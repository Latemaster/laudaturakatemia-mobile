export type MenuSection = 'suositellut' | 'kurssit' | 'osaaminen'

interface TopMenuProps {
  active: MenuSection
  onSelect: (section: MenuSection) => void
}

const ITEMS: { id: MenuSection; label: string }[] = [
  { id: 'suositellut', label: 'Suositellut' },
  { id: 'kurssit', label: 'Kurssit' },
  { id: 'osaaminen', label: 'Osaaminen' },
]

export default function TopMenu({ active, onSelect }: TopMenuProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      <div className="flex gap-1 rounded-full bg-surface/90 p-1 shadow-md ring-1 ring-ink/5 backdrop-blur">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              active === item.id ? 'bg-accent text-white' : 'text-ink-dim'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
