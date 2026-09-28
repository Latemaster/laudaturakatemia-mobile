import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 5

function f(x: number) {
  return 1 / x
}

function buildBranch(from: number, to: number, step: number) {
  const points: string[] = []
  for (let x = from; step > 0 ? x <= to : x >= to; x += step) {
    const y = f(x)
    if (Math.abs(y) > WINDOW) continue
    points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function DomainRangeHyperbola({ value, onChange }: VisualProps = {}) {
  const [internalX, setInternalX] = useState(1.5)
  const x = value ?? internalX
  const setX = onChange ?? setInternalX
  const y = f(x)

  const rightBranch = useMemo(() => buildBranch(0.2, WINDOW, 0.05), [])
  const leftBranch = useMemo(() => buildBranch(-0.2, -WINDOW, -0.05), [])

  const px = x
  const py = -y

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} strokeDasharray="0.2 0.15" className="stroke-bad" strokeWidth={0.05} />
        <path d={rightBranch} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <path d={leftBranch} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <circle cx={0} cy={0} r={0.18} className="fill-surface stroke-bad" strokeWidth={0.08} />
        <circle cx={px} cy={py} r={0.16} className="fill-good" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={-4}
          max={4}
          step={0.1}
          value={x}
          onChange={(e) => {
            const v = Number(e.target.value)
            setX(v === 0 ? 0.1 : v)
          }}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{x.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-center text-sm text-ink-dim">
        <span className="font-mono">
          f({x.toFixed(1)}) = 1/{x.toFixed(1)} = {y.toFixed(2)}
        </span>
        {' · '}Määrittelyjoukko: x ≠ 0
      </p>
    </div>
  )
}
