import { cards, getConceptCards, getExerciseCards, groupExercisesByConcept } from './cards'
import { COURSES } from './courses'
import { COURSE_GRADES, type CourseGrade, type CourseGrades } from './courseGrades'
import { exerciseMaxPoints, loadEvaluation, markedCount, scoredPoints } from './evaluation'
import { RUBRIC_EXERCISES } from './rubrics'
import { THEMES, THEME_MAP, getConceptTheme, getCourseThemes, type Theme, type ThemeId } from './themes'
import type { Card, TopicCode } from '../types'

// Knowledge: how well the student knows each course (and each theme of it),
// as opposed to how much of the course they have done (coursePoints.ts).
//
// One formula, for courses and themes alike, in points:
//
//   score = (priorWeight * prior + earned) / (priorWeight + attempted)
//
// `earned` and `attempted` count the student's first attempt at each card:
// points got and points there were to get. The prior is the course grade
// the student reported; without one its weight is 0, so one right answer
// is 100 %. See docs/plans/knowledge-driven-progress.md.

// ---------------------------------------------------------------------------
// Self-assessment scale (Kurssit › Oppimistavoitteet)
// ---------------------------------------------------------------------------

// 0 = never studied it .. 3 = knows it well. Not part of any score.
export type PollLevel = 0 | 1 | 2 | 3

export interface PollOption {
  level: PollLevel
  label: string
  // Fits four buttons across a phone screen; `label` is the full answer.
  shortLabel: string
  description: string
}

export const POLL_OPTIONS: PollOption[] = [
  {
    level: 0,
    label: 'En ole opiskellut',
    shortLabel: 'En osaa',
    description: 'Aihe on minulle uusi tai en muista siitä mitään.',
  },
  {
    level: 1,
    label: 'Muistan jotain',
    shortLabel: 'Vähän',
    description: 'Olen nähnyt aiheen, mutta en osaisi ratkaista tehtäviä.',
  },
  {
    level: 2,
    label: 'Osaan perusteet',
    shortLabel: 'Perusteet',
    description: 'Osaan helpot tehtävät, vaikeammat eivät vielä suju.',
  },
  {
    level: 3,
    label: 'Osaan hyvin',
    shortLabel: 'Hyvin',
    description: 'Ratkaisen myös vaikeampia tehtäviä sujuvasti.',
  },
]

// ---------------------------------------------------------------------------
// Prior: the course grade
// ---------------------------------------------------------------------------

// How much a course grade counts against real answers: two quick
// exercises' points. A handful of answers outweighs it.
export const PRIOR_WEIGHT = 2

// Course grade 4 -> 0.1, 7 -> 0.5, 10 -> 0.9: a linear map that keeps both
// ends away from the extremes, since a grade says little about any single
// theme.
export function courseGradeToPrior(grade: CourseGrade): number {
  const lowest = COURSE_GRADES[0]
  const highest = COURSE_GRADES[COURSE_GRADES.length - 1]
  return 0.1 + ((grade - lowest) / (highest - lowest)) * 0.8
}

// ---------------------------------------------------------------------------
// Evidence: first attempts at cards
// ---------------------------------------------------------------------------

export interface Attempt {
  // 0..1: the share of the card's points the student got. Quick exercises
  // are right or wrong; open tasks come from the student's own Pisteytys.
  result: number
  // The card's points. Left out for quick exercises, worth one.
  max?: number
  // Date.now() of the attempt; kept so a later version can decay old
  // evidence or draw a history, not used by the score yet.
  at: number
}

export interface KnowledgeState {
  // Keyed by card id. Only the first attempt at a card is stored: once the
  // solution has been shown, a retry no longer tells us anything new.
  attempts: Record<string, Attempt>
}

export const EMPTY_KNOWLEDGE: KnowledgeState = { attempts: {} }

