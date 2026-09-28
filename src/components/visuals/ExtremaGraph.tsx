import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 4

function f(x: number) {
  return x * x * x - 3 * x
}

function fPrime(x: number) {
  return 3 * x * x - 3
}

function buildPath() {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.1) {
    const y = f(x)
    if (Math.abs(y) > WINDOW + 2) continue
    points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function ExtremaGraph({ value, onChange }: VisualProps = {}) {
  const [internalX, setInternalX] = useState(-2)
  const x = value ?? internalX
  const setX = onChange ?? setInternalX
  const path = useMemo(buildPath, [])
  const y = f(x)
  const slope = fPrime(x)
  const sign = slope > 0.05 ? '+ (kasvava)' : slope < -0.05 ? '− (vähenevä)' : '0 (ääriarvo!)'

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.06} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <circle cx={-1} cy={-f(-1)} r={0.14} className="fill-good" />
        <circle cx={1} cy={-f(1)} r={0.14} className="fill-bad" />
        <circle cx={x} cy={-y} r={0.18} className="fill-ink" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={-2.5}
          max={2.5}
          step={0.1}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{x.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono">f&apos;({x.toFixed(1)}) = {slope.toFixed(2)}</span> — {sign}
      </p>
    </div>
  )
}
