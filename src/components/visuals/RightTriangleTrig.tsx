import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const C = 4 // fixed hypotenuse length

export default function RightTriangleTrig({ value, onChange }: VisualProps = {}) {
  const [internalDeg, setInternalDeg] = useState(40)
  const deg = value ?? internalDeg
  const setDeg = onChange ?? setInternalDeg

  const { a, b, arcPath } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    const bLen = C * Math.cos(rad)
    const aLen = C * Math.sin(rad)
    const arcX = 0.8 * Math.cos(rad)
    const arcY = 0.8 * Math.sin(rad)
    return { a: aLen, b: bLen, arcPath: `M 0.8,0 A 0.8,0.8 0 0 0 ${arcX.toFixed(3)},${(-arcY).toFixed(3)}` }
  }, [deg])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -4.5 5 5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <path
          d={`M 0,0 L ${b.toFixed(2)},0 L ${b.toFixed(2)},${(-a).toFixed(2)} Z`}
          className="fill-accent/15 stroke-accent"
          strokeWidth={0.06}
        />
        {/* right angle marker at B */}
        <path
          d={`M ${(b - 0.3).toFixed(2)},0 L ${(b - 0.3).toFixed(2)},-0.3 L ${b.toFixed(2)},-0.3`}
          fill="none"
          className="stroke-ink/50"
          strokeWidth={0.05}
        />
        <path d={arcPath} fill="none" className="stroke-good" strokeWidth={0.05} />

        <text x={b / 2 - 0.2} y={0.4} fontSize={0.32} className="fill-ink-dim">
          b
        </text>
        <text x={b + 0.1} y={-a / 2} fontSize={0.32} className="fill-ink-dim">
          a
        </text>
        <text x={b / 2 - 0.4} y={-a / 2 - 0.2} fontSize={0.32} className="fill-ink-dim">
          c
        </text>
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">θ</span>
        <input
          type="range"
          min={10}
          max={80}
          step={5}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">
          a = c·sin θ = {a.toFixed(2)}, b = c·cos θ = {b.toFixed(2)}
        </span>
      </p>
    </div>
  )
}
