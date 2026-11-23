import { cards, getExerciseCards } from './cards'
import { COURSE_MAP } from './courses'
import { classifyDifficulty, type Difficulty } from './progress'
import { getCourseTargets, type TargetGrade } from './studyPlans'
import type { Card, TaskCard, TopicCode } from '../types'

// ---------------------------------------------------------------------------
// Feed settings (Suositellut › Syötteen asetukset)
// ---------------------------------------------------------------------------

// The long tasks' difficulty tiers, as the settings list them.
export const FEED_DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
  { value: 'easy', label: 'Helpot', hint: 'Osa I: perustehtävät.' },
  { value: 'mid', label: 'Keskivaikeat', hint: 'Osa II: soveltavat tehtävät.' },
  { value: 'hard', label: 'Vaikeat', hint: 'Osat III–IV: kokeen vaativimmat.' },
]

export interface FeedPrefs {
  // The long tasks' tiers the student has on. Never empty.
  difficulties: Difficulty[]
  // The feed's courses in priority order. null follows the target grade's
  // study plan, so changing the target still changes the feed until the
  // student edits the list themselves.
  courses: TopicCode[] | null
  // Which kinds of exercise the feed has: the quick exercises
  // (pikatehtävät) and the open-answer YO problems (pitkät tehtävät).
  // null follows the device: quick on everywhere, long off on phones, where
  // writing a long answer is the harder sell, and on for laptops.
  quickTasks: boolean | null
  longTasks: boolean | null
}

export const DEFAULT_FEED_PREFS: FeedPrefs = { difficulties: ['easy', 'mid', 'hard'], courses: null, quickTasks: null, longTasks: null }

export interface FeedKinds {
  quick: boolean
  long: boolean
}

// The kinds in the feed: the settings, or the device's defaults. The
// settings never turn both off; if stored prefs somehow do, quick wins.
export function getFeedKinds(prefs: FeedPrefs, isDesktop: boolean): FeedKinds {
  const long = prefs.longTasks ?? isDesktop
  const quick = (prefs.quickTasks ?? true) || !long
  return { quick, long }
}

const ALL: Difficulty[] = ['easy', 'mid', 'hard']

// The plan's course order and per-course difficulties for a target grade.
function planDifficulties(grade: TargetGrade): Map<TopicCode, Difficulty[]> {
  return new Map(getCourseTargets(grade).map((target) => [target.code, target.difficulties]))
}

export function getFeedCourses(grade: TargetGrade, prefs: FeedPrefs): TopicCode[] {
  return prefs.courses ?? [...planDifficulties(grade).keys()]
}

// Which tiers the feed pulls from one course: the plan's (or all three for
// a course the student added themselves) among the ones switched on. When
// the plan asks for none of those, the easiest tier switched on.
export function getFeedDifficulties(grade: TargetGrade, prefs: FeedPrefs, code: TopicCode): Difficulty[] {
  const fromPlan = planDifficulties(grade).get(code) ?? ALL
  const selected = ALL.filter((d) => prefs.difficulties.includes(d))
  const both = fromPlan.filter((d) => selected.includes(d))
  return both.length > 0 ? both : selected.slice(0, 1)
}

// ---------------------------------------------------------------------------
// Surfacing
// ---------------------------------------------------------------------------

// How many courses are mixed at a time, and how many tasks a course gives
// per turn before it steps aside for the next one in line.
const ACTIVE_COURSES = 3
const TASKS_PER_TURN = 4

const DIFFICULTY_RANK: Record<Difficulty, number> = { easy: 0, mid: 1, hard: 2 }

interface CourseQueue {
  code: TopicCode
  tasks: Card[]
  taken: number
}

// One quick exercise, one long task, and so on while both last.
function interleave(quick: Card[], long: Card[]): Card[] {
  const result: Card[] = []
  for (let i = 0; i < Math.max(quick.length, long.length); i++) {
    if (i < quick.length) result.push(quick[i])
    if (i < long.length) result.push(long[i])
  }
  return result
}

