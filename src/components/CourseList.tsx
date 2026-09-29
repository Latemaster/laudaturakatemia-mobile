import { COURSE_MAP } from '../data/courses'
import { getCourseProgress } from '../data/progress'
import { getCourseBuckets, type TargetGrade } from '../data/studyPlans'
import type { TopicCode } from '../types'

interface CourseListProps {
  onSelect: (code: TopicCode) => void
  engagedIds: Record<string, true>
  targetGrade: TargetGrade
}

export default function CourseList({ onSelect, engagedIds, targetGrade }: CourseListProps) {
  const buckets = getCourseBuckets(targetGrade)

  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Kurssit</h1>
        <p className="mb-6 text-sm text-ink-dim">
          Kurssit on jaettu tavoitteesi <span className="font-semibold text-ink">{targetGrade}</span> mukaan. Valitse
          kurssi, jonka tehtäviä ja oppitunteja haluat harjoitella.
        </p>

        <div className="flex flex-col gap-6">
          {buckets.map((bucket, index) => {
            if (bucket.courses.length === 0) return null
            return (
              <section key={bucket.title}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  <h2 className="text-sm font-bold text-ink">{bucket.title}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {bucket.courses.map(({ code, focus }) => {
                    const course = COURSE_MAP[code]
                    const { pct } = getCourseProgress(code, engagedIds)
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => onSelect(code)}
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
                        {focus && (
                          <p className="text-xs font-medium leading-relaxed text-accent">Tavoite {targetGrade}: {focus}</p>
                        )}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                          <div className={`h-full rounded-full ${course.barClass}`} style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
