import { useState } from 'react'
import { createPortal } from 'react-dom'
import { COURSES, COURSE_MAP } from '../data/courses'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import type { TargetGrade } from '../data/studyPlans'
import type { Difficulty } from '../data/progress'
import {
  FEED_DIFFICULTIES,
  getFeedCourses,
  getFeedDifficulties,
  type FeedPrefs,
} from '../data/feed'
import EsitiedotView from './EsitiedotView'
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, SlidersIcon, XIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'
import type { TopicCode } from '../types'

interface FeedInfoProps {
  targetGrade: TargetGrade
  prefs: FeedPrefs
  onPrefsChange: (prefs: FeedPrefs) => void
  // Whether long tasks are in the feed: the setting, or the device default.
  longTasks: boolean
  cardCount: number
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'helpot',
  mid: 'keskivaikeat',
  hard: 'vaikeat',
}

function describe(difficulties: Difficulty[]): string {
  if (difficulties.length === 3) return 'kaikki tehtävät'
  return difficulties.map((d) => DIFFICULTY_LABEL[d]).join(' ja ')
}

const sectionTitle = 'mb-2 text-xs font-semibold uppercase tracking-widest text-ink-dim/70'
const iconButton =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink ring-1 ring-ink/10 disabled:opacity-30'

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-ink/20'}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-[left] ${
          checked ? 'left-[1.375rem]' : 'left-0.5'
        }`}
      />
    </button>
  )
}

// The top-right button on the Suositellut feed. Opens the feed's info and
// settings: the student's esitiedot, whether long tasks come up, how hard
// they should be, and which courses the feed rotates through, in what
// order. On phones it is a full-screen sheet like Esitiedot.
export default function FeedInfo({
  targetGrade,
  prefs,
  onPrefsChange,
  longTasks,
  cardCount,
  courseGrades,
  onCourseGradeChange,
}: FeedInfoProps) {
  const [open, setOpen] = useState(false)
  const [esitiedotOpen, setEsitiedotOpen] = useState(false)
  const { isDesktop } = useLayout()
  const courses = getFeedCourses(targetGrade, prefs)
  const addable = COURSES.filter((course) => !courses.includes(course.code))
  const gradesFilled = COURSES.filter((course) => courseGrades[course.code] !== undefined).length

  function setCourses(next: TopicCode[]) {
    onPrefsChange({ ...prefs, courses: next })
  }

  function move(index: number, by: -1 | 1) {
    const next = [...courses]
    const [code] = next.splice(index, 1)
    next.splice(index + by, 0, code)
    setCourses(next)
  }

  const close = () => setOpen(false)

  const body = (
    <div className="text-sm leading-relaxed text-ink-dim">
      <p className="mb-5">
        Syöte lähtee tavoitearvosanasi <span className="font-semibold text-ink">{targetGrade}</span>{' '}
        lukusuunnitelmasta ja esitiedoistasi. Täällä voit muokata, millaisia tehtäviä se tarjoaa.
      </p>

      <h3 className={sectionTitle}>Esitiedot</h3>
      <button
        type="button"
        onClick={() => setEsitiedotOpen(true)}
        aria-haspopup="dialog"
        className="mb-5 flex w-full items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 text-left ring-1 ring-ink/10 hover:ring-ink/20"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">Kurssiarvosanat</span>
          <span className="block text-xs">
            {gradesFilled}/{COURSES.length} täytetty
          </span>
        </span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-dim" />
      </button>

      <h3 className={sectionTitle}>Tehtävät</h3>
      <div className="mb-5 flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 ring-1 ring-ink/10">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">Pikatehtävät</span>
            <span className="block text-xs">Monivalinnat ja lyhyet laskut, jotka tarkistetaan heti.</span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-good">Aina mukana</span>
        </div>
        <label className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 ring-1 ring-ink/10">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">Pitkät tehtävät</span>
            <span className="block text-xs">
              YO-tehtävät, joihin kirjoitat ratkaisun ja pisteytät sen itse.
              {!isDesktop && ' Puhelimella oletuksena pois.'}
            </span>
          </span>
          <Switch
            checked={longTasks}
            onChange={(checked) => onPrefsChange({ ...prefs, longTasks: checked })}
            label="Pitkät tehtävät"
          />
        </label>
      </div>

      <h3 className={sectionTitle}>Pitkien tehtävien vaikeustaso</h3>
      <div
        role="radiogroup"
        aria-label="Pitkien tehtävien vaikeustaso"
        aria-disabled={!longTasks}
        className={`mb-5 flex flex-col gap-2 ${longTasks ? '' : 'opacity-40'}`}
      >
        {FEED_DIFFICULTIES.map((option) => {
          const selected = prefs.difficulty === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!longTasks}
              onClick={() => onPrefsChange({ ...prefs, difficulty: option.value })}
              className={`rounded-2xl px-4 py-2.5 text-left ring-1 transition-colors ${
                selected ? 'bg-accent/10 ring-accent/50' : 'bg-surface-2 ring-ink/10 enabled:hover:ring-ink/20'
              }`}
            >
              <span className={`block text-sm font-semibold ${selected ? 'text-accent' : 'text-ink'}`}>
                {option.label}
              </span>
              <span className="block text-xs">{option.hint}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className={sectionTitle.replace('mb-2 ', '')}>Kurssit</h3>
        {prefs.courses !== null && (
          <button
            type="button"
            onClick={() => onPrefsChange({ ...prefs, courses: null })}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Palauta suunnitelman mukaiseksi
          </button>
        )}
      </div>
      <p className="mb-3 text-xs">
        Syöte kiertää kursseja tässä järjestyksessä: kolme kurssia kerrallaan, muutama tehtävä kustakin.
        {longTasks && ' Kun kurssi tulee uudelleen vuoroon, tehtävät ovat astetta vaikeampia.'}
      </p>
      <ol className="mb-4 flex flex-col gap-1.5">
        {courses.map((code, index) => (
          <li key={code} className="flex items-center gap-2 rounded-2xl bg-surface-2 py-1.5 pl-3 pr-1.5">
            <span className="w-4 shrink-0 text-xs font-semibold text-ink-dim/70">{index + 1}</span>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${COURSE_MAP[code].badgeClass}`}
            >
              {code}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs">
              {longTasks
                ? `pikatehtävät, ${describe(getFeedDifficulties(targetGrade, prefs, code))}`
                : 'pikatehtävät'}
            </span>
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={`Siirrä ${code} ylemmäs`}
              className={iconButton}
            >
              <ChevronDownIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === courses.length - 1}
              aria-label={`Siirrä ${code} alemmas`}
              className={iconButton}
            >
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCourses(courses.filter((c) => c !== code))}
              disabled={courses.length === 1}
              aria-label={`Poista ${code} syötteestä`}
              className={iconButton}
            >
              <XIcon className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ol>

      {addable.length > 0 && (
        <>
          <h3 className={sectionTitle}>Lisää kurssi</h3>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {addable.map((course) => (
              <button
                key={course.code}
                type="button"
                onClick={() => setCourses([...courses, course.code])}
                aria-label={`Lisää ${course.code} syötteeseen`}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${course.badgeClass}`}
              >
                <PlusIcon className="h-3 w-3" />
                {course.code}
              </button>
            ))}
          </div>
        </>
      )}

      <p className="rounded-xl bg-surface-2 p-3 text-xs">
        Yhteensä <span className="font-semibold text-ink">{cardCount} korttia</span>. Jo tekemäsi tehtävät
        siirtyvät syötteen loppuun.
        {longTasks && ' Vaikeustasot: helpot = Osa I, keskivaikeat = Osa II, vaikeat = Osat III–IV.'} Tavoitteen voit
        vaihtaa Osaaminen-sivulta.
      </p>
    </div>
  )

  const closeButton = (
    <button type="button" onClick={close} aria-label="Sulje" className={iconButton}>
      <XIcon className="h-3.5 w-3.5" />
    </button>
  )

  const sheet = isDesktop ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feed-info-title"
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink/30 px-4 py-8 backdrop-blur-sm"
      onClick={close}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
          <h2 id="feed-info-title" className="text-base font-bold text-ink">
            Syötteen asetukset
          </h2>
          {closeButton}
        </div>
        <div className="overflow-y-auto px-5 py-4">{body}</div>
      </div>
    </div>
  ) : (
    // Phones: full screen over the feed and the top menu, as Esitiedot.
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-info-title"
        className="grid-bg fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-page px-6 pb-32 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 id="feed-info-title" className="text-2xl font-bold text-ink">
              Syötteen asetukset
            </h1>
            {closeButton}
          </div>
          <div className="rounded-3xl border border-ink/10 bg-surface px-5 py-5 shadow-sm">{body}</div>
        </div>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-page via-page/90 to-transparent px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-8">
          <button
            type="button"
            onClick={close}
            className="pointer-events-auto flex w-full max-w-md items-center justify-center rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            Valmis
          </button>
        </div>
      </div>,
      document.body,
    )
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Syötteen asetukset"
        aria-haspopup="dialog"
        className={`${
          isDesktop ? 'absolute right-6 top-3' : 'fixed right-4 top-[calc(env(safe-area-inset-top)+3.5rem)]'
        } z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5 backdrop-blur`}
      >
        <SlidersIcon className="h-5 w-5" />
      </button>

      {open && sheet}
      {esitiedotOpen && (
        <EsitiedotView
          courseGrades={courseGrades}
          onCourseGradeChange={onCourseGradeChange}
          onClose={() => setEsitiedotOpen(false)}
        />
      )}
    </>
  )
}
