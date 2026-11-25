import type { ReactNode } from 'react'

export type MenuSection = 'suositellut' | 'kurssit' | 'osaaminen' | 'arviointi'

interface TopMenuProps {
  active: MenuSection
  onSelect: (section: MenuSection) => void
  // Beside the tabs, on the right (the mini Osaaminen donut).
  extra?: ReactNode
}

const ITEMS: { id: MenuSection; label: string }[] = [
  { id: 'suositellut', label: 'Suositellut' },
  { id: 'kurssit', label: 'Kurssit' },
  { id: 'osaaminen', label: 'Osaaminen' },
]

export default function TopMenu({ active, onSelect, extra }: TopMenuProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-center gap-2 px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="flex gap-1 rounded-full bg-surface/90 p-1 shadow-md ring-1 ring-ink/5 backdrop-blur">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              active === item.id ? 'bg-accent text-white' : 'text-ink-dim'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {extra}
    </nav>
  )
}
