// Checks the knowledge levels, the target ring, the predicted grade and the
// Suositellut mix (docs/plans/knowledge-driven-progress.md) on a few example
// students, and prints what each of them would see.
//
//   npm run check:knowledge
//   npm run check:knowledge -- --drafts   (counts draft rubrics too)
//
// Exits non-zero when a rule is broken.

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const drafts = process.argv.includes('--drafts')

// The data modules read localStorage and the URL of a browser.
const storage = new Map()
globalThis.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
  location: { search: drafts ? '?drafts' : '' },
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {},
}

const server = await createServer({
  root,
  mode: 'production',
  define: { 'import.meta.env.DEV': 'false' },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true },
  appType: 'custom',
  logLevel: 'error',
})
const load = (name) => server.ssrLoadModule(`/src/data/${name}.ts`)

const failures = []
function check(condition, text) {
  if (!condition) failures.push(text)
  console.log(`  ${condition ? 'ok  ' : 'FAIL'} ${text}`)
}

try {
  const K = await load('knowledge')
  const F = await load('feed')
  const P = await load('coursePoints')
  const G = await load('foundGap')
  const { predictGrade } = await load('grade')
  const { COURSES } = await load('courses')
  const { getExerciseCards } = await load('cards')
  const { getCourseTargets } = await load('studyPlans')
  const { WEEKLY_POINTS_GOAL, PLAN_WEEKS } = await load('points')

  const prefs = F.DEFAULT_FEED_PREFS
  const TARGETS = ['L', 'E', 'M', 'C', 'B']

  // `right` of `count` quick exercises answered right, in file order.
  function answer(state, code, count, right) {
    return getExerciseCards(code)
      .slice(0, count)
      .reduce((s, card, i) => K.recordAttempt(s, card.id, i < right ? 1 : 0), state)
  }
  function tasksOf(feed) {
    return feed.filter((card) => card.type !== 'lesson')
  }
  function counts(tasks) {
    const result = {}
    for (const card of tasks) result[card.topic.code] = (result[card.topic.code] ?? 0) + 1
    return result
  }
  function earnedFrom(state) {
    return Object.fromEntries(
      Object.entries(state.attempts)
        .filter(([, a]) => a.result > 0)
        .map(([id, a]) => [id, a.result * (a.max ?? 1)]),
    )
  }
  function maxShareOfTen(tasks, blocks) {
    let max = 0
    for (let b = 0; b < blocks; b++) max = Math.max(max, ...Object.values(counts(tasks.slice(b * 10, b * 10 + 10))))
    return max
  }

  function report(title, state, grades, target = 'M') {
    console.log(`\n${title} (tavoite ${target})`)
    const knowledge = K.computeKnowledge(state, grades)
    const { overall } = knowledge
    const ring = P.getTargetProgress(target, P.getCoursePoints(earnedFrom(state)))
    console.log(
      '  kurssit:',
      COURSES.map(({ code }) => {
        const c = knowledge.courses[code]
        return `${code} ${c.level ? `${c.level.label}${c.gradeOnly ? '*' : ''} ${c.pct}%` : 'ei tietoa'}`
      }).join(', '),
    )
    console.log(
      `  ennuste: ${overall.known ? `${predictGrade(overall.pct).letter} (${overall.pct}%)` : '–'}, varmuus ${Math.round(overall.certainty * 100)}%`,
    )
    console.log(`  rengas: ${ring.counted} / ${ring.needed} p (${Math.round(ring.progress * 100)}%)`)
    const feed = F.getRecommendedCards(target, prefs, knowledge, state.attempts, { quick: true, long: false })
    const tasks = tasksOf(feed)
    console.log('  syötteen 10 ensimmäistä:', tasks.slice(0, 10).map((c) => c.topic.code.slice(3)).join(' '))
    return { knowledge, overall, ring, tasks }
  }

  // --- The three cases ------------------------------------------------------

  {
    let state = K.EMPTY_KNOWLEDGE
    for (const code of ['MAA2', 'MAA3', 'MAA4', 'MAA5']) state = answer(state, code, 12, 11)
    const { knowledge, overall, ring, tasks } = report('Vahva MAA2–5, tyhjä MAA6–7', state, {})
    check(['MAA2', 'MAA3', 'MAA4', 'MAA5'].every((c) => knowledge.courses[c].level.label === 'Erinomainen'), 'MAA2–5 Erinomainen')
    check(knowledge.courses.MAA6.level === null && knowledge.courses.MAA7.level === null, 'MAA6–7 ei tietoa')
    check(predictGrade(overall.pct).letter === 'C', 'four of ten courses predict C, not L')
    check(ring.progress < 1, 'four courses do not close the ring')
    const first = counts(tasks.slice(0, 10))
    check(['MAA6', 'MAA7'].every((c) => first[c] === 3), 'MAA6 and MAA7 lead the feed, three of ten each')
    const review = ['MAA2', 'MAA3', 'MAA4', 'MAA5'].reduce((n, c) => n + (first[c] ?? 0), 0)
    check(review === 2, 'two of ten are review of the strong courses')
  }

  {
    const grades = { MAA2: 10, MAA3: 9, MAA4: 8, MAA5: 7, MAA6: 5, MAA7: 4, MAA9: 6, MAA10: 7, MAA11: 8, MAA12: 5 }
    const { knowledge, overall, ring, tasks } = report('Vain kurssiarvosanat', K.EMPTY_KNOWLEDGE, grades)
    const levels = COURSES.map(({ code }) => knowledge.courses[code])
    check(levels.every((c) => c.gradeOnly && c.level.label !== 'Erinomainen'), 'all grade-only, none Erinomainen')
    check(knowledge.courses.MAA2.pct === 90 && knowledge.courses.MAA5.pct === 50 && knowledge.courses.MAA7.pct === 10, 'grades 10, 7, 4 are 90, 50, 10 %')
    check(knowledge.courses.MAA2.level.label === 'Vahva', 'grade 10 is capped at Vahva')
    check(overall.certainty === 0 && ring.counted === 0, 'certainty 0, ring empty: grades give neither')
    const first = counts(tasks.slice(0, 10))
    check((first.MAA7 ?? 0) >= 2 && (first.MAA6 ?? 0) >= 2, 'the weakest central courses lead the feed')
    check((first.MAA2 ?? 0) + (first.MAA3 ?? 0) === 2, 'two of ten are review of the strong courses')
  }

  {
    const { overall, ring, tasks, knowledge } = report('Uusi opiskelija', K.EMPTY_KNOWLEDGE, {})
    check(!overall.known && overall.certainty === 0 && ring.progress === 0, 'no prediction, empty ring')
    const plan = getCourseTargets('M').map((t) => t.code)
    check(F.rankPlanCourses('M', knowledge).join() === plan.join(), 'feed follows the study plan')
    check(tasks.slice(0, 3).map((c) => c.topic.code).join() === plan.slice(0, 3).join(), 'starts with the plan’s first three courses')
  }

  // --- Rules ----------------------------------------------------------------

  console.log('\nTasot ja kaava')
  for (const [pct, label] of [[0, 'Heikko'], [24, 'Heikko'], [25, 'Kehittyvä'], [44, 'Kehittyvä'], [45, 'Kohtalainen'], [64, 'Kohtalainen'], [65, 'Vahva'], [84, 'Vahva'], [85, 'Erinomainen'], [100, 'Erinomainen']]) {
    check(K.getKnowledgeLevel(pct).label === label, `${pct} % = ${label}`)
  }
  {
    const one = K.computeKnowledge(answer(K.EMPTY_KNOWLEDGE, 'MAA7', 1, 1), {}).courses.MAA7
    check(one.pct === 100, 'one right answer, no grade: 100 %')
    const graded = K.computeKnowledge(answer(K.EMPTY_KNOWLEDGE, 'MAA7', 2, 0), { MAA7: 7 }).courses.MAA7
    check(graded.pct === 25 && graded.certainty === 0.5, 'grade 7 and two wrong: (2 x 50 % + 0) / 4 = 25 %, certainty 50 %')
    const task = K.recordAttempt(K.EMPTY_KNOWLEDGE, 'maa2-task-OSAI_T1', 3, 4)
    check(K.computeKnowledge(task, {}).courses.MAA2.pct === 75, 'open task 3/4 p: 75 %')
    const again = K.recordAttempt(task, 'maa2-task-OSAI_T1', 4, 4)
    check(again === task, 'a second attempt at the same card is ignored')
  }

  console.log('\nTavoiterengas')
  for (const target of TARGETS) {
    const quotas = P.getCourseQuotas(target)
    const total = [...quotas.values()].reduce((a, b) => a + b, 0)
    const offered = [...quotas.keys()].reduce((sum, code) => sum + P.getOfferedPoints(code), 0)
    const goal = WEEKLY_POINTS_GOAL[target] * PLAN_WEEKS
    console.log(`       ${target}: ${[...quotas].map(([c, q]) => `${c} ${Math.round(q)}`).join(', ')}`)
    check(Math.abs(total - Math.min(goal, offered)) < 1e-6, `${target}: quotas add up to ${Math.round(total)} p (tavoite ${goal}, tarjolla ${offered})`)
    const all = Object.fromEntries(COURSES.map(({ code }) => [code, P.getOfferedPoints(code)]))
    check(P.getTargetProgress(target, all).progress === 1, `${target}: doing everything closes the ring`)
    const widest = Math.max(
      ...COURSES.map(({ code }) => P.getTargetProgress(target, { ...Object.fromEntries(COURSES.map((c) => [c.code, 0])), [code]: 10000 }).progress),
    )
    check(widest < 0.5, `${target}: one course alone fills at most ${Math.round(widest * 100)} %`)
  }

  console.log('\nSyöte')
  {
    // Every pool in use: weak, strong and unknown courses.
    let state = K.EMPTY_KNOWLEDGE
    for (const code of ['MAA2', 'MAA3']) state = answer(state, code, 6, 6)
    for (const code of ['MAA4', 'MAA5', 'MAA6', 'MAA7']) state = answer(state, code, 4, 1)
    const knowledge = K.computeKnowledge(state, {})
    const tasks = tasksOf(F.getRecommendedCards('M', prefs, knowledge, state.attempts, { quick: true, long: true }))
    const first = counts(tasks.slice(0, 20))
    const sum = (codes) => codes.reduce((n, c) => n + (first[c] ?? 0), 0)
    check(
      sum(['MAA4', 'MAA5', 'MAA6', 'MAA7']) === 14 && sum(['MAA2', 'MAA3']) === 4 && sum(['MAA9', 'MAA10', 'MAA11', 'MAA12']) === 2,
      'mix of the first twenty is 14 / 4 / 2',
    )
    check(maxShareOfTen(tasks, 5) <= F.COURSE_CAP, 'no course has more than three of ten')

    const own = { ...prefs, courses: ['MAA12', 'MAA2'] }
    const ownTasks = tasksOf(F.getRecommendedCards('M', own, knowledge, {}, { quick: true, long: false }, 'MAA7'))
    check(ownTasks[0].topic.code === 'MAA12' && ownTasks.every((c) => ['MAA12', 'MAA2'].includes(c.topic.code)), 'own course order wins')
    check(F.rankPlanCourses('M', knowledge, 'MAA3')[0] === 'MAA3', 'a found gap leads the ranking')
    const ranked = F.rankPlanCourses('M', knowledge)
    check(
      ranked.slice(0, 4).sort().join() === 'MAA4,MAA5,MAA6,MAA7' && ranked.slice(8).sort().join() === 'MAA2,MAA3',
      'the list runs weak, unknown, strong',
    )

    const done = tasks.findIndex((c) => state.attempts[c.id])
    check(tasks.slice(done).every((c) => state.attempts[c.id]), 'answered cards come last')
    check(new Set(tasks.map((c) => c.id)).size === tasks.length, 'every card comes once')
  }

  console.log('\nLöytynyt aukko')
  {
    const grades = { MAA6: 7 }
    const s1 = answer(K.EMPTY_KNOWLEDGE, 'MAA6', 1, 0)
    const k0 = K.computeKnowledge(K.EMPTY_KNOWLEDGE, grades)
    const k1 = K.computeKnowledge(s1, grades)
    const gap = G.updateFoundGap(null, 'MAA6', k0, k1)
    check(gap?.code === 'MAA6' && gap.pct === 50, 'a wrong answer that lowers the prediction is a gap')
    const [, second, third] = getExerciseCards('MAA6')
    const s2 = K.recordAttempt(s1, second.id, 1)
    const k2 = K.computeKnowledge(s2, grades)
    check(G.updateFoundGap(gap, 'MAA6', k1, k2) === null, 'back at 50 % closes it')
    const s3 = K.recordAttempt(s1, third.id, 0)
    check(G.updateFoundGap(gap, 'MAA6', k1, K.computeKnowledge(s3, grades)).pct === 50, 'a second drop keeps the first level to climb to')
  }

  console.log('\nVanhat tallenteet')
  {
    storage.set(
      'laudatur.knowledge',
      JSON.stringify({
        version: 1,
        polls: { 'maa2-polynomit': 2 },
        attempts: { 'maa2-exercise-1': { result: 1, at: 1 }, 'maa2-exercise-2': { result: 0, at: 2 }, broken: { result: 'x' } },
      }),
    )
    const old = K.loadKnowledge()
    check(Object.keys(old.attempts).length === 2 && K.computeKnowledge(old, {}).courses.MAA2.pct === 50, 'old attempts load, broken ones are dropped')
    const saved = JSON.parse(storage.get('laudatur.knowledge'))
    check(saved.version === 1 && saved.attempts['maa2-exercise-1'].result === 1, 'storage version and format unchanged')
    storage.set('laudatur.feedPrefs', JSON.stringify({ difficulty: 'skipEasy', courses: ['MAA4', 'XX'] }))
    const loaded = F.loadFeedPrefs()
    check(loaded.courses.join() === 'MAA4' && loaded.difficulties.join() === 'mid,hard', 'old feed settings load')
  }
} finally {
  await server.close()
}

console.log(failures.length === 0 ? '\nKaikki kunnossa.' : `\n${failures.length} virhettä:\n- ${failures.join('\n- ')}`)
process.exit(failures.length === 0 ? 0 : 1)
