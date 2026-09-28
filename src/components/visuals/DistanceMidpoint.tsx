import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 5

export default function DistanceMidpoint({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalBx, setInternalBx] = useState(4)
  const bx = value ?? internalBx
  const setBx = onChange ?? setInternalBx
  const [by, setBy] = useState(3)

  const { distance, mx, my } = useMemo(
    () => ({
      distance: Math.sqrt(bx * bx + by * by),
      mx: bx / 2,
      my: by / 2,
    }),
    [bx, by],
  )

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-1 -${WINDOW} ${WINDOW + 1.5} ${WINDOW + 1.5}`}
        className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-1} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.04} />
        <line x1={0} y1={-WINDOW} x2={0} y2={0.5} className="stroke-ink/15" strokeWidth={0.04} />
        <line x1={0} y1={0} x2={bx} y2={-by} className="stroke-accent" strokeWidth={0.08} />
        <circle cx={0} cy={0} r={0.15} className="fill-ink" />
        <circle cx={bx} cy={-by} r={0.15} className="fill-ink" />
        <circle cx={mx} cy={-my} r={0.15} className="fill-good" />
        <text x={0.15} y={0.4} fontSize={0.35} className="fill-ink font-semibold">
          A
        </text>
        <text x={bx + 0.15} y={-by - 0.15} fontSize={0.35} className="fill-ink font-semibold">
          B
        </text>
        <text x={mx + 0.15} y={-my + 0.35} fontSize={0.32} className="fill-good font-semibold">
          M
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">Bx</span>
        <input type="range" min={0} max={5} step={0.5} value={bx} onChange={(e) => setBx(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{bx}</span>
      </label>
      <label className="mt-2 flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">By</span>
        <input type="range" min={0} max={5} step={0.5} value={by} onChange={(e) => setBy(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{by}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">
            d = {distance.toFixed(2)}, M = ({mx.toFixed(1)}, {my.toFixed(1)})
          </span>
        </p>
      )}
    </div>
  )
}
