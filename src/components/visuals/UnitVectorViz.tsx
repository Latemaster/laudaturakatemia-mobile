import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 5
const V_LEN = 4

export default function UnitVectorViz({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalDeg, setInternalDeg] = useState(35)
  const deg = value ?? internalDeg
  const setDeg = onChange ?? setInternalDeg

  const { v, unit } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    return {
      v: [V_LEN * Math.cos(rad), V_LEN * Math.sin(rad)] as [number, number],
      unit: [Math.cos(rad), Math.sin(rad)] as [number, number],
    }
  }, [deg])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/15" strokeWidth={0.05} />
        <line x1={0} y1={0} x2={v[0]} y2={-v[1]} className="stroke-accent" strokeWidth={0.1} />
        <line x1={0} y1={0} x2={unit[0]} y2={-unit[1]} className="stroke-good" strokeWidth={0.14} />
        <text x={v[0] + 0.15} y={-v[1]} fontSize={0.32} className="fill-accent font-semibold">
          v (|v|={V_LEN})
        </text>
        <text x={unit[0] + 0.15} y={-unit[1] + 0.3} fontSize={0.3} className="fill-good font-semibold">
          v̂
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

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">
            v̂ = v / |v| = ({unit[0].toFixed(2)}, {unit[1].toFixed(2)}), |v̂| = 1
          </span>
        </p>
      )}
    </div>
  )
}
