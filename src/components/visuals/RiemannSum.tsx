import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const A = 0
const B = 4

function f(x: number) {
  return 0.3 * x * x + 1
}

// Exact value of ∫ f(x) dx from A to B, for comparison as n grows.
const EXACT = (0.1 * B ** 3 + B) - (0.1 * A ** 3 + A)

function buildCurvePath() {
  const points: string[] = []
  for (let x = A; x <= B; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-f(x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function RiemannSum({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalN, setInternalN] = useState(4)
  const n = value ?? internalN
  const setN = onChange ?? setInternalN
  const curvePath = useMemo(buildCurvePath, [])

  const { rects, sum } = useMemo(() => {
    const width = (B - A) / n
    let total = 0
    const boxes: Array<{ x: number; h: number }> = []
    for (let i = 0; i < n; i++) {
      const x = A + i * width
      const h = f(x)
      boxes.push({ x, h })
      total += h * width
    }
    return { rects: boxes, sum: total }
  }, [n])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -5.5 5 6" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-0.5} y1={0} x2={4.5} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        {rects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={-r.h}
            width={(B - A) / n}
            height={r.h}
            className="fill-good/30 stroke-good"
            strokeWidth={0.02}
          />
        ))}
        <path d={curvePath} fill="none" className="stroke-accent" strokeWidth={0.08} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">n</span>
        <input
          type="range"
          min={2}
          max={24}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{n}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">
            Summa ≈ {sum.toFixed(2)} (tarkka arvo {EXACT.toFixed(2)})
          </span>
        </p>
      )}
    </div>
  )
}
