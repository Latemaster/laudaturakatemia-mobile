import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCheckpointProgress, usePointsTotal } from '../data/points'
import { pointsToPct, predictGrade } from '../data/grade'
import ActivityRings, { RING_COLORS, useRingsState } from './ActivityRings'
import { getTargetPoints, type TargetGrade } from '../data/studyPlans'
import { computeKnowledge, type KnowledgeState } from '../data/knowledge'
import type { CourseGrades } from '../data/courseGrades'

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

interface ProgressRingsProps {
  knowledge: KnowledgeState
  courseGrades: CourseGrades
  targetGrade: TargetGrade
  onOpen: () => void
  // Laptops: on the blue top bar, with the two rings' numbers beside them.
  laptop?: boolean
}

// Top bar's right corner: the activity rings (ActivityRings) with the
// predicted grade in the middle, and a bubble when points come in. Opens
// Osaaminen.
export default function PointsMeter({ knowledge, courseGrades, targetGrade, onOpen, laptop = false }: ProgressRingsProps) {
  const overall = useMemo(() => computeKnowledge(knowledge, courseGrades).overall, [knowledge, courseGrades])
  const grade = predictGrade(overall.pct)
  const targetPct = pointsToPct(getTargetPoints(targetGrade).avg)
  const outer = targetPct > 0 ? overall.pct / targetPct : 0
  const total = usePointsTotal()
  const shown = useCountUp(total)
  const checkpoint = getCheckpointProgress(total)
  const state = useRingsState()
  const { bubble, burst } = state

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
        <ActivityRings
          size={laptop ? 44 : 40}
          stroke={laptop ? 6 : 5.5}
          outer={outer}
          state={state}
          center={<span className="text-[11px] font-bold leading-none text-ink">{grade.letter}</span>}
        />
        {laptop && (
          <span className="flex flex-col items-start gap-0.5 text-[11px] font-semibold leading-tight">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 4px ${RING_COLORS.outer.stroke}` }} />
              Tavoite {targetGrade}: {outerPct} %
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RING_COLORS.inner.stroke }} />
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
