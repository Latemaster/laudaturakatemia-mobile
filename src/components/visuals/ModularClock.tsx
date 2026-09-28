import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const N = 5
const R = 3.4

export default function ModularClock({ value, onChange }: VisualProps = {}) {
  const [internalA, setInternalA] = useState(13)
  const a = value ?? internalA
  const setA = onChange ?? setInternalA
  const r = ((a % N) + N) % N

  const ticks = useMemo(
    () =>
      Array.from({ length: N }, (_, k) => {
        const angle = (2 * Math.PI * k) / N - Math.PI / 2
        return { k, x: R * Math.cos(angle), y: R * Math.sin(angle) }
      }),
    [],
  )

  const active = ticks[r]

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-4.5 -4.5 9 9" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <circle cx={0} cy={0} r={R} fill="none" className="stroke-ink/20" strokeWidth={0.06} />
        {ticks.map(({ k, x, y }) => (
          <g key={k}>
            <circle cx={x} cy={y} r={k === r ? 0.32 : 0.22} className={k === r ? 'fill-accent' : 'fill-ink/30'} />
            <text
              x={x * 1.32}
              y={y * 1.32}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={0.42}
              className={k === r ? 'fill-accent font-semibold' : 'fill-ink-dim'}
            >
              {k}
            </text>
          </g>
        ))}
        {active && <line x1={0} y1={0} x2={active.x} y2={active.y} className="stroke-accent" strokeWidth={0.06} />}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">a</span>
        <input
          type="range"
          min={0}
          max={24}
          step={1}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{a}</span>
      </label>

      <p className="mt-3 text-center text-sm text-ink-dim">
        <span className="font-mono">
          {a} mod {N} = {r}
        </span>
      </p>
    </div>
  )
}
