import { useId, useState, type ReactNode } from 'react'
import { InfoIcon, XIcon } from './icons'

interface InfoToggleProps {
  label: string
  children: ReactNode
}

// A small "i" button that reveals an explanation panel below it. The button
// and panel are rendered as siblings inside a flex-wrap row so the panel
// drops to a full-width line under whatever header the button sits in.
export default function InfoToggle({ label, children }: InfoToggleProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? `Sulje: ${label}` : label}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
          open ? 'bg-accent text-white' : 'text-ink-dim/70 ring-1 ring-ink/10 active:bg-ink/5'
        }`}
      >
        {open ? <XIcon className="h-3 w-3" /> : <InfoIcon className="h-4 w-4" />}
      </button>
      {open && (
        <div
          id={panelId}
          className="mt-3 w-full basis-full rounded-xl bg-surface-2 p-3 text-left text-xs leading-relaxed text-ink-dim"
        >
          {children}
        </div>
      )}
    </>
  )
}
