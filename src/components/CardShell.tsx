import type { ReactNode } from 'react'
import { COURSE_MAP } from '../data/courses'
import { useLayout } from '../layout/LayoutContext'
import type { Topic } from '../types'

interface CardShellProps {
  topic: Topic
  // Kind label and title. On phones it sits above the content; on laptops
  // it moves into a left column so the card uses the panel's width instead
  // of being a tall, narrow strip in the middle.
  header?: ReactNode
  children: ReactNode
}

export default function CardShell({ topic, header, children }: CardShellProps) {
  const { isDesktop } = useLayout()
  const badge = (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[topic.code].badgeClass}`}
    >
      {topic.code} · {topic.name}
    </span>
  )

  if (isDesktop) {
    return (
      <section className="snap-card relative flex w-full items-center justify-center px-10 py-8">
        <div className="flex w-full max-w-6xl items-center gap-10">
          <div className="w-[34%] shrink-0">
            <div className="mb-4">{badge}</div>
            {header}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      <div className="mb-4 mt-24 flex">{badge}</div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden">
        {header}
        {children}
      </div>
    </section>
  )
}