export function recordAttempt(
  state: KnowledgeState,
  cardId: string,
  scored: number,
  max = 1,
  at = Date.now(),
): KnowledgeState {
  if (state.attempts[cardId] || !(max > 0)) return state
  const result = Math.min(1, Math.max(0, scored / max))
  const attempt: Attempt = max === 1 ? { result, at } : { result, max, at }
  return { ...state, attempts: { ...state.attempts, [cardId]: attempt } }
}

// ---------------------------------------------------------------------------
// Card -> themes
// ---------------------------------------------------------------------------

interface CardTagging {
  card: Card
  themes: ThemeId[]
}

// Every card that can produce evidence, with the themes it is evidence
// for. Quick exercises aren't in `cards` (they only appear when browsing a
// course), so they are collected per course here. Built once: the data is
// static.
const TAGGED_CARDS: Map<string, CardTagging> = (() => {
  const map = new Map<string, CardTagging>()
  for (const card of cards) {
    if (card.type !== 'task') continue
    map.set(card.id, { card, themes: card.problem.themes ?? [] })
  }
  for (const course of COURSES) {
    const byConcept = groupExercisesByConcept(getExerciseCards(course.code))
    for (const [conceptIndex, exercises] of byConcept) {
      const theme = getConceptTheme(course.code, conceptIndex)
      for (const exercise of exercises) {
        map.set(exercise.id, { card: exercise, themes: theme ? [theme.id] : [] })
      }
    }
  }
  return map
})()