// Rotates through the courses in list order: ACTIVE_COURSES at a time, one
// task from each in turn. A course that has given TASKS_PER_TURN tasks
// goes to the back of the line with what it has left, and the next course
// takes its place. Each course's tasks run from easy to hard, so when a
// course comes round again it picks up where it left off, a level harder.
// The course's lesson card comes right before its first task.
function rotate(queues: CourseQueue[], lessons: Map<TopicCode, Card>): Card[] {
  const result: Card[] = []
  const waiting = queues.filter((queue) => queue.tasks.length > 0)
  const active: CourseQueue[] = []

  while (waiting.length > 0 || active.length > 0) {
    while (active.length < ACTIVE_COURSES && waiting.length > 0) {
      const next = waiting.shift()!
      next.taken = 0
      active.push(next)
    }
    for (const queue of [...active]) {
      const lesson = lessons.get(queue.code)
      if (lesson) {
        result.push(lesson)
        lessons.delete(queue.code)
      }
      result.push(queue.tasks.shift()!)
      queue.taken += 1
      if (queue.tasks.length === 0 || queue.taken >= TASKS_PER_TURN) {
        active.splice(active.indexOf(queue), 1)
        if (queue.tasks.length > 0) waiting.push(queue)
      }
    }
  }
  return result
}

// The Suositellut feed: each course's quick exercises (pikatehtävät) and
// long tasks, whichever `kinds` has on, woven together. Cards the student has
// already answered are left out of the rotation and come at the very end,
// so the feed leads with new material but nothing disappears for good.
export function getRecommendedCards(
  grade: TargetGrade,
  prefs: FeedPrefs,
  answered: Record<string, unknown> = {},
  kinds: FeedKinds = { quick: true, long: true },
): Card[] {
  const fresh: CourseQueue[] = []
  const done: CourseQueue[] = []
  const lessons = new Map<TopicCode, Card>()

  for (const code of getFeedCourses(grade, prefs)) {
    if (!(code in COURSE_MAP)) continue
    const wanted = new Set(getFeedDifficulties(grade, prefs, code))
    const long = kinds.long
      ? cards
          .filter((card): card is TaskCard => card.topic.code === code && card.type === 'task')
          .map((card) => ({ card, difficulty: classifyDifficulty(card.problem.section) }))
          .filter(({ difficulty }) => wanted.has(difficulty))
          .sort((a, b) => DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty])
          .map(({ card }) => card)
      : []
    const tasks = interleave(kinds.quick ? getExerciseCards(code) : [], long)
    if (tasks.length === 0) continue

    const lesson = cards.find((card) => card.topic.code === code && card.type === 'lesson')
    if (lesson) lessons.set(code, lesson)
    fresh.push({ code, tasks: tasks.filter((card) => !answered[card.id]), taken: 0 })
    done.push({ code, tasks: tasks.filter((card) => answered[card.id]), taken: 0 })
  }

  return [...rotate(fresh, lessons), ...rotate(done, lessons)]
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'laudatur.feedPrefs'

// The tiers stored, or the ones an older single choice stood for.
function parseDifficulties(parsed: Record<string, unknown>): Difficulty[] {
  if (Array.isArray(parsed.difficulties)) {
    const valid = ALL.filter((d) => (parsed.difficulties as unknown[]).includes(d))
    if (valid.length > 0) return valid
  }
  if (parsed.difficulty === 'skipEasy') return ['mid', 'hard']
  if (parsed.difficulty === 'hardOnly') return ['hard']
  return ALL
}

export function loadFeedPrefs(): FeedPrefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_FEED_PREFS
    const parsed = JSON.parse(raw) as Partial<FeedPrefs> & Record<string, unknown>
    const courses = Array.isArray(parsed.courses)
      ? parsed.courses.filter((code): code is TopicCode => typeof code === 'string' && code in COURSE_MAP)
      : null
    return {
      difficulties: parseDifficulties(parsed),
      courses,
      quickTasks: typeof parsed.quickTasks === 'boolean' ? parsed.quickTasks : null,
      longTasks: typeof parsed.longTasks === 'boolean' ? parsed.longTasks : null,
    }
  } catch {
    return DEFAULT_FEED_PREFS
  }
}

export function saveFeedPrefs(prefs: FeedPrefs): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Storage unavailable: the settings still apply for this session.
  }
}
