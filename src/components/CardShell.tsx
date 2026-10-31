import type { ReactNode } from 'react'
import { COURSE_MAP } from '../data/courses'
import { useLayout } from '../layout/LayoutContext'
import type { Topic } from '../types'

interface CardShellProps {
  topic: Topic
  children: ReactNode
}

export default function CardShell({ topic, children }: CardShellProps) {
  const { isDesktop } = useLayout()
  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      <div className={`flex ${isDesktop ? 'mx-auto mb-4 mt-12 w-full max-w-2xl' : 'mb-4 mt-24'}`}>
        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[topic.code].badgeClass}`}
        >
          {topic.code} · {topic.name}
        </span>
      </div>
      <div className={`mx-auto flex w-full flex-1 flex-col overflow-hidden ${isDesktop ? 'max-w-2xl' : 'max-w-md'}`}>
        {children}
      </div>
    </section>
  )
}
