import { createPortal } from 'react-dom'
import { COURSES } from '../data/courses'
import { COURSE_GRADES, COURSE_GRADE_LETTER, type CourseGrade, type CourseGrades } from '../data/courseGrades'
import { XIcon } from './icons'
import type { TopicCode } from '../types'
import { useLayout } from '../layout/LayoutContext'

interface EsitiedotViewProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  onClose: () => void
}

// Full-screen sheet where the student sets their lukio course grades, one
// row of 4–10 per course. Theme-level knowledge comes from answering the
// exercises, so there is nothing else to fill in here.
//
// Portalled to <body> so it covers the whole app: opened from inside a feed
// card, it would otherwise sit under the top menu and the feed's buttons.
export default function EsitiedotView({ courseGrades, onCourseGradeChange, onClose }: EsitiedotViewProps) {
  const { isDesktop } = useLayout()
  const filled = COURSES.filter((course) => courseGrades[course.code] !== undefined).length

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="esitiedot-title"
      className={`grid-bg fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-page px-6 ${
        isDesktop ? 'py-10' : 'pb-10 pt-[calc(env(safe-area-inset-top)+1.25rem)]'
      }`}
    >
      <div className={`mx-auto w-full ${isDesktop ? 'max-w-2xl' : 'max-w-md'}`}>
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
        <p className="mb-6 text-sm text-ink-dim">
          Valitse lukion kurssiarvosanasi (4–10). Napauta valittua uudelleen tyhjentääksesi. Tehtävien
          vastaukset tarkentavat arviota.{' '}
          <span className="font-semibold text-ink">
            {filled}/{COURSES.length} täytetty
          </span>
        </p>

        <div className="rounded-3xl border border-ink/10 bg-surface px-5 pb-4 pt-1 shadow-sm">
          <ul className="flex flex-col divide-y divide-ink/5 border-b border-ink/5">
            {COURSES.map((course) => {
              const grade = courseGrades[course.code]
              return (
                <li key={course.code} className="py-3.5">
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-semibold text-ink">
                      {course.code} · <span className="font-medium">{course.name}</span>
                    </span>
                    <span className={`shrink-0 text-xs font-semibold ${grade === undefined ? 'text-ink-dim/70' : 'text-good'}`}>
                      {grade === undefined ? 'ei arvosanaa' : `≈ ${COURSE_GRADE_LETTER[grade]}`}
                    </span>
                  </div>
                  <div className="flex gap-1" role="radiogroup" aria-label={`${course.code} kurssiarvosana`}>
                    {COURSE_GRADES.map((option) => {
                      const selected = option === grade
                      return (
                        <button
                          key={option}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => onCourseGradeChange(course.code, selected ? undefined : option)}
                          className={`flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                            selected
                              ? 'bg-accent text-white shadow-md'
                              : 'bg-surface-2 text-ink-dim ring-1 ring-ink/10 hover:bg-accent/10 active:bg-ink/5'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={onClose} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Tallenna
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
