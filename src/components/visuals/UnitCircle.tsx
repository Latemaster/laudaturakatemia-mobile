import { useMemo, useState } from 'react'

const WINDOW = 1.35

export default function UnitCircle() {
  const [degrees, setDegrees] = useState(45)

  const { x, y, radians } = useMemo(() => {
    const rad = (degrees * Math.PI) / 180
    return { x: Math.cos(rad), y: Math.sin(rad), radians: rad }
  }, [degrees])

  const svgY = -y

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.015} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.015} />
        <circle cx={0} cy={0} r={1} fill="none" className="stroke-ink/30" strokeWidth={0.02} />

        {/* projections onto the axes */}
        <line x1={x} y1={0} x2={x} y2={svgY} strokeDasharray="0.04 0.04" className="stroke-bad" strokeWidth={0.02} />
        <line x1={0} y1={svgY} x2={x} y2={svgY} strokeDasharray="0.04 0.04" className="stroke-good" strokeWidth={0.02} />

        <line x1={0} y1={0} x2={x} y2={svgY} className="stroke-accent" strokeWidth={0.03} />
        <circle cx={x} cy={svgY} r={0.05} className="fill-accent" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">θ</span>
        <input
          type="range"
          min={0}
          max={360}
          step={5}
          value={degrees}
          onChange={(e) => setDegrees(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{degrees}°</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">θ = {(radians / Math.PI).toFixed(2)}π rad</span>
        <br />
        <span className="font-mono text-bad">cos θ = {x.toFixed(2)}</span>
        {'   '}
        <span className="font-mono text-good">sin θ = {y.toFixed(2)}</span>
      </p>
    </div>
  )
}
