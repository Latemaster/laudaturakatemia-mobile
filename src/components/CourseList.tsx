import { COURSES } from '../data/courses'
import { getCoursePoints, getCourseProgressPct } from '../data/coursePoints'
import type { Knowledge } from '../data/knowledge'
import { usePointsEarned } from '../data/points'
import type { TopicCode } from '../types'
import CourseProgressBar from './CourseProgressBar'
import InfoToggle from './InfoToggle'
import KnowledgeBlob, { KnowledgeLegend } from './KnowledgeBlob'
import { knowledgeBorder } from './knowledgeColors'
import PageContainer from './PageContainer'

interface CourseListProps {
  onSelect: (code: TopicCode) => void
  knowledge: Knowledge
}

export default function CourseList({ onSelect, knowledge }: CourseListProps) {
  const points = getCoursePoints(usePointsEarned())
  return (
    <PageContainer wide>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-ink">Kurssit</h1>
        <InfoToggle label="Mitä osaamisesi tarkoittaa">
          <KnowledgeLegend />
        </InfoToggle>
      </div>
      <p className="mb-6 text-sm text-ink-dim">Valitse kurssi, jota haluat harjoitella. Reunan väri kertoo, miten hyvin osaat sen.</p>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {COURSES.map((course, index) => {
          const pct = getCourseProgressPct(course.code, points)
          return (
            <button
              key={course.code}
              type="button"
              onClick={() => onSelect(course.code)}
              data-onboarding={index === 0 ? 'course-first' : undefined}
              className={`relative flex flex-col gap-2 rounded-2xl bg-surface p-4 text-left shadow-sm transition-colors active:bg-surface-2 ${knowledgeBorder(knowledge.courses[course.code])}`}
            >
              <span className="text-base font-semibold text-ink">
                {course.code} · <span className="font-medium">{course.name}</span>
              </span>
              <p className="text-sm leading-relaxed text-ink-dim">{course.description}</p>
              <KnowledgeBlob course={knowledge.courses[course.code]} />
              <span className="flex w-full">
                <CourseProgressBar pct={pct} />
              </span>
            </button>
          )
        })}
      </div>
    </PageContainer>
  )
}
