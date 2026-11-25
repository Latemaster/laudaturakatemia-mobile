import { getExerciseCards } from './cards'
import { COURSES, COURSE_MAP } from './courses'
import { exerciseMaxPoints } from './evaluation'
import { PLAN_WEEKS, WEEKLY_POINTS_GOAL } from './points'
import { RUBRIC_EXERCISES } from './rubrics'
import { getCourseRelevance, type TargetGrade } from './studyPlans'
import type { TopicCode } from '../types'

// Points per course: how much of a course has been done (the progress bar),
// and how the points fill the target ring. Neither says how well the
// student knows the course; that is knowledge.ts.

// What each course offers: one point per quick exercise, plus the open
// tasks that have a rubric to score against.
const OFFERED: Record<TopicCode, number> = Object.fromEntries(
  COURSES.map(({ code }) => [
    code,
    getExerciseCards(code).length +
      RUBRIC_EXERCISES.filter((exercise) => exercise.topic.code === code).reduce(
        (sum, exercise) => sum + exerciseMaxPoints(exercise),
        0,
      ),
  ]),
) as Record<TopicCode, number>

export function getOfferedPoints(code: TopicCode): number {
  return OFFERED[code]
}

// Card ids start with their course: "maa2-exercise-1", "maa2-task-OSAI_T1".
export function getCardCourse(cardId: string): TopicCode | null {
  const code = cardId.split('-')[0].toUpperCase()
  return code in COURSE_MAP ? (code as TopicCode) : null
}

export type CoursePoints = Record<TopicCode, number>

export function getCoursePoints(earned: Record<string, number>): CoursePoints {
  const points = Object.fromEntries(COURSES.map(({ code }) => [code, 0])) as CoursePoints
  for (const [cardId, value] of Object.entries(earned)) {
    const code = getCardCourse(cardId)
    if (code) points[code] += value
  }
  return points
}

// The course progress bar: points earned out of the points the course
// offers.
export function getCourseProgressPct(code: TopicCode, points: CoursePoints): number {
  const offered = OFFERED[code]
  return offered > 0 ? Math.min(100, Math.round((points[code] / offered) * 100)) : 0
}

// ---------------------------------------------------------------------------
// Target ring
// ---------------------------------------------------------------------------

// Points from one course count towards the ring up to this many times its
// quota: strength in one course partly makes up for another, but no single
// course can close the ring.
export const QUOTA_CAP = 1.5

// Each plan course's share of the points the target needs (the weekly goal
// over the plan's weeks), by how central the course is to the plan. A
// course never has to give more than it offers; what it can't is shared
// among the others the same way.
export function getCourseQuotas(
  grade: TargetGrade,
  offered: Partial<Record<TopicCode, number>> = OFFERED,
): Map<TopicCode, number> {
  const quotas = new Map<TopicCode, number>()
  let open = [...getCourseRelevance(grade)]
  let left = WEEKLY_POINTS_GOAL[grade] * PLAN_WEEKS
  while (open.length > 0) {
    const share = left / open.reduce((sum, [, relevance]) => sum + relevance, 0)
    const full = open.filter(([code, relevance]) => (offered[code] ?? 0) <= share * relevance)
    if (full.length === 0) {
      for (const [code, relevance] of open) quotas.set(code, share * relevance)
      break
    }
    for (const [code] of full) {
      quotas.set(code, offered[code] ?? 0)
      left -= offered[code] ?? 0
    }
    open = open.filter(([code]) => !quotas.has(code))
  }
  return quotas
}

export interface TargetProgress {
  // Points that count, and points needed, rounded for showing.
  counted: number
  needed: number
  // 0..1.
  progress: number
}

export function getTargetProgress(
  grade: TargetGrade,
  points: CoursePoints,
  offered: Partial<Record<TopicCode, number>> = OFFERED,
): TargetProgress {
  let counted = 0
  let needed = 0
  for (const [code, quota] of getCourseQuotas(grade, offered)) {
    counted += Math.min(points[code], QUOTA_CAP * quota)
    needed += quota
  }
  const progress = needed > 0 ? Math.min(1, counted / needed) : 0
  return {
    // Rounded down, so the figures only meet when the ring closes.
    counted: progress >= 1 ? Math.round(needed) : Math.floor(Math.min(counted, needed)),
    needed: Math.round(needed),
    progress,
  }
}
