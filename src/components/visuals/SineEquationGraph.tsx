import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const MAX_X = 4 * Math.PI // two periods

function buildSinePath() {
  const points: string[] = []
  for (let x = 0; x <= MAX_X; x += 0.05) {
    points.push(`${x.toFixed(3)},${(-Math.sin(x)).toFixed(3)}`)
  }
  return `M ${points.join(' L ')}`
}

function solutionsInRange(c: number) {
  const base1 = Math.asin(c)
  const base2 = Math.PI - base1
  const candidates: number[] = []
  for (let k = 0; k <= 2; k++) {
    candidates.push(base1 + k * 2 * Math.PI, base2 + k * 2 * Math.PI)
  }
  return [...new Set(candidates.map((x) => Math.round(x * 100) / 100))].filter((x) => x >= 0 && x <= MAX_X + 0.05)
}

export default function SineEquationGraph({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalC, setInternalC] = useState(0.5)
  const c = value ?? internalC
  const setC = onChange ?? setInternalC
  const path = useMemo(buildSinePath, [])
  const solutions = useMemo(() => solutionsInRange(c), [c])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox={`-0.3 -1.4 ${MAX_X + 0.6} 2.8`} className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={0} y1={0} x2={MAX_X} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.1} />
        <line x1={0} y1={-c} x2={MAX_X} y2={-c} className="stroke-good" strokeWidth={0.07} />
        {solutions.map((x) => (
          <circle key={x} cx={x} cy={-c} r={0.14} className="fill-bad" />
        ))}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">c</span>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.1}
          value={c}
          onChange={(e) => setC(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{c.toFixed(1)}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">sin x = {c.toFixed(1)}</span> — {solutions.length} ratkaisua kahdella jaksolla
        </p>
      )}
    </div>
  )
}
