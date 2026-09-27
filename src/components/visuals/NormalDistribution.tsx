import { useMemo, useState } from 'react'

const WINDOW = 5

function density(x: number, sigma: number) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-(x * x) / (2 * sigma * sigma))
}

function buildPath(sigma: number) {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-density(x, sigma) * 6).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function NormalDistribution() {
  const [sigma, setSigma] = useState(1)
  const path = useMemo(() => buildPath(sigma), [sigma])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -3 ${WINDOW * 2} 3.5`}
        className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        <line x1={0} y1={0.2} x2={0} y2={-2.8} strokeDasharray="0.1 0.08" className="stroke-ink/25" strokeWidth={0.03} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.08} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">σ</span>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.1}
          value={sigma}
          onChange={(e) => setSigma(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{sigma.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-center text-sm text-ink-dim">
        <span className="font-mono">X ~ N(0, {(sigma * sigma).toFixed(2)})</span> - mitä suurempi σ, sitä leveämpi kellokäyrä
      </p>
    </div>
  )
}
