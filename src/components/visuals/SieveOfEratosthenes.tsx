import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const MAX_N = 50
const PRIMES_USED = [2, 3, 5, 7]
const NUMBERS = Array.from({ length: MAX_N - 1 }, (_, i) => i + 2)
const COLS = 7

export default function SieveOfEratosthenes({ value, onChange }: VisualProps = {}) {
  const [internalStep, setInternalStep] = useState(4)
  const step = value ?? internalStep
  const setStep = onChange ?? setInternalStep

  const activePrimes = PRIMES_USED.slice(0, step)

  const status = useMemo(() => {
    const map = new Map<number, 'prime' | 'composite' | 'unknown'>()
    for (const n of NUMBERS) {
      const isComposite = activePrimes.some((p) => n !== p && n % p === 0)
      // A number is confirmed prime only once every prime that could
      // possibly divide it (i.e. every used prime up to sqrt(n)) has
      // actually been applied - not just because n^2 exceeds MAX_N, which
      // wrongly marked e.g. 49 "prime" before the sieve reached 7.
      const necessaryPrimes = PRIMES_USED.filter((p) => p * p <= n)
      const fullyChecked = necessaryPrimes.every((p) => activePrimes.includes(p))
      if (isComposite) map.set(n, 'composite')
      else if (fullyChecked) map.set(n, 'prime')
      else map.set(n, 'unknown')
    }
    return map
  }, [activePrimes])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox={`0 0 ${COLS * 30} ${Math.ceil(NUMBERS.length / COLS) * 30}`} className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        {NUMBERS.map((n, i) => {
          const col = i % COLS
          const row = Math.floor(i / COLS)
          const s = status.get(n)
          const fillClass = s === 'prime' ? 'fill-good/25' : s === 'composite' ? 'fill-bad/10' : 'fill-ink/5'
          const textClass = s === 'prime' ? 'fill-good font-semibold' : s === 'composite' ? 'fill-ink/30 line-through' : 'fill-ink-dim'
          return (
            <g key={n}>
              <rect x={col * 30 + 2} y={row * 30 + 2} width={26} height={26} rx={5} className={fillClass} />
              <text x={col * 30 + 15} y={row * 30 + 19} textAnchor="middle" fontSize={11} className={textClass}>
                {n}
              </text>
            </g>
          )
        })}
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-14 font-mono font-semibold text-ink">askel</span>
        <input
          type="range"
          min={0}
          max={PRIMES_USED.length}
          step={1}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
      </label>

      <p className="mt-3 text-center text-sm text-ink-dim">
        {step === 0
          ? 'Aloitus: kaikki luvut 2-50 mahdollisia alkulukuja'
          : `Seulottu alkuluvuilla ${activePrimes.join(', ')} ${step >= PRIMES_USED.length ? '- valmis' : ''}`}
      </p>
    </div>
  )
}
