import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 5

function buildPath() {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.15) {
    const y = Math.pow(2, x)
    if (y > WINDOW + 3) continue
    points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function ExpEquationGraph({ value, onChange }: VisualProps = {}) {
  const [internalB, setInternalB] = useState(4)
  const b = value ?? internalB
  const setB = onChange ?? setInternalB
  const path = useMemo(buildPath, [])
  const x = Math.log2(b)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.05} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <line x1={-WINDOW} y1={-b} x2={WINDOW} y2={-b} className="stroke-good" strokeWidth={0.08} />
        <line x1={x} y1={0} x2={x} y2={-b} strokeDasharray="0.15 0.1" className="stroke-bad/60" strokeWidth={0.07} />
        <circle cx={x} cy={-b} r={0.16} className="fill-bad" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">b</span>
        <input
          type="range"
          min={0.5}
          max={16}
          step={0.5}
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{b}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          2ˣ = {b} ⇒ x = log₂({b}) = {x.toFixed(2)}
        </span>
      </p>
    </div>
  )
}
