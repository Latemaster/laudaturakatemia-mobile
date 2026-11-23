import { useState } from 'react'
import { motion } from 'framer-motion'
import { COURSES } from '../data/courses'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import type { TargetGrade } from '../data/studyPlans'
import type { TopicCode } from '../types'
import EsitiedotView from './EsitiedotView'
import KindLabel from './KindLabel'
import { CheckIcon, ChevronRightIcon, InfoIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'

interface FeedIntroCardProps {
  targetGrade: TargetGrade
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
}

// The Suositellut feed's first card, always: what the feed is, and the
// student's esitiedot. Until those are filled in it asks for them, with a
// button straight into the Esitiedot menu.
export default function FeedIntroCard({
  targetGrade,
  courseGrades,
  onCourseGradeChange,
}: FeedIntroCardProps) {
  const { isDesktop } = useLayout()
  const [esitiedotOpen, setEsitiedotOpen] = useState(false)

  const gradesFilled = COURSES.filter((course) => courseGrades[course.code] !== undefined).length
  const started = gradesFilled > 0
  const complete = gradesFilled === COURSES.length

  const header = (
    <>
      <KindLabel icon={<InfoIcon />} label="Aloita tästä" />
      <h1 className={`font-bold leading-tight text-ink ${isDesktop ? 'text-4xl' : 'text-3xl'}`}>Suositellut</h1>
      <p className="mt-3 text-base leading-relaxed text-ink-dim">
        Suositellut valitsee, mitä tehtäviä sinun kannattaa tehdä seuraavaksi, tavoitearvosanasi{' '}
        <span className="font-semibold text-ink">{targetGrade}</span>, esitietojesi ja tekemiesi tehtävien
        perusteella.
      </p>
    </>
  )

  const esitiedot = (
    <section
      className={`rounded-3xl border bg-surface p-6 shadow-sm ${
        complete ? 'border-ink/10' : 'border-accent/30 ring-1 ring-accent/20'
      }`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">Esitiedot</span>
      <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-ink">
        {complete ? (
          <>
            <CheckIcon className="h-5 w-5 text-good" />
            Esitiedot täytetty
          </>
        ) : started ? (
          'Esitiedot ovat kesken'
        ) : (
          'Täytä esitiedot ensin'
        )}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-dim">
        {complete
          ? 'Ennusteesi lähtee liikkeelle esitiedoistasi, ja tehtävien vastaukset tarkentavat sitä.'
          : 'Täytä lukion kurssiarvosanasi. Laskemme Sinulle alustavan arvosana ennusteen, jota tarkennamme kun teet tehtäviä.'}
      </p>
      <p className="mt-3 text-xs font-semibold text-ink-dim">
        {gradesFilled}/{COURSES.length} kurssiarvosanaa
      </p>
      <button
        type="button"
        onClick={() => setEsitiedotOpen(true)}
        aria-haspopup="dialog"
        className={`mt-4 flex items-center justify-center gap-1 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
          complete ? 'bg-surface-2 text-accent ring-1 ring-accent/30' : 'bg-accent text-white shadow-md'
        } ${isDesktop ? 'w-fit' : 'w-full'}`}
      >
        Täytä esitiedot
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </section>
  )

  const scrollHint = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ delay: 0.8, duration: 1.6, repeat: Infinity }}
      className={`flex flex-col gap-1 text-sm text-ink-dim ${isDesktop ? 'mt-6 items-start' : 'mt-8 items-center'}`}
    >
      <span>{isDesktop ? 'Vieritä alas aloittaaksesi' : 'Pyyhkäise ylös aloittaaksesi'}</span>
      <span aria-hidden>{isDesktop ? '↓' : '↑'}</span>
    </motion.div>
  )

  const sheet = esitiedotOpen && (
    <EsitiedotView
      courseGrades={courseGrades}
      onCourseGradeChange={onCourseGradeChange}
      onClose={() => setEsitiedotOpen(false)}
    />
  )

  // Laid out like the feed's other cards (CardShell): the header in a left
  // column on laptops, above the content on phones.
  if (isDesktop) {
    return (
      <section className="snap-card relative flex w-full items-center justify-center px-10 py-8">
        <div className="flex w-full max-w-6xl items-center gap-10">
          <div className="w-[34%] shrink-0">
            {header}
            {scrollHint}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">{esitiedot}</div>
        </div>
        {sheet}
      </section>
    )
  }

  return (
    <section className="grid-bg snap-card relative flex w-full flex-col bg-page px-6 pb-6 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto mt-24 flex w-full max-w-md flex-1 flex-col">
        <div className="mb-5">{header}</div>
        {esitiedot}
        {scrollHint}
      </div>
      {sheet}
    </section>
  )
}
