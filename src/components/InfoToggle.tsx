import { useId, useState, type ReactNode } from 'react'
import { InfoIcon, XIcon } from './icons'

interface InfoToggleProps {
  label: string
  children: ReactNode
  // Controlled open state, for a card that shows the explanation in place
  // of its contents (with `inline` off) rather than under the header.
  open?: boolean
  onOpenChange?: (open: boolean) => void
  // Off: only the button is rendered; the card renders InfoPanel itself.
  inline?: boolean
}

// The explanation panel's look, for cards that place it themselves.
export function InfoPanel({ id, className = '', children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <div
      id={id}
      className={`w-full rounded-xl bg-surface-2 p-3 text-left text-xs leading-relaxed text-ink-dim ${className}`}
    >
      {children}
    </div>
  )
}

// A small "i" button that reveals an explanation panel below it. The button
// and panel are rendered as siblings inside a flex-wrap row so the panel
// drops to a full-width line under whatever header the button sits in.
export default function InfoToggle({ label, children, open: openProp, onOpenChange, inline = true }: InfoToggleProps) {
  const [openState, setOpenState] = useState(false)
  const open = openProp ?? openState
  const panelId = useId()

  function toggle() {
    setOpenState(!open)
    onOpenChange?.(!open)
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? `Sulje: ${label}` : label}
        aria-expanded={open}
        aria-controls={inline ? panelId : undefined}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
          open ? 'bg-accent text-white' : 'text-ink-dim/70 ring-1 ring-ink/10 active:bg-ink/5'
        }`}
      >
        {open ? <XIcon className="h-3 w-3" /> : <InfoIcon className="h-4 w-4" />}
      </button>
      {inline && open && (
        <InfoPanel id={panelId} className="mt-3 basis-full">
          {children}
        </InfoPanel>
      )}
    </>
  )
}
