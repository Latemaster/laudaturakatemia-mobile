import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW_X = 2 * Math.PI
const WINDOW_Y = 3.2

function buildPath(amp: number, freq: number) {
  const points: string[] = []
  for (let x = -WINDOW_X; x <= WINDOW_X; x += 0.05) {
    const y = amp * Math.sin(freq * x)
    points.push(`${x.toFixed(3)},${(-y).toFixed(3)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function SineWaveParams({ value, onChange, hideReadout }: VisualProps = {}) {
  const [internalAmp, setInternalAmp] = useState(1)
  const amp = value ?? internalAmp
  const setAmp = onChange ?? setInternalAmp
  const [freq, setFreq] = useState(1)
  const path = useMemo(() => buildPath(amp, freq), [amp, freq])

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW_X} -${WINDOW_Y} ${WINDOW_X * 2} ${WINDOW_Y * 2}`}
        className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW_X} y1={0} x2={WINDOW_X} y2={0} className="stroke-ink/20" strokeWidth={0.04} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth={0.1} />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">A</span>
        <input type="range" min={0.5} max={3} step={0.25} value={amp} onChange={(e) => setAmp(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{amp}</span>
      </label>
      <label className="mt-2 flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">B</span>
        <input type="range" min={0.5} max={3} step={0.25} value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="h-2 flex-1 accent-accent" />
        <span className="w-10 text-right font-mono text-ink-dim">{freq}</span>
      </label>

      {!hideReadout && (
        <p className="mt-3 text-sm text-ink-dim">
          <span className="font-mono">y = {amp}·sin({freq}x)</span>
        </p>
      )}
    </div>
  )
}
