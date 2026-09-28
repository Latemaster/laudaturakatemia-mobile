import { useMemo, useState } from 'react'
import type { VisualProps } from './index'

const WINDOW = 1.35

function point(deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [Math.cos(rad), Math.sin(rad)]
}

export default function AngleSymmetry({ value, onChange }: VisualProps = {}) {
  const [internalDeg, setInternalDeg] = useState(30)
  const deg = value ?? internalDeg
  const setDeg = onChange ?? setInternalDeg

  const { p, pSupp } = useMemo(
    () => ({
      p: point(deg),
      pSupp: point(180 - deg),
    }),
    [deg],
  )

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg
        viewBox={`-${WINDOW} -${WINDOW} ${WINDOW * 2} ${WINDOW * 2}`}
        className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface"
      >
        <line x1={-WINDOW} y1={0} x2={WINDOW} y2={0} className="stroke-ink/20" strokeWidth={0.015} />
        <line x1={0} y1={-WINDOW} x2={0} y2={WINDOW} className="stroke-ink/20" strokeWidth={0.015} />
        <circle cx={0} cy={0} r={1} fill="none" className="stroke-ink/30" strokeWidth={0.02} />

        <line x1={0} y1={0} x2={p[0]} y2={-p[1]} className="stroke-accent" strokeWidth={0.03} />
        <circle cx={p[0]} cy={-p[1]} r={0.05} className="fill-accent" />

        <line x1={0} y1={0} x2={pSupp[0]} y2={-pSupp[1]} className="stroke-good" strokeWidth={0.03} />
        <circle cx={pSupp[0]} cy={-pSupp[1]} r={0.05} className="fill-good" />
      </svg>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={5}
          max={175}
          step={5}
          value={deg}
          onChange={(e) => setDeg(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-14 text-right font-mono text-ink-dim">{deg}°</span>
      </label>

      <p className="mt-3 text-sm text-ink-dim">
        <span className="font-mono text-accent">sin({deg}°) = {p[1].toFixed(2)}</span>
        <br />
        <span className="font-mono text-good">
          sin({180 - deg}°) = {pSupp[1].toFixed(2)}
        </span>
        {' — sama arvo, vastakulma'}
      </p>
    </div>
  )
}
