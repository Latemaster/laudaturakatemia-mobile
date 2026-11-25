import { useSyncExternalStore } from 'react'

// Points the student has earned across the app: a quick exercise's one
// point, an open task's self-scored points. Kept per exercise, at the best
// score so far, so answering again or re-scoring never counts twice; the
// total drives the checkpoints (välietapit) and the top bar's mini donut.

interface PointsState {
  earned: Record<string, number>
  // Every award, dated, for the weekly chart.
  log: PointsLogEntry[]
}

export interface PointsLogEntry {
  at: number
  points: number
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
    if (!stored) return { earned: {}, log: [] }
    const parsed = JSON.parse(stored) as { version?: number; earned?: Record<string, unknown>; log?: unknown }
    if (parsed.version !== STORAGE_VERSION || typeof parsed.earned !== 'object' || parsed.earned === null) {
      return { earned: {}, log: [] }
    }
    const earned: Record<string, number> = {}
    for (const [id, value] of Object.entries(parsed.earned)) {
      if (typeof value === 'number' && value > 0) earned[id] = value
    }
    const log: PointsLogEntry[] = []
    if (Array.isArray(parsed.log)) {
      for (const entry of parsed.log) {
        const { at, points } = (entry ?? {}) as Partial<PointsLogEntry>
        if (typeof at === 'number' && typeof points === 'number' && points > 0) log.push({ at, points })
      }
    }
    // Points saved before the log existed count from now.
    const logged = log.reduce((sum, e) => sum + e.points, 0)
    const unlogged = Object.values(earned).reduce((sum, n) => sum + n, 0) - logged
    if (unlogged > 0) log.push({ at: Date.now(), points: unlogged })
    return { earned, log }
  } catch {
    return { earned: {}, log: [] }
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
  const earned = { ...state.earned, [id]: points }
  state = { earned, log: [...state.log, { at: Date.now(), points: points - before }] }
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

export function getPointsLog(): PointsLogEntry[] {
  return state.log
}

// The award log, re-rendering on every award.
export function usePointsLog(): PointsLogEntry[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state.log,
  )
}

// Best points per exercise, re-rendering on every award.
export function usePointsEarned(): Record<string, number> {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state.earned,
  )
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
  // The student's level (taso): 1 at the start, one up per checkpoint.
  level: number
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
  if (!next) return { total: points, reachedCount, level: reachedCount + 1, prevPoints, next: null, toNext: 0, progress: 1 }
  return {
    total: points,
    reachedCount,
    level: reachedCount + 1,
    prevPoints,
    next,
    toNext: next.points - points,
    progress: (points - prevPoints) / (next.points - prevPoints),
  }
}

// ---------------------------------------------------------------------------
// Weekly pace
// ---------------------------------------------------------------------------

// Points per week that keep a student on track for each target grade: the
// dashed "tavoitetahti" line in Edistyminen ajan mittaan. Roughly a few
// quick exercises a day for B up to a steady daily session for L.
export const WEEKLY_POINTS_GOAL: Record<'L' | 'E' | 'M' | 'C' | 'B', number> = {
  L: 35,
  E: 28,
  M: 20,
  C: 14,
  B: 10,
}

// The plan's length: the chart's weeks, and the target ring's points.
export const PLAN_WEEKS = 8

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// Monday 00:00 (local time) of the week `at` falls in.
export function weekStart(at: number): number {
  const d = new Date(at)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.getTime()
}

export interface WeekPoints {
  // 1-based, counted from the week of the first points.
  week: number
  start: number
  // Earned that week, and in all up to its end.
  points: number
  cumulative: number
}

// Points per week from the week of the first points up to this week.
export function getWeeklyPoints(log: PointsLogEntry[], now = Date.now()): WeekPoints[] {
  const first = log.length > 0 ? Math.min(...log.map((e) => e.at)) : now
  const firstWeek = weekStart(first)
  const count = Math.max(1, Math.round((weekStart(now) - firstWeek) / WEEK_MS) + 1)
  const weeks: WeekPoints[] = Array.from({ length: count }, (_, i) => ({
    week: i + 1,
    // Rounded via Date so a daylight-saving change can't shift a week.
    start: weekStart(firstWeek + i * WEEK_MS + 12 * 60 * 60 * 1000),
    points: 0,
    cumulative: 0,
  }))
  for (const entry of log) {
    const index = Math.round((weekStart(entry.at) - firstWeek) / WEEK_MS)
    if (weeks[index]) weeks[index].points += entry.points
  }
  let running = 0
  for (const w of weeks) {
    running += w.points
    w.cumulative = running
  }
  return weeks
}

// "1 piste" / "4 pistettä".
export function pointsLabel(n: number): string {
  return `${n} ${n === 1 ? 'piste' : 'pistettä'}`
}
