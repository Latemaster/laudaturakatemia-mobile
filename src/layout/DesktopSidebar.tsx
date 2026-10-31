import { COURSES } from '../data/courses'
import { getCourseProgress } from '../data/progress'
import type { TopicCode } from '../types'
import { ETUSIVU_PAGES, type AppSection, type EtusivuPage } from './sections'

interface DesktopSidebarProps {
  section: AppSection
  etusivuPage: EtusivuPage
  onEtusivuPageChange: (page: EtusivuPage) => void
  selectedCourse: TopicCode | null
  onSelectCourse: (code: TopicCode | null) => void
  engagedIds: Record<string, true>
}

function itemClass(active: boolean) {
  return `w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
    active ? 'bg-surface text-accent shadow-sm ring-1 ring-ink/5' : 'text-ink hover:bg-surface/60'
  }`
}

// Left column of the laptop layout, like the laptop site's sidebar: the
// Etusivu sub-pages, or the course list so switching course is one click.
export default function DesktopSidebar({
  section,
  etusivuPage,
  onEtusivuPageChange,
  selectedCourse,
  onSelectCourse,
  engagedIds,
}: DesktopSidebarProps) {
  return (
    <aside className="scrollbar-hide w-72 shrink-0 overflow-y-auto border-r border-ink/10 bg-page px-4 py-6">
      {section === 'etusivu' && (
        <>
          <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-ink-dim/80">Etusivu</h2>
          <ul className="flex flex-col gap-1">
            {ETUSIVU_PAGES.map((page) => (
              <li key={page.id}>
                <button type="button" onClick={() => onEtusivuPageChange(page.id)} className={itemClass(etusivuPage === page.id)}>
                  {page.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {section === 'kurssit' && (
        <>
          <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-ink-dim/80">Kurssit</h2>
          <ul className="flex flex-col gap-1">
            <li>
              <button type="button" onClick={() => onSelectCourse(null)} className={itemClass(selectedCourse === null)}>
                Kaikki kurssit
              </button>
            </li>
            {COURSES.map((course) => {
              const { pct } = getCourseProgress(course.code, engagedIds)
              return (
                <li key={course.code}>
                  <button
                    type="button"
                    onClick={() => onSelectCourse(course.code)}
                    className={itemClass(selectedCourse === course.code)}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate">
                        {course.code} · <span className="font-medium">{course.name}</span>
                      </span>
                      <span className="shrink-0 text-xs text-ink-dim">{pct} %</span>
                    </span>
                    <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-ink/10">
                      <span className={`block h-full rounded-full ${course.barClass}`} style={{ width: `${pct}%` }} />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </aside>
  )
}
