import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getCheckpointProgress, onPointsAwarded, usePointsTotal, type PointsEvent } from '../data/points'
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

interface PointsMeterProps {
  onOpen: () => void
  // Laptops: on the blue top bar, with the way to the next checkpoint
  // written out.
  laptop?: boolean
}

// Top bar's right corner: the points earned from exercises and the way to
// the next välietappi (a bar along its bottom). Earning points makes it
// pop, light up green and throw a little confetti, with a bubble saying how
// far the next checkpoint is. Opens Osaaminen, where the checkpoints are.
export default function PointsMeter({ onOpen, laptop = false }: PointsMeterProps) {
  const total = usePointsTotal()
  const shown = useCountUp(total)
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

  const label = checkpoint.next
    ? `Pisteet ${total}. ${checkpoint.toNext} p seuraavaan välietappiin. Avaa Osaaminen.`
    : `Pisteet ${total}. Avaa Osaaminen.`
  const bar = (
    <span className={`block h-1 overflow-hidden rounded-full ${laptop ? 'w-24 bg-white/25' : 'w-full bg-ink/10'}`}>
      <span
        className={`block h-full rounded-full transition-[width] duration-700 ${laptop ? 'bg-white' : 'bg-good'}`}
        style={{ width: `${Math.round(checkpoint.progress * 100)}%` }}
      />
    </span>
  )

  return (
    <div className="relative shrink-0">
      <motion.button
        key={burst}
        type="button"
        onClick={onOpen}
        aria-label={label}
        title="Pisteet ja välietapit"
        initial={false}
        animate={burst > 0 ? { scale: [1, 1.18, 0.96, 1.03, 1] } : undefined}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className={`relative flex items-center rounded-full ${
          laptop
            ? 'gap-2.5 bg-white/15 py-1.5 pl-1.5 pr-4 text-white transition-colors hover:bg-white/25'
            : 'h-10 min-w-[3.5rem] gap-1.5 bg-surface/90 px-2.5 pb-1 text-ink shadow-md ring-1 ring-ink/5 backdrop-blur'
        }`}
      >
        {/* Lights up green as points come in. */}
        {burst > 0 && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 1, 0], scale: [1, 1.08, 1.25] }}
            transition={{ duration: reached ? 1.2 : 0.9, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 0 3px rgba(47, 158, 110, 0.9), 0 0 18px rgba(47, 158, 110, 0.6)' }}
          />
        )}
        <span
          className={`flex shrink-0 items-center justify-center rounded-full bg-good text-white ${
            laptop ? 'h-8 w-8' : 'h-6 w-6'
          }`}
        >
          <PointsStar className={laptop ? 'h-5 w-5' : 'h-4 w-4'} />
        </span>
        {laptop ? (
          <span className="flex flex-col items-start gap-1 leading-none">
            <span className="text-sm font-bold tabular-nums">{shown} p</span>
            <span className="flex items-center gap-2 text-[11px] text-white/85">
              {bar}
              {checkpoint.next ? `${checkpoint.toNext} p etappiin ${checkpoint.next.number}` : 'Kaikki etapit!'}
            </span>
          </span>
        ) : (
          <>
            <span className="text-sm font-bold tabular-nums">{shown}</span>
            {/* The way to the next välietappi. */}
            <span className="absolute inset-x-3 bottom-1.5">{bar}</span>
          </>
        )}
        <ConfettiBurst
          trigger={burst}
          origin="center"
          delay={0}
          count={reached ? 34 : 18}
          spread={reached ? 1.8 : 1.1}
          className="overflow-visible"
        />
      </motion.button>

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
