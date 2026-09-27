// Static comparison: a smooth, differentiable curve (with a clear
// tangent line) versus |x|, which is continuous but has a kink at 0
// where no single tangent line exists.
function buildSmoothPath() {
  const points: string[] = []
  for (let x = -3; x <= 3; x += 0.1) {
    points.push(`${x.toFixed(2)},${(-(0.4 * x * x - 1.5)).toFixed(2)}`)
  }
  return `M ${points.join(' L ')}`
}

const SMOOTH_PATH = buildSmoothPath()

export default function ContinuityKink() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface p-2">
          <svg viewBox="-3 -3 6 5" className="h-24 w-full overflow-hidden">
            <line x1={-3} y1={0} x2={3} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
            <path d={SMOOTH_PATH} fill="none" className="stroke-accent" strokeWidth={0.12} />
            <line x1={-1.5} y1={1.9} x2={1.5} y2={-0.1} className="stroke-good" strokeWidth={0.08} strokeDasharray="0.15 0.1" />
            <circle cx={0} cy={1.5} r={0.14} className="fill-good" />
          </svg>
          <p className="mt-1 text-center text-xs font-semibold text-good">Derivoituva</p>
        </div>

        <div className="rounded-xl bg-surface p-2">
          <svg viewBox="-3 -3 6 5" className="h-24 w-full overflow-hidden">
            <line x1={-3} y1={0} x2={3} y2={0} className="stroke-ink/15" strokeWidth={0.05} />
            <path d="M -2.5,-2.5 L 0,0 L 2.5,-2.5" fill="none" className="stroke-bad" strokeWidth={0.12} />
            <circle cx={0} cy={0} r={0.16} className="fill-bad" />
          </svg>
          <p className="mt-1 text-center text-xs font-semibold text-bad">Ei derivoituva (kulma)</p>
        </div>
      </div>

      <p className="text-center text-sm text-ink-dim">
        |x| on jatkuva, mutta kohdassa x=0 vasemman- ja oikeanpuoleinen kulmakerroin eroavat
      </p>
    </div>
  )
}
