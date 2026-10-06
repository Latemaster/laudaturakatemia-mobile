import { useState } from 'react'
import { COURSE_MAP } from '../data/courses'
import { COURSE_GRADES, COURSE_GRADE_LETTER, type CourseGrade } from '../data/courseGrades'
import { POLL_OPTIONS, type KnowledgeState, type PollLevel } from '../data/knowledge'
import { getCourseThemes, type ThemeId } from '../data/themes'
import type { TopicCode } from '../types'
import ThemePollView from './ThemePollView'
import { ChevronRightIcon, XIcon } from './icons'

interface CourseSetupViewProps {
  code: TopicCode
  grade: CourseGrade | undefined
  onGradeChange: (grade: CourseGrade | undefined) => void
  polls: KnowledgeState['polls']
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
  onClose: () => void
}

// Full-screen sheet for one course's esitiedot: the lukio grade and the
// per-theme pre-poll. Opened from the course list in CourseGradesSection.
export default function CourseSetupView({ code, grade, onGradeChange, polls, onPollChange, onClose }: CourseSetupViewProps) {
  const course = COURSE_MAP[code]
  const themes = getCourseThemes(code)
  const answered = themes.filter((theme) => polls[theme.id] !== undefined).length
  const [pollStart, setPollStart] = useState<number | null>(null)

  // Where "continue" should land: the first unanswered theme.
  const firstOpen = Math.max(
    0,
    themes.findIndex((theme) => polls[theme.id] === undefined),
  )
  const pollLabel = answered === 0 ? 'Tee esikysely' : answered < themes.length ? 'Jatka esikyselyä' : 'Muokkaa vastauksia'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-setup-title"
      className="grid-bg fixed inset-0 z-40 overflow-y-auto bg-page px-6 pb-32 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}>
              {course.code}
            </span>
            <h1 id="course-setup-title" className="text-2xl font-bold leading-tight text-ink">
              {course.name}
            </h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-ink-dim">{course.description}</p>

        <section className="mb-4 rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">Kurssiarvosana</span>
            <span className="text-xs font-semibold text-ink-dim">
              {grade === undefined ? 'ei arvosanaa' : `${grade} ≈ ${COURSE_GRADE_LETTER[grade]}`}
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
                  onClick={() => onGradeChange(selected ? undefined : option)}
                  className={`flex h-11 flex-1 items-center justify-center rounded-xl text-base font-bold transition-colors ${
                    selected ? 'bg-accent text-white shadow-md' : 'bg-surface-2 text-ink-dim ring-1 ring-ink/10 active:bg-ink/5'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-dim">
            Lukion kurssiarvosana 4–10. Napauta valittua uudelleen tyhjentääksesi. Arvosanaa käytetään teeman
            lähtöarviona, kun esikyselyyn ei ole vastattu.
          </p>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">Esikysely</span>
            <span className={`text-xs font-semibold ${answered === themes.length ? 'text-good' : 'text-ink-dim'}`}>
              {answered}/{themes.length} teemaa vastattu
            </span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-ink-dim">
            Käy kurssin teemat läpi ja kerro jokaisesta, kuinka hyvin osaat sen. Vastaus on teeman osaamisarvion
            lähtökohta, ja tehtävien vastaukset tarkentavat sitä.
          </p>

          <button
            type="button"
            onClick={() => setPollStart(firstOpen)}
            className="mb-4 flex w-full items-center justify-center gap-1 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
          >
            {pollLabel}
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          <ul className="flex flex-col divide-y divide-ink/5">
            {themes.map((theme, index) => {
              const level = polls[theme.id]
              const option = level === undefined ? undefined : POLL_OPTIONS[level]
              return (
                <li key={theme.id}>
                  <button
                    type="button"
                    onClick={() => setPollStart(index)}
                    className="flex w-full items-center gap-3 py-2.5 text-left"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        option ? 'bg-accent/15 text-accent' : 'bg-ink/5 text-ink-dim/60'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium leading-snug text-ink">{theme.name}</span>
                      <span className={`text-xs ${option ? 'font-semibold text-accent' : 'text-ink-dim/70'}`}>
                        {option ? option.label : 'ei vastattu'}
                      </span>
                    </span>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-dim/50" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
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

      {pollStart !== null && (
        <ThemePollView
          code={code}
          startIndex={pollStart}
          polls={polls}
          onPollChange={onPollChange}
          onClose={() => setPollStart(null)}
        />
      )}
    </div>
  )
}
