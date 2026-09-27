// Static illustration of the parallelepiped (3D box) spanned by three
// vectors a, b, c - its volume is the scalar triple product a·(b×c).
type Vec3 = [number, number, number]

function project([x, y, z]: Vec3): [number, number] {
  return [x + 0.5 * z, -(y + 0.3 * z)]
}

function add(...vs: Vec3[]): Vec3 {
  return vs.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]], [0, 0, 0])
}

const O: Vec3 = [0, 0, 0]
const A: Vec3 = [2.5, 0, 0]
const B: Vec3 = [0, 2, 0]
const C: Vec3 = [0.6, 0.6, 2]

const VERTS = {
  o: O,
  a: A,
  b: B,
  c: C,
  ab: add(A, B),
  ac: add(A, C),
  bc: add(B, C),
  abc: add(A, B, C),
}

const EDGES: Array<[keyof typeof VERTS, keyof typeof VERTS]> = [
  ['o', 'a'],
  ['o', 'b'],
  ['o', 'c'],
  ['a', 'ab'],
  ['a', 'ac'],
  ['b', 'ab'],
  ['b', 'bc'],
  ['c', 'ac'],
  ['c', 'bc'],
  ['ab', 'abc'],
  ['ac', 'abc'],
  ['bc', 'abc'],
]

export default function ParallelepipedViz() {
  const p = Object.fromEntries(Object.entries(VERTS).map(([k, v]) => [k, project(v)])) as Record<
    keyof typeof VERTS,
    [number, number]
  >

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-1 -5.5 6.5 6.5" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        {EDGES.map(([from, to], i) => (
          <line key={i} x1={p[from][0]} y1={p[from][1]} x2={p[to][0]} y2={p[to][1]} className="stroke-accent" strokeWidth={0.06} />
        ))}
        <text x={p.a[0] + 0.1} y={p.a[1] + 0.3} fontSize={0.32} className="fill-ink-dim">
          a
        </text>
        <text x={p.b[0] - 0.3} y={p.b[1]} fontSize={0.32} className="fill-ink-dim">
          b
        </text>
        <text x={p.c[0] + 0.1} y={p.c[1] - 0.1} fontSize={0.32} className="fill-ink-dim">
          c
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">Tilavuus V = |a·(b×c)|</p>
    </div>
  )
}
