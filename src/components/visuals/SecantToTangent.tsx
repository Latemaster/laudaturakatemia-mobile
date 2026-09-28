import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 6
const X0 = -1

function f(x: number) {
  return 0.4 * x * x - 1.5
}

function buildCurvePath() {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.25) {
    points.push(`${x.toFixed(2)},${(-f(x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function SecantToTangent({ value, onChange }: VisualProps = {}) {
  const [internalH, setInternalH] = useState(1.5)
  const h = value ?? internalH
  const setH = onChange ?? setInternalH
  const curvePath = useMemo(buildCurvePath, [])

  const x1 = X0 + h
  const y0 = f(X0)
  const y1 = f(x1)
  const slope = (y1 - y0) / h

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.08} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.08} />
        <path d={curvePath} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <line x1={-WINDOW} y1={-(y0 + slope * (-WINDOW - X0))} x2={WINDOW} y2={-(y0 + slope * (WINDOW - X0))} className="stroke-bad" strokeWidth={0.1} />
        <circle cx={X0} cy={-y0} r={0.18} className="fill-good" />
        <circle cx={x1} cy={-y1} r={0.18} className="fill-good" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">h</span>
        <input
          type="range"
          min={0.1}
          max={3}
          step={0.1}
          value={h}
          onChange={(e) => setH(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{h.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          Δy/Δx = ({y1.toFixed(2)}-{y0.toFixed(2)})/{h.toFixed(1)} = {slope.toFixed(2)}
        </span>
        {h <= 0.2 && ' ≈ tangentin kulmakerroin'}
      </p>
    </div>
  )
}
