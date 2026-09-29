import { COURSE_MAP } from '../data/courses'
import {
  EXTERNAL_COURSE_NAMES,
  STUDY_PLANS,
  TARGET_GRADES,
  getFinnishGrade,
  getTargetPoints,
  isAppCourse,
  type PlanCourse,
  type TargetGrade,
} from '../data/studyPlans'
import { XIcon } from './icons'

interface TargetGradeViewProps {
  targetGrade: TargetGrade
  onTargetGradeChange: (grade: TargetGrade) => void
  onClose: () => void
}

function PlanCourseRow({ course }: { course: PlanCourse }) {
  if (isAppCourse(course.code)) {
    const meta = COURSE_MAP[course.code]
    return (
      <li className="flex flex-col gap-1">
        <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${meta.badgeClass}`}>
          {meta.code} · {meta.name}
        </span>
        <span className="text-xs leading-relaxed text-ink-dim">{course.focus}</span>
      </li>
    )
  }

  return (
    <li className="flex flex-col gap-1">
      <span className="inline-flex w-fit items-center rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-semibold text-ink-dim ring-1 ring-ink/10">
        {course.code} · {EXTERNAL_COURSE_NAMES[course.code]}
      </span>
      <span className="text-xs leading-relaxed text-ink-dim">
        {course.focus}
        <span className="text-ink-dim/60"> · ei vielä sovelluksessa</span>
      </span>
    </li>
  )
}

// Full-screen sheet for picking the target grade and seeing which courses
// (and which of their task tiers) the Suositellut feed and the Osaaminen
// progress will follow.
export default function TargetGradeView({ targetGrade, onTargetGradeChange, onClose }: TargetGradeViewProps) {
  const plan = STUDY_PLANS[targetGrade]
  const grade = getFinnishGrade(targetGrade)
  const points = getTargetPoints(targetGrade)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="target-grade-title"
      className="grid-bg fixed inset-0 z-40 overflow-y-auto bg-page px-6 pb-32 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
    >
      <div className="mx-auto w-full max-w-md">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h1 id="target-grade-title" className="text-2xl font-bold text-ink">
            Aseta tavoite
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-ink-dim">
          Tavoitearvosana ohjaa Suositellut-syötettä ja sitä, mitä Osaaminen-sivu seuraa.
        </p>

        <section className="mb-4 rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
          <span className="mb-3 block text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
            Tavoitearvosana
          </span>
          <div className="mb-4 flex gap-2" role="radiogroup" aria-label="Tavoitearvosana">
            {TARGET_GRADES.map((letter) => {
              const selected = letter === targetGrade
              return (
                <button
                  key={letter}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onTargetGradeChange(letter)}
                  className={`flex h-12 flex-1 items-center justify-center rounded-2xl text-xl font-bold transition-colors ${
                    selected
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-surface-2 text-ink-dim ring-1 ring-ink/10 active:bg-ink/5'
                  }`}
                >
                  {letter}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-ink">{grade.name}</span>
            <span className="text-xs font-semibold text-ink-dim">
              Pisteraja n. {points.min}–{points.max} · tavoite {points.avg} p.
            </span>
          </div>
        </section>

        <h2 className="mb-1 mt-2 text-lg font-bold text-ink">Tavoite perustuu näihin kursseihin</h2>
        <p className="mb-3 text-xs text-ink-dim">
          Suositellut näyttää kortit tässä järjestyksessä: perusteet ensin, vaikeimmat tehtävät viimeisenä.
        </p>

        <div className="flex flex-col gap-3">
          {plan.tiers.map((tier, index) => (
            <section key={tier.title} className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold leading-snug text-ink">{tier.title}</h3>
                  {tier.note && <span className="mt-0.5 text-xs text-ink-dim">{tier.note}</span>}
                </div>
              </div>
              <ol className="flex flex-col gap-3 border-t border-ink/10 pt-3">
                {tier.courses.map((course) => (
                  <PlanCourseRow key={`${tier.title}-${course.code}`} course={course} />
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-page via-page/90 to-transparent px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-8">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto flex w-full max-w-md items-center justify-center rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
        >
          Valmis
        </button>
      </div>
    </div>
  )
}
