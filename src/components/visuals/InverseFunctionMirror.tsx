import { useState } from 'react'

const WINDOW = 5

function f(x: number) {
  return 2 * x + 3
}

function fInv(y: number) {
  return (y - 3) / 2
}

export default function InverseFunctionMirror() {
  const [x, setX] = useState(0.5)
  const y = f(x)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={-WINDOW} y1={WINDOW} x2={WINDOW} y2={-WINDOW} strokeDasharray="0.15 0.1" className="stroke-ink/25" strokeWidth={0.05} />

        <line x1={-WINDOW} y1={-f(-WINDOW)} x2={WINDOW} y2={-f(WINDOW)} className="stroke-accent" strokeWidth={0.1} />
        <line x1={-WINDOW} y1={-fInv(-WINDOW)} x2={WINDOW} y2={-fInv(WINDOW)} className="stroke-good" strokeWidth={0.1} />

        <circle cx={x} cy={-y} r={0.16} className="fill-accent" />
        <circle cx={y} cy={-x} r={0.16} className="fill-good" />
        <line x1={x} y1={-y} x2={y} y2={-x} strokeDasharray="0.1 0.08" className="stroke-ink/30" strokeWidth={0.04} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={-3}
          max={2}
          step={0.1}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{x.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-center text-sm text-ink-dim">
        <span className="font-mono text-accent">f({x.toFixed(1)}) = {y.toFixed(1)}</span>
        {'  '}
        <span className="font-mono text-good">f⁻¹({y.toFixed(1)}) = {x.toFixed(1)}</span>
      </p>
    </div>
  )
}
