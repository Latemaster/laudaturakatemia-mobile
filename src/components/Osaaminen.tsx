import { useState } from 'react'
import { COURSES } from '../data/courses'
import { getCourseDifficultyBreakdown, getCourseProgress, getOverallPct, type Difficulty } from '../data/progress'
import { predictGrade, type FinnishGrade } from '../data/grade'
import { ChevronDownIcon } from './icons'
import ProgressChart from './ProgressChart'
import type { TopicCode } from '../types'

interface OsaaminenProps {
  engagedIds: Record<string, true>
}

const TIER_CLASSES: Record<FinnishGrade['tier'], { badge: string; text: string; stroke: string }> = {
  high: { badge: 'bg-good/15 text-good ring-good/30', text: 'text-good', stroke: 'stroke-good' },
  mid: { badge: 'bg-accent/15 text-accent ring-accent/30', text: 'text-accent', stroke: 'stroke-accent' },
  low: { badge: 'bg-bad/15 text-bad ring-bad/30', text: 'text-bad', stroke: 'stroke-bad' },
}

const DIFFICULTY_LABELS: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Helpot' },
  { key: 'mid', label: 'Keskivaikeat' },
  { key: 'hard', label: 'Vaikeat' },
]

const DONUT_SIZE = 104
const DONUT_STROKE = 8
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS

function GradeDonut({ pct, grade }: { pct: number; grade: FinnishGrade }) {
  const tierClasses = TIER_CLASSES[grade.tier]
  const offset = DONUT_CIRCUMFERENCE * (1 - pct / 100)

  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
      <svg width={DONUT_SIZE} height={DONUT_SIZE} className="-rotate-90">
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          strokeWidth={DONUT_STROKE}
          className="fill-none stroke-ink/10"
        />
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          strokeWidth={DONUT_STROKE}
          strokeDasharray={DONUT_CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none transition-all duration-500 ${tierClasses.stroke}`}
        />
      </svg>
      <span
        className={`absolute flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ring-2 ${tierClasses.badge}`}
      >
        {grade.letter}
      </span>
    </div>
  )
}

export default function Osaaminen({ engagedIds }: OsaaminenProps) {
  const [expandedCourse, setExpandedCourse] = useState<TopicCode | null>(null)
  const overallPct = getOverallPct(engagedIds)
  const grade = predictGrade(overallPct)
  const tierClasses = TIER_CLASSES[grade.tier]

  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Osaaminen</h1>
        <p className="mb-6 text-sm text-ink-dim">Ennuste ja edistyminen tällä istunnolla.</p>

        <div className="mb-6 flex flex-col items-center rounded-3xl border border-ink/10 bg-surface p-6 text-center shadow-sm">
          <span className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
            Ennustettu arvosana
          </span>
          <GradeDonut pct={overallPct} grade={grade} />
          <span className={`mt-3 text-base font-semibold ${tierClasses.text}`}>{grade.name}</span>
          <span className="mt-1 text-sm font-semibold text-ink-dim">{overallPct} % kokonaisosaaminen</span>
          <p className="mt-3 text-xs leading-relaxed text-ink-dim">
            Ennuste perustuu käytyihin tehtäviin, ei vielä oikeisiin vastauksiin.
          </p>
        </div>

        <ProgressChart />

        <div className="flex flex-col gap-3">
          {COURSES.map((course) => {
            const { pct } = getCourseProgress(course.code, engagedIds)
            const isExpanded = expandedCourse === course.code
            const breakdown = getCourseDifficultyBreakdown(course.code, engagedIds)

            return (
              <div key={course.code} className="rounded-2xl border border-ink/10 bg-surface p-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpandedCourse(isExpanded ? null : course.code)}
                  className="flex w-full flex-col gap-1.5 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}
                    >
                      {course.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-ink-dim">{pct} %</span>
                      <ChevronDownIcon
                        className={`h-3.5 w-3.5 text-ink-dim/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div className={`h-full rounded-full ${course.barClass}`} style={{ width: `${pct}%` }} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3">
                    {DIFFICULTY_LABELS.map(({ key, label }) => {
                      const { engaged, total } = breakdown[key]
                      const tierPct = total > 0 ? Math.round((engaged / total) * 100) : 0
                      return (
                        <div key={key}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-ink-dim">{label}</span>
                            <span className="font-semibold text-ink-dim">
                              {engaged}/{total} pistettä
                            </span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
                            <div
                              className={`h-full rounded-full ${course.barClass}`}
                              style={{ width: `${tierPct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
