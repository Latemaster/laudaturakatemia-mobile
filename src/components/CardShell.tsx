import { useEffect, useRef, useState, type ReactNode } from 'react'
import { COURSE_MAP } from '../data/courses'
import type { Topic } from '../types'
import { ExpandIcon, XIcon } from './icons'

interface CardShellProps {
  topic: Topic
  children: ReactNode
}

const COLLAPSED_CLASSES = 'mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden'
const EXPANDED_CLASSES =
  'scrollbar-hide fixed inset-0 z-50 mx-auto w-full max-w-md overflow-y-auto overscroll-contain bg-page px-6 pb-10'

export default function CardShell({ topic, children }: CardShellProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    function checkOverflow() {
      if (!outer || !inner || isExpanded) return
      setIsOverflowing(inner.scrollHeight > outer.clientHeight + 1)
    }

    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [isExpanded])

  const badge = (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[topic.code].badgeClass}`}
    >
      {topic.code} · {topic.name}
    </span>
  )

  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      {!isExpanded && <div className="mb-4 mt-24">{badge}</div>}

      <div ref={outerRef} className={isExpanded ? EXPANDED_CLASSES : COLLAPSED_CLASSES}>
        {isExpanded && (
          <div className="sticky top-0 z-10 -mx-6 mb-4 flex items-center justify-between bg-page px-6 pb-4 pt-[calc(env(safe-area-inset-top)+1.5rem)]">
            {badge}
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Sulje"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-ink/10"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div ref={innerRef} className="flex flex-col">
          {children}
        </div>
      </div>

      {isOverflowing && !isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          aria-label="Näytä koko sisältö"
          className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink shadow-lg ring-1 ring-ink/10"
        >
          <ExpandIcon className="h-5 w-5" />
        </button>
      )}
    </section>
  )
}
