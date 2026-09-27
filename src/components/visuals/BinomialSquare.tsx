import { useState } from 'react'

const TOTAL = 10

export default function BinomialSquare() {
  const [a, setA] = useState(6)
  const b = TOTAL - a

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox={`0 0 ${TOTAL} ${TOTAL}`} className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <rect x={0} y={0} width={a} height={a} className="fill-accent/20" />
        <rect x={a} y={0} width={b} height={a} className="fill-good/20" />
        <rect x={0} y={a} width={a} height={b} className="fill-good/20" />
        <rect x={a} y={a} width={b} height={b} className="fill-accent/20" />
        <rect x={0} y={0} width={TOTAL} height={TOTAL} fill="none" className="stroke-ink/30" strokeWidth={0.08} />
        <line x1={a} y1={0} x2={a} y2={TOTAL} className="stroke-ink/30" strokeWidth={0.08} />
        <line x1={0} y1={a} x2={TOTAL} y2={a} className="stroke-ink/30" strokeWidth={0.08} />

        <text x={a / 2} y={a / 2} textAnchor="middle" dominantBaseline="middle" fontSize={a > 1.6 ? 0.9 : 0} className="fill-ink font-semibold">
          a²
        </text>
        <text x={a + b / 2} y={a / 2} textAnchor="middle" dominantBaseline="middle" fontSize={b > 1.6 ? 0.9 : 0} className="fill-ink font-semibold">
          ab
        </text>
        <text x={a / 2} y={a + b / 2} textAnchor="middle" dominantBaseline="middle" fontSize={a > 1.6 ? 0.9 : 0} className="fill-ink font-semibold">
          ab
        </text>
        <text x={a + b / 2} y={a + b / 2} textAnchor="middle" dominantBaseline="middle" fontSize={b > 1.6 ? 0.9 : 0} className="fill-ink font-semibold">
          b²
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-4 font-mono font-semibold text-ink">a</span>
        <input
          type="range"
          min={1}
          max={TOTAL - 1}
          step={1}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-16 text-right font-mono text-ink-dim">
          a={a}, b={b}
        </span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          (a+b)² = a² + 2ab + b² = {a * a} + 2·{a * b} + {b * b} = {TOTAL * TOTAL}
        </span>
      </p>
    </div>
  )
}
