import { useState } from 'react'
import { COURSES } from '../data/courses'
import { getCourseProgress } from '../data/progress'
import type { TopicCode } from '../types'
import { COURSE_VIEWS, ETUSIVU_PAGES, type AppSection, type CourseView, type EtusivuPage } from './sections'

interface DesktopSidebarProps {
  section: AppSection
  etusivuPage: EtusivuPage
  onEtusivuPageChange: (page: EtusivuPage) => void
  selectedCourse: TopicCode
  courseView: CourseView
  onSelectCourseView: (code: TopicCode, view: CourseView) => void
  engagedIds: Record<string, true>
}

function itemClass(active: boolean) {
  return `w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
    active ? 'bg-surface text-accent shadow-sm ring-1 ring-ink/5' : 'text-ink hover:bg-surface/60'
  }`
}

// Left column of the laptop layout, like the laptop site's sidebar: the
// Etusivu sub-pages, or the courses, each opening to its learning goals,
// summary and exercises.
export default function DesktopSidebar({
  section,
  etusivuPage,
  onEtusivuPageChange,
  selectedCourse,
  courseView,
  onSelectCourseView,
  engagedIds,
}: DesktopSidebarProps) {
  const [openCourse, setOpenCourse] = useState<TopicCode | null>(selectedCourse)

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
            {COURSES.map((course) => {
              const { pct } = getCourseProgress(course.code, engagedIds)
              const open = openCourse === course.code
              return (
                <li key={course.code}>
                  <button
                    type="button"
                    onClick={() => setOpenCourse(open ? null : course.code)}
                    aria-expanded={open}
                    className={itemClass(open)}
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
                  {open && (
                    <ul className="mb-2 ml-4 mt-1 flex flex-col gap-0.5 border-l border-ink/10 pl-2">
                      {COURSE_VIEWS.map((view) => {
                        const active = selectedCourse === course.code && courseView === view.id
                        return (
                          <li key={view.id}>
                            <button
                              type="button"
                              onClick={() => onSelectCourseView(course.code, view.id)}
                              className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                                active ? 'font-semibold text-accent' : 'font-medium text-ink-dim hover:bg-surface/60 hover:text-ink'
                              }`}
                            >
                              {view.label}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </aside>
  )
}
