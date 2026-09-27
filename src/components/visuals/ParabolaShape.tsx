import { useMemo, useState } from 'react'

const WINDOW = 5

function buildPath(a: number) {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.25) {
    points.push(`${x.toFixed(2)},${(-(a * x * x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function ParabolaShape() {
  const [a, setA] = useState(1)
  const path = useMemo(() => buildPath(a), [a])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.06} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.12} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">a</span>
        <input
          type="range"
          min={-2}
          max={2}
          step={0.25}
          value={a}
          onChange={(e) => setA(Number(e.target.value) || 0.25)}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{a}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">y = {a}x²</span> — {a > 0 ? 'aukeaa ylös' : 'aukeaa alas'}
      </p>
    </div>
  )
}
