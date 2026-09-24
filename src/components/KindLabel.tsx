import type { ReactNode } from 'react'

interface KindLabelProps {
  icon: ReactNode
  label: string
}

export default function KindLabel({ icon, label }: KindLabelProps) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-ink-dim/70">
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
    </div>
  )
}
