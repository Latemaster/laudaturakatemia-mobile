interface ProgressDotsProps {
  total: number
  current: number
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-10 flex gap-1 px-4 pt-[calc(env(safe-area-inset-top)+3.5rem)]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
            i <= current ? 'bg-accent' : 'bg-ink/15'
          }`}
        />
      ))}
    </div>
  )
}
