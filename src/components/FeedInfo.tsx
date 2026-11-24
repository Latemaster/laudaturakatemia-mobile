import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { COURSES, COURSE_MAP, COURSE_TAG_CLASS } from '../data/courses'
import type { CourseGrade, CourseGrades } from '../data/courseGrades'
import type { TargetGrade } from '../data/studyPlans'
import { FEED_DIFFICULTIES, getFeedCourses, type FeedPrefs } from '../data/feed'
import EsitiedotView from './EsitiedotView'
import InfoToggle from './InfoToggle'
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, SlidersIcon, XIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'
import type { TopicCode } from '../types'

interface FeedInfoProps {
  targetGrade: TargetGrade
  prefs: FeedPrefs
  onPrefsChange: (prefs: FeedPrefs) => void
  // Which kinds of exercise are in the feed: the settings, or the device's
  // defaults.
  quickTasks: boolean
  longTasks: boolean
  cardCount: number
  courseGrades: CourseGrades
  onCourseGradeChange: (code: TopicCode, grade: CourseGrade | undefined) => void
}

const sectionTitle = 'mb-2 text-xs font-semibold uppercase tracking-widest text-ink-dim/70'
const iconButton =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink ring-1 ring-ink/10 disabled:opacity-30'

function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-accent' : 'bg-ink/20'
      }`}
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
  quickTasks,
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
        <label className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 ring-1 ring-ink/10">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-ink">Pikatehtävät</span>
            <span className="block text-xs">Monivalinnat ja lyhyet laskut, jotka tarkistetaan heti.</span>
          </span>
          <Switch
            checked={quickTasks}
            // The feed always has one kind on: the last one can't be turned off.
            disabled={quickTasks && !longTasks}
            onChange={(checked) => onPrefsChange({ ...prefs, quickTasks: checked })}
            label="Pikatehtävät"
          />
        </label>
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
            disabled={longTasks && !quickTasks}
            onChange={(checked) => onPrefsChange({ ...prefs, longTasks: checked })}
            label="Pitkät tehtävät"
          />
        </label>
        {quickTasks !== longTasks && (
          <p className="px-1 text-xs">Ainakin toisen tehtävätyypin on oltava päällä.</p>
        )}
      </div>

      {longTasks && (
        <>
          <h3 className={sectionTitle}>Pitkien tehtävien vaikeustaso</h3>
          <div className="mb-2 flex flex-col gap-2">
            {FEED_DIFFICULTIES.map((option) => {
              const on = prefs.difficulties.includes(option.value)
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3 ring-1 ring-ink/10"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="block text-xs">{option.hint}</span>
                  </span>
                  <Switch
                    checked={on}
                    // At least one tier stays on.
                    disabled={on && prefs.difficulties.length === 1}
                    onChange={(checked) =>
                      onPrefsChange({
                        ...prefs,
                        difficulties: checked
                          ? [...prefs.difficulties, option.value]
                          : prefs.difficulties.filter((d) => d !== option.value),
                      })
                    }
                    label={option.label}
                  />
                </label>
              )
            })}
          </div>
          <p className="mb-5 px-1 text-xs">
            Kultakin kurssilta tulee ne valituista tasoista, joita lukusuunnitelma sille pyytää.
          </p>
        </>
      )}

      <div className="mb-2 flex flex-wrap items-center gap-x-2">
        <h3 className={sectionTitle.replace('mb-2 ', '')}>Kurssien järjestys</h3>
        <InfoToggle label="Miten kurssijärjestys toimii">
          <p className="mb-2">
            Syöte ei käy kursseja läpi yksi kerrallaan, vaan sekoittaa kolmea kurssia kerrallaan, listan
            järjestyksessä:
          </p>
          <ol className="mb-2 list-decimal space-y-1 pl-4">
            <li>Aluksi vuorottelevat listan kolme ylintä kurssia, tehtävä kustakin vuorotellen.</li>
            <li>Kun kurssilta on tullut neljä tehtävää, se väistyy ja seuraava kurssi listalta tulee tilalle.</li>
            <li>Kurssi palaa myöhemmin vuoroon siitä mihin jäi{longTasks && ', ja tehtävät ovat silloin vaikeampia'}.</li>
          </ol>
          <p>Ylimmät kurssit tulevat siis syötteessä ensin ja useimmin. Jo tekemäsi tehtävät siirtyvät loppuun.</p>
        </InfoToggle>
      </div>
      <p className="mb-3 text-xs">Järjestä kurssit tärkeysjärjestykseen. Ylimmät tulevat syötteessä ensin.</p>
      <ol className="mb-4 flex flex-col gap-1.5">
        {courses.map((code, index) => (
          <li key={code} className="flex items-center gap-2 rounded-2xl bg-surface-2 py-2 pl-3 pr-1.5">
            <span className="w-4 shrink-0 text-xs font-semibold text-ink-dim/70">{index + 1}</span>
            <span className="min-w-0 flex-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${COURSE_TAG_CLASS}`}
              >
                {code}
              </span>
              <span lang="fi" className="mt-0.5 block hyphens-auto break-words text-xs leading-snug">
                {COURSE_MAP[code]?.name}
              </span>
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
      {prefs.courses !== null && (
        <button
          type="button"
          onClick={() => onPrefsChange({ ...prefs, courses: null })}
          className="-mt-2 mb-4 text-xs font-semibold text-accent hover:underline"
        >
          Palauta suunnitelman mukaiseksi
        </button>
      )}

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
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${COURSE_TAG_CLASS}`}
              >
                <PlusIcon className="h-3 w-3" />
                {course.code}
              </button>
            ))}
          </div>
        </>
      )}

      <p className="rounded-xl bg-surface-2 p-3 text-xs">
        Yhteensä <span className="font-semibold text-ink">{cardCount} korttia</span>. Tavoitteen voit vaihtaa
        Osaaminen-sivulta.
      </p>
    </div>
  )

  const saveButton = (
    <button type="button" onClick={close} className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
      Tallenna
    </button>
  )

  const closeButton = (
    <button type="button" onClick={close} aria-label="Sulje" className={iconButton}>
      <XIcon className="h-3.5 w-3.5" />
    </button>
  )

  const sheet = isDesktop ? (
    // Laptops: a drawer from the panel's right edge, over a dimmed feed.
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-info-title"
        className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-[2px]"
        onClick={close}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
          onClick={(event) => event.stopPropagation()}
          className="absolute inset-y-0 right-0 flex w-[30rem] max-w-full flex-col bg-surface shadow-2xl"
        >
          <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-7 py-5">
            <h2 id="feed-info-title" className="text-xl font-bold text-ink">
              Syötteen asetukset
            </h2>
            {closeButton}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">{body}</div>
          <div className="flex justify-end border-t border-ink/10 px-7 py-4">
            <button
              type="button"
              onClick={close}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Tallenna
            </button>
          </div>
        </motion.div>
      </div>,
      document.body,
    )
  ) : (
    // Phones: full screen over the feed and the top menu, as Esitiedot.
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-info-title"
        className="grid-bg fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+1.25rem)]"
      >
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 id="feed-info-title" className="text-2xl font-bold text-ink">
              Syötteen asetukset
            </h1>
            <div className="flex shrink-0 items-center gap-3">
              {saveButton}
              {closeButton}
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-surface px-5 py-5 shadow-sm">{body}</div>
        </div>
      </div>,
      document.body,
    )
  )

  return (
    <>
      {isDesktop ? (
        // Laptops: a labelled button in the panel's top-right corner, over
        // the gutter the feed's boxes leave above them.
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="absolute right-8 top-3.5 z-20 flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-surface-2"
        >
          <SlidersIcon className="h-4 w-4" />
          Syötteen asetukset
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Syötteen asetukset"
          aria-haspopup="dialog"
          className="fixed right-4 top-[calc(env(safe-area-inset-top)+3.5rem)] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink shadow-md ring-1 ring-ink/5 backdrop-blur"
        >
          <SlidersIcon className="h-5 w-5" />
        </button>
      )}

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
