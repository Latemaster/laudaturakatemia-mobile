import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const A0 = 1000
const MAX_T = 20

export default function CompoundInterest({ value, onChange }: VisualProps = {}) {
  const [internalRatePct, setInternalRatePct] = useState(5)
  const ratePct = value ?? internalRatePct
  const setRatePct = onChange ?? setInternalRatePct

  const r = ratePct / 100
  const path = useMemo(() => {
    const points: string[] = []
    for (let t = 0; t <= MAX_T; t += 0.5) {
      const value = A0 * Math.pow(1 + r, t)
      points.push(`${t.toFixed(1)},${(-(value / 400)).toFixed(2)}`)
    }
    return `M ${points.join(' L ')}`
  }, [r])

  const finalValue = A0 * Math.pow(1 + r, MAX_T)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-1 -12 22 13" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-1} y1={0} x2={21} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={-1} y1={-2.5} x2={21} y2={-2.5} strokeDasharray="0.15 0.1" className="stroke-ink/20" strokeWidth={0.04} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.14} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">r %</span>
        <input
          type="range"
          min={1}
          max={12}
          step={0.5}
          value={ratePct}
          onChange={(e) => setRatePct(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{ratePct}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          A = 1000·(1+{(r).toFixed(2)})ᵗ → {finalValue.toFixed(0)} € 20v kuluttua
        </span>
      </p>
    </div>
  )
}
