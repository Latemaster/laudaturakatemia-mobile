import { COURSES } from '../data/courses'
import { getCoursePoints, getCourseProgressPct } from '../data/coursePoints'
import type { Knowledge } from '../data/knowledge'
import { usePointsEarned } from '../data/points'
import type { TopicCode } from '../types'
import KnowledgeChip from './KnowledgeChip'
import PageContainer from './PageContainer'

interface CourseListProps {
  onSelect: (code: TopicCode) => void
  knowledge: Knowledge
}

export default function CourseList({ onSelect, knowledge }: CourseListProps) {
  const points = getCoursePoints(usePointsEarned())
  return (
    <PageContainer wide>
      <h1 className="mb-1 text-2xl font-bold text-ink">Kurssit</h1>
      <p className="mb-6 text-sm text-ink-dim">Valitse kurssi, jonka tehtäviä ja oppitunteja haluat harjoitella.</p>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
        {COURSES.map((course, index) => {
          const pct = getCourseProgressPct(course.code, points)
          return (
            <button
              key={course.code}
              type="button"
              onClick={() => onSelect(course.code)}
              data-onboarding={index === 0 ? 'course-first' : undefined}
              className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface p-4 text-left shadow-sm transition-colors active:bg-surface-2"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-base font-semibold text-ink">
                  {course.code} · <span className="font-medium">{course.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <KnowledgeChip course={knowledge.courses[course.code]} />
                  <span className="text-xs font-semibold text-ink-dim">{pct} %</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink-dim">{course.description}</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
              </div>
            </button>
          )
        })}
      </div>
    </PageContainer>
  )
}
