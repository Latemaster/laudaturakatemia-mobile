import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { exerciseMaxPoints, markedCount, scoredPoints, type EvaluationAttempt } from '../../data/evaluation'
import type { RubricExercise } from '../../data/rubrics'

// The exercise's points tile and its colours, shared by the laptop exercise
// box (ExerciseWorkspace) and the phone feed's task card (TaskCardView).

export interface Points {
  scored: number | null
  max: number
  // Every criterion has been marked.
  done: boolean
}

// The tally's colour, from `bad` through amber (topic-maa7) to `good` as
// the share of the maximum grows.
const TALLY_STOPS: [number, number, number][] = [
  [0xd9, 0x63, 0x6f],
  [0xd9, 0x8a, 0x3d],
  [0x2f, 0x9e, 0x6e],
]
function tallyColor(ratio: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, ratio)) * (TALLY_STOPS.length - 1)
  const i = Math.min(Math.floor(t), TALLY_STOPS.length - 2)
  const f = t - i
  return TALLY_STOPS[i].map((c, k) => Math.round(c + (TALLY_STOPS[i + 1][k] - c) * f)) as [number, number, number]
}
// The page's accent, before anything is scored.
const UNSCORED_COLOR: [number, number, number] = [0x56, 0x81, 0xbd]

// The points' colour as an rgba() string, shared by the badge and the
// answered exercise's outline.
export function pointsColor(points: Points | undefined, alpha = 1): string {
  const [r, g, b] =
    !points || points.scored === null ? UNSCORED_COLOR : tallyColor(points.scored / points.max)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Counts from 0 up to `target` each time `trigger` changes (but not on
// mount): the fractional value while counting, null otherwise. Starts after
// a short pause so the full view has closed before the points pour in.
function useCountUp(target: number | null, trigger: number): number | null {
  const [value, setValue] = useState<number | null>(null)
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    const to = targetRef.current
    if (trigger === 0 || !to) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const delay = 250
    const duration = Math.min(1400, 400 + to * 120)
    const start = performance.now() + delay
    let frame = 0
    setValue(0)
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration))
      setValue(t < 1 ? to * (1 - (1 - t) ** 3) : null)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [trigger])

  return value
}

// Up to this many points the scale shows one segment per point; above it,
// one continuous bar.
const MAX_SEGMENTS = 20
// The tile's side padding and the gap between segments, in rem (px-4, gap-1).
const TILE_PAD = 1
const SEGMENT_GAP = 0.25

// How far the tile's background fill reaches for `shown` of `max` points:
// exactly to the filled edge of the scale under it, which is inset by the
// tile's padding and broken by the segment gaps. Empty and full fill the
// whole tile's edges.
function fillWidth(shown: number, max: number): string {
  if (shown <= 0) return '0%'
  if (shown >= max) return '100%'
  const inner = `(100% - ${2 * TILE_PAD}rem)`
  if (max > MAX_SEGMENTS) return `calc(${TILE_PAD}rem + ${inner} * ${shown / max})`
  // The segments before the one the edge is in, and how much of that one is
  // filled; a whole number of points ends on its segment, not after the gap.
  const whole = Math.ceil(shown) - 1
  const part = shown - whole
  // A segment and the gap after it are (inner + gap) / max wide; a segment
  // alone is (inner - (max - 1) gaps) / max.
  return `calc(${TILE_PAD}rem + (${inner} + ${SEGMENT_GAP}rem) * ${whole / max} + (${inner} - ${
    (max - 1) * SEGMENT_GAP
  }rem) * ${part / max})`
}

