import { useState } from 'react'
import { COURSES } from '../data/courses'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import type { KnowledgeState, PollLevel } from '../data/knowledge'
import { getCourseThemes, type ThemeId } from '../data/themes'
import { ChevronRightIcon, XIcon } from './icons'
import CourseSetupView from './CourseSetupView'
import type { TopicCode } from '../types'

interface EsitiedotViewProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  polls: KnowledgeState['polls']
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
  onClose: () => void
}

// Full-screen sheet listing the courses; tapping one opens CourseSetupView
// where its lukio grade and pre-poll are filled in.
export default function EsitiedotView({
  courseGrades,
  onCourseGradeChange,
  polls,
  onPollChange,
  onClose,
}: EsitiedotViewProps) {
  const [selected, setSelected] = useState<TopicCode | null>(null)

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
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}
                  >
                    {course.code}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium text-ink">{course.name}</span>
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
