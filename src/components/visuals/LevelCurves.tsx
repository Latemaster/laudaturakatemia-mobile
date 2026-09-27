import { useState } from 'react'

const WINDOW = 5
const REFERENCE_LEVELS = [4, 9, 16, 25]

export default function LevelCurves() {
  const [c, setC] = useState(12)
  const r = Math.sqrt(c)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.04} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/15" strokeWidth={0.04} />
        {REFERENCE_LEVELS.map((lvl) => (
          <circle key={lvl} cx={0} cy={0} r={Math.sqrt(lvl)} fill="none" className="stroke-ink/15" strokeWidth={0.03} />
        ))}
        <circle cx={0} cy={0} r={r} fill="none" className="stroke-accent" strokeWidth={0.1} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">c</span>
        <input
          type="range"
          min={1}
          max={24}
          step={1}
          value={c}
          onChange={(e) => setC(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{c}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          f(x,y) = x²+y² = {c} → ympyrä, säde {r.toFixed(2)}
        </span>
      </p>
    </div>
  )
}
