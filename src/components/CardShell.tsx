import type { ReactNode } from 'react'
import { COURSE_MAP } from '../data/courses'
import type { Topic } from '../types'

interface CardShellProps {
  topic: Topic
  children: ReactNode
}

export default function CardShell({ topic, children }: CardShellProps) {
  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      <span
        className={`mb-4 mt-24 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[topic.code].badgeClass}`}
      >
        {topic.code} · {topic.name}
      </span>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-y-auto overscroll-contain">
        {children}
      </div>
    </section>
  )
}
