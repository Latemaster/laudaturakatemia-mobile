import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const X_MAX = 8
const Y_SCALE = 3

function f(x: number) {
  return 1 / (x * x)
}

function buildCurvePath() {
  const points: string[] = []
  for (let x = 1; x <= X_MAX; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-f(x) * Y_SCALE).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

function buildAreaPath(n: number) {
  const points: string[] = [`1,0`]
  for (let x = 1; x <= n; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-f(x) * Y_SCALE).toFixed(2)}`)
  }
  points.push(`${n.toFixed(2)},0`)
  return `M ${points.join(' L ')} Z`
}

export default function ImproperIntegralConvergence({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalN, setInternalN] = useState(4)
  const n = value ?? internalN
  const setN = onChange ?? setInternalN
  const curvePath = useMemo(buildCurvePath, [])
  const areaPath = useMemo(() => buildAreaPath(n), [n])
  const area = 1 - 1 / n

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -3.5 8.5 4" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-0.5} y1={0} x2={8} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        <path d={areaPath} className="fill-good/30" />
        <path d={curvePath} fill="none" className="stroke-accent" strokeWidth={0.08} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">N</span>
        <input
          type="range"
          min={2}
          max={50}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{n}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-center text-sm text-ink-dim">
          <span className="font-mono">
            ∫₁^{n} 1/x² dx = 1 − 1/{n} = {area.toFixed(3)} → 1
          </span>
        </p>
      )}
    </div>
  )
}
