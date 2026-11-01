import { useState } from 'react'
import { COURSES } from '../data/courses'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import type { KnowledgeState, PollLevel } from '../data/knowledge'
import { getCourseThemes, type ThemeId } from '../data/themes'
import { ChevronRightIcon, XIcon } from './icons'
import CourseSetupView from './CourseSetupView'
import type { TopicCode } from '../types'
import { useLayout } from '../layout/LayoutContext'

interface EsitiedotViewProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  polls: KnowledgeState['polls']
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
  onClose: () => void
}

// Full-screen sheet listing the courses; tapping one opens CourseSetupView
// where its lukio grade and pre-poll are filled in (beside the list, on
// laptops).
export default function EsitiedotView({
  courseGrades,
  onCourseGradeChange,
  polls,
  onPollChange,
  onClose,
}: EsitiedotViewProps) {
  const { isDesktop } = useLayout()
  // Laptops always show a course beside the list, the first one to start.
  const [selected, setSelected] = useState<TopicCode | null>(isDesktop ? COURSES[0].code : null)

  const courseList = (
    <ul className="flex flex-col divide-y divide-ink/5 rounded-3xl border border-ink/10 bg-surface px-5 py-1 shadow-sm">
      {COURSES.map((course) => {
        const grade = courseGrades[course.code]
        const themes = getCourseThemes(course.code)
        const answered = themes.filter((theme) => polls[theme.id] !== undefined).length
        const complete = grade !== undefined && answered === themes.length
        return (
          <li key={course.code}>
            <button
              type="button"
              onClick={() => setSelected(course.code)}
              className="flex w-full items-center gap-3 py-2.5 text-left active:bg-ink/5"
            >
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-ink">
                  {course.code} · <span className="font-medium">{course.name}</span>
                </span>
                <span className={`truncate text-xs ${complete ? 'text-good' : 'text-ink-dim'}`}>
                  {grade === undefined ? 'Ei arvosanaa' : `Arvosana ${grade}`}
                  {' · '}esikysely {answered}/{themes.length}
                </span>
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-dim/50" />
            </button>
          </li>
        )
      })}
    </ul>
  )

  // Laptops: the courses in a sidebar like the Kurssit one, and the
  // selected course's grade and pre-poll beside it, with Valmis in the
  // header.
  if (isDesktop && selected) {
    return (
      <div role="dialog" aria-modal="true" aria-labelledby="esitiedot-title" className="fixed inset-0 z-40 flex bg-page">
        <aside className="scrollbar-hide w-72 shrink-0 overflow-y-auto border-r border-ink/10 bg-page px-4 py-6">
          <h2 className="mb-3 pl-3 text-xs font-semibold uppercase tracking-widest text-ink-dim/80">Kurssit</h2>
          <ul className="flex flex-col gap-1">
            {COURSES.map((course) => {
              const grade = courseGrades[course.code]
              const themes = getCourseThemes(course.code)
              const answered = themes.filter((theme) => polls[theme.id] !== undefined).length
              const complete = grade !== undefined && answered === themes.length
              const current = course.code === selected
              return (
                <li key={course.code}>
                  <button
                    type="button"
                    onClick={() => setSelected(course.code)}
                    aria-current={current || undefined}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                      current ? 'bg-surface text-accent shadow-sm ring-1 ring-ink/5' : 'text-ink hover:bg-surface/60'
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate">
                        {course.code} · <span className="font-medium">{course.name}</span>
                      </span>
                      <span className="shrink-0 text-xs text-ink-dim">{grade ?? '–'}</span>
                    </span>
                    <span className={`mt-0.5 block text-xs font-medium ${complete ? 'text-good' : 'text-ink-dim'}`}>
                      Esikysely {answered}/{themes.length}
                    </span>
                    <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-ink/10">
                      <span
                        className={`block h-full rounded-full ${course.barClass}`}
                        style={{ width: `${(answered / themes.length) * 100}%` }}
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="grid-bg flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-start justify-between gap-4 px-10 pb-4 pt-6">
            <div>
              <h1 id="esitiedot-title" className="text-2xl font-bold text-ink">
                Esitiedot
              </h1>
              <p className="mt-1 text-sm text-ink-dim">Valitse kurssi ja täytä sen arvosana ja esikysely.</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              >
                Valmis
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Sulje"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mx-10 mb-6 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-3xl bg-surface/55 p-5 ring-1 ring-ink/5">
            <CourseSetupView
              key={selected}
              code={selected}
              grade={courseGrades[selected]}
              onGradeChange={(grade) => onCourseGradeChange(selected, grade)}
              polls={polls}
              onPollChange={onPollChange}
              onClose={onClose}
              embedded
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="esitiedot-title"
      className="grid-bg fixed inset-0 z-40 overflow-y-auto bg-page px-6 pb-32 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h1 id="esitiedot-title" className="text-2xl font-bold text-ink">
            Esitiedot
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-ink-dim">Avaa kurssi täyttääksesi arvosanan ja esikyselyn.</p>

        {courseList}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-page via-page/90 to-transparent px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-8">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex w-full max-w-md items-center justify-center rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
        >
          Valmis
        </button>
      </div>

      {selected && (
        <CourseSetupView
          code={selected}
          grade={courseGrades[selected]}
          onGradeChange={(grade) => onCourseGradeChange(selected, grade)}
          polls={polls}
          onPollChange={onPollChange}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
