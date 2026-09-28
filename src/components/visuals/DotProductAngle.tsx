import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 5
const U_LEN = 3
const V_LEN = 2.5

export default function DotProductAngle({ value, onChange }: VisualProps = {}) {
  const [internalDeg, setInternalDeg] = useState(60)
  const deg = value ?? internalDeg
  const setDeg = onChange ?? setInternalDeg

  const { v, dot } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    return {
      v: [V_LEN * Math.cos(rad), V_LEN * Math.sin(rad)] as [number, number],
      dot: U_LEN * V_LEN * Math.cos(rad),
    }
  }, [deg])

  const isPerpendicular = Math.abs(dot) < 0.05

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={0} x2={U_LEN} y2={0} className="stroke-accent" strokeWidth={0.1} />
        <line x1={0} y1={0} x2={v[0]} y2={-v[1]} className="stroke-good" strokeWidth={0.1} />
        <text x={U_LEN + 0.1} y={0.3} fontSize={0.32} className="fill-accent font-semibold">
          u
        </text>
        <text x={v[0] + 0.1} y={-v[1]} fontSize={0.32} className="fill-good font-semibold">
          v
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">θ</span>
        <input
          type="range"
          min={0}
          max={180}
          step={5}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      <p className={`mt-3 text-sm font-mono ${isPerpendicular ? 'font-semibold text-good' : 'text-ink-dim'}`}>
        u·v = |u||v|cos θ = {dot.toFixed(2)}
        {isPerpendicular && ' — kohtisuorassa!'}
      </p>
    </div>
  )
}
