// Static illustration of the Euclidean algorithm computing gcd(48, 18).
const STEPS = [
  { a: 48, b: 18, q: 2, r: 12 },
  { a: 18, b: 12, q: 1, r: 6 },
  { a: 12, b: 6, q: 2, r: 0 },
]

export default function EuclideanAlgorithm() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 flex flex-col items-center gap-2 rounded-xl bg-surface p-4">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1 font-mono text-sm text-ink">
            <span className="rounded-lg border-2 border-accent bg-accent/10 px-2 py-1">{s.a}</span>
            <span className="text-ink-dim">=</span>
            <span>{s.q}</span>
            <span className="text-ink-dim">·</span>
            <span className="rounded-lg border-2 border-ink/20 px-2 py-1">{s.b}</span>
            <span className="text-ink-dim">+</span>
            <span className={`rounded-lg border-2 px-2 py-1 ${s.r === 0 ? 'border-good bg-good/15 font-semibold' : 'border-ink/20'}`}>
              {s.r}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-ink-dim">
        Viimeinen nollasta poikkeava jakojäännös on SYT: <span className="font-mono font-semibold text-ink">SYT(48, 18) = 6</span>
      </p>
    </div>
  )
}
