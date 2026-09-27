import { useMemo, useState } from 'react'

const WINDOW = 4

function buildExpPath(a: number) {
  const points: string[] = []
  for (let x = -WINDOW; x <= WINDOW; x += 0.15) {
    points.push(`${x.toFixed(2)},${(-Math.pow(a, x)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

function buildLogPath(a: number) {
  const points: string[] = []
  for (let x = 0.05; x <= WINDOW + 4; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-(Math.log(x) / Math.log(a))).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function ExpLogMirror() {
  const [a, setA] = useState(2)
  const expPath = useMemo(() => buildExpPath(a), [a])
  const logPath = useMemo(() => buildLogPath(a), [a])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.05} />
        <line x1={-WINDOW} y1={WINDOW} x2={WINDOW} y2={-WINDOW} strokeDasharray="0.15 0.1" className="stroke-ink/25" strokeWidth={0.05} />
        <path d={expPath} fill="none" className="stroke-accent" strokeWidth={0.12} />
        <path d={logPath} fill="none" className="stroke-good" strokeWidth={0.12} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">a</span>
        <input
          type="range"
          min={1.2}
          max={3}
          step={0.2}
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{a.toFixed(1)}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono text-accent">y = {a.toFixed(1)}ˣ</span>
        {'   '}
        <span className="font-mono text-good">y = log_{a.toFixed(1)}(x)</span>
      </p>
    </div>
  )
}
