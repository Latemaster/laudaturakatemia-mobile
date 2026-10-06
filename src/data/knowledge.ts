import { cards, getConceptCards, getExerciseCards, groupExercisesByConcept } from './cards'
import { COURSES } from './courses'
import { COURSE_GRADES, type CourseGrade, type CourseGrades } from './courseGrades'
import type { FinnishGrade } from './grade'
import { classifyDifficulty, type Difficulty } from './progress'
import { THEMES, THEME_MAP, getConceptTheme, getCourseThemes, type Theme, type ThemeId } from './themes'
import type { Card, TopicCode } from '../types'

// Knowledge scores: how well the student knows each theme of each course,
// as opposed to how much of the course they have engaged with (progress.ts).
//
// A theme's score is a weighted mean of everything we know about it:
//
//   score = (priorWeight * prior + sum(w_i * r_i)) / (priorWeight + sum(w_i))
//
// where the prior comes from the student's own pre-poll answer for the
// theme (esikysely), falling back to their reported course grade, and each
// r_i is the result of the student's first attempt at a card tagged with
// the theme, weighted by how hard the card was. Everything is in 0..1 and
// shown as a percentage. See docs/knowledge-score-model.md for the
// reasoning behind each number.

// ---------------------------------------------------------------------------
// Pre-poll (esikysely)
// ---------------------------------------------------------------------------

// Self-assessment the student gives per theme before (or instead of)
// doing its exercises: 0 = never studied it .. 3 = knows it well.
export type PollLevel = 0 | 1 | 2 | 3

export interface PollOption {
  level: PollLevel
  label: string
  // Fits four buttons across a phone screen; `label` is the full answer.
  shortLabel: string
  description: string
  // Score the theme starts from when this is the only thing we know.
  prior: number
}

export const POLL_OPTIONS: PollOption[] = [
  {
    level: 0,
    label: 'En ole opiskellut',
    shortLabel: 'En osaa',
    description: 'Aihe on minulle uusi tai en muista siitä mitään.',
    prior: 0.15,
  },
  {
    level: 1,
    label: 'Muistan jotain',
    shortLabel: 'Vähän',
    description: 'Olen nähnyt aiheen, mutta en osaisi ratkaista tehtäviä.',
    prior: 0.35,
  },
  {
    level: 2,
    label: 'Osaan perusteet',
    shortLabel: 'Perusteet',
    description: 'Osaan helpot tehtävät, vaikeammat eivät vielä suju.',
    prior: 0.6,
  },
  {
    level: 3,
    label: 'Osaan hyvin',
    shortLabel: 'Hyvin',
    description: 'Ratkaisen myös vaikeampia tehtäviä sujuvasti.',
    prior: 0.85,
  },
]

export const POLL_OPTION_MAP: Record<PollLevel, PollOption> = Object.fromEntries(
  POLL_OPTIONS.map((option) => [option.level, option]),
) as Record<PollLevel, PollOption>

// How much a pre-poll answer counts against real attempts: two easy
// exercises' worth. Enough that the score starts where the student said,
// little enough that a handful of answers dominates it.
export const POLL_PRIOR_WEIGHT = 2

// A course grade is a coarser signal (whole course, possibly years old), so
// it counts half as much as a poll answer. The same weight is used for the
// neutral prior, so a theme never starts from an empty denominator.
export const FALLBACK_PRIOR_WEIGHT = 1

export const NEUTRAL_PRIOR = 0.5

// Course grade 4 -> 0.1, 7 -> 0.5, 10 -> 0.9: a linear map that keeps both
// ends away from the extremes, since a grade says little about any single
// theme.
export function courseGradeToPrior(grade: CourseGrade): number {
  const lowest = COURSE_GRADES[0]
  const highest = COURSE_GRADES[COURSE_GRADES.length - 1]
  return 0.1 + ((grade - lowest) / (highest - lowest)) * 0.8
}

export type PriorSource = 'poll' | 'courseGrade' | 'none'

export interface Prior {
  source: PriorSource
  value: number
  weight: number
}

export function getThemePrior(theme: Theme, state: KnowledgeState, courseGrades: CourseGrades): Prior {
  const poll = state.polls[theme.id]
  if (poll !== undefined) {
    return { source: 'poll', value: POLL_OPTION_MAP[poll].prior, weight: POLL_PRIOR_WEIGHT }
  }
  const grade = courseGrades[theme.code]
  if (grade !== undefined) {
    return { source: 'courseGrade', value: courseGradeToPrior(grade), weight: FALLBACK_PRIOR_WEIGHT }
  }
  return { source: 'none', value: NEUTRAL_PRIOR, weight: FALLBACK_PRIOR_WEIGHT }
}

// ---------------------------------------------------------------------------
// Evidence (näyttö): attempts at cards
// ---------------------------------------------------------------------------

// Quick exercises are checked by the app, so they are right or wrong.
// Open-answer task cards have no checker: after viewing the solution the
// student rates their own answer, with "partly" in the middle.
export type AttemptResult = 0 | 0.5 | 1

