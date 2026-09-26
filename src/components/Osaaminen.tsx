import { cards } from '../data/cards'
import { COURSES } from '../data/courses'

interface OsaaminenProps {
  engagedIds: Record<string, true>
}

export default function Osaaminen({ engagedIds }: OsaaminenProps) {
  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Osaaminen</h1>
        <p className="mb-6 text-sm text-ink-dim">Edistymisesi kursseittain tällä istunnolla.</p>
        <div className="flex flex-col gap-4">
          {COURSES.map((course) => {
            const practiceCards = cards.filter(
              (card) => card.topic.code === course.code && (card.type === 'task' || card.type === 'exercise'),
            )
            const total = practiceCards.length
            const engaged = practiceCards.filter((card) => engagedIds[card.id]).length
            const pct = total > 0 ? Math.round((engaged / total) * 100) : 0

            return (
              <div key={course.code} className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${course.badgeClass}`}
                  >
                    {course.code} · {course.name}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink-dim">
                    {engaged}/{total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${course.barClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-dim">
                  {engaged === 0
                    ? 'Ei vielä käytyjä tehtäviä tässä kurssissa.'
                    : `${engaged}/${total} tehtävää käyty läpi.`}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
