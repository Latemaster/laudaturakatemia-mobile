import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const N = 6
const A1 = 2

export default function SequenceBars({ value, onChange }: VisualProps = {}) {
  const [internalD, setInternalD] = useState(3)
  const d = value ?? internalD
  const setD = onChange ?? setInternalD
  const [r, setR] = useState(1.5)

  const { arith, geo, maxVal } = useMemo(() => {
    const a = Array.from({ length: N }, (_, i) => A1 + i * d)
    const g = Array.from({ length: N }, (_, i) => A1 * Math.pow(r, i))
    return { arith: a, geo: g, maxVal: Math.max(...a, ...g, 1) }
  }, [d, r])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="0 -6.5 12 7" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={0} y1={0} x2={12} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        {arith.map((v, i) => (
          <rect key={`a${i}`} x={i * 2 + 0.15} y={-(v / maxVal) * 6} width={0.7} height={(v / maxVal) * 6} className="fill-accent" />
        ))}
        {geo.map((v, i) => (
          <rect key={`g${i}`} x={i * 2 + 0.95} y={-(v / maxVal) * 6} width={0.7} height={(v / maxVal) * 6} className="fill-good" />
        ))}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-16 font-mono font-semibold text-accent">d (arit.)</span>
        <input type="range" min={0.5} max={5} step={0.5} value={d} onChange={(e) => setD(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{d}</span>
      </label>
      <label className="mt-2 flex items-center gap-3 text-sm">
        <span className="w-16 font-mono font-semibold text-good">r (geom.)</span>
        <input type="range" min={1.1} max={2} step={0.1} value={r} onChange={(e) => setR(Number(e.target.value))} className="h-2 flex-1 accent-good" />
        <span className="w-10 text-right font-mono text-ink-dim">{r.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono text-accent">aₙ = {A1}+(n-1)·{d}</span>
        {'  '}
        <span className="font-mono text-good">
          aₙ = {A1}·{r.toFixed(1)}ⁿ⁻¹
        </span>
      </p>
    </div>
  )
}
