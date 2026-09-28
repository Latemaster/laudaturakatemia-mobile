import { useState } from 'react'
import type { VisualProps } from './index'

const BASE = 2

export default function ScaleFactor({ value, onChange }: VisualProps = {}) {
  const [internalK, setInternalK] = useState(1.5)
  const k = value ?? internalK
  const setK = onChange ?? setInternalK
  const scaledSide = BASE * k

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="0 0 10 6.5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <rect x={0.5} y={6.5 - BASE} width={BASE} height={BASE} className="fill-accent/20 stroke-accent" strokeWidth={0.05} />
        <text x={0.5 + BASE / 2} y={6.5 - BASE / 2} textAnchor="middle" dominantBaseline="middle" fontSize={0.35} className="fill-ink font-semibold">
          A₁ = {BASE * BASE}
        </text>

        <rect
          x={9.5 - scaledSide}
          y={6.5 - scaledSide}
          width={scaledSide}
          height={scaledSide}
          className="fill-good/20 stroke-good"
          strokeWidth={0.05}
        />
        <text
          x={9.5 - scaledSide / 2}
          y={6.5 - scaledSide / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={scaledSide > 1.4 ? 0.35 : 0}
          className="fill-ink font-semibold"
        >
          A₂ = {(BASE * BASE * k * k).toFixed(1)}
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-16 font-mono font-semibold text-ink">k</span>
        <input
          type="range"
          min={0.5}
          max={2.5}
          step={0.25}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{k}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">A₂ = A₁ · k² = {BASE * BASE} · {k}² = {(BASE * BASE * k * k).toFixed(1)}</span>
      </p>
    </div>
  )
}
