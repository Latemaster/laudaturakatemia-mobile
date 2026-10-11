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
import { POLL_OPTIONS, type KnowledgeState, type PollLevel } from '../data/knowledge'
import { THEMES, type ThemeId } from '../data/themes'
import { ChevronRightIcon } from './icons'
import EsitiedotView from './EsitiedotView'
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
// Shows a summary; "Muuta" opens EsitiedotView with the course list, the
// same pattern as the tavoitearvosana row.
export default function CourseGradesSection({
  courseGrades,
  onCourseGradeChange,
  polls,
  onPollChange,
}: CourseGradesSectionProps) {
  const [open, setOpen] = useState(false)
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
            Esitiedot antavat arvion osaamisesta jo ennen kuin tehtäviä on tehty. Valitse Muuta, avaa kurssi ja
            täytä lukion kurssiarvosanasi (4–10) sekä esikysely, jossa kerrot jokaisesta kurssin teemasta, kuinka
            hyvin osaat sen.
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

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-surface-2 p-3 text-left ring-1 ring-transparent transition-colors active:ring-accent/40"
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
            {indication.filled}/{indication.total} arvosanaa · esikysely {answeredThemes}/{THEMES.length} teemaa
          </span>
        </div>
        <span className="flex items-center gap-0.5 text-xs font-semibold text-accent">
          Muuta
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <EsitiedotView
          courseGrades={courseGrades}
          onCourseGradeChange={onCourseGradeChange}
          polls={polls}
          onPollChange={onPollChange}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  )
}