export interface Attempt {
  result: AttemptResult
  // Date.now() of the attempt; kept so a later version can decay old
  // evidence or draw a history, not used by the score yet.
  at: number
}

export interface KnowledgeState {
  polls: Partial<Record<ThemeId, PollLevel>>
  // Keyed by card id. Only the first attempt at a card is stored: once the
  // solution has been shown, a retry no longer tells us anything new.
  attempts: Record<string, Attempt>
}

export const EMPTY_KNOWLEDGE: KnowledgeState = { polls: {}, attempts: {} }

// Maximum weight of one attempt in the score. A quick exercise is a single
// fact; an open-answer task says more the harder it is. Hard caps at 3
// rather than the 5 exam points DIFFICULTY_POINTS gives it.
//
// The weight is only reached by a correct answer: solving a hard problem is
// strong evidence of mastery, but failing one says little about the basics,
// so a failure always weighs 1 and a partial answer sits in between (see
// attemptWeight). That way one failed Osa IV proof can't wipe out a run of
// correct basics.
export const EXERCISE_WEIGHT = 1
export const TASK_WEIGHT: Record<Difficulty, number> = { easy: 1, mid: 2, hard: 3 }

export function attemptWeight(maxWeight: number, result: AttemptResult): number {
  return 1 + (maxWeight - 1) * result
}

// Evidence at which the score is considered settled: confidence is the
// share of this a theme has collected. Six is e.g. three quick exercises
// plus an easy and a mid task.
export const FULL_EVIDENCE = 6

export function recordAttempt(state: KnowledgeState, cardId: string, result: AttemptResult, at = Date.now()): KnowledgeState {
  if (state.attempts[cardId]) return state
  return { ...state, attempts: { ...state.attempts, [cardId]: { result, at } } }
}

export function setPoll(state: KnowledgeState, themeId: ThemeId, level: PollLevel | undefined): KnowledgeState {
  const polls = { ...state.polls }
  if (level === undefined) delete polls[themeId]
  else polls[themeId] = level
  return { ...state, polls }
}

// ---------------------------------------------------------------------------
// Card -> themes
// ---------------------------------------------------------------------------

interface CardTagging {
  card: Card
  themes: ThemeId[]
  maxWeight: number
}

// Every card that can produce evidence, with the themes it is evidence
// for. Quick exercises aren't in `cards` (they only appear when browsing a
// course), so they are collected per course here. Built once: the data is
// static.
const TAGGED_CARDS: Map<string, CardTagging> = (() => {
  const map = new Map<string, CardTagging>()
  for (const card of cards) {
    if (card.type !== 'task') continue
    map.set(card.id, {
      card,
      themes: card.problem.themes ?? [],
      maxWeight: TASK_WEIGHT[classifyDifficulty(card.problem.section)],
    })
  }
  for (const course of COURSES) {
    const byConcept = groupExercisesByConcept(getExerciseCards(course.code))
    for (const [conceptIndex, exercises] of byConcept) {
      const theme = getConceptTheme(course.code, conceptIndex)
      for (const exercise of exercises) {
        map.set(exercise.id, { card: exercise, themes: theme ? [theme.id] : [], maxWeight: EXERCISE_WEIGHT })
      }
    }
  }
  return map
})()

export function getCardThemes(cardId: string): Theme[] {
  return (TAGGED_CARDS.get(cardId)?.themes ?? []).map((id) => THEME_MAP[id]).filter((theme) => theme !== undefined)
}

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

export type KnowledgeLevel = 'vahva' | 'kehittyvä' | 'heikko'

export interface KnowledgeLevelInfo {
  level: KnowledgeLevel
  label: string
  // Reuses the grade tiers so the UI can colour it with the same classes.
  tier: FinnishGrade['tier']
  min: number
}

// Listed high to low; a score belongs to the first band it reaches.
export const KNOWLEDGE_LEVELS: KnowledgeLevelInfo[] = [
  { level: 'vahva', label: 'Vahva', tier: 'high', min: 0.7 },
  { level: 'kehittyvä', label: 'Kehittyvä', tier: 'mid', min: 0.4 },
  { level: 'heikko', label: 'Heikko', tier: 'low', min: 0 },
]

export function getKnowledgeLevel(score: number): KnowledgeLevelInfo {
  return KNOWLEDGE_LEVELS.find((band) => score >= band.min) ?? KNOWLEDGE_LEVELS[KNOWLEDGE_LEVELS.length - 1]
}

export interface ThemeScore {
  theme: Theme
  // 0..1 and the same rounded to a whole percentage.
  score: number
  pct: number
  prior: Prior
  // Number of attempts and their summed weight.
  attempts: number
  evidence: number
  // 0..1: how settled the score is, evidence / FULL_EVIDENCE capped at 1.
  confidence: number
  // False when there is neither a poll answer nor an attempt: the score is
  // then just the neutral or course-grade prior and should read "ei tietoa".
  hasData: boolean
  level: KnowledgeLevelInfo
}

