import { useMemo, useState } from 'react'

const WINDOW = 5
const B = 1

export default function LineSlope() {
  const [k, setK] = useState(1)

  const { y1, y2 } = useMemo(
    () => ({
      y1: k * -WINDOW + B,
      y2: k * WINDOW + B,
    }),
    [k],
  )

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={-WINDOW} y1={-y1} x2={WINDOW} y2={-y2} className="stroke-accent" strokeWidth={0.1} />
        <circle cx={0} cy={-B} r={0.12} className="fill-good" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">k</span>
        <input
          type="range"
          min={-3}
          max={3}
          step={0.25}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{k}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">y = {k}x + {B}</span>
      </p>
    </div>
  )
}
