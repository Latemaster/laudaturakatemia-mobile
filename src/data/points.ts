import { useSyncExternalStore } from 'react'

// Points the student has earned across the app: a quick exercise's one
// point, an open task's self-scored points. Kept per exercise, at the best
// score so far, so answering again or re-scoring never counts twice; the
// total drives the checkpoints (välietapit) and the top bar's mini donut.

interface PointsState {
  earned: Record<string, number>
}

export interface PointsEvent {
  // Points added by this award (always > 0).
  delta: number
  total: number
  // Set when the award reached a new checkpoint.
  reached: Checkpoint | null
}

const STORAGE_KEY = 'laudatur.points'
const STORAGE_VERSION = 1
const EVENT = 'laudatur:points'

function load(): PointsState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { earned: {} }
    const parsed = JSON.parse(stored) as { version?: number; earned?: Record<string, unknown> }
    if (parsed.version !== STORAGE_VERSION || typeof parsed.earned !== 'object' || parsed.earned === null) {
      return { earned: {} }
    }
    const earned: Record<string, number> = {}
    for (const [id, value] of Object.entries(parsed.earned)) {
      if (typeof value === 'number' && value > 0) earned[id] = value
    }
    return { earned }
  } catch {
    return { earned: {} }
  }
}

let state = load()
let total = sumOf(state)
const listeners = new Set<() => void>()

function sumOf(s: PointsState): number {
  return Object.values(s.earned).reduce((sum, n) => sum + n, 0)
}

function save() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, ...state }))
  } catch {
    // Storage can be unavailable; the session still counts.
  }
}

// Records `points` for exercise `id`. Only an improvement on the best so
// far adds to the total; returns what was added.
export function awardPoints(id: string, points: number): number {
  const before = state.earned[id] ?? 0
  if (!(points > before)) return 0
  const prevTotal = total
  state = { earned: { ...state.earned, [id]: points } }
  total = sumOf(state)
  save()
  listeners.forEach((l) => l())
  const delta = total - prevTotal
  const prevCp = getCheckpointProgress(prevTotal)
  const nextCp = getCheckpointProgress(total)
  const event: PointsEvent = {
    delta,
    total,
    reached: nextCp.reachedCount > prevCp.reachedCount ? CHECKPOINTS[nextCp.reachedCount - 1] : null,
  }
  window.dispatchEvent(new CustomEvent<PointsEvent>(EVENT, { detail: event }))
  return delta
}

export function getPointsTotal(): number {
  return total
}

export function usePointsTotal(): number {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => total,
  )
}

export function onPointsAwarded(handler: (event: PointsEvent) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<PointsEvent>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}

// ---------------------------------------------------------------------------
// Checkpoints (välietapit)
// ---------------------------------------------------------------------------

export interface Checkpoint {
  // 1-based.
  number: number
  points: number
}

// Close together at first, so the first ones come quickly, then further
// apart. Past the list, one every 100 points.
const CHECKPOINT_POINTS = [5, 15, 30, 50, 75, 100, 150, 200, 300, 400, 500]
const MAX_LISTED = 40
export const CHECKPOINTS: Checkpoint[] = Array.from({ length: MAX_LISTED }, (_, i) => ({
  number: i + 1,
  points:
    i < CHECKPOINT_POINTS.length
      ? CHECKPOINT_POINTS[i]
      : CHECKPOINT_POINTS[CHECKPOINT_POINTS.length - 1] + (i - CHECKPOINT_POINTS.length + 1) * 100,
}))

export interface CheckpointProgress {
  total: number
  reachedCount: number
  // The checkpoint just passed (0 points before the first) and the next.
  prevPoints: number
  next: Checkpoint | null
  // Points still needed for the next checkpoint.
  toNext: number
  // 0..1 between the previous and the next checkpoint.
  progress: number
}

export function getCheckpointProgress(points: number): CheckpointProgress {
  const reachedCount = CHECKPOINTS.filter((cp) => points >= cp.points).length
  const next = CHECKPOINTS[reachedCount] ?? null
  const prevPoints = reachedCount > 0 ? CHECKPOINTS[reachedCount - 1].points : 0
  if (!next) return { total: points, reachedCount, prevPoints, next: null, toNext: 0, progress: 1 }
  return {
    total: points,
    reachedCount,
    prevPoints,
    next,
    toNext: next.points - points,
    progress: (points - prevPoints) / (next.points - prevPoints),
  }
}

// "1 piste" / "4 pistettä".
export function pointsLabel(n: number): string {
  return `${n} ${n === 1 ? 'piste' : 'pistettä'}`
}