export interface CourseKnowledge {
  code: TopicCode
  score: number
  pct: number
  confidence: number
  hasData: boolean
  level: KnowledgeLevelInfo
  themes: ThemeScore[]
}

export interface Knowledge {
  themes: Record<ThemeId, ThemeScore>
  courses: Record<TopicCode, CourseKnowledge>
  // Mean of the course scores as a percentage, on the same 0-100 scale as
  // the exam-points prediction so predictGrade can take it directly.
  overallPct: number
}

interface EvidenceAcc {
  attempts: number
  weight: number
  weightedResult: number
}

export function computeKnowledge(state: KnowledgeState, courseGrades: CourseGrades): Knowledge {
  const evidence = new Map<ThemeId, EvidenceAcc>()
  for (const [cardId, attempt] of Object.entries(state.attempts)) {
    const tagging = TAGGED_CARDS.get(cardId)
    if (!tagging) continue
    const weight = attemptWeight(tagging.maxWeight, attempt.result)
    for (const themeId of tagging.themes) {
      const acc = evidence.get(themeId) ?? { attempts: 0, weight: 0, weightedResult: 0 }
      acc.attempts += 1
      acc.weight += weight
      acc.weightedResult += weight * attempt.result
      evidence.set(themeId, acc)
    }
  }

  const themes: Record<ThemeId, ThemeScore> = {}
  for (const theme of THEMES) {
    const prior = getThemePrior(theme, state, courseGrades)
    const acc = evidence.get(theme.id) ?? { attempts: 0, weight: 0, weightedResult: 0 }
    const score = (prior.weight * prior.value + acc.weightedResult) / (prior.weight + acc.weight)
    themes[theme.id] = {
      theme,
      score,
      pct: Math.round(score * 100),
      prior,
      attempts: acc.attempts,
      evidence: acc.weight,
      confidence: Math.min(1, acc.weight / FULL_EVIDENCE),
      hasData: prior.source === 'poll' || acc.attempts > 0,
      level: getKnowledgeLevel(score),
    }
  }

  const courses = {} as Record<TopicCode, CourseKnowledge>
  for (const course of COURSES) {
    const courseThemes = getCourseThemes(course.code).map((theme) => themes[theme.id])
    const totalWeight = courseThemes.reduce((sum, t) => sum + (t.theme.weight ?? 1), 0)
    const score =
      totalWeight > 0 ? courseThemes.reduce((sum, t) => sum + (t.theme.weight ?? 1) * t.score, 0) / totalWeight : NEUTRAL_PRIOR
    const confidence =
      courseThemes.length > 0 ? courseThemes.reduce((sum, t) => sum + t.confidence, 0) / courseThemes.length : 0
    courses[course.code] = {
      code: course.code,
      score,
      pct: Math.round(score * 100),
      confidence,
      hasData: courseThemes.some((t) => t.hasData),
      level: getKnowledgeLevel(score),
      themes: courseThemes,
    }
  }

  const overallPct =
    COURSES.length > 0 ? Math.round((COURSES.reduce((sum, c) => sum + courses[c.code].score, 0) / COURSES.length) * 100) : 0

  return { themes, courses, overallPct }
}

// How urgently a theme should be practised, for the Suositellut feed: the
// gap to full mastery, boosted while the score is still unsettled so an
// untested theme is checked before a known-weak one is drilled to death.
// `relevance` is the study plan's say (0 = not in the plan .. 1 = core),
// multiplied in so out-of-plan themes sink to the bottom.
export function getThemePriority(themeScore: ThemeScore, relevance = 1): number {
  const gap = 1 - themeScore.score
  const uncertainty = 1 - themeScore.confidence
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
}

function isPollLevel(value: unknown): value is PollLevel {
  return value === 0 || value === 1 || value === 2 || value === 3
}

function isAttemptResult(value: unknown): value is AttemptResult {
  return value === 0 || value === 0.5 || value === 1
}

export function loadKnowledge(): KnowledgeState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return EMPTY_KNOWLEDGE
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_KNOWLEDGE
    const raw = parsed as Partial<StoredKnowledge>
    if (raw.version !== STORAGE_VERSION) return EMPTY_KNOWLEDGE

    const polls: KnowledgeState['polls'] = {}
    for (const [themeId, level] of Object.entries(raw.polls ?? {})) {
      if (THEME_MAP[themeId] && isPollLevel(level)) polls[themeId] = level
    }
    const attempts: KnowledgeState['attempts'] = {}
    for (const [cardId, attempt] of Object.entries(raw.attempts ?? {})) {
      if (typeof attempt !== 'object' || attempt === null) continue
      const { result, at } = attempt as Partial<Attempt>
      if (isAttemptResult(result) && typeof at === 'number') attempts[cardId] = { result, at }
    }
    return { polls, attempts }
  } catch {
    return EMPTY_KNOWLEDGE
  }
}

export function saveKnowledge(state: KnowledgeState): void {
  try {
    const stored: StoredKnowledge = { version: STORAGE_VERSION, ...state }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // in-memory state still works for the session.
  }
}