// The header's top-right corner is the score, larger than the tags around
// it: "– / 12 p" before self-scoring, then the running tally on a scale with
// a segment per point, tinted from red to green by how much of the maximum
// it is. Once there is an answer it opens Pisteytys. Each change of
// `celebrate` (saving the points) fills the scale up from empty with a
// "+N p" rising over it.
//
// `compact` is the phone card's narrower tile, beside the title.
export default function PointsBadge({
  points,
  onOpen,
  celebrate = 0,
  compact = false,
  hint = 'Lähetä vastaus, niin voit pisteyttää sen',
}: {
  points: Points
  onOpen?: () => void
  celebrate?: number
  compact?: boolean
  // The tooltip while the tile can't be opened.
  hint?: string
}) {
  const { scored, max, done } = points
  const counting = useCountUp(scored, celebrate)
  const shown = counting ?? scored
  const color = (alpha = 1) => pointsColor({ ...points, scored: shown }, alpha)
  const fill = (shown ?? 0) / max
  const label = done
    ? 'Pisteesi'
    : scored !== null
      ? 'Pisteytys kesken'
      : onOpen
        ? 'Pisteytä vastaus'
        : 'Pisteet'
  const content = (
    <>
      {/* The tile fills up with the points, behind the text. */}
      <span aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl">
        <span
          className={`absolute inset-y-0 left-0 ${counting === null ? 'transition-[width] duration-500' : ''}`}
          style={{ width: fillWidth(shown ?? 0, max), backgroundColor: color(0.12) }}
        />
      </span>
      <span className="relative text-[11px] font-semibold uppercase tracking-wide">
        {label}
        {onOpen && ' ›'}
      </span>
      <span className={`relative font-bold leading-tight tabular-nums ${compact ? 'text-xl' : 'text-2xl'}`}>
        {shown === null ? '–' : counting === null ? shown : Math.floor(shown)}
        <span className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}> / {max} p</span>
      </span>
      <span className={`relative mt-1.5 flex w-full ${compact ? 'h-2 gap-1' : 'h-2.5 gap-1'}`}>
        {max <= MAX_SEGMENTS ? (
          Array.from({ length: max }, (_, i) => (
            <span key={i} className="h-full flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: color(0.15) }}>
              <span
                className="block h-full"
                style={{
                  width: `${Math.min(1, Math.max(0, (shown ?? 0) - i)) * 100}%`,
                  backgroundColor: color(),
                }}
              />
            </span>
          ))
        ) : (
          <span className="h-full flex-1 overflow-hidden rounded-sm" style={{ backgroundColor: color(0.15) }}>
            <span className="block h-full" style={{ width: `${fill * 100}%`, backgroundColor: color() }} />
          </span>
        )}
      </span>
      {celebrate > 0 && scored !== null && scored > 0 && (
        <motion.span
          key={celebrate}
          aria-hidden
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 1, 1, 0], y: [6, -2, -10, -16] }}
          transition={{ delay: 0.25, duration: 1.6, times: [0, 0.15, 0.7, 1], ease: 'easeOut' }}
          className="pointer-events-none absolute right-3 top-1 text-sm font-bold"
          style={{ color: pointsColor(points) }}
        >
          +{scored} p
        </motion.span>
      )}
    </>
  )
  const className = `relative flex flex-col items-start rounded-2xl px-4 py-2.5 text-left transition-colors ${
    compact ? 'w-36' : 'w-56'
  }`
  const style = { backgroundColor: color(0.06), color: color(), boxShadow: `inset 0 0 0 1px ${color(0.3)}` }
  // A small bump once the scale is full.
  const pulse = {
    initial: false as const,
    animate: celebrate > 0 ? { scale: [1, 1, 1.06, 1] } : undefined,
    transition: { duration: 1.9, times: [0, 0.75, 0.88, 1] },
  }
  return onOpen ? (
    <motion.button
      key={celebrate}
      {...pulse}
      type="button"
      onClick={onOpen}
      title="Näytä pisteytys"
      className={`${className} hover:brightness-95`}
      style={style}
    >
      {content}
    </motion.button>
  ) : (
    <motion.div
      key={celebrate}
      {...pulse}
      className={className}
      style={style}
      title={hint}
    >
      {content}
    </motion.div>
  )
}


// An exercise's points from its rubric and the student's self-scores;
// undefined for problems whose rubric isn't written yet.
export function useTaskPoints(
  rubricExercise: RubricExercise | undefined,
  scores: EvaluationAttempt['scores'] | undefined,
): Points | undefined {
  return useMemo(() => {
    if (!rubricExercise) return undefined
    const marked = markedCount(rubricExercise, scores ?? {})
    return {
      scored: marked.marked === 0 ? null : scoredPoints(rubricExercise, scores ?? {}),
      max: exerciseMaxPoints(rubricExercise),
      done: marked.marked === marked.total,
    }
  }, [rubricExercise, scores])
}

// The whole card lighting up as points come in: a glow in the points'
// colour that swells in from the card's edges and fades, timed with the tile
// filling up. Each change of `trigger` plays it once; 0 shows nothing.
// Sits inside a positioned card, under its content's pointer events.
export function CardGlow({
  trigger,
  points,
  className = 'rounded-3xl',
}: {
  trigger: number
  points: Points | undefined
  className?: string
}) {
  if (trigger === 0) return null
  return (
    <motion.span
      key={trigger}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ delay: 0.2, duration: 1.8, times: [0, 0.2, 0.55, 1], ease: 'easeOut' }}
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
      style={{
        boxShadow: `inset 0 0 0 3px ${pointsColor(points)}, inset 0 0 48px ${pointsColor(points, 0.35)}`,
        background: `radial-gradient(ellipse at top right, ${pointsColor(points, 0.12)}, transparent 70%)`,
      }}
    />
  )
}

export const QUICK_POINTS_HINT = 'Vastaa, niin saat pisteen'

// A quick exercise's single point: "– / 1 p" until it's checked, then 1 or
// 0 by the latest check. A right answer bumps `celebrate`, so the tile
// fills with a "+1 p" and the card lights up. `answer` wraps the
// exercise's own onAnswer.
export function useQuickPoints(onAnswer?: (correct: boolean) => void) {
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [celebrate, setCelebrate] = useState(0)
  const answer = useCallback(
    (isCorrect: boolean) => {
      setCorrect(isCorrect)
      if (isCorrect) setCelebrate((c) => c + 1)
      onAnswer?.(isCorrect)
    },
    [onAnswer],
  )
  const points: Points = { scored: correct === null ? null : correct ? 1 : 0, max: 1, done: correct !== null }
  return { points, celebrate, answer }
}
