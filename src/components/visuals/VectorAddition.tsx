import { useMemo, useState } from 'react'

const WINDOW = 5
const U: [number, number] = [3, 1]
const V_LEN = 2.5

export default function VectorAddition() {
  const [deg, setDeg] = useState(70)

  const { v, sum } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    const vVec: [number, number] = [V_LEN * Math.cos(rad), V_LEN * Math.sin(rad)]
    return { v: vVec, sum: [U[0] + vVec[0], U[1] + vVec[1]] as [number, number] }
  }, [deg])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/15" strokeWidth={0.05} />

        <line x1={0} y1={0} x2={U[0]} y2={-U[1]} className="stroke-accent" strokeWidth={0.1} />
        <line x1={0} y1={0} x2={v[0]} y2={-v[1]} className="stroke-good" strokeWidth={0.1} />
        <line x1={U[0]} y1={-U[1]} x2={sum[0]} y2={-sum[1]} strokeDasharray="0.1 0.08" className="stroke-good/60" strokeWidth={0.06} />
        <line x1={v[0]} y1={-v[1]} x2={sum[0]} y2={-sum[1]} strokeDasharray="0.1 0.08" className="stroke-accent/60" strokeWidth={0.06} />
        <line x1={0} y1={0} x2={sum[0]} y2={-sum[1]} className="stroke-bad" strokeWidth={0.12} />

        <text x={U[0] + 0.15} y={-U[1]} fontSize={0.32} className="fill-accent font-semibold">
          u
        </text>
        <text x={v[0] + 0.15} y={-v[1]} fontSize={0.32} className="fill-good font-semibold">
          v
        </text>
        <text x={sum[0] + 0.15} y={-sum[1]} fontSize={0.32} className="fill-bad font-semibold">
          u+v
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">θ</span>
        <input
          type="range"
          min={0}
          max={360}
          step={10}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          u+v = ({sum[0].toFixed(1)}, {sum[1].toFixed(1)})
        </span>
      </p>
    </div>
  )
}
