import type { PollLevel } from './knowledge'

// How confident the student says they are in each learning goal on the
// Kurssit › Oppimistavoitteet page, on the same four-step scale as the
// Osaaminen pre-poll. Goals have no ids of their own, so they are keyed by
// course, heading and text (goalKey); editing a goal's wording drops its
// answer, which is fine for a self-assessment.

export type GoalConfidence = Record<string, PollLevel>

const STORAGE_KEY = 'laudatur.goalConfidence'

export function goalKey(code: string, heading: string, goal: string): string {
  return `${code}|${heading}|${goal}`
}

function isPollLevel(value: unknown): value is PollLevel {
  return value === 0 || value === 1 || value === 2 || value === 3
}

export function loadGoalConfidence(): GoalConfidence {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const result: GoalConfidence = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (isPollLevel(value)) result[key] = value
    }
    return result
  } catch {
    return {}
  }
}

export function saveGoalConfidence(confidence: GoalConfidence): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(confidence))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // in-memory state still works for the session.
  }
}
