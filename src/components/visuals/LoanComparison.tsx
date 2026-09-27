import { useMemo, useState } from 'react'

const P = 10000
const R = 0.06

function equalPayment(n: number) {
  return (P * R * Math.pow(1 + R, n)) / (Math.pow(1 + R, n) - 1)
}

function decliningPayments(n: number) {
  const principalPerPeriod = P / n
  let remaining = P
  const payments: number[] = []
  for (let i = 0; i < n; i++) {
    payments.push(principalPerPeriod + remaining * R)
    remaining -= principalPerPeriod
  }
  return payments
}

export default function LoanComparison() {
  const [n, setN] = useState(8)

  const { equal, declining, maxVal } = useMemo(() => {
    const eq = equalPayment(n)
    const decl = decliningPayments(n)
    return { equal: eq, declining: decl, maxVal: Math.max(eq, decl[0]) }
  }, [n])

  const width = 20 / n

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="0 -6.5 20.5 7" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={0} y1={0} x2={20.5} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        <line
          x1={0}
          y1={-(equal / maxVal) * 6}
          x2={20}
          y2={-(equal / maxVal) * 6}
          className="stroke-accent"
          strokeWidth={0.08}
        />
        {declining.map((v, i) => (
          <rect key={i} x={i * width + width * 0.15} y={-(v / maxVal) * 6} width={width * 0.7} height={(v / maxVal) * 6} className="fill-good/60" />
        ))}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">n</span>
        <input type="range" min={4} max={15} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{n}</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono text-accent">Tasaerä: {equal.toFixed(0)} €/erä (vakio)</span>
        <br />
        <span className="font-mono text-good">
          Tasalyhennys: {declining[0].toFixed(0)}→{declining[declining.length - 1].toFixed(0)} € (pienenee)
        </span>
      </p>
    </div>
  )
}
