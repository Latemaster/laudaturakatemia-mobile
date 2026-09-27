import { useMemo, useState } from 'react'

const WINDOW = 4
const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴']

function buildPath(fn: (x: number) => number) {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.1) {
    const y = fn(x)
    if (Math.abs(y) > WINDOW + 3) continue
    points.push(`${x.toFixed(2)},${(-y).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function PowerRuleGraph() {
  const [n, setN] = useState(3)

  const { fPath, fPrimePath } = useMemo(
    () => ({
      fPath: buildPath((x) => Math.pow(x, n) / Math.pow(WINDOW, n - 1)),
      fPrimePath: buildPath((x) => (n * Math.pow(x, n - 1)) / Math.pow(WINDOW, n - 1)),
    }),
    [n],
  )

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.06} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.06} />
        <path d={fPath} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <path d={fPrimePath} fill="none" className="stroke-good" strokeWidth={0.12} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">n</span>
        <input
          type="range"
          min={1}
          max={4}
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
          f&apos;(x) = {n}x{SUPERSCRIPTS[n - 1]}
        </span>
      </p>
    </div>
  )
}
