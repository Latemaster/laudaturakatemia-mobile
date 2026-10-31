import type { MenuSection } from '../components/TopMenu'

// The phone menu's four tabs plus the two site pages that only the laptop
// layout shows.
export type AppSection = MenuSection | 'etusivu' | 'mahdollistajat'

export type EtusivuPage = 'esittely' | 'tue'

export const ETUSIVU_PAGES: { id: EtusivuPage; label: string }[] = [
  { id: 'esittely', label: 'Esittely' },
  { id: 'tue', label: 'Tue projektia' },
]

export function isMenuSection(section: AppSection): section is MenuSection {
  return section !== 'etusivu' && section !== 'mahdollistajat'
}

// The laptop layout shows a sidebar only where there is something to pick.
export function hasSidebar(section: AppSection): boolean {
  return section === 'etusivu' || section === 'kurssit'
}
