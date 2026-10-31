import type { ReactNode } from 'react'
import { useLayout } from '../layout/LayoutContext'

interface PageContainerProps {
  children: ReactNode
  // Content column width on laptops; phones always use the narrow column.
  wide?: boolean
}

// The scrolling grid-paper page used by Kurssit, Osaaminen and Arviointi.
// On phones it fills the screen below the floating menu; on laptops it
// fills the framed content panel, which paints its own background.
export default function PageContainer({ children, wide = false }: PageContainerProps) {
  const { isDesktop } = useLayout()
  if (isDesktop) {
    return (
      <div className="h-full overflow-y-auto px-10 pb-12 pt-8">
        <div className={`mx-auto w-full ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}>{children}</div>
      </div>
    )
  }
  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  )
}
