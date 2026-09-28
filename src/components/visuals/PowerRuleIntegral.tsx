import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 4
const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴']

function buildPath(fn: (x: number) => number) {
  const points: string[] = []
  for (let x = 0; x <= WINDOW; x += 0.1) {
    const y = fn(x)
    if (y > WINDOW + 2) continue
    points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function PowerRuleIntegral({ value, onChange }: VisualProps = {}) {
  const [internalN, setInternalN] = useState(1)
  const n = value ?? internalN
  const setN = onChange ?? setInternalN

  const { fPath, bigFPath } = useMemo(
    () => ({
      fPath: buildPath((x) => Math.pow(x, n)),
      bigFPath: buildPath((x) => Math.pow(x, n + 1) / (n + 1)),
    }),
    [n],
  )

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox={`-0.5 -${WINDOW} ${WINDOW + 1} ${WINDOW + 1}`} className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-0.5} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-WINDOW} x2={0} y2={0.5} className="stroke-ink/20" strokeWidth={0.06} />
        <path d={fPath} fill="none" className="stroke-accent" strokeWidth={0.1} />
        <path d={bigFPath} fill="none" className="stroke-good" strokeWidth={0.1} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">n</span>
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{n}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono text-accent">f(x) = x{SUPERSCRIPTS[n]}</span>
        {'   '}
        <span className="font-mono text-good">
          F(x) = x{SUPERSCRIPTS[n + 1]}/{n + 1}
        </span>
      </p>
    </div>
  )
}
