import type { ReactNode } from 'react'
import type { AppSection } from './sections'

interface DesktopTopBarProps {
  active: AppSection
  onSelect: (section: AppSection) => void
  // At the bar's right end (the mini Osaaminen donut).
  extra?: ReactNode
}

// Laptop navigation: the site's Etusivu and Mahdollistajat pages from the
// laptop site, followed by the same tabs the phone menu has.
const ITEMS: { id: AppSection; label: string }[] = [
  { id: 'etusivu', label: 'Etusivu' },
  { id: 'mahdollistajat', label: 'Mahdollistajat' },
  { id: 'suositellut', label: 'Suositellut' },
  { id: 'kurssit', label: 'Kurssit' },
  { id: 'osaaminen', label: 'Osaaminen' },
]

export default function DesktopTopBar({ active, onSelect, extra }: DesktopTopBarProps) {
  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-6 bg-[#6188bb] px-6 text-white shadow-md">
      <button
        type="button"
        onClick={() => onSelect('etusivu')}
        aria-label="Laudatur Akatemia – etusivu"
        className="h-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/30"
      >
        <img src="/brand/logo-grid.png" alt="Laudatur Akatemia" className="h-full w-auto" />
      </button>
      <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {ITEMS.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {/* Divider between the site pages and the study tabs. */}
            {index === 2 && <span aria-hidden className="mx-3 h-6 w-px bg-white/30" />}
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === item.id ? 'bg-white text-accent shadow-sm' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              {item.label}
            </button>
          </div>
        ))}
      </nav>
      {extra}
    </header>
  )
}
