import { useState } from 'react'

const WINDOW = 6

export default function AbsoluteValueLine() {
  const [a, setA] = useState(3)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox={`-${WINDOW} -1.5 ${WINDOW * 2} 3`} className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/30" strokeWidth={0.05} />
        <line x1={-a} y1={0} x2={a} y2={0} className="stroke-good" strokeWidth={0.15} />
        {Array.from({ length: WINDOW * 2 + 1 }, (_, i) => i - WINDOW).map((tick) => (
          <line key={tick} x1={tick} y1={-0.15} x2={tick} y2={0.15} className="stroke-ink/30" strokeWidth={0.04} />
        ))}
        <circle cx={-a} cy={0} r={0.15} className="fill-accent" />
        <circle cx={a} cy={0} r={0.15} className="fill-accent" />
        <text x={-a} y={-0.4} textAnchor="middle" fontSize={0.4} className="fill-ink font-semibold">
          -a
        </text>
        <text x={a} y={-0.4} textAnchor="middle" fontSize={0.4} className="fill-ink font-semibold">
          a
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">a</span>
        <input
          type="range"
          min={1}
          max={6}
          step={0.5}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{a}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">|x| &lt; {a} ⇔ -{a} &lt; x &lt; {a}</span>
      </p>
    </div>
  )
}
