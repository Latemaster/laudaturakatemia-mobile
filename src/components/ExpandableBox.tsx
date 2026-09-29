import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ExpandIcon, XIcon } from './icons'

interface ExpandableBoxProps {
  className?: string
  fadeClassName?: string
  // Where the expand button sits, relative to the box's top-right corner.
  buttonClassName?: string
  // How the collapsed box gets its height. 'fill' (default) stretches to
  // whatever room its flex-column parent leaves for it; 'natural' grows
  // with its content until the max height set in `className` (e.g.
  // max-h-40), so short content stays short and only long content is cut.
  sizing?: 'fill' | 'natural'
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
  children: ReactNode
}

const EXPANDED_HOST_CLASSES =
  'scrollbar-hide fixed inset-0 z-50 overflow-y-auto overflow-x-hidden overscroll-contain bg-surface px-6 pb-10 pt-[calc(env(safe-area-inset-top)+1.5rem)]'

export default function ExpandableBox({
  className = '',
  fadeClassName = 'from-surface',
  buttonClassName = 'right-3 top-3',
  sizing = 'fill',
  isExpanded,
  onExpandedChange,
  children,
}: ExpandableBoxProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [portalHost] = useState(() => document.createElement('div'))
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Reparent the same portal host between the box's own slot and document.body
  // (instead of swapping which tree renders the content) so the popup escapes
  // the scrolling feed - and everything else on the page - without ever
  // unmounting the box, which would reset its content's state.
  useLayoutEffect(() => {
    const collapsedClasses = sizing === 'fill' ? 'absolute inset-0 overflow-hidden' : 'relative overflow-hidden'
    portalHost.className = isExpanded ? EXPANDED_HOST_CLASSES : `${collapsedClasses} ${className}`
    const parent = isExpanded ? document.body : placeholderRef.current
    parent?.appendChild(portalHost)
    return () => {
      portalHost.remove()
    }
  }, [isExpanded, portalHost, className, sizing])

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    function checkOverflow() {
      if (!inner || isExpanded) return
      // The host's padding is part of its clientHeight but not of the
      // content's scrollHeight, so count it as space the content needs:
      // otherwise content that runs into the bottom padding gets clipped
      // without the button ever showing.
      const style = getComputedStyle(portalHost)
      const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      setIsOverflowing(inner.scrollHeight + padding > portalHost.clientHeight + 1)
    }

    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(portalHost)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [isExpanded, portalHost])

  return (
    <div ref={placeholderRef} className={sizing === 'fill' ? 'relative min-h-0 flex-1' : 'relative'}>
      {isOverflowing && !isExpanded && (
        <button
          type="button"
          onClick={() => onExpandedChange(true)}
          aria-label="Näytä koko sisältö"
          className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/10 backdrop-blur ${buttonClassName}`}
        >
          <ExpandIcon className="h-4 w-4" />
        </button>
      )}

      {createPortal(
        <>
          <div ref={innerRef} className="flex flex-col">
            {children}
          </div>
          {isOverflowing && !isExpanded && (
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t ${fadeClassName} to-transparent`}
            />
          )}
          {isExpanded && (
            <button
              type="button"
              onClick={() => onExpandedChange(false)}
              aria-label="Sulje"
              className="fixed right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-[60] flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-ink/10"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </>,
        portalHost,
      )}
    </div>
  )
}
