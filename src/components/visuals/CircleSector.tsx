import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 4
const R = 3.5

export default function CircleSector({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalDeg, setInternalDeg] = useState(90)
  const deg = value ?? internalDeg
  const setDeg = onChange ?? setInternalDeg

  const { sectorPath, arcLength, sectorArea } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    const x2 = R * Math.cos(rad)
    const y2 = -R * Math.sin(rad)
    const largeArc = deg > 180 ? 1 : 0
    return {
      sectorPath: `M 0,0 L ${R},0 A ${R},${R} 0 ${largeArc} 0 ${x2.toFixed(3)},${y2.toFixed(3)} Z`,
      arcLength: ((deg / 360) * 2 * Math.PI * R).toFixed(2),
      sectorArea: ((deg / 360) * Math.PI * R * R).toFixed(2),
    }
  }, [deg])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <circle cx={0} cy={0} r={R} fill="none" className="stroke-ink/20" strokeWidth={0.05} />
        <path d={sectorPath} className="fill-accent/25 stroke-accent" strokeWidth={0.06} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">θ</span>
        <input
          type="range"
          min={10}
          max={350}
          step={10}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">Kaari s = {arcLength}, sektorin A = {sectorArea}</span>
        </p>
      )}
    </div>
  )
}
