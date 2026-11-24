import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import type { TourStep } from '../data/onboarding'
import { useLayout } from '../layout/LayoutContext'

interface CoachMarkProps {
  step: TourStep
  index: number
  count: number
  onComplete: () => void
  onSkip: () => void
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

// Room left around the highlighted control.
const PAD = 6
const SAME = (a: Rect | null, b: Rect | null) =>
  a === b ||
  (!!a && !!b && a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height)

function targetSelector(target: string) {
  return `[data-onboarding="${target}"]`
}

// One step of a section's guided tour. Finds the control the step points at,
// dims everything else and waits for the student to use it: a tap/click on
// the control, or a swipe/scroll of the feed. Stays out of the way while
// another sheet or dialog is open (e.g. the one the previous step opened).
export default function CoachMark({ step, index, count, onComplete, onSkip }: CoachMarkProps) {
  const { isDesktop } = useLayout()
  const [rect, setRect] = useState<Rect | null>(null)
  const [nudge, setNudge] = useState(0)
  const scrolledIntoView = useRef(false)
  // A swipe fires many scroll events; the step completes once.
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const completeRef = useRef(() => {
    if (doneRef.current) return
    doneRef.current = true
    onCompleteRef.current()
  })

  // Follow the target every frame: layouts animate, sheets open and close.
  useEffect(() => {
    scrolledIntoView.current = false
    let frame = 0
    let last: Rect | null = null
    const tick = () => {
      const el = document.querySelector<HTMLElement>(targetSelector(step.target))
      const blocked = document.querySelector('[aria-modal="true"]:not([data-coachmark])')
      let next: Rect | null = null
      if (el && !blocked) {
        let r = el.getBoundingClientRect()
        if (step.action === 'click' && !scrolledIntoView.current && (r.top < 0 || r.bottom > window.innerHeight)) {
          scrolledIntoView.current = true
          el.scrollIntoView({ block: 'center', behavior: 'smooth' })
          r = el.getBoundingClientRect()
        }
        if (r.width > 0 && r.height > 0) next = { top: r.top, left: r.left, width: r.width, height: r.height }
      }
      if (!SAME(last, next)) {
        last = next
        setRect(next)
      }
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [step])

  // Done when the student uses the control.
  useEffect(() => {
    const selector = targetSelector(step.target)
    if (step.action === 'click') {
      const onClick = (event: MouseEvent) => {
        if ((event.target as Element | null)?.closest?.(selector)) completeRef.current()
      }
      document.addEventListener('click', onClick, true)
      return () => document.removeEventListener('click', onClick, true)
    }
    let start: number | null = null
    const onScroll = (event: Event) => {
      const el = event.target
      if (!(el instanceof HTMLElement) || !el.matches(selector)) return
      if (start === null) start = el.scrollTop
      if (Math.abs(el.scrollTop - start) > el.clientHeight * 0.5) completeRef.current()
    }
    // Where the feed is when the step starts.
    const el = document.querySelector<HTMLElement>(selector)
    if (el) start = el.scrollTop
    document.addEventListener('scroll', onScroll, true)
    return () => document.removeEventListener('scroll', onScroll, true)
  }, [step])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSkip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onSkip])

  if (!rect) return null

  const vw = window.innerWidth
  const vh = window.innerHeight
  const counter = count > 1 && (
    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
      Vaihe {index + 1}/{count}
    </span>
  )
  const skip = (
    <button
      type="button"
      onClick={onSkip}
      className="pointer-events-auto rounded-full px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/30 transition-colors hover:bg-white/10"
    >
      Ohita
    </button>
  )

  if (step.action === 'swipe') {
    // The feed itself is the target: leave it fully usable and show the
    // gesture over it.
    const cx = rect.left + rect.width / 2
    const travel = Math.min(140, rect.height / 4)
    // Phones: the gesture runs through the middle of the screen. Laptops:
    // under the card, in the panel's free bottom gutter, off the content.
    const cy = isDesktop ? rect.top + rect.height - 190 : rect.top + rect.height / 2
    return createPortal(
      <div data-coachmark className="pointer-events-none fixed inset-0 z-[75]">
        <motion.div
          aria-hidden
          className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-accent/25 ring-4 ring-accent/50"
          style={{ left: cx - 28, top: cy - 28 }}
          initial={{ y: isDesktop ? -30 : travel / 2, opacity: 0 }}
          animate={{
            y: isDesktop ? [-30, 30] : [travel / 2, -travel / 2],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-2xl text-accent">{isDesktop ? '↓' : '↑'}</span>
        </motion.div>
        <div
          role="status"
          className="absolute flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2 rounded-2xl bg-ink px-4 py-3 text-white shadow-xl"
          style={{
            left: Math.min(Math.max(16, cx - 160), vw - 16 - Math.min(320, vw - 32)),
            top: Math.min(cy + (isDesktop ? 30 : travel / 2) + 56, vh - 120),
          }}
        >
          <div className="flex items-center justify-between gap-2">
            {counter || <span />}
            {skip}
          </div>
          <p className="text-sm font-semibold leading-snug">{step.text}</p>
        </div>
      </div>,
      document.body,
    )
  }

  const hole = {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  }
  const below = hole.top + hole.height + 170 < vh || hole.top < vh / 2
  const tipWidth = Math.min(320, vw - 32)
  const tipLeft = Math.min(Math.max(16, hole.left + hole.width / 2 - tipWidth / 2), vw - 16 - tipWidth)
  const arrowLeft = Math.min(Math.max(16, hole.left + hole.width / 2 - tipLeft - 8), tipWidth - 32)
  const blocker = 'pointer-events-auto absolute'
  const block = () => setNudge((n) => n + 1)

  return createPortal(
    <div data-coachmark className="pointer-events-none fixed inset-0 z-[75]">
      {/* Clicks anywhere but the control are caught here. */}
      <div className={blocker} style={{ top: 0, left: 0, right: 0, height: Math.max(0, hole.top) }} onClick={block} />
      <div className={blocker} style={{ top: hole.top + hole.height, left: 0, right: 0, bottom: 0 }} onClick={block} />
      <div className={blocker} style={{ top: hole.top, left: 0, width: Math.max(0, hole.left), height: hole.height }} onClick={block} />
      <div
        className={blocker}
        style={{ top: hole.top, left: hole.left + hole.width, right: 0, height: hole.height }}
        onClick={block}
      />
      {/* The dimming, with a rounded hole over the control. */}
      <div
        className="absolute rounded-2xl"
        style={{ ...hole, boxShadow: '0 0 0 9999px rgba(52, 74, 87, 0.55)' }}
      />
      <motion.div
        key={nudge}
        aria-hidden
        className="absolute rounded-2xl ring-4 ring-accent"
        style={hole}
        initial={{ scale: nudge ? 1.08 : 1 }}
        animate={{ scale: [1, 1.04, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        key={`${step.target}-tip`}
        role="status"
        initial={{ opacity: 0, y: below ? -6 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto absolute flex flex-col gap-2 rounded-2xl bg-ink px-4 py-3 text-white shadow-xl"
        style={{
          width: tipWidth,
          left: tipLeft,
          ...(below ? { top: hole.top + hole.height + 14 } : { bottom: vh - hole.top + 14 }),
        }}
      >
        <span
          aria-hidden
          className="absolute h-4 w-4 rotate-45 bg-ink"
          style={{ left: arrowLeft, ...(below ? { top: -6 } : { bottom: -6 }) }}
        />
        <div className="relative flex items-center justify-between gap-2">
          {counter || <span />}
          {skip}
        </div>
        <p className="relative text-sm font-semibold leading-snug">{step.text}</p>
      </motion.div>
    </div>,
    document.body,
  )
}
