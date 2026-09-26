import { cards } from './cards'
import { COURSES } from './courses'
import type { TopicCode } from '../types'

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
