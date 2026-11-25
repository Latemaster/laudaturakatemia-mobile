import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { pointsToPct, predictGrade } from '../data/grade'
import { getTargetPoints, type TargetGrade } from '../data/studyPlans'
import { computeKnowledge, type KnowledgeState } from '../data/knowledge'
import type { CourseGrades } from '../data/courseGrades'
import { getCheckpointProgress, onPointsAwarded, usePointsTotal, type PointsEvent } from '../data/points'
import { GradeDonut } from './Osaaminen'
import { ConfettiBurst } from './Celebrations'

interface MiniOsaaminenProps {
  knowledge: KnowledgeState
  courseGrades: CourseGrades
  targetGrade: TargetGrade
  onOpen: () => void
  // Laptops: on the blue top bar, with the checkpoint beside the donut.
  laptop?: boolean
}

// How long the "+N p" bubble stays up.
const BUBBLE_MS = 2600

// The Osaaminen page's grade donut in miniature, in the top bar's right
// corner. Earning points makes it pop with a small confetti burst and a
// bubble telling how far the next välietappi is; clicking it opens
// Osaaminen.
export default function MiniOsaaminen({ knowledge, courseGrades, targetGrade, onOpen, laptop = false }: MiniOsaaminenProps) {
  const overall = useMemo(() => computeKnowledge(knowledge, courseGrades).overall, [knowledge, courseGrades])
  const grade = predictGrade(overall.pct)
  const targetPct = pointsToPct(getTargetPoints(targetGrade).avg)
  const total = usePointsTotal()
  const checkpoint = getCheckpointProgress(total)

  const [burst, setBurst] = useState(0)
  const [bubble, setBubble] = useState<PointsEvent | null>(null)
  const timer = useRef<number>()
  useEffect(() => {
    const off = onPointsAwarded((event) => {
      setBurst((b) => b + 1)
      setBubble(event)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setBubble(null), event.reached ? BUBBLE_MS + 1200 : BUBBLE_MS)
    })
    return () => {
      off()
      window.clearTimeout(timer.current)
    }
  }, [])

  const reached = bubble?.reached ?? null
  const size = laptop ? 40 : 34
  const label = checkpoint.next
    ? `Osaaminen: arvosana ${grade.letter}, ${overall.pct} %. ${checkpoint.toNext} p seuraavaan välietappiin.`
    : `Osaaminen: arvosana ${grade.letter}, ${overall.pct} %.`

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onOpen}
        aria-label={label}
        title="Avaa Osaaminen"
        className={`group relative flex items-center gap-3 rounded-full ${
          laptop ? 'py-1 pl-1 pr-4 text-white transition-colors hover:bg-white/15' : ''
        }`}
      >
        <motion.span
          key={burst}
          initial={false}
          animate={burst > 0 ? { scale: [1, 1.28, 0.94, 1.04, 1] } : undefined}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex items-center justify-center rounded-full bg-surface/95 shadow-md ring-1 ring-ink/5 backdrop-blur"
          style={{ width: size + 6, height: size + 6 }}
        >
          {/* A ring that swells out and fades as points come in. */}
          {burst > 0 && (
            <motion.span
              aria-hidden
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: reached ? 2.4 : 1.8, opacity: 0 }}
              transition={{ duration: reached ? 1.1 : 0.8, ease: 'easeOut' }}
              className={`pointer-events-none absolute inset-0 rounded-full ring-[3px] ${reached ? 'ring-[#e8b83a]' : 'ring-good'}`}
            />
          )}
          <GradeDonut pct={overall.pct} grade={grade} targetPct={targetPct} size={size} gap={2.5} />
          <ConfettiBurst trigger={burst} delay={0} count={reached ? 30 : 16} spread={reached ? 0.9 : 0.5} />
        </motion.span>
        {laptop && (
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="text-sm font-semibold">{overall.pct} % · {grade.letter}</span>
            <span className="flex items-center gap-2 text-[11px] text-white/80">
              <span className="h-1.5 w-14 overflow-hidden rounded-full bg-white/25">
                <span
                  className="block h-full rounded-full bg-white transition-[width] duration-700"
                  style={{ width: `${Math.round(checkpoint.progress * 100)}%` }}
                />
              </span>
              {checkpoint.next ? `${checkpoint.toNext} p etappiin` : 'Kaikki etapit!'}
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
            className={`pointer-events-none absolute top-full z-40 mt-2 whitespace-nowrap rounded-2xl bg-surface px-3 py-2 text-left shadow-lg ring-1 ring-ink/10 ${
              laptop ? 'left-0' : 'right-0'
            }`}
          >
            <span className="block text-sm font-bold text-good">+{bubble.delta} p</span>
            {reached ? (
              <span className="block text-xs font-semibold text-ink">Välietappi {reached.number} saavutettu!</span>
            ) : null}
            {(() => {
              const cp = getCheckpointProgress(bubble.total)
              return cp.next ? (
                <span className="block text-xs text-ink-dim">
                  {cp.toNext} p seuraavaan välietappiin ({cp.next.points} p)
                </span>
              ) : (
                <span className="block text-xs text-ink-dim">Kaikki välietapit saavutettu</span>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
