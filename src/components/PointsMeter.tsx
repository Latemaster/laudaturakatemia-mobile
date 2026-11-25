import { AnimatePresence, motion } from 'framer-motion'
import { getCoursePoints, getTargetProgress } from '../data/coursePoints'
import { getCheckpointProgress, usePointsEarned, usePointsTotal } from '../data/points'
import ActivityRings, { RING_COLORS, useRingsState } from './ActivityRings'
import type { TargetGrade } from '../data/studyPlans'

interface ProgressRingsProps {
  targetGrade: TargetGrade
  onOpen: () => void
  // Laptops: on the blue top bar, with the two rings' numbers beside them.
  laptop?: boolean
}

// Top bar's right corner: the activity rings (ActivityRings) with the
// target grade in the middle, and a bubble when points come in. Opens
// Osaaminen.
export default function PointsMeter({ targetGrade, onOpen, laptop = false }: ProgressRingsProps) {
  const outer = getTargetProgress(targetGrade, getCoursePoints(usePointsEarned())).progress
  const total = usePointsTotal()
  const checkpoint = getCheckpointProgress(total)
  const state = useRingsState()
  const { bubble, burst } = state

  const reached = bubble?.reached ?? null
  const outerPct = Math.floor(outer * 100)
  const label = `Matka tavoitearvosanaan ${outerPct} %. ${
    checkpoint.next ? `Taso ${checkpoint.level}, ${checkpoint.toNext} p seuraavaan.` : 'Ylin taso saavutettu.'
  } Avaa Osaaminen.`

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onOpen}
        aria-label={label}
        title="Tavoite ja taso"
        className={`relative flex items-center rounded-full ${
          laptop ? 'gap-3 py-1 pl-1 pr-4 text-white transition-colors hover:bg-white/15' : ''
        }`}
      >
        <ActivityRings
          size={laptop ? 44 : 40}
          stroke={laptop ? 6 : 5.5}
          outer={outer}
          state={state}
          center={<span className="text-[11px] font-bold leading-none text-ink">{targetGrade}</span>}
        />
        {laptop && (
          <span className="flex flex-col items-start gap-0.5 text-[11px] font-semibold leading-tight">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white" style={{ boxShadow: `inset 0 0 0 4px ${RING_COLORS.outer.stroke}` }} />
              Tavoite {targetGrade}: {outerPct} %
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: RING_COLORS.inner.stroke }} />
              {checkpoint.next ? `Taso ${checkpoint.level} · ${checkpoint.toNext} p seuraavaan` : `Taso ${checkpoint.level}`}
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
              <span className="block text-xs font-semibold text-ink">Taso {reached.number + 1} saavutettu!</span>
            )}
            {(() => {
              const cp = getCheckpointProgress(bubble.total)
              return (
                <span className="block text-xs text-ink-dim">
                  {cp.next
                    ? `${cp.toNext} p tasoon ${cp.level + 1}`
                    : 'Ylin taso saavutettu'}
                </span>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
