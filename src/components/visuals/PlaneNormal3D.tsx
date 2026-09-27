// Static illustration of a plane spanned by two vectors u, v from a point
// a, together with its normal vector n = u × v.
type Vec3 = [number, number, number]

function project([x, y, z]: Vec3): [number, number] {
  return [x + 0.5 * z, -(y + 0.3 * z)]
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

function length(a: Vec3) {
  return Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2)
}

const A: Vec3 = [-1, -1, 0]
const U: Vec3 = [2.5, 0, 0]
const V: Vec3 = [0, 2, 1]

export default function PlaneNormal3D() {
  const corners = [A, add(A, U), add(A, add(U, V)), add(A, V)].map(project)
  const n = cross(U, V)
  const nLen = length(n)
  const center = add(A, add([U[0] / 2, U[1] / 2, U[2] / 2], [V[0] / 2, V[1] / 2, V[2] / 2]))
  const nScaled: Vec3 = [(n[0] / nLen) * 2.2, (n[1] / nLen) * 2.2, (n[2] / nLen) * 2.2]
  const nTip = project(add(center, nScaled))
  const centerP = project(center)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-3.5 -5.5 8 6.5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <polygon
          points={corners.map(([x, y]) => `${x},${y}`).join(' ')}
          className="fill-accent/20 stroke-accent"
          strokeWidth={0.06}
        />
        <line x1={centerP[0]} y1={centerP[1]} x2={nTip[0]} y2={nTip[1]} className="stroke-good" strokeWidth={0.1} />
        <circle cx={nTip[0]} cy={nTip[1]} r={0.1} className="fill-good" />
        <text x={nTip[0] + 0.15} y={nTip[1]} fontSize={0.35} className="fill-good font-semibold">
          n
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">Normaalivektori n = u × v on kohtisuorassa tasoa vastaan</p>
    </div>
  )
}
