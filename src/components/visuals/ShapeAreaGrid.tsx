const SHAPES = [
  { label: 'A = a²', shape: 'square' },
  { label: 'A = l·w', shape: 'rect' },
  { label: 'A = ½ah', shape: 'triangle' },
  { label: 'A = ½(a+b)h', shape: 'trapezoid' },
  { label: 'A = πr²', shape: 'circle' },
] as const

export default function ShapeAreaGrid() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 grid grid-cols-3 gap-3 rounded-xl bg-surface p-4">
        {SHAPES.map(({ label, shape }) => (
          <div key={shape} className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 40 30" className="h-10 w-14">
              {shape === 'square' && <rect x={10} y={2} width={20} height={20} className="fill-accent/20 stroke-accent" strokeWidth={1.5} />}
              {shape === 'rect' && <rect x={4} y={6} width={32} height={16} className="fill-accent/20 stroke-accent" strokeWidth={1.5} />}
              {shape === 'triangle' && (
                <polygon points="20,3 3,26 37,26" className="fill-accent/20 stroke-accent" strokeWidth={1.5} />
              )}
              {shape === 'trapezoid' && (
                <polygon points="12,4 28,4 36,26 4,26" className="fill-accent/20 stroke-accent" strokeWidth={1.5} />
              )}
              {shape === 'circle' && <circle cx={20} cy={15} r={13} className="fill-accent/20 stroke-accent" strokeWidth={1.5} />}
            </svg>
            <span className="font-mono text-xs text-ink-dim">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-dim">Tasokuvioiden pinta-alat</p>
    </div>
  )
}
