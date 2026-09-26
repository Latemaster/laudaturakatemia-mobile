import { COURSES } from '../data/courses'
import type { TopicCode } from '../types'

interface CourseListProps {
  onSelect: (code: TopicCode) => void
}

export default function CourseList({ onSelect }: CourseListProps) {
  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Kurssit</h1>
        <p className="mb-6 text-sm text-ink-dim">Valitse kurssi, jonka tehtäviä ja oppitunteja haluat harjoitella.</p>
        <div className="flex flex-col gap-3">
          {COURSES.map((course) => (
            <button
              key={course.code}
              type="button"
              onClick={() => onSelect(course.code)}
              className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface p-4 text-left shadow-sm transition-colors active:bg-surface-2"
            >
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${course.badgeClass}`}
              >
                {course.code} · {course.name}
              </span>
              <p className="text-sm leading-relaxed text-ink-dim">{course.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
