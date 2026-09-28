import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

function project([x, y, z]: [number, number, number]): [number, number] {
  return [x + 0.5 * z, -(y + 0.3 * z)]
}

const A: [number, number, number] = [0, 0, 0]
const DIR: [number, number, number] = [2, 1, 1.3]

export default function ParametricLine3D({ value, onChange }: VisualProps = {}) {
  const [internalT, setInternalT] = useState(1)
  const t = value ?? internalT
  const setT = onChange ?? setInternalT

  const point = useMemo<[number, number, number]>(
    () => [A[0] + t * DIR[0], A[1] + t * DIR[1], A[2] + t * DIR[2]],
    [t],
  )

  const start = project([A[0] - 2 * DIR[0], A[1] - 2 * DIR[1], A[2] - 2 * DIR[2]])
  const end = project([A[0] + 2 * DIR[0], A[1] + 2 * DIR[1], A[2] + 2 * DIR[2]])
  const p = project(point)
  const origin = project(A)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-6 -6 12 7" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} className="stroke-ink/30" strokeWidth={0.08} />
        <circle cx={origin[0]} cy={origin[1]} r={0.12} className="fill-ink" />
        <text x={origin[0] + 0.15} y={origin[1] + 0.3} fontSize={0.35} className="fill-ink-dim">
          a
        </text>
        <circle cx={p[0]} cy={p[1]} r={0.18} className="fill-accent" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">t</span>
        <input
          type="range"
          min={-2}
          max={2}
          step={0.1}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{t.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          r(t) = a + t·v = ({point[0].toFixed(1)}, {point[1].toFixed(1)}, {point[2].toFixed(1)})
        </span>
      </p>
    </div>
  )
}
