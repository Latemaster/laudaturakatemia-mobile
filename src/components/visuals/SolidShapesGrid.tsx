const SOLIDS = [
  { label: 'Pallo', shape: 'sphere' },
  { label: 'Kuutio', shape: 'cube' },
  { label: 'Lieriö', shape: 'cylinder' },
  { label: 'Kartio', shape: 'cone' },
] as const

export default function SolidShapesGrid() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 grid grid-cols-4 gap-2 rounded-xl bg-surface p-4">
        {SOLIDS.map(({ label, shape }) => (
          <div key={shape} className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 40 34" className="h-11 w-11">
              {shape === 'sphere' && (
                <>
                  <circle cx={20} cy={17} r={14} className="fill-accent/20 stroke-accent" strokeWidth={1.5} />
                  <ellipse cx={20} cy={17} rx={14} ry={5} fill="none" className="stroke-accent/50" strokeWidth={1} />
                </>
              )}
              {shape === 'cube' && (
                <>
                  <polygon points="8,12 24,12 24,28 8,28" className="fill-accent/20 stroke-accent" strokeWidth={1.5} />
                  <polygon points="8,12 14,6 30,6 24,12" className="fill-accent/30 stroke-accent" strokeWidth={1.5} />
                  <polygon points="24,12 30,6 30,22 24,28" className="fill-accent/10 stroke-accent" strokeWidth={1.5} />
                </>
              )}
              {shape === 'cylinder' && (
                <>
                  <rect x={6} y={9} width={28} height={16} className="fill-accent/20 stroke-accent" strokeWidth={1.5} />
                  <ellipse cx={20} cy={9} rx={14} ry={4} className="fill-accent/30 stroke-accent" strokeWidth={1.5} />
                  <path d="M 6,25 A 14,4 0 0 0 34,25" fill="none" className="stroke-accent" strokeWidth={1.5} />
                </>
              )}
              {shape === 'cone' && (
                <>
                  <polygon points="20,3 6,25 34,25" className="fill-accent/20 stroke-accent" strokeWidth={1.5} />
                  <ellipse cx={20} cy={25} rx={14} ry={4} className="fill-accent/30 stroke-accent" strokeWidth={1.5} />
                </>
              )}
            </svg>
            <span className="text-xs text-ink-dim">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-ink-dim">Avaruuskappaleet</p>
    </div>
  )
}
