import { useMemo, useState } from 'react'

const WINDOW = 6

// y is left unclamped and relies on the SVG's own viewBox + overflow-hidden
// to clip it - clamping the value here would flatten the curve into a
// plateau instead of letting it naturally run off the top/bottom edge.
function buildParabolaPath(a: number, b: number, c: number) {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.25) {
    const y = a * x * x + b * x + c
    points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

const SLIDERS = [
  { key: 'a', label: 'a', min: -3, max: 3 },
  { key: 'b', label: 'b', min: -6, max: 6 },
  { key: 'c', label: 'c', min: -6, max: 6 },
] as const

export default function QuadraticDiscriminant() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(-2)
  const [c, setC] = useState(-3)

  const discriminant = b * b - 4 * a * c
  const discriminantDisplay = Math.round(discriminant * 100) / 100

  const roots = useMemo(() => {
    if (discriminant > 0) {
      const sq = Math.sqrt(discriminant)
      return [(-b - sq) / (2 * a), (-b + sq) / (2 * a)]
    }
    if (discriminant === 0) return [-b / (2 * a)]
    return []
  }, [a, b, discriminant])

  const path = useMemo(() => buildParabolaPath(a, b, c), [a, b, c])

  const rootLabel =
    discriminant > 0 ? '2 ratkaisua' : discriminant === 0 ? '1 ratkaisu' : 'ei reaaliratkaisuja'
  const rootColor = discriminant > 0 ? 'text-good' : discriminant === 0 ? 'text-accent' : 'text-bad'

  const values = { a, b, c }
  const setters = { a: setA, b: setB, c: setC }

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.08} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.08} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.15} />
        {roots.map((rootX, i) => (
          <circle key={i} cx={rootX} cy={0} r={0.25} className="fill-good" />
        ))}
      </svg>

      <div className="flex flex-col gap-3">
        {SLIDERS.map(({ key, label, min, max }) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <span className="w-4 font-mono font-semibold text-ink">{label}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={0.5}
              value={values[key]}
              onChange={(e) => {
                const next = Number(e.target.value)
                setters[key](key === 'a' && next === 0 ? 0.5 : next)
              }}
              className="h-2 flex-1 accent-accent"
            />
            <span className="w-10 text-right font-mono text-ink-dim">{values[key]}</span>
          </label>
        ))}
      </div>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">D = b² − 4ac = {discriminantDisplay}</span>{' '}
        <span className={`font-semibold ${rootColor}`}>({rootLabel})</span>
      </p>
    </div>
  )
}
