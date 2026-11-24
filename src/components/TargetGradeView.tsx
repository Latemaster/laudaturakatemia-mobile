import { COURSE_MAP } from '../data/courses'
import {
  EXTERNAL_COURSE_NAMES,
  STUDY_PLANS,
  TARGET_GRADES,
  getTargetPoints,
  isAppCourse,
  type PlanCourse,
  type TargetGrade,
} from '../data/studyPlans'
import { XIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'

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
        <span className="text-sm font-semibold text-ink">
          {meta.code} · <span className="font-medium">{meta.name}</span>
        </span>
        <span className="text-xs leading-relaxed text-ink-dim">{course.focus}</span>
      </li>
    )
  }

  return (
    <li className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-ink-dim">
        {course.code} · <span className="font-medium">{EXTERNAL_COURSE_NAMES[course.code]}</span>
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
  const points = getTargetPoints(targetGrade)
  const { isDesktop } = useLayout()

  const picker = (
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
      <span className="text-sm font-semibold text-ink-dim">
        Pisteraja n. {points.min}–{points.max} · tavoite {points.avg} p.
      </span>
      <div className="mt-4 flex justify-end border-t border-ink/10 pt-4">
        <button type="button" onClick={onClose} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Tallenna
        </button>
      </div>
    </section>
  )

  const planIntro = (
    <>
      <h2 className="mb-1 mt-2 text-lg font-bold text-ink">Tavoite perustuu näihin kursseihin</h2>
      <p className="mb-3 text-xs text-ink-dim">
        Suositellut näyttää kortit tässä järjestyksessä: perusteet ensin, vaikeimmat tehtävät viimeisenä.
      </p>
    </>
  )

  const tiers = plan.tiers.map((tier, index) => (
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
  ))

  // Laptops: the grade picker on the left, the plan's tiers in two columns
  // on the right, and Tallenna at the bottom of the grade box.
  if (isDesktop) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="target-grade-title"
        className="grid-bg fixed inset-0 z-40 flex flex-col bg-page"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 px-10 pb-5 pt-8">
          <div>
            <h1 id="target-grade-title" className="text-2xl font-bold text-ink">
              Aseta tavoite
            </h1>
            <p className="mt-1 text-sm text-ink-dim">
              Tavoitearvosana ohjaa Suositellut-syötettä ja sitä, mitä Osaaminen-sivu seuraa.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 gap-6 px-10 pb-8">
          <div className="w-80 shrink-0 [&>section]:mb-0">{picker}</div>
          <div className="min-w-0 flex-1 overflow-y-auto rounded-3xl bg-surface/55 p-6 ring-1 ring-ink/5">
            {planIntro}
            {/* Two balanced columns, so a short tier leaves no gap. */}
            <div className="columns-2 gap-4 [&>section]:mb-4 [&>section]:break-inside-avoid">{tiers}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="target-grade-title"
      className="grid-bg fixed inset-0 z-40 overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
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

        {picker}

        {planIntro}
        <div className="flex flex-col gap-3">{tiers}</div>
      </div>
    </div>
  )
}
