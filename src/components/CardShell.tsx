import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { COURSE_MAP } from '../data/courses'
import type { Topic } from '../types'
import { ExpandIcon, XIcon } from './icons'

interface CardShellProps {
  topic: Topic
  children: ReactNode
}

const COLLAPSED_HOST_CLASSES = 'absolute inset-0 flex flex-col overflow-hidden'
const EXPANDED_HOST_CLASSES =
  'scrollbar-hide fixed inset-0 z-50 flex flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-page'

export default function CardShell({ topic, children }: CardShellProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [portalHost] = useState(() => document.createElement('div'))
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Reparent the same portal host between the card's own slot and document.body
  // (instead of swapping which tree renders the content) so the popup escapes
  // the scrolling feed - and any stacking context it creates - without ever
  // unmounting the card, which would reset its state.
  useLayoutEffect(() => {
    portalHost.className = isExpanded ? EXPANDED_HOST_CLASSES : COLLAPSED_HOST_CLASSES
    const parent = isExpanded ? document.body : placeholderRef.current
    parent?.appendChild(portalHost)
    return () => {
      portalHost.remove()
    }
  }, [isExpanded, portalHost])

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    function checkOverflow() {
      if (!inner || isExpanded) return
      setIsOverflowing(inner.scrollHeight > portalHost.clientHeight + 1)
    }

    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(portalHost)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [isExpanded, portalHost])

  const badge = (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[topic.code].badgeClass}`}
    >
      {topic.code} · {topic.name}
    </span>
  )

  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      {!isExpanded && (
        <div className="mb-4 mt-24 flex items-start justify-between gap-3">
          {badge}
          {isOverflowing && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              aria-label="Näytä koko sisältö"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-lg ring-1 ring-ink/10"
            >
              <ExpandIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      <div ref={placeholderRef} className="relative mx-auto w-full max-w-md flex-1" />

      {createPortal(
        <div className={`mx-auto flex w-full max-w-md flex-1 flex-col ${isExpanded ? 'px-6 pb-10' : ''}`}>
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
        </div>,
        portalHost,
      )}
    </section>
  )
}
