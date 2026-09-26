import { COURSES } from '../data/courses'
import { getCourseProgress, getOverallPct } from '../data/progress'
import { predictGrade, type FinnishGrade } from '../data/grade'

interface OsaaminenProps {
  engagedIds: Record<string, true>
}

const TIER_CLASSES: Record<FinnishGrade['tier'], { badge: string; text: string }> = {
  high: { badge: 'bg-good/15 text-good ring-good/30', text: 'text-good' },
  mid: { badge: 'bg-accent/15 text-accent ring-accent/30', text: 'text-accent' },
  low: { badge: 'bg-bad/15 text-bad ring-bad/30', text: 'text-bad' },
}

export default function Osaaminen({ engagedIds }: OsaaminenProps) {
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
          <span
            className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ring-2 ${tierClasses.badge}`}
          >
            {grade.letter}
          </span>
          <span className={`mt-3 text-base font-semibold ${tierClasses.text}`}>{grade.name}</span>
          <p className="mt-3 text-xs leading-relaxed text-ink-dim">
            Ennuste perustuu käytyihin tehtäviin, ei vielä oikeisiin vastauksiin.
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Kokonaisosaaminen</span>
            <span className="text-sm font-semibold text-ink-dim">{overallPct} %</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {COURSES.map((course) => {
            const { pct } = getCourseProgress(course.code, engagedIds)
            return (
              <div key={course.code} className="rounded-2xl border border-ink/10 bg-surface p-3 shadow-sm">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}
                  >
                    {course.code}
                  </span>
                  <span className="text-xs font-semibold text-ink-dim">{pct} %</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className={`h-full rounded-full ${course.barClass}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
