import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

function buildPath() {
  const points: string[] = []
  for (let x = 0.2; x <= 16; x += 0.2) {
    points.push(`${x.toFixed(2)},${(-Math.log2(x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function LogPointGraph({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalX, setInternalX] = useState(8)
  const x = value ?? internalX
  const setX = onChange ?? setInternalX
  const path = useMemo(buildPath, [])
  const y = Math.log2(x)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-1 -4.5 17 8.5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-1} y1={0} x2={16} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-4} x2={0} y2={4} className="stroke-ink/20" strokeWidth={0.06} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.14} />
        <line x1={x} y1={0} x2={x} y2={-y} strokeDasharray="0.2 0.15" className="stroke-good/60" strokeWidth={0.08} />
        <circle cx={x} cy={-y} r={0.2} className="fill-good" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={0.5}
          max={16}
          step={0.5}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{x}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">log₂({x}) = {y.toFixed(2)}</span>
        </p>
      )}
    </div>
  )
}
