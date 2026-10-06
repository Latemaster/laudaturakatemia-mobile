import { useState } from 'react'
import { COURSES } from '../data/courses'
import {
  COURSE_GRADES,
  COURSE_GRADE_LETTER,
  formatAverage,
  getEarlyIndication,
  type CourseGrade,
  type CourseGrades,
} from '../data/courseGrades'
import type { FinnishGrade } from '../data/grade'
import { POLL_OPTIONS, type KnowledgeState, type PollLevel } from '../data/knowledge'
import { THEMES, getCourseThemes, type ThemeId } from '../data/themes'
import { ChevronRightIcon } from './icons'
import CourseSetupView from './CourseSetupView'
import InfoToggle from './InfoToggle'
import type { TopicCode } from '../types'

interface CourseGradesSectionProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  polls: KnowledgeState['polls']
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
}

const TIER_BADGE: Record<FinnishGrade['tier'], string> = {
  high: 'bg-good/15 text-good ring-good/30',
  mid: 'bg-accent/15 text-accent ring-accent/30',
  low: 'bg-bad/15 text-bad ring-bad/30',
}

// "Osaaminen esitiedot": the student's lukio grades and pre-poll answers.
// Shows one row per course; tapping a course opens CourseSetupView where
// both are filled in.
export default function CourseGradesSection({
  courseGrades,
  onCourseGradeChange,
  polls,
  onPollChange,
}: CourseGradesSectionProps) {
  const [selected, setSelected] = useState<TopicCode | null>(null)
  const indication = getEarlyIndication(courseGrades)
  const { average } = indication
  const hasGrades = average !== null
  const answeredThemes = THEMES.filter((theme) => polls[theme.id] !== undefined).length

  return (
    <section className="mb-6 rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
          Osaaminen esitiedot
        </span>
        <InfoToggle label="Mitä esitiedot tarkoittavat">
          <p className="mb-2">
            Esitiedot antavat arvion osaamisesta jo ennen kuin tehtäviä on tehty. Avaa kurssi ja täytä lukion
            kurssiarvosanasi (4–10) sekä esikysely, jossa kerrot jokaisesta kurssin teemasta, kuinka hyvin osaat
            sen.
          </p>
          <p className="mb-2">Arvosanojen keskiarvo muunnetaan yo-arvosanaksi samalle pisteasteikolle kuin ennuste:</p>
          <ul className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
            {[...COURSE_GRADES].reverse().map((grade) => (
              <li key={grade}>
                <span className="font-semibold text-ink">{grade}</span> ≈ {COURSE_GRADE_LETTER[grade]}
              </li>
            ))}
          </ul>
          <p className="mb-2">
            Esikyselyn vastaus on teeman osaamisarvion lähtökohta ja painaa yhtä paljon kuin kaksi pikatehtävää.
            Tehtävien vastaukset tarkentavat sitä.
          </p>
          <ul className="mb-2 flex flex-col gap-1">
            {POLL_OPTIONS.map((option) => (
              <li key={option.level}>
                <span className="font-semibold text-ink">{option.label}</span> = {Math.round(option.prior * 100)} %
                {' · '}
                {option.description}
              </li>
            ))}
          </ul>
          <p>
            Jos teemaan ei ole vastattu, lähtökohtana käytetään kurssiarvosanaa. Tyhjäksi jätetyt kurssit eivät
            vaikuta keskiarvoon.
          </p>
        </InfoToggle>
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-2 ${
            hasGrades ? TIER_BADGE[indication.grade.tier] : 'bg-ink/5 text-ink-dim/60 ring-ink/10'
          }`}
        >
          {hasGrades ? indication.grade.letter : '–'}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">Varhainen arvio</span>
          <span className="text-sm font-semibold text-ink">
            {average !== null ? `Keskiarvo ${formatAverage(average)} · ${indication.pct} %` : 'Ei vielä arvosanoja'}
          </span>
          <span className="text-xs text-ink-dim">
            {indication.filled}/{indication.total} arvosanaa · esikysely {answeredThemes}/{THEMES.length} teemaa
          </span>
        </div>
      </div>

      <p className="mb-2 mt-4 text-xs text-ink-dim">Avaa kurssi täyttääksesi arvosanan ja esikyselyn.</p>
      <ul className="flex flex-col divide-y divide-ink/5">
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
    </section>
  )
}
