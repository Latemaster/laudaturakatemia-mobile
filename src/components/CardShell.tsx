import type { ReactNode } from 'react'
import { useLayout } from '../layout/LayoutContext'
import type { Topic } from '../types'

interface CardShellProps {
  topic: Topic
  // Kind label and title. On phones it sits above the content; on laptops
  // it moves into a left column so the card uses the panel's width instead
  // of being a tall, narrow strip in the middle.
  header?: ReactNode
  children: ReactNode
  // Phones: shown under the card, on the page (the swipe hint).
  below?: ReactNode
  // Phones: lights the whole card up as points come in (CardGlow).
  glow?: ReactNode
}

export default function CardShell({ topic, header, children, below, glow }: CardShellProps) {
  const { isDesktop } = useLayout()
  // The course in plain text, as the laptop Kurssit sidebar names it.
  const badge = (
    <span className="text-xs font-semibold text-ink-dim">
      {topic.code} · <span className="font-medium">{topic.name}</span>
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

  // Phones: everything sits in one white card, like the laptop exercise
  // box: the header (course, kind, title) above a line, the content in the
  // room left below it. The content never pushes the card past the screen;
  // what doesn't fit fades out under a "koko näytöllä" button.
  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-4 pb-4 pt-[calc(env(safe-area-inset-top)+6rem)]">
      <div className="relative mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-ink/5">
        <header className="shrink-0 border-b border-ink/10 px-5 pb-3 pt-4">
          <div className="mb-2">{badge}</div>
          {header}
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {glow}
      </div>
      {below}
    </section>
  )
}
