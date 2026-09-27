// A general (non-right) triangle with the standard a/b/c, A/B/C labeling
// used by the sine and cosine laws: side a is opposite vertex A, etc.
const A: [number, number] = [0, 0]
const B: [number, number] = [4, 0]
const C: [number, number] = [1.2, 2.8]

function mid(p: [number, number], q: [number, number]): [number, number] {
  return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
}

export default function TriangleLawsDiagram() {
  const midBC = mid(B, C)
  const midAC = mid(A, C)
  const midAB = mid(A, B)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.8 -3.2 5.6 3.7" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <path
          d={`M ${A[0]},${-A[1]} L ${B[0]},${-B[1]} L ${C[0]},${-C[1]} Z`}
          className="fill-accent/15 stroke-accent"
          strokeWidth={0.06}
        />

        <text x={A[0] - 0.35} y={-A[1] + 0.15} fontSize={0.34} className="fill-ink font-semibold">
          A
        </text>
        <text x={B[0] + 0.1} y={-B[1] + 0.15} fontSize={0.34} className="fill-ink font-semibold">
          B
        </text>
        <text x={C[0] - 0.05} y={-C[1] - 0.15} fontSize={0.34} className="fill-ink font-semibold">
          C
        </text>

        <text x={midBC[0] + 0.1} y={-midBC[1]} fontSize={0.32} className="fill-good">
          a
        </text>
        <text x={midAC[0] - 0.35} y={-midAC[1]} fontSize={0.32} className="fill-good">
          b
        </text>
        <text x={midAB[0] - 0.1} y={-midAB[1] + 0.35} fontSize={0.32} className="fill-good">
          c
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">Sivu on aina vastapäätä samannimistä kulmaa</p>
    </div>
  )
}
