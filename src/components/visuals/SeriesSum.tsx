import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const A1 = 1
const D = 1

export default function SeriesSum({ value, onChange }: VisualProps = {}) {
  const [internalN, setInternalN] = useState(5)
  const n = value ?? internalN
  const setN = onChange ?? setInternalN

  const { terms, sum } = useMemo(() => {
    const values = Array.from({ length: n }, (_, i) => A1 + i * D)
    return { terms: values, sum: values.reduce((a, b) => a + b, 0) }
  }, [n])

  const maxVal = Math.max(...terms, 1)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="0 -6.5 20.5 7" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={0} y1={0} x2={20.5} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        {terms.map((v, i) => (
          <rect key={i} x={i * 2 + 0.2} y={-(v / maxVal) * 6} width={1.4} height={(v / maxVal) * 6} className="fill-accent/70" />
        ))}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">n</span>
        <input type="range" min={1} max={10} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{n}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          Sₙ = n/2·(a₁+aₙ) = {sum}
        </span>
      </p>
    </div>
  )
}