export function getCardThemes(cardId: string): Theme[] {
  return (TAGGED_CARDS.get(cardId)?.themes ?? []).map((id) => THEME_MAP[id]).filter((theme) => theme !== undefined)
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

export type KnowledgeLevel = 'heikko' | 'kehittyvä' | 'kohtalainen' | 'vahva' | 'erinomainen'

export interface KnowledgeLevelInfo {
  level: KnowledgeLevel
  label: string
  // Lowest whole percentage of the level.
  min: number
}

// Listed high to low; a percentage belongs to the first level it reaches.
export const KNOWLEDGE_LEVELS: KnowledgeLevelInfo[] = [
  { level: 'erinomainen', label: 'Erinomainen', min: 85 },
  { level: 'vahva', label: 'Vahva', min: 65 },
  { level: 'kohtalainen', label: 'Kohtalainen', min: 45 },
  { level: 'kehittyvä', label: 'Kehittyvä', min: 25 },
  { level: 'heikko', label: 'Heikko', min: 0 },
]

// Vahva and up: a strong course gets light review in the feed.
export const STRONG_PCT = 65

// Erinomainen needs real answers, so a level from the course grade alone
// stops at Vahva.
export function getKnowledgeLevel(pct: number, gradeOnly = false): KnowledgeLevelInfo {
  const levels = gradeOnly ? KNOWLEDGE_LEVELS.slice(1) : KNOWLEDGE_LEVELS
  return levels.find((band) => pct >= band.min) ?? levels[levels.length - 1]
}

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

export interface Score {
  // 0..1 and the same rounded to a whole percentage; 0 when not known.
  score: number
  pct: number
  earned: number
  attempted: number
  // 0..1: how much of the score comes from answers rather than the course
  // grade, attempted / (PRIOR_WEIGHT + attempted).
  certainty: number
  // False with neither a course grade nor an attempt: "ei tietoa".
  known: boolean
}

export interface ThemeScore extends Score {
  theme: Theme
}

export interface CourseKnowledge extends Score {
  code: TopicCode
  // Known from the course grade alone: shown lighter.
  gradeOnly: boolean
  // null when not known.
  level: KnowledgeLevelInfo | null
  themes: ThemeScore[]
}

export interface OverallEstimate {
  // Mean of the courses' percentages, on the same 0-100 scale as the
  // exam-points prediction so predictGrade can take it directly. A course
  // with nothing known counts as 0.
  pct: number
  // 0..1: mean of the courses' certainties.
  certainty: number
  // False when nothing at all is known: no course grades, no answers.
  known: boolean
}

export interface Knowledge {
  themes: Record<ThemeId, ThemeScore>
  courses: Record<TopicCode, CourseKnowledge>
  overall: OverallEstimate
}

interface Evidence {
  earned: number
  attempted: number
}

const NO_EVIDENCE: Evidence = { earned: 0, attempted: 0 }

function scoreOf({ earned, attempted }: Evidence, grade: CourseGrade | undefined): Score {
  const priorWeight = grade === undefined ? 0 : PRIOR_WEIGHT
  const prior = grade === undefined ? 0 : courseGradeToPrior(grade)
  const total = priorWeight + attempted
  const score = total > 0 ? (priorWeight * prior + earned) / total : 0
  return {
    score,
    pct: Math.round(score * 100),
    earned,
    attempted,
    certainty: attempted / (PRIOR_WEIGHT + attempted),
    known: total > 0,
  }
}

function addEvidence<K>(map: Map<K, Evidence>, key: K, earned: number, attempted: number) {
  const prev = map.get(key) ?? NO_EVIDENCE
  map.set(key, { earned: prev.earned + earned, attempted: prev.attempted + attempted })
}

export function computeKnowledge(state: KnowledgeState, courseGrades: CourseGrades): Knowledge {
  const byCourse = new Map<TopicCode, Evidence>()
  const byTheme = new Map<ThemeId, Evidence>()
  for (const [cardId, attempt] of Object.entries(state.attempts)) {
    const tagging = TAGGED_CARDS.get(cardId)
    if (!tagging) continue
    const max = attempt.max ?? 1
    addEvidence(byCourse, tagging.card.topic.code, attempt.result * max, max)
    for (const themeId of tagging.themes) addEvidence(byTheme, themeId, attempt.result * max, max)
  }

  const themes: Record<ThemeId, ThemeScore> = {}
  for (const theme of THEMES) {
    themes[theme.id] = { theme, ...scoreOf(byTheme.get(theme.id) ?? NO_EVIDENCE, courseGrades[theme.code]) }
  }

  const courses = {} as Record<TopicCode, CourseKnowledge>
  for (const { code } of COURSES) {
    const score = scoreOf(byCourse.get(code) ?? NO_EVIDENCE, courseGrades[code])
    const gradeOnly = score.known && score.attempted === 0
    courses[code] = {
      ...score,
      code,
      gradeOnly,
      level: score.known ? getKnowledgeLevel(score.pct, gradeOnly) : null,
      themes: getCourseThemes(code).map((theme) => themes[theme.id]),
    }
  }

  const all = COURSES.map(({ code }) => courses[code])
  const mean = (value: (course: CourseKnowledge) => number) =>
    all.reduce((sum, course) => sum + value(course), 0) / all.length
  return {
    themes,
    courses,
    overall: {
      pct: Math.round(mean((course) => course.score) * 100),
      certainty: mean((course) => course.certainty),
      known: all.some((course) => course.known),
    },
  }
}

// How urgently a course or a theme should be practised, for the Suositellut
// feed: the gap to full mastery, boosted while the score is still unsettled
// so an untested theme is checked before a known-weak one is drilled to
// death. `relevance` is the study plan's say (0 = not in the plan .. 1 =
// core), multiplied in so out-of-plan themes sink to the bottom.
export function getThemePriority({ score, certainty }: Pick<Score, 'score' | 'certainty'>, relevance = 1): number {
  const gap = 1 - score
  const uncertainty = 1 - certainty
  return gap * (0.5 + 0.5 * uncertainty) * relevance
}

// ---------------------------------------------------------------------------
// Data checks
// ---------------------------------------------------------------------------

// Problems with the tagging data that would silently drop evidence: a
// concept box no theme claims (its exercises score nothing), a concept
// index pointing past the theory file, a task tagged with an unknown or
// foreign theme, and courses with tasks still waiting to be tagged.
// Meant for a dev-time console warning, not for the UI.
export function getThemeIssues(): string[] {
  const issues: string[] = []
  for (const course of COURSES) {
    const conceptCount = getConceptCards(course.code).length
    const claimed = new Map<number, ThemeId[]>()
    for (const theme of getCourseThemes(course.code)) {
      for (const index of theme.concepts) {
        if (index >= conceptCount) issues.push(`${theme.id}: concept ${index} does not exist (${course.code} has ${conceptCount})`)
        claimed.set(index, [...(claimed.get(index) ?? []), theme.id])
      }
    }
    for (let index = 0; index < conceptCount; index++) {
      const owners = claimed.get(index) ?? []
      if (owners.length === 0) issues.push(`${course.code}: concept ${index} belongs to no theme`)
      if (owners.length > 1) issues.push(`${course.code}: concept ${index} belongs to several themes (${owners.join(', ')})`)
    }

    let untagged = 0
    for (const card of cards) {
      if (card.type !== 'task' || card.topic.code !== course.code) continue
      const tags = card.problem.themes ?? []
      if (tags.length === 0) untagged += 1
      for (const tag of tags) {
        const theme = THEME_MAP[tag]
        if (!theme) issues.push(`${card.id}: unknown theme "${tag}"`)
        else if (theme.code !== course.code) issues.push(`${card.id}: theme "${tag}" belongs to ${theme.code}`)
      }
    }
    if (untagged > 0) issues.push(`${course.code}: ${untagged} task(s) have no themes yet`)
  }
  return issues
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'laudatur.knowledge'
const STORAGE_VERSION = 1

interface StoredKnowledge extends KnowledgeState {
  version: number
  // Open tasks scored before their scores counted as attempts have been
  // copied in.
  tasksBackfilled?: boolean
}

function readStored(): { state: KnowledgeState; backfilled: boolean } {
  const empty = { state: EMPTY_KNOWLEDGE, backfilled: false }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return empty
  const parsed: unknown = JSON.parse(stored)
  if (typeof parsed !== 'object' || parsed === null) return empty
  const raw = parsed as Partial<StoredKnowledge>
  if (raw.version !== STORAGE_VERSION) return empty

  const attempts: KnowledgeState['attempts'] = {}
  for (const [cardId, attempt] of Object.entries(raw.attempts ?? {})) {
    if (typeof attempt !== 'object' || attempt === null) continue
    const { result, max, at } = attempt as Partial<Attempt>
    if (typeof result !== 'number' || !(result >= 0 && result <= 1) || typeof at !== 'number') continue
    attempts[cardId] = typeof max === 'number' && max > 0 ? { result, max, at } : { result, at }
  }
  return { state: { attempts }, backfilled: raw.tasksBackfilled === true }
}

// The open tasks the student has answered and scored in full.
function withScoredTasks(state: KnowledgeState): KnowledgeState {
  const evaluation = loadEvaluation()
  return RUBRIC_EXERCISES.reduce((next, exercise) => {
    const attempt = evaluation[exercise.id]
    if (!attempt?.answer) return next
    const { marked, total } = markedCount(exercise, attempt.scores)
    if (marked < total) return next
    const cardId = `${exercise.topic.code.toLowerCase()}-task-${exercise.problemId}`
    return recordAttempt(next, cardId, scoredPoints(exercise, attempt.scores), exerciseMaxPoints(exercise))
  }, state)
}

export function loadKnowledge(): KnowledgeState {
  try {
    const { state, backfilled } = readStored()
    if (backfilled) return state
    const next = withScoredTasks(state)
    saveKnowledge(next)
    return next
  } catch {
    return EMPTY_KNOWLEDGE
  }
}

export function saveKnowledge(state: KnowledgeState): void {
  try {
    const stored: StoredKnowledge = { version: STORAGE_VERSION, tasksBackfilled: true, ...state }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // in-memory state still works for the session.
  }
}
