// Points earned out of the points the course offers, the percentage at the
// bar's end.
export default function CourseProgressBar({ pct, thin = false }: { pct: number; thin?: boolean }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <span className={`block min-w-0 flex-1 overflow-hidden rounded-full bg-ink/10 ${thin ? 'h-1' : 'h-1.5'}`}>
        <span className="block h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </span>
      <span className="min-w-[2.25rem] shrink-0 whitespace-nowrap text-right text-xs font-semibold leading-none text-ink-dim">{pct} %</span>
    </span>
  )
}
