import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { getCheckpointProgress, onPointsAwarded, usePointsTotal, type PointsEvent } from '../data/points'
import { ConfettiBurst } from './Celebrations'

// Two rings after a fitness watch's activity rings, shared by the top
// bar's corner and the Osaaminen page:
// - outer, dark green: points towards the target grade (coursePoints.ts);
// - inner, light green: the way to the next välietappi.
// Points move both; when the inner ring closes it lights up, bursts, starts
// over, and the outer ring gets its push.

export const RING_COLORS = {
  outer: { stroke: '#1e7a4c', track: 'rgba(30, 122, 76, 0.14)', glow: 'rgba(30, 122, 76, 0.75)' },
  inner: { stroke: '#4fd18b', track: 'rgba(79, 209, 139, 0.22)', glow: 'rgba(79, 209, 139, 0.9)' },
}
type RingColor = (typeof RING_COLORS)['outer']

const BUBBLE_MS = 2600
// A closed checkpoint: how long the inner ring stays full and lit before
// it starts over, and when the outer ring gets its push.
export const CHECKPOINT_HOLD_MS = 1000

export interface RingsState {
  inner: number
  instant: boolean
  innerLit: boolean
  outerLit: boolean
  // Bumped per award, and per closed checkpoint.
  burst: number
  bigBurst: number
  bubble: PointsEvent | null
}

// The rings' animation state, driven by points being awarded.
export function useRingsState(): RingsState {
  const total = usePointsTotal()
  const [inner, setInner] = useState(() => getCheckpointProgress(total).progress)
  const [instant, setInstant] = useState(false)
  const [innerLit, setInnerLit] = useState(false)
  const [outerLit, setOuterLit] = useState(false)
  const [burst, setBurst] = useState(0)
  const [bigBurst, setBigBurst] = useState(0)
  const [bubble, setBubble] = useState<PointsEvent | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    const off = onPointsAwarded((event) => {
      timers.current.forEach(window.clearTimeout)
      timers.current = []
      setInstant(false)
      setBurst((b) => b + 1)
      setBubble(event)
      const progress = getCheckpointProgress(event.total).progress
      if (event.reached) {
        // Close the ring, light it up, then start it over and push the
        // outer ring.
        setInner(1)
        later(650, () => {
          setInnerLit(true)
          setBigBurst((b) => b + 1)
        })
        later(CHECKPOINT_HOLD_MS + 400, () => {
          setInnerLit(false)
          setInstant(true)
          setInner(0)
          setOuterLit(true)
        })
        later(CHECKPOINT_HOLD_MS + 480, () => {
          setInstant(false)
          setInner(progress)
        })
        later(CHECKPOINT_HOLD_MS + 1500, () => setOuterLit(false))
      } else {
        setInner(progress)
        setInnerLit(true)
        later(700, () => setInnerLit(false))
      }
      later(event.reached ? BUBBLE_MS + 1400 : BUBBLE_MS, () => setBubble(null))
    })
    return () => {
      off()
      timers.current.forEach(window.clearTimeout)
    }
  }, [])

  return { inner, instant, innerLit, outerLit, burst, bigBurst, bubble }
}

function Ring({
  radius,
  stroke,
  size,
  value,
  colors,
  instant,
  delayMs,
  lit,
}: {
  radius: number
  stroke: number
  size: number
  value: number
  colors: RingColor
  instant?: boolean
  delayMs?: number
  lit?: boolean
}) {
  const circumference = 2 * Math.PI * radius
  const v = Math.min(1, Math.max(0, value))
  return (
    <>
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" stroke={colors.track} />
      {v > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          stroke={colors.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - v)}
          style={{
            transition: instant
              ? 'none'
              : `stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs ?? 0}ms, filter 300ms`,
            filter: lit ? `drop-shadow(0 0 3px ${colors.glow}) drop-shadow(0 0 7px ${colors.glow})` : 'none',
          }}
        />
      )}
    </>
  )
}

// The rings on a white disc, `center` (the target grade) in the middle.
export default function ActivityRings({
  size,
  stroke,
  outer,
  state,
  center,
  popOnPoints = true,
}: {
  size: number
  stroke: number
  // 0..1 (capped) of the way to the target grade.
  outer: number
  state: RingsState
  center?: ReactNode
  popOnPoints?: boolean
}) {
  const gap = Math.max(1.5, stroke * 0.25)
  const outerR = (size - stroke) / 2
  const innerR = outerR - stroke - gap
  const pad = Math.round(size * 0.08)
  const reached = state.bubble?.reached ?? null
  return (
    <motion.span
      key={popOnPoints ? state.burst : undefined}
      initial={false}
      animate={popOnPoints && state.burst > 0 ? { scale: [1, 1.14, 0.97, 1] } : undefined}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative flex shrink-0 items-center justify-center rounded-full bg-surface shadow-md ring-1 ring-ink/10"
      style={{ width: size + pad * 2, height: size + pad * 2 }}
    >
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <Ring
          radius={outerR}
          stroke={stroke}
          size={size}
          value={outer}
          colors={RING_COLORS.outer}
          delayMs={reached ? CHECKPOINT_HOLD_MS + 400 : 450}
          lit={state.outerLit}
        />
        <Ring
          radius={innerR}
          stroke={stroke}
          size={size}
          value={state.inner}
          colors={RING_COLORS.inner}
          instant={state.instant}
          lit={state.innerLit}
        />
      </svg>
      {center && <span className="absolute inset-0 flex items-center justify-center">{center}</span>}
      {/* A closed checkpoint: a green ring swells out. */}
      {state.bigBurst > 0 && (
        <motion.span
          key={state.bigBurst}
          aria-hidden
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 0 3px ${RING_COLORS.inner.stroke}, 0 0 16px ${RING_COLORS.inner.glow}` }}
        />
      )}
      <ConfettiBurst trigger={state.bigBurst} origin="center" delay={0} count={30} spread={1.6} className="overflow-visible" />
    </motion.span>
  )
}
