import { COURSES } from '../data/courses'
import { getCourseProgress } from '../data/progress'
import type { TopicCode } from '../types'

interface CourseListProps {
  onSelect: (code: TopicCode) => void
  engagedIds: Record<string, true>
}

export default function CourseList({ onSelect, engagedIds }: CourseListProps) {
  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Kurssit</h1>
        <p className="mb-6 text-sm text-ink-dim">Valitse kurssi, jonka tehtäviä ja oppitunteja haluat harjoitella.</p>
        <div className="flex flex-col gap-3">
          {COURSES.map((course) => {
            const { pct } = getCourseProgress(course.code, engagedIds)
            return (
              <button
                key={course.code}
                type="button"
                onClick={() => onSelect(course.code)}
                className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface p-4 text-left shadow-sm transition-colors active:bg-surface-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${course.badgeClass}`}
                  >
                    {course.code} · {course.name}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink-dim">{pct} %</span>
                </div>
                <p className="text-sm leading-relaxed text-ink-dim">{course.description}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className={`h-full rounded-full ${course.barClass}`} style={{ width: `${pct}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
