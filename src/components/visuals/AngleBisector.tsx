// Fixed triangle A(0,0), B(4,0), C(1,3) with the angle bisector from A,
// which (by the angle bisector theorem) meets BC at D and splits angle
// BAC into two equal halves - marked here with matching arcs.
const A: [number, number] = [0, 0]
const B: [number, number] = [4, 0]
const C: [number, number] = [1, 3]
const D: [number, number] = [2.324, 1.676]

function toSvg([x, y]: [number, number]) {
  return `${x},${-y}`
}

export default function AngleBisector() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -3.3 5 3.6" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <path d={`M ${toSvg(A)} L ${toSvg(B)} L ${toSvg(C)} Z`} fill="none" className="stroke-ink/60" strokeWidth={0.06} />
        <line x1={A[0]} y1={-A[1]} x2={D[0]} y2={-D[1]} className="stroke-accent" strokeWidth={0.06} />

        <path d="M 0.8,0 A 0.8,0.8 0 0 0 0.598,-0.593" fill="none" className="stroke-good" strokeWidth={0.06} />
        <path d="M 0.598,-0.593 A 0.8,0.8 0 0 0 0.253,-0.759" fill="none" className="stroke-good" strokeWidth={0.06} />

        <text x={-0.35} y={0.4} fontSize={0.4} className="fill-ink font-semibold">
          A
        </text>
        <text x={4.1} y={0.4} fontSize={0.4} className="fill-ink font-semibold">
          B
        </text>
        <text x={0.95} y={-3.15} fontSize={0.4} className="fill-ink font-semibold">
          C
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">Kulmanpuolittaja jakaa kulman kahteen yhtä suureen osaan</p>
    </div>
  )
}
