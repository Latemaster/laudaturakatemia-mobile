import { cards } from './cards'
import { COURSES } from './courses'
import type { TaskCard, TopicCode } from '../types'

export interface CourseProgress {
  engaged: number
  total: number
  pct: number
}

export function getCourseProgress(code: TopicCode, engagedIds: Record<string, true>): CourseProgress {
  const practiceCards = cards.filter(
    (card) => card.topic.code === code && (card.type === 'task' || card.type === 'exercise'),
  )
  const total = practiceCards.length
  const engaged = practiceCards.filter((card) => engagedIds[card.id]).length
  const pct = total > 0 ? Math.round((engaged / total) * 100) : 0
  return { engaged, total, pct }
}

export function getOverallPct(engagedIds: Record<string, true>): number {
  if (COURSES.length === 0) return 0
  const sum = COURSES.reduce((acc, course) => acc + getCourseProgress(course.code, engagedIds).pct, 0)
  return Math.round(sum / COURSES.length)
}

export type Difficulty = 'easy' | 'mid' | 'hard'

// Point weight per solved problem, by difficulty.
export const DIFFICULTY_POINTS: Record<Difficulty, number> = { easy: 1, mid: 2, hard: 5 }

// Every course splits its 35 problems 10/10/15 across easy/mid/hard (see
// classifyDifficulty below) — used where a course's per-tier totals are
// needed without walking the full card list (e.g. example-data generation).
export const DIFFICULTY_TOTALS: Record<Difficulty, number> = { easy: 10, mid: 10, hard: 15 }

// Every course's 35 problems are split 10/10/10/5 across "Osa I".."Osa IV"
// (some courses spell it "Osio"), matching the source packets' own
// perustehtävä / keskivaikea / syventävä / vaativa split. Osa III and IV are
// combined into one "hard" tier for a simple three-level breakdown.
function classifyDifficulty(section: string): Difficulty {
  const roman = section.trim().split(/\s+/).pop()
  if (roman === 'I') return 'easy'
  if (roman === 'II') return 'mid'
  return 'hard'
}

export interface DifficultyStats {
  engaged: number
  total: number
}

export type DifficultyBreakdown = Record<Difficulty, DifficultyStats>

export function getCourseDifficultyBreakdown(
  code: TopicCode,
  engagedIds: Record<string, true>,
): DifficultyBreakdown {
  const breakdown: DifficultyBreakdown = {
    easy: { engaged: 0, total: 0 },
    mid: { engaged: 0, total: 0 },
    hard: { engaged: 0, total: 0 },
  }
  const taskCards = cards.filter(
    (card): card is TaskCard => card.topic.code === code && card.type === 'task',
  )
  for (const card of taskCards) {
    const tier = classifyDifficulty(card.problem.section)
    breakdown[tier].total += 1
    if (engagedIds[card.id]) breakdown[tier].engaged += 1
  }
  return breakdown
}
