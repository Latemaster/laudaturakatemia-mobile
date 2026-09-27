const SCALE = 1.6

// A small triangle and the same triangle scaled up, drawn side by side with
// matching angle marks to show that yhdenmuotoiset (similar) shapes keep
// their angles but not their size.
const BASE_TRIANGLE = [
  [0, 0],
  [2, 0],
  [0.6, 1.6],
] as const

function scale(points: readonly (readonly [number, number])[], factor: number, offsetX: number) {
  return points.map(([x, y]) => [x * factor + offsetX, y * factor] as const)
}

function toPath(points: readonly (readonly [number, number])[]) {
  return `M ${points.map(([x, y]) => `${x},${-y}`).join(' L ')} Z`
}

export default function SimilarTriangles() {
  const small = BASE_TRIANGLE
  const big = scale(BASE_TRIANGLE, SCALE, 4.5)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="-0.5 -3.2 11 3.6" className="mb-3 h-48 w-full overflow-hidden rounded-xl bg-surface">
        <path d={toPath(small)} className="fill-accent/20 stroke-accent" strokeWidth={0.06} />
        <path d={toPath(big)} className="fill-good/20 stroke-good" strokeWidth={0.06} />

        <text x={0.7} y={0.5} fontSize={0.4} className="fill-ink-dim">
          a
        </text>
        <text x={4.5 + 0.7 * SCALE} y={0.5} fontSize={0.4} className="fill-ink-dim">
          {(SCALE).toFixed(1)}a
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">
        Vastaavat kulmat yhtä suuret, sivujen suhde <span className="font-mono">1 : {SCALE.toFixed(1)}</span>
      </p>
    </div>
  )
}
