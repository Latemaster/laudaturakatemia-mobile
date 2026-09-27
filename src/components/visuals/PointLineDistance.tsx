// Fixed line y = 0.5x + 1 and point P(4,4); the dashed segment shows the
// shortest (perpendicular) distance d from P to the line.
const P: [number, number] = [4, 4]
const FOOT: [number, number] = [4.4, 3.2]

function lineY(x: number) {
  return 0.5 * x + 1
}

export default function PointLineDistance() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-1.5 -5.5 8 6.5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={-1} y1={-lineY(-1)} x2={6} y2={-lineY(6)} className="stroke-accent" strokeWidth={0.08} />
        <line
          x1={P[0]}
          y1={-P[1]}
          x2={FOOT[0]}
          y2={-FOOT[1]}
          strokeDasharray="0.15 0.1"
          className="stroke-bad"
          strokeWidth={0.07}
        />
        <circle cx={P[0]} cy={-P[1]} r={0.13} className="fill-ink" />
        <circle cx={FOOT[0]} cy={-FOOT[1]} r={0.1} className="fill-ink/50" />
        <text x={P[0] + 0.15} y={-P[1] - 0.1} fontSize={0.35} className="fill-ink font-semibold">
          P
        </text>
        <text x={(P[0] + FOOT[0]) / 2 + 0.2} y={-(P[1] + FOOT[1]) / 2} fontSize={0.32} className="fill-bad font-semibold">
          d
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">
        Lyhin etäisyys pisteestä suoraan on aina kohtisuora janan pituus
      </p>
    </div>
  )
}
