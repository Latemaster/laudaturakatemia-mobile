// Static illustration of two vectors u, v from the origin and their cross
// product u × v, which points perpendicular to the plane they span.
type Vec3 = [number, number, number]

function project([x, y, z]: Vec3): [number, number] {
  return [x + 0.5 * z, -(y + 0.3 * z)]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

const U: Vec3 = [3, 0.5, 0]
const V: Vec3 = [0.5, 2.5, 0]
const N = cross(U, V)
const nLen = Math.sqrt(N[0] ** 2 + N[1] ** 2 + N[2] ** 2)
const N_DISPLAY: Vec3 = [(N[0] / nLen) * 2.5, (N[1] / nLen) * 2.5, (N[2] / nLen) * 2.5]

export default function CrossProductViz() {
  const origin = project([0, 0, 0])
  const uEnd = project(U)
  const vEnd = project(V)
  const nEnd = project(N_DISPLAY)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-1 -5.5 7 6.5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <line x1={origin[0]} y1={origin[1]} x2={uEnd[0]} y2={uEnd[1]} className="stroke-accent" strokeWidth={0.1} />
        <line x1={origin[0]} y1={origin[1]} x2={vEnd[0]} y2={vEnd[1]} className="stroke-good" strokeWidth={0.1} />
        <line x1={origin[0]} y1={origin[1]} x2={nEnd[0]} y2={nEnd[1]} className="stroke-bad" strokeWidth={0.12} />
        <text x={uEnd[0] + 0.1} y={uEnd[1]} fontSize={0.35} className="fill-accent font-semibold">
          u
        </text>
        <text x={vEnd[0] + 0.1} y={vEnd[1]} fontSize={0.35} className="fill-good font-semibold">
          v
        </text>
        <text x={nEnd[0] + 0.1} y={nEnd[1]} fontSize={0.35} className="fill-bad font-semibold">
          u×v
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">Ristitulo on kohtisuorassa molempia vektoreita vastaan</p>
    </div>
  )
}
