import { useMemo, useState } from 'react'

const WINDOW = 6

function buildPath() {
  const segments: string[] = []
  let current: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.05) {
    const y = Math.tan(x)
    if (Math.abs(y) > WINDOW + 3) {
      if (current.length > 1) segments.push(`M ${current.join(' L ')}`)
      current = []
      continue
    }
    current.push(`${x.toFixed(3)},${(-y).toFixed(3)}`)
  }
  if (current.length > 1) segments.push(`M ${current.join(' L ')}`)
  return segments.join(' ')
}

export default function TangentGraph() {
  const [deg, setDeg] = useState(45)
  const path = useMemo(buildPath, [])
  const rad = (deg * Math.PI) / 180
  const value = Math.tan(rad)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.06} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.1} />
        {Math.abs(value) <= WINDOW && <circle cx={rad} cy={-value} r={0.15} className="fill-good" />}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={-85}
          max={85}
          step={5}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">tan({deg}°) = {value.toFixed(2)}</span> — asymptootit ±90° kohdalla
      </p>
    </div>
  )
}
