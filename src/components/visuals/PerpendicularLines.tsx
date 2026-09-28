import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 5
const K1 = 1

export default function PerpendicularLines({ value, onChange }: VisualProps = {}) {
  const [internalK2, setInternalK2] = useState(-1)
  const k2 = value ?? internalK2
  const setK2 = onChange ?? setInternalK2

  const product = useMemo(() => K1 * k2, [k2])
  const isPerpendicular = Math.abs(product + 1) < 0.05

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={-WINDOW} y1={K1 * WINDOW} x2={WINDOW} y2={-K1 * WINDOW} className="stroke-accent" strokeWidth={0.1} />
        <line x1={-WINDOW} y1={k2 * WINDOW} x2={WINDOW} y2={-k2 * WINDOW} className="stroke-good" strokeWidth={0.1} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">k₂</span>
        <input
          type="range"
          min={-3}
          max={3}
          step={0.1}
          value={k2}
          onChange={(e) => setK2(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{k2.toFixed(1)}</span>
      </label>

      <p className={`mt-3 text-sm font-mono ${isPerpendicular ? 'text-good font-semibold' : 'text-ink-dim'}`}>
        k₁·k₂ = {K1} · {k2.toFixed(1)} = {product.toFixed(2)}
        {isPerpendicular && ' — kohtisuorassa!'}
      </p>
    </div>
  )
}
