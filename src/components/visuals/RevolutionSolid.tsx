// Static illustration of the solid formed when y = sqrt(x) rotates around
// the x-axis: the silhouette (mirrored curve) plus a few circular
// cross-sections to suggest the 3D shape.
function f(x: number) {
  return Math.sqrt(x)
}

function buildOutline(sign: 1 | -1) {
  const points: string[] = []
  for (let x = 0; x <= 6; x += 0.15) {
    points.push(`${x.toFixed(2)},${(sign * f(x)).toFixed(2)}`)
  }
  return points.join(' L ')
}

const CROSS_SECTIONS = [1.5, 3, 4.5, 6]

export default function RevolutionSolid() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -3 7 6" className="mb-3 h-40 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-0.5} y1={0} x2={6.5} y2={0} strokeDasharray="0.08 0.08" className="stroke-ink/30" strokeWidth={0.04} />
        <path
          d={`M ${buildOutline(1)} L ${buildOutline(-1).split(' L ').reverse().join(' L ')} Z`}
          className="fill-accent/20 stroke-accent"
          strokeWidth={0.06}
        />
        {CROSS_SECTIONS.map((x) => (
          <ellipse key={x} cx={x} cy={0} rx={0.35} ry={f(x)} fill="none" className="stroke-accent/50" strokeWidth={0.05} />
        ))}
      </svg>

      <p className="text-center text-sm text-ink-dim">Käyrä pyörii x-akselin ympäri ja muodostaa kappaleen</p>
    </div>
  )
}
