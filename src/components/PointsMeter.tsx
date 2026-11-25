import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCheckpointProgress, onPointsAwarded, usePointsTotal, type PointsEvent } from '../data/points'
import { pointsToPct } from '../data/grade'
import { getTargetPoints, type TargetGrade } from '../data/studyPlans'
import { computeKnowledge, type KnowledgeState } from '../data/knowledge'
import type { CourseGrades } from '../data/courseGrades'
import { ConfettiBurst } from './Celebrations'

// The points star: the same mark the Osaaminen page's Välietapit row uses.
export function PointsStar({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2.8l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 16.8l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
    </svg>
  )
}

// Counts the shown number up to `value` when it grows.
function useCountUp(value: number): number {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = from.current
    if (value <= start || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      from.current = value
      setShown(value)
      return
    }
    const began = performance.now() + 200
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - began) / 700))
      const v = start + (value - start) * (1 - (1 - t) ** 3)
      setShown(Math.round(v))
      from.current = v
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return shown
}

const BUBBLE_MS = 2600
// A checkpoint: how long the inner ring stays full and lit before it
// starts over, and when the outer ring gets its push.
const CHECKPOINT_HOLD_MS = 1000

// Ring colours, on a dark disc as on a watch face.
const OUTER = { stroke: '#4f9dff', track: 'rgba(79, 157, 255, 0.22)', glow: 'rgba(79, 157, 255, 0.9)' }
const INNER = { stroke: '#3ddc84', track: 'rgba(61, 220, 132, 0.22)', glow: 'rgba(61, 220, 132, 0.9)' }

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
  colors: typeof OUTER
  // Jump without animating (the inner ring starting over).
  instant?: boolean
  delayMs?: number
  // Glows (a full inner ring, the outer ring being pushed).
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
            filter: lit ? `drop-shadow(0 0 3px ${colors.glow}) drop-shadow(0 0 6px ${colors.glow})` : 'none',
          }}
        />
      )}
    </>
  )
}

interface ProgressRingsProps {
  knowledge: KnowledgeState
  courseGrades: CourseGrades
  targetGrade: TargetGrade
  onOpen: () => void
  // Laptops: on the blue top bar, with the two rings' numbers beside them.
  laptop?: boolean
}

// Top bar's right corner, after a fitness watch's activity rings. The
// outer ring is the way to the target grade: full when kokonaisosaaminen
// reaches the target's points. The inner ring is the way to the next
// välietappi. Points move the inner ring; when it closes it lights up,
// bursts, starts over, and the outer ring gets its push. Opens Osaaminen.
export default function PointsMeter({ knowledge, courseGrades, targetGrade, onOpen, laptop = false }: ProgressRingsProps) {
  const overall = useMemo(() => computeKnowledge(knowledge, courseGrades).overall, [knowledge, courseGrades])
  const targetPct = pointsToPct(getTargetPoints(targetGrade).avg)
  const outer = targetPct > 0 ? overall.pct / targetPct : 0
  const total = usePointsTotal()
  const shown = useCountUp(total)
  const checkpoint = getCheckpointProgress(total)

  // The inner ring's shown value: normally the checkpoint progress, but
  // held full for a moment when a checkpoint closes.
  const [inner, setInner] = useState(checkpoint.progress)
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

  const size = laptop ? 44 : 38
  const stroke = laptop ? 6 : 5
  const gap = 1.5
  const outerR = (size - stroke) / 2
  const innerR = outerR - stroke - gap
  const reached = bubble?.reached ?? null
  const outerPct = Math.round(Math.min(1, outer) * 100)
  const label = `Matka tavoitearvosanaan ${outerPct} %. ${
    checkpoint.next ? `${checkpoint.toNext} p seuraavaan välietappiin.` : 'Kaikki välietapit saavutettu.'
  } Avaa Osaaminen.`

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onOpen}
        aria-label={label}
        title="Tavoite ja välietapit"
        className={`relative flex items-center rounded-full ${
          laptop ? 'gap-3 py-1 pl-1 pr-4 text-white transition-colors hover:bg-white/15' : ''
        }`}
      >
        <motion.span
          key={burst}
          initial={false}
          animate={burst > 0 ? { scale: [1, 1.14, 0.97, 1] } : undefined}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative flex items-center justify-center rounded-full bg-[#141c22] shadow-md ring-1 ring-black/10"
          style={{ width: size + 6, height: size + 6 }}
        >
          <svg width={size} height={size} className="-rotate-90 overflow-visible">
            <Ring
              radius={outerR}
              stroke={stroke}
              size={size}
              value={outer}
              colors={OUTER}
              delayMs={reached ? CHECKPOINT_HOLD_MS + 400 : 450}
              lit={outerLit}
            />
            <Ring radius={innerR} stroke={stroke} size={size} value={inner} colors={INNER} instant={instant} lit={innerLit} />
          </svg>
          {/* A closed checkpoint: a green ring swells out. */}
          {bigBurst > 0 && (
            <motion.span
              key={bigBurst}
              aria-hidden
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 0 3px ${INNER.stroke}, 0 0 16px ${INNER.glow}` }}
            />
          )}
          <ConfettiBurst trigger={bigBurst} origin="center" delay={0} count={30} spread={1.6} className="overflow-visible" />
        </motion.span>
        {laptop && (
          <span className="flex flex-col items-start gap-0.5 text-[11px] font-semibold leading-tight">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: OUTER.stroke }} />
              Tavoite {targetGrade}: {outerPct} %
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: INNER.stroke }} />
              {checkpoint.next ? `${shown} p · ${checkpoint.toNext} p etappiin ${checkpoint.next.number}` : `${shown} p`}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {bubble && (
          <motion.div
            key={burst}
            role="status"
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute right-0 top-full z-40 mt-2 whitespace-nowrap rounded-2xl bg-surface px-3 py-2 text-left shadow-lg ring-1 ring-ink/10"
          >
            <span className="block text-sm font-bold text-good">+{bubble.delta} p</span>
            {reached && (
              <span className="block text-xs font-semibold text-ink">Välietappi {reached.number} saavutettu!</span>
            )}
            {(() => {
              const cp = getCheckpointProgress(bubble.total)
              return (
                <span className="block text-xs text-ink-dim">
                  {cp.next
                    ? `${cp.toNext} p seuraavaan välietappiin (${cp.next.points} p)`
                    : 'Kaikki välietapit saavutettu'}
                </span>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
