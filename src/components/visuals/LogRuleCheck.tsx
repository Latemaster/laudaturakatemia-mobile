import { useState } from 'react'
import type { VisualProps } from './index'

export default function LogRuleCheck({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalX, setInternalX] = useState(4)
  const x = value ?? internalX
  const setX = onChange ?? setInternalX
  const [y, setY] = useState(5)

  const left = Math.log10(x * y)
  const right = Math.log10(x) + Math.log10(y)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 rounded-xl bg-surface p-4 text-center">
        <p className="font-mono text-base text-ink">
          log(x·y) = log(x) + log(y)
        </p>
        {!hideReadout && (
          <>
            <p className="mt-2 font-mono text-sm text-ink-dim">
              log({x}·{y}) = {left.toFixed(3)}
            </p>
            <p className="font-mono text-sm text-ink-dim">
              log({x}) + log({y}) = {right.toFixed(3)}
            </p>
          </>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input type="range" min={1} max={20} step={1} value={x} onChange={(e) => setX(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{x}</span>
      </label>
      <label className="mt-2 flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">y</span>
        <input type="range" min={1} max={20} step={1} value={y} onChange={(e) => setY(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{y}</span>
      </label>
    </div>
  )
}
