import { useState } from 'react'
import {
  COURSE_GRADES,
  COURSE_GRADE_LETTER,
  formatAverage,
  getEarlyIndication,
  type CourseGrade,
  type CourseGrades,
} from '../data/courseGrades'
import type { FinnishGrade } from '../data/grade'
import EsitiedotView from './EsitiedotView'
import InfoToggle, { InfoPanel } from './InfoToggle'
import { useLayout } from '../layout/LayoutContext'
import type { TopicCode } from '../types'

interface CourseGradesSectionProps {
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
  // The explanation's open state, held by the page: on laptops it replaces
  // the section's contents and grows into the chart's room.
  infoOpen?: boolean
  onInfoOpenChange?: (open: boolean) => void
}

const TIER_BADGE: Record<FinnishGrade['tier'], string> = {
  high: 'bg-good/15 text-good ring-good/30',
  mid: 'bg-accent/15 text-accent ring-accent/30',
  low: 'bg-bad/15 text-bad ring-bad/30',
}

// "Osaaminen esitiedot": the student's lukio course grades.
// Shows a summary; the whole row opens EsitiedotView with the course list,
// the same pattern as the tavoitearvosana row.
export default function CourseGradesSection({
  courseGrades,
  onCourseGradeChange,
  infoOpen = false,
  onInfoOpenChange,
}: CourseGradesSectionProps) {
  const { isDesktop } = useLayout()
  const [open, setOpen] = useState(false)
  const indication = getEarlyIndication(courseGrades)
  const { average } = indication
  const hasGrades = average !== null
  const infoInPlace = isDesktop && infoOpen

  const info = (
    <>
      <p className="mb-2">
        Esitiedot antavat arvion osaamisesta jo ennen kuin tehtäviä on tehty. Napauta korttia ja täytä lukion
        kurssiarvosanasi (4–10).
      </p>
      <p className="mb-2">Arvosanojen keskiarvo muunnetaan yo-arvosanaksi samalle pisteasteikolle kuin ennuste:</p>
      <ul className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
        {[...COURSE_GRADES].reverse().map((grade) => (
          <li key={grade}>
            <span className="font-semibold text-ink">{grade}</span> ≈ {COURSE_GRADE_LETTER[grade]}
          </li>
        ))}
      </ul>
      <p>
        Kurssiarvosana on kurssin teemojen lähtöarvio, ja tehtävien vastaukset tarkentavat sitä. Tyhjäksi jätetyt kurssit eivät
        vaikuta keskiarvoon.
      </p>
    </>
  )

  return (
    <section
      className={`mb-6 rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm ${
        infoInPlace ? 'flex min-h-0 flex-1 flex-col' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
          Osaaminen esitiedot
        </span>
        <InfoToggle
          label="Mitä esitiedot tarkoittavat"
          open={infoOpen}
          onOpenChange={onInfoOpenChange}
          inline={!isDesktop}
        >
          {info}
        </InfoToggle>
      </div>

      {infoInPlace ? (
        <InfoPanel className="mt-3 min-h-0 flex-1 overflow-y-auto">{info}</InfoPanel>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Muuta esitietoja"
          data-onboarding="osaaminen-esitiedot"
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors hover:bg-accent/10 hover:ring-accent/30 active:ring-accent/40"
        >
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
              {indication.filled}/{indication.total} arvosanaa
            </span>
          </div>
        </button>
      )}

      {open && (
        <EsitiedotView
          courseGrades={courseGrades}
          onCourseGradeChange={onCourseGradeChange}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  )
}
