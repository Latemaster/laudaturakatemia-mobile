import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 6

function f(x: number) {
  return 0.4 * x * x - 1.5
}

function fPrime(x: number) {
  return 0.8 * x
}

function buildCurvePath() {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.25) {
    points.push(`${x.toFixed(2)},${(-f(x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function TangentLine({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalX0, setInternalX0] = useState(2)
  const x0 = value ?? internalX0
  const setX0 = onChange ?? setInternalX0

  const curvePath = useMemo(buildCurvePath, [])
  const y0 = f(x0)
  const slope = fPrime(x0)

  // Tangent line y = y0 + slope * (x - x0), sampled across the window.
  const tangentY1 = y0 + slope * (-WINDOW - x0)
  const tangentY2 = y0 + slope * (WINDOW - x0)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.08} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.08} />
        <path d={curvePath} fill="none" className="stroke-accent" strokeWidth={0.15} />
        <line x1={-WINDOW} y1={-tangentY1} x2={WINDOW} y2={-tangentY2} className="stroke-bad" strokeWidth={0.12} />
        <circle cx={x0} cy={-y0} r={0.25} className="fill-good" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={-5}
          max={5}
          step={0.25}
          value={x0}
          onChange={(e) => setX0(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{x0}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">
            f({x0}) = {y0.toFixed(2)}, f&apos;({x0}) = {slope.toFixed(2)}
          </span>
        </p>
      )}
    </div>
  )
}
