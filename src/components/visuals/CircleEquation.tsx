import { useState } from 'react'

const WINDOW = 5

export default function CircleEquation() {
  const [r, setR] = useState(3)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/15" strokeWidth={0.05} />
        <circle cx={0} cy={0} r={r} fill="none" className="stroke-accent" strokeWidth={0.1} />
        <line x1={0} y1={0} x2={r} y2={0} className="stroke-good" strokeWidth={0.07} />
        <circle cx={0} cy={0} r={0.1} className="fill-ink" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">r</span>
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={r}
          onChange={(e) => setR(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{r}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">x² + y² = {r}² = {r * r}</span>
      </p>
    </div>
  )
}
