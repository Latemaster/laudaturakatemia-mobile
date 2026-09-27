import { useMemo, useState } from 'react'

const WINDOW = 5
const R = 3
const LEVELS = [1.5, 2.25, 3]

export default function GradientField() {
  const [deg, setDeg] = useState(45)

  const { point, gradTip } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    const x = R * Math.cos(rad)
    const y = R * Math.sin(rad)
    // gradient of f = x^2 + y^2 is (2x, 2y): points radially outward,
    // scaled down here just so the arrow fits nicely in the frame.
    const gx = x * 0.6
    const gy = y * 0.6
    return { point: [x, y] as [number, number], gradTip: [x + gx, y + gy] as [number, number] }
  }, [deg])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        {LEVELS.map((lvl) => (
          <circle key={lvl} cx={0} cy={0} r={lvl * R} fill="none" className="stroke-ink/15" strokeWidth={0.03} />
        ))}
        <circle cx={0} cy={0} r={R} fill="none" className="stroke-ink/30" strokeWidth={0.05} />
        <line x1={point[0]} y1={-point[1]} x2={gradTip[0]} y2={-gradTip[1]} className="stroke-bad" strokeWidth={0.12} />
        <circle cx={point[0]} cy={-point[1]} r={0.14} className="fill-ink" />
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

      <p className="mt-3 text-sm text-ink-dim">∇f osoittaa aina jyrkimmän nousun suuntaan (tässä suoraan ulospäin)</p>
    </div>
  )
}
