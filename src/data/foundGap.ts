import { COURSE_MAP } from './courses'
import { STRONG_PCT, type Knowledge } from './knowledge'
import type { TopicCode } from '../types'

// A drop in the predicted grade's percentage means an answer found a gap:
// the course is remembered, named on Osaaminen and moved to the top of the
// feed until it is back where it was.
export interface FoundGap {
  code: TopicCode
  // The course's percentage before the drop.
  pct: number
}

// The gap after one answer in `code`: a new one when the prediction fell
// and the course is not a strong one, none when the known one has been
// closed, otherwise what it was.
export function updateFoundGap(
  gap: FoundGap | null,
  code: TopicCode,
  before: Knowledge,
  after: Knowledge,
): FoundGap | null {
  const { pct } = after.courses[code]
  if (after.overall.pct < before.overall.pct && pct < STRONG_PCT) {
    // A second drop in the same course still has to climb all the way back.
    const from = gap?.code === code ? Math.max(gap.pct, before.courses[code].pct) : before.courses[code].pct
    return { code, pct: from }
  }
  return gap?.code === code && pct >= gap.pct ? null : gap
}

const STORAGE_KEY = 'laudatur.foundGap'

export function loadFoundGap(): FoundGap | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const { code, pct } = (JSON.parse(stored) ?? {}) as Partial<FoundGap>
    return typeof code === 'string' && code in COURSE_MAP && typeof pct === 'number' ? { code, pct } : null
  } catch {
    return null
  }
}

export function saveFoundGap(gap: FoundGap | null): void {
  try {
    if (gap) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gap))
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable; the gap then lasts for the session.
  }
}
