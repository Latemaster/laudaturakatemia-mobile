import type { ReactNode } from 'react'
import type { Topic } from '../types'

const topicColors: Record<Topic, string> = {
  Derivaatta: 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-400/30',
  Trigonometria: 'bg-sky-500/15 text-sky-300 ring-sky-400/30',
  Integraalit: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  Sarjat: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
}

interface CardShellProps {
  topic: Topic
  children: ReactNode
}

export default function CardShell({ topic, children }: CardShellProps) {
  return (
    <section className="snap-card relative flex w-full flex-col justify-center bg-base px-6 pb-24 pt-[env(safe-area-inset-top)]">
      <span
        className={`absolute left-6 top-16 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${topicColors[topic]}`}
      >
        {topic}
      </span>
      <div className="mx-auto w-full max-w-md">{children}</div>
    </section>
  )
}
