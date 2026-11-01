import type { MenuSection } from '../components/TopMenu'

// The phone menu's tabs plus the two site pages that only the laptop
// layout shows.
export type AppSection = MenuSection | 'etusivu' | 'mahdollistajat'

export type EtusivuPage = 'esittely' | 'tue'

export const ETUSIVU_PAGES: { id: EtusivuPage; label: string }[] = [
  { id: 'esittely', label: 'Esittely' },
  { id: 'tue', label: 'Tue projektia' },
]

// What a course opens to in the laptop layout's Kurssit sidebar, as on the
// laptop site: its learning goals, its theory summary, or its exercises.
export type CourseView = 'tavoitteet' | 'tiivistelma' | 'tehtavat'

export const COURSE_VIEWS: { id: CourseView; label: string }[] = [
  { id: 'tavoitteet', label: 'Oppimistavoitteet' },
  { id: 'tiivistelma', label: 'Tiivistelmä' },
  { id: 'tehtavat', label: 'Tehtävät' },
]

export function isMenuSection(section: AppSection): section is MenuSection {
  return section !== 'etusivu' && section !== 'mahdollistajat'
}

// The laptop layout shows a sidebar only where there is something to pick.
export function hasSidebar(section: AppSection): boolean {
  return section === 'etusivu' || section === 'kurssit'
}
