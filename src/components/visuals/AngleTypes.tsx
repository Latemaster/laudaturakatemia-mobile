import { useMemo, useState } from 'react'

const WINDOW = 6

function angleType(deg: number) {
  if (deg === 90) return { label: 'Suora kulma', color: 'text-accent' }
  if (deg === 180) return { label: 'Oikokulma', color: 'text-accent' }
  if (deg === 360 || deg === 0) return { label: 'Täysi kulma', color: 'text-accent' }
  if (deg < 90) return { label: 'Terävä kulma', color: 'text-good' }
  if (deg < 180) return { label: 'Tylppä kulma', color: 'text-bad' }
  return { label: 'Heijastuskulma', color: 'text-bad' }
}

export default function AngleTypes() {
  const [deg, setDeg] = useState(60)

  const { x, y, arcPath } = useMemo(() => {
    const rad = (deg * Math.PI) / 180
    const px = 4.5 * Math.cos(rad)
    const py = -4.5 * Math.sin(rad)
    const largeArc = deg > 180 ? 1 : 0
    const arcX = 1.2 * Math.cos(rad)
    const arcY = -1.2 * Math.sin(rad)
    return { x: px, y: py, arcPath: `M 1.2,0 A 1.2,1.2 0 ${largeArc} 0 ${arcX.toFixed(3)},${arcY.toFixed(3)}` }
  }, [deg])

  const type = angleType(deg)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={0} y1={0} x2={5} y2={0} className="stroke-ink/40" strokeWidth={0.1} />
        <line x1={0} y1={0} x2={x} y2={y} className="stroke-accent" strokeWidth={0.1} />
        <path d={arcPath} fill="none" className="stroke-good" strokeWidth={0.08} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">θ</span>
        <input
          type="range"
          min={0}
          max={360}
          step={5}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      <p className={`mt-3 text-sm font-semibold ${type.color}`}>{type.label}</p>
    </div>
  )
}
