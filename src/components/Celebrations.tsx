import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'

// Feedback when an answer is checked: a confetti burst for points, a red
// shake for a wrong answer. Both play once per change of `trigger`; 0 shows
// nothing.

const CONFETTI_COLORS = ['#5681bd', '#2f9e6e', '#d98a3d', '#7c6fdc', '#c74f8f', '#2f9baa', '#e8b83a']

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

interface Particle {
  // Where it starts, as a share of the container (0..1).
  left: number
  top: number
  dx: number
  rise: number
  fall: number
  rotate: number
  size: number
  round: boolean
  color: string
  delay: number
  duration: number
}

function makeParticles(origin: 'sides' | 'center', count: number, spread: number, color?: string): Particle[] {
  const colors = color ? [color, color, ...CONFETTI_COLORS] : CONFETTI_COLORS
  return Array.from({ length: count }, (_, i) => {
    const r = Math.random
    const size = 5 + r() * 4
    if (origin === 'sides') {
      // Half shoot in from the left edge, half from the right, upward and
      // inward, then fall.
      const fromLeft = i % 2 === 0
      return {
        left: fromLeft ? 0 : 1,
        top: 0.45 + r() * 0.3,
        dx: (fromLeft ? 1 : -1) * (50 + r() * 170) * spread,
        rise: -(90 + r() * 200) * spread,
        fall: (140 + r() * 160) * spread,
        rotate: (r() - 0.5) * 720,
        size,
        round: r() < 0.3,
        color: colors[Math.floor(r() * colors.length)],
        delay: r() * 0.12,
        duration: 1.1 + r() * 0.5,
      }
    }
    // From the middle, in every direction.
    const angle = (i / count) * Math.PI * 2 + r() * 0.4
    const speed = (30 + r() * 40) * spread
    return {
      left: 0.5,
      top: 0.5,
      dx: Math.cos(angle) * speed,
      rise: Math.sin(angle) * speed - 12 * spread,
      fall: Math.sin(angle) * speed + 30 * spread,
      rotate: (r() - 0.5) * 540,
      size: size * 0.8,
      round: r() < 0.4,
      color: colors[Math.floor(r() * colors.length)],
      delay: r() * 0.05,
      duration: 0.9 + r() * 0.4,
    }
  })
}

// Confetti bursting from the container's sides (or, with origin "center",
// its middle). Sits inside a positioned element, under its pointer events.
export function ConfettiBurst({
  trigger,
  color,
  origin = 'sides',
  count = 36,
  spread = 1,
  delay = 0.15,
  fullScreen = false,
  className = '',
}: {
  trigger: number
  // Mixed in with the palette, e.g. the points' colour.
  color?: string
  origin?: 'sides' | 'center'
  count?: number
  // Scales how far the pieces fly.
  spread?: number
  delay?: number
  fullScreen?: boolean
  className?: string
}) {
  const particles = useMemo(
    () => (trigger > 0 ? makeParticles(origin, count, spread, color) : []),
    // A new burst only when the trigger changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger],
  )
  if (trigger === 0 || prefersReducedMotion()) return null
  return (
    <span
      key={trigger}
      aria-hidden
      className={`pointer-events-none inset-0 ${fullScreen ? 'fixed z-[60]' : 'absolute z-10'} ${className}`}
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            left: `${p.left * 100}%`,
            top: `${p.top * 100}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            borderRadius: p.round ? '9999px' : '1px',
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.6 }}
          animate={{
            x: [0, p.dx * 0.7, p.dx],
            y: [0, p.rise, p.fall],
            rotate: [0, p.rotate * 0.6, p.rotate],
            opacity: [1, 1, 0],
            scale: [0.6, 1, 0.9],
          }}
          transition={{
            delay: delay + p.delay,
            duration: p.duration,
            times: [0, 0.4, 1],
            ease: ['easeOut', 'easeIn'],
          }}
        />
      ))}
    </span>
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
