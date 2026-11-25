import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

// Feedback when an answer is checked: a confetti burst for points, a red
// shake for a wrong answer. Both play once per change of `trigger`; 0 shows
// nothing.

// Greens only: the confetti always means "right".
const CONFETTI_COLORS = ['#2f9e6e', '#3f9142', '#1f7a52', '#5cc28f', '#8fd9a8', '#b6e8c6']

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

interface Particle {
  // Where it starts, in px from the item's top-left corner.
  x: number
  y: number
  dx: number
  dy: number
  fall: number
  rotate: number
  size: number
  round: boolean
  color: string
  delay: number
  duration: number
}

// Pieces spread evenly around the item's edge, each flying across it (all
// inward with `inward`), then drifting down as it fades.
function makeParticles(width: number, height: number, count: number, spread: number, inward: boolean): Particle[] {
  const perimeter = 2 * (width + height)
  const r = Math.random
  return Array.from({ length: count }, (_, i) => {
    // Position along the perimeter, clockwise from the top-left corner.
    const d = ((i + r() * 0.8) / count) * perimeter
    let x: number, y: number, nx: number, ny: number
    if (d < width) [x, y, nx, ny] = [d, 0, 0, -1]
    else if (d < width + height) [x, y, nx, ny] = [width, d - width, 1, 0]
    else if (d < 2 * width + height) [x, y, nx, ny] = [width - (d - width - height), height, 0, 1]
    else [x, y, nx, ny] = [0, height - (d - 2 * width - height), -1, 0]
    // Most fly out; some fly in, so the burst still rings the item when
    // it fills the screen and there's no room outside it.
    const sign = inward || r() < 0.4 ? -1 : 1
    const out = (18 + r() * 46) * spread
    const side = (r() - 0.5) * 40 * spread
    const size = 5 + r() * 4
    return {
      x,
      y,
      dx: sign * nx * out + ny * side,
      dy: sign * ny * out + nx * side,
      fall: (20 + r() * 40) * spread,
      rotate: (r() - 0.5) * 720,
      size,
      round: r() < 0.35,
      color: CONFETTI_COLORS[Math.floor(r() * CONFETTI_COLORS.length)],
      delay: r() * 0.12,
      duration: 1 + r() * 0.5,
    }
  })
}

// Green confetti bursting out all around the element it sits in. Drawn on
// a layer over the page at the element's place, so a card's clipping
// doesn't cut it off. With `fullScreen` it bursts in from the screen's
// edges instead.
export function ConfettiBurst({
  trigger,
  count = 44,
  spread = 1,
  delay = 0.15,
  fullScreen = false,
}: {
  trigger: number
  count?: number
  // Scales how far the pieces fly.
  spread?: number
  delay?: number
  fullScreen?: boolean
}) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  useLayoutEffect(() => {
    if (trigger === 0) return
    if (fullScreen) {
      setRect({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight })
      return
    }
    const box = anchor.current?.parentElement?.getBoundingClientRect()
    if (box) setRect({ left: box.left, top: box.top, width: box.width, height: box.height })
  }, [trigger, fullScreen])
  const particles = useMemo(
    () => (rect ? makeParticles(rect.width, rect.height, count, spread, fullScreen) : []),
    // A new burst only when the item is measured for a new trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rect],
  )
  if (trigger === 0 || prefersReducedMotion()) return null
  return (
    <>
      <span ref={anchor} aria-hidden className="hidden" />
      {rect &&
        createPortal(
          <span
            key={trigger}
            aria-hidden
            className="pointer-events-none fixed z-[65]"
            style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
          >
            {particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute block"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.round ? p.size : p.size * 1.6,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  borderRadius: p.round ? '9999px' : '1px',
                  backgroundColor: p.color,
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.5 }}
                animate={{
                  x: [0, p.dx, p.dx * 1.15],
                  y: [0, p.dy, p.dy + p.fall],
                  rotate: [0, p.rotate * 0.6, p.rotate],
                  opacity: [1, 1, 0],
                  scale: [0.5, 1, 0.85],
                }}
                transition={{
                  delay: delay + p.delay,
                  duration: p.duration,
                  times: [0, 0.35, 1],
                  ease: ['easeOut', 'easeIn'],
                }}
              />
            ))}
          </span>,
          document.body,
        )}
    </>
  )
}

const SHAKE_KEYFRAMES: Keyframe[] = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-9px)' },
  { transform: 'translateX(8px)' },
  { transform: 'translateX(-6px)' },
  { transform: 'translateX(5px)' },
  { transform: 'translateX(-3px)' },
  { transform: 'translateX(2px)' },
  { transform: 'translateX(0)' },
]

const BAD = '217, 99, 111'

// A wrong answer: the element it sits in shakes side to side while a red
// edge flashes over it. With `fullScreen` the red edge covers the screen
// and shakes itself instead.
export function WrongShake({
  trigger,
  className = 'rounded-3xl',
  fullScreen = false,
}: {
  trigger: number
  className?: string
  fullScreen?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (trigger === 0 || prefersReducedMotion()) return
    const target = fullScreen ? ref.current : ref.current?.parentElement
    const animation = target?.animate?.(SHAKE_KEYFRAMES, { duration: 480, easing: 'ease-out' })
    return () => animation?.cancel()
  }, [trigger, fullScreen])
  if (trigger === 0) return null
  return (
    <motion.span
      ref={ref}
      key={trigger}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.9, times: [0, 0.1, 0.5, 1], ease: 'easeOut' }}
      className={`pointer-events-none inset-0 ${fullScreen ? 'fixed z-[60]' : 'absolute z-10'} ${className}`}
      style={{
        boxShadow: `inset 0 0 0 3px rgba(${BAD}, 1), inset 0 0 40px rgba(${BAD}, 0.35)`,
        background: `rgba(${BAD}, 0.06)`,
      }}
    />
  )
}
