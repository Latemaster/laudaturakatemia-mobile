import type { ReactNode } from 'react'
import type { Topic, TopicCode } from '../types'

const topicColors: Record<TopicCode, string> = {
  MAA6: 'bg-topic-maa6/15 text-topic-maa6 ring-topic-maa6/30',
  MAA5: 'bg-topic-maa5/15 text-topic-maa5 ring-topic-maa5/30',
  MAA7: 'bg-topic-maa7/15 text-topic-maa7 ring-topic-maa7/30',
}

interface CardShellProps {
  topic: Topic
  children: ReactNode
}

export default function CardShell({ topic, children }: CardShellProps) {
  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      <span
        className={`mb-4 mt-16 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${topicColors[topic.code]}`}
      >
        {topic.code} · {topic.name}
      </span>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </div>
    </section>
  )
}
