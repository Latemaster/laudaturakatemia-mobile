// Static cavalier-projection illustration of the x/y/z axes, the i/j/k
// basis vectors, and a sample space vector v = (3, 2, 2).
function project([x, y, z]: [number, number, number]): [number, number] {
  return [x + 0.5 * z, -(y + 0.3 * z)]
}

const AXES: Array<{ to: [number, number, number]; label: string }> = [
  { to: [4.5, 0, 0], label: 'x' },
  { to: [0, 4.5, 0], label: 'y' },
  { to: [0, 0, 4.5], label: 'z' },
]

const V: [number, number, number] = [3, 2, 2]

export default function SpaceVectorAxes() {
  const origin = project([0, 0, 0])
  const vEnd = project(V)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-2 -6.5 9 8" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        {AXES.map(({ to, label }) => {
          const [x2, y2] = project(to)
          return (
            <g key={label}>
              <line x1={origin[0]} y1={origin[1]} x2={x2} y2={y2} className="stroke-ink/40" strokeWidth={0.06} />
              <text x={x2 + 0.15} y={y2} fontSize={0.4} className="fill-ink-dim font-semibold">
                {label}
              </text>
            </g>
          )
        })}
        <line x1={origin[0]} y1={origin[1]} x2={vEnd[0]} y2={vEnd[1]} className="stroke-accent" strokeWidth={0.14} />
        <circle cx={vEnd[0]} cy={vEnd[1]} r={0.14} className="fill-accent" />
        <text x={vEnd[0] + 0.2} y={vEnd[1]} fontSize={0.4} className="fill-accent font-semibold">
          v
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">v = 3î + 2ĵ + 2k̂ = (3, 2, 2)</p>
    </div>
  )
}
