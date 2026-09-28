import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 6

function f(x: number) {
  return Math.sqrt(x)
}

function buildCurvePath() {
  const points: string[] = []
  for (let x = 0; x <= WINDOW; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-f(x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

function buildAreaPath(b: number) {
  const points: string[] = [`0,0`]
  for (let x = 0; x <= b; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-f(x)).toFixed(2)}`)
  }
  points.push(`${b.toFixed(2)},0`)
  return `M ${points.join(' L ')} Z`
}

export default function AreaUnderCurve({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalB, setInternalB] = useState(4)
  const b = value ?? internalB
  const setB = onChange ?? setInternalB
  const curvePath = useMemo(buildCurvePath, [])
  const areaPath = useMemo(() => buildAreaPath(b), [b])
  const area = (2 / 3) * Math.pow(b, 1.5)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -3.5 6.5 4" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-0.5} y1={0} x2={6} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        <path d={areaPath} className="fill-good/30" />
        <path d={curvePath} fill="none" className="stroke-accent" strokeWidth={0.08} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">b</span>
        <input
          type="range"
          min={1}
          max={6}
          step={0.5}
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{b}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">
            A = ∫₀^{b} √x dx = {area.toFixed(2)}
          </span>
        </p>
      )}
    </div>
  )
}
