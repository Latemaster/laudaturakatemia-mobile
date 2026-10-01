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
import { ChevronDownIcon } from './icons'
import InfoToggle from './InfoToggle'
import type { TopicCode } from '../types'

interface CourseGradesSectionProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
}

const TIER_BADGE: Record<FinnishGrade['tier'], string> = {
  high: 'bg-good/15 text-good ring-good/30',
  mid: 'bg-accent/15 text-accent ring-accent/30',
  low: 'bg-bad/15 text-bad ring-bad/30',
}

interface GradePickerProps {
  code: TopicCode
  value: CourseGrade | undefined
  onChange: (grade: CourseGrade | undefined) => void
}

// A row of 4..10 buttons. Tapping the selected grade again clears it, so
// a course can go back to "not filled in" without a separate control.
function GradePicker({ code, value, onChange }: GradePickerProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={`${code} kurssiarvosana`}>
      {COURSE_GRADES.map((grade) => {
        const selected = grade === value
        return (
          <button
            key={grade}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(selected ? undefined : grade)}
            className={`flex h-9 flex-1 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
              selected ? 'bg-accent text-white shadow-md' : 'bg-surface-2 text-ink-dim ring-1 ring-ink/10 active:bg-ink/5'
            }`}
          >
            {grade}
          </button>
        )
      })}
    </div>
  )
}

export default function CourseGradesSection({ courseGrades, onCourseGradeChange }: CourseGradesSectionProps) {
  const indication = getEarlyIndication(courseGrades)
  const { average } = indication
  const hasGrades = average !== null
  // Starts open until the student has filled something in; after that the
  // summary row carries the information and the pickers fold away.
  const [open, setOpen] = useState(!hasGrades)

  return (
    <section className="mb-6 rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
          Osaaminen esitiedot
        </span>
        <InfoToggle label="Mitä esitiedot tarkoittavat">
          <p className="mb-2">
            Kurssiarvosanat antavat varhaisen arvion osaamisesta jo ennen kuin tehtäviä on tehty. Täytä
            lukion kurssiarvosanasi asteikolla 4–10 niiltä kursseilta, jotka olet käynyt.
          </p>
          <p className="mb-2">
            Arvosanojen keskiarvo muunnetaan yo-arvosanaksi samalle pisteasteikolle kuin ennuste:
          </p>
          <ul className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
            {[...COURSE_GRADES].reverse().map((grade) => (
              <li key={grade}>
                <span className="font-semibold text-ink">{grade}</span> ≈ {COURSE_GRADE_LETTER[grade]}
              </li>
            ))}
          </ul>
          <p>Arvio tarkentuu, kun teet tehtäviä. Tyhjäksi jätetyt kurssit eivät vaikuta keskiarvoon.</p>
        </InfoToggle>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-2 ${
            hasGrades ? TIER_BADGE[indication.grade.tier] : 'bg-ink/5 text-ink-dim/60 ring-ink/10'
          }`}
        >
          {hasGrades ? indication.grade.letter : '–'}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
            Varhainen arvio
          </span>
          {average !== null ? (
            <>
              <span className="text-sm font-semibold text-ink">
                Keskiarvo {formatAverage(average)} · {indication.pct} %
              </span>
              <span className="text-xs text-ink-dim">
                {indication.filled} / {indication.total} kurssin arvosana täytetty
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-semibold text-ink">Ei vielä arvosanoja</span>
              <span className="text-xs text-ink-dim">Täytä kurssiarvosanasi alta</span>
            </>
          )}
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-ink-dim/70 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-ink/10 pt-3">
          {COURSES.map((course) => {
            const value = courseGrades[course.code]
            return (
              <div key={course.code} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex min-w-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}
                  >
                    <span className="shrink-0">{course.code}</span>
                    <span className="truncate font-medium">&nbsp;· {course.name}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink-dim">
                    {value === undefined ? 'ei arvosanaa' : `${value} ≈ ${COURSE_GRADE_LETTER[value]}`}
                  </span>
                </div>
                <GradePicker code={course.code} value={value} onChange={(grade) => onCourseGradeChange(course.code, grade)} />
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
