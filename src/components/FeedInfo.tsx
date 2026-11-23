import { useState } from 'react'
import { COURSES, COURSE_MAP } from '../data/courses'
import type { TargetGrade } from '../data/studyPlans'
import type { Difficulty } from '../data/progress'
import {
  FEED_DIFFICULTIES,
  getFeedCourses,
  getFeedDifficulties,
  type FeedPrefs,
} from '../data/feed'
import { ChevronDownIcon, PlusIcon, SlidersIcon, XIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'
import type { TopicCode } from '../types'

interface FeedInfoProps {
  targetGrade: TargetGrade
  prefs: FeedPrefs
  onPrefsChange: (prefs: FeedPrefs) => void
  cardCount: number
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

// Floating button on the Suositellut feed. Opens the feed's settings: how
// hard the tasks should be and which courses it rotates through, in what
// order, with a short explanation of how cards are picked.
export default function FeedInfo({ targetGrade, prefs, onPrefsChange, cardCount }: FeedInfoProps) {
  const [open, setOpen] = useState(false)
  const { isDesktop } = useLayout()
  const courses = getFeedCourses(targetGrade, prefs)
  const addable = COURSES.filter((course) => !courses.includes(course.code))

  function setCourses(next: TopicCode[]) {
    onPrefsChange({ ...prefs, courses: next })
  }

  function move(index: number, by: -1 | 1) {
    const next = [...courses]
    const [code] = next.splice(index, 1)
    next.splice(index + by, 0, code)
    setCourses(next)
  }

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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="feed-info-title"
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/30 lg:items-center px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+4.5rem)] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4">
              <h2 id="feed-info-title" className="text-base font-bold text-ink">
                Syötteen asetukset
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Sulje" className={iconButton}>
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 text-sm leading-relaxed text-ink-dim">
              <p className="mb-4">
                Syöte lähtee tavoitearvosanasi <span className="font-semibold text-ink">{targetGrade}</span>{' '}
                lukusuunnitelmasta. Voit painottaa vaikeustasoa ja muokata kurssilistaa.
              </p>

              <h3 className={sectionTitle}>Vaikeustaso</h3>
              <div role="radiogroup" aria-label="Vaikeustaso" className="mb-5 flex flex-col gap-2">
                {FEED_DIFFICULTIES.map((option) => {
                  const selected = prefs.difficulty === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onPrefsChange({ ...prefs, difficulty: option.value })}
                      className={`rounded-2xl px-4 py-2.5 text-left ring-1 transition-colors ${
                        selected ? 'bg-accent/10 ring-accent/50' : 'bg-surface-2 ring-ink/10 hover:ring-ink/20'
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
                Kun kurssi tulee uudelleen vuoroon, tehtävät ovat astetta vaikeampia.
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
                      {describe(getFeedDifficulties(targetGrade, prefs, code))}
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
                siirtyvät syötteen loppuun. Vaikeustasot: helpot = Osa I, keskivaikeat = Osa II, vaikeat = Osat
                III–IV. Tavoitteen voit vaihtaa Osaaminen-sivulta.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
