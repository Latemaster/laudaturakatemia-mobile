import { useState } from 'react'
import { formatAverage, getEarlyIndication, type CourseGrade, type CourseGrades } from '../data/courseGrades'
import type { FinnishGrade } from '../data/grade'
import EsitiedotView from './EsitiedotView'
import type { TopicCode } from '../types'

interface CourseGradesSectionProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  // The predicted grade; null before there is one.
  grade: FinnishGrade | null
  // How sure the prediction is, in words and their colour.
  label: string
  labelColor?: string
}

const TIER_BADGE: Record<FinnishGrade['tier'], string> = {
  high: 'bg-good/15 text-good ring-good/30',
  mid: 'bg-accent/15 text-accent ring-accent/30',
  low: 'bg-bad/15 text-bad ring-bad/30',
}

// The predicted grade with a summary of the course grades it starts from.
// The whole row opens EsitiedotView with the course list, the same pattern
// as the tavoitearvosana row.
export default function CourseGradesSection({
  courseGrades,
  onCourseGradeChange,
  grade,
  label,
  labelColor,
}: CourseGradesSectionProps) {
  const [open, setOpen] = useState(false)
  const { average, filled, total } = getEarlyIndication(courseGrades)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${label}${grade ? `, ${grade.letter}` : ''}. Muuta esitietoja`}
        data-onboarding="osaaminen-esitiedot"
        className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors hover:bg-accent/10 hover:ring-accent/30 active:ring-accent/40"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-2 ${
            grade ? TIER_BADGE[grade.tier] : 'bg-ink/5 text-ink-dim/60 ring-ink/10'
          }`}
        >
          {grade ? grade.letter : '–'}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={`text-[11px] font-semibold uppercase tracking-widest ${labelColor ? '' : 'text-ink-dim/70'}`}
            style={{ color: labelColor }}
          >
            {label}
          </span>
          <span className="text-sm font-semibold text-ink">
            {average !== null ? `Keskiarvo ${formatAverage(average)}` : 'Ei vielä arvosanoja'}
          </span>
          <span className="text-xs text-ink-dim">
            {filled}/{total} arvosanaa
          </span>
        </div>
      </button>

      {open && (
        <EsitiedotView
          courseGrades={courseGrades}
          onCourseGradeChange={onCourseGradeChange}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
