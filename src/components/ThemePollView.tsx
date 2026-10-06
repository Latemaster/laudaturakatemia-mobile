import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getConceptCards } from '../data/cards'
import { COURSE_MAP } from '../data/courses'
import { POLL_OPTIONS, type KnowledgeState, type PollLevel } from '../data/knowledge'
import { getCourseThemes, type Theme, type ThemeId } from '../data/themes'
import type { TopicCode, VisualKey } from '../types'
import MathText from './MathText'
import { VISUALS } from './visuals'
import { CheckIcon, ChevronRightIcon, XIcon } from './icons'

interface ThemePollViewProps {
  code: TopicCode
  // Theme to open on; lets the course sheet jump straight to one answer.
  startIndex?: number
  polls: KnowledgeState['polls']
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
  onClose: () => void
}

// The first interactive visual among the theme's concept boxes, so the
// card shows the same picture the theory feed does for that topic.
function themeVisual(code: TopicCode, theme: Theme): VisualKey | undefined {
  const concepts = getConceptCards(code)
  for (const index of theme.concepts) {
    const visual = concepts[index]?.visual
    if (visual) return visual
  }
  return undefined
}

function conceptTitles(code: TopicCode, theme: Theme): string[] {
  const concepts = getConceptCards(code)
  return theme.concepts.map((index) => concepts[index]?.title).filter((title): title is string => !!title)
}

// Four filled-or-empty pips showing where an answer sits on the scale.
function LevelPips({ level, active }: { level: PollLevel; active: boolean }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {POLL_OPTIONS.map((option) => (
        <span
          key={option.level}
          className={`h-1.5 w-3 rounded-full ${
            option.level <= level ? (active ? 'bg-white' : 'bg-accent') : active ? 'bg-white/30' : 'bg-ink/15'
          }`}
        />
      ))}
    </span>
  )
}

// Step-by-step pre-poll (esikysely) for one course: each theme gets a card
// with a short summary and its visual, then the four-step "how well do you
// know this" scale. Answers save as they are tapped, so closing midway
// keeps what was answered.
export default function ThemePollView({ code, startIndex = 0, polls, onPollChange, onClose }: ThemePollViewProps) {
  const course = COURSE_MAP[code]
  const themes = getCourseThemes(code)
  const [index, setIndex] = useState(Math.min(startIndex, Math.max(0, themes.length - 1)))
  const [direction, setDirection] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Each theme starts from the top of its card, not wherever the previous
  // one was scrolled to when its answer was tapped.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [index])

  const theme = themes[index]
  const value = polls[theme.id]
  const isLast = index === themes.length - 1
  const visual = themeVisual(code, theme)
  const Visual = visual ? VISUALS[visual] : null
  const titles = conceptTitles(code, theme)
  const answered = themes.filter((t) => polls[t.id] !== undefined).length

  function go(step: number) {
    const next = index + step
    if (next < 0 || next >= themes.length) return
    setDirection(step)
    setIndex(next)
  }

  function handleNext() {
    if (isLast) onClose()
    else go(1)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-poll-title"
      className="grid-bg fixed inset-0 z-50 flex flex-col bg-page pt-[calc(env(safe-area-inset-top)+1.25rem)]"
    >
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col overflow-hidden px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${course.badgeClass}`}>
              {course.code} · {course.name}
            </span>
            <h1 id="theme-poll-title" className="text-lg font-bold text-ink">
              Esikysely{' '}
              <span className="font-semibold text-ink-dim">
                {index + 1}/{themes.length}
              </span>
            </h1>
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

        <div className="mb-4 flex gap-1" aria-hidden>
          {themes.map((t, i) => (
            <button
              key={t.id}
              type="button"
              tabIndex={-1}
              onClick={() => {
                setDirection(i > index ? 1 : -1)
                setIndex(i)
              }}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i === index ? 'bg-accent' : polls[t.id] !== undefined ? 'bg-accent/40' : 'bg-ink/15'
              }`}
            />
          ))}
        </div>

        <div ref={scrollRef} className="relative flex-1 overflow-y-auto overscroll-contain pb-40">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={theme.id}
              custom={direction}
              initial={{ opacity: 0, x: 40 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 * direction }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-4"
            >
              <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
                <span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">
                  Teema
                </span>
                <h2 className="mb-3 text-xl font-bold leading-snug text-ink">{theme.name}</h2>

                {Visual ? (
                  <div className="mb-4 overflow-hidden rounded-2xl bg-surface-2 p-3">
                    <Visual />
                  </div>
                ) : theme.formula ? (
                  <div className="mb-4 overflow-x-auto rounded-2xl bg-surface-2 px-3 py-2 text-base text-ink">
                    <MathText content={`$$${theme.formula}$$`} />
                  </div>
                ) : null}

                <div className="text-sm leading-relaxed text-ink">
                  <MathText content={theme.summary} />
                </div>

                {titles.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {titles.map((title) => (
                      <li
                        key={title}
                        className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-dim ring-1 ring-ink/10"
                      >
                        {title}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-3xl border border-ink/10 bg-surface p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-ink">Kuinka hyvin osaat tämän?</h3>
                <div className="flex flex-col gap-2" role="radiogroup" aria-label={`${theme.name}: kuinka hyvin osaat`}>
                  {POLL_OPTIONS.map((option) => {
                    const selected = option.level === value
                    return (
                      <button
                        key={option.level}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onPollChange(theme.id, selected ? undefined : option.level)}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${
                          selected
                            ? 'bg-accent text-white shadow-md'
                            : 'bg-surface-2 text-ink ring-1 ring-ink/10 active:bg-ink/5'
                        }`}
                      >
                        <LevelPips level={option.level} active={selected} />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-sm font-semibold">{option.label}</span>
                          <span className={`text-xs leading-snug ${selected ? 'text-white/80' : 'text-ink-dim'}`}>
                            {option.description}
                          </span>
                        </span>
                        {selected && <CheckIcon className="h-4 w-4 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </section>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-page via-page/90 to-transparent px-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-8">
        <div className="pointer-events-auto flex w-full max-w-md flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-surface text-sm font-semibold text-ink shadow-md ring-1 ring-ink/5 disabled:opacity-40"
            >
              Edellinen
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`flex h-12 flex-[2] items-center justify-center gap-1 rounded-full text-sm font-semibold shadow-lg transition-transform active:scale-[0.98] ${
                value === undefined && !isLast
                  ? 'bg-surface text-ink ring-1 ring-ink/5'
                  : 'bg-accent text-white'
              }`}
            >
              {isLast ? 'Valmis' : value === undefined ? 'Ohita' : 'Seuraava'}
              {!isLast && <ChevronRightIcon className="h-4 w-4" />}
            </button>
          </div>
          <span className="text-center text-[11px] text-ink-dim">
            {answered}/{themes.length} vastattu · vastaukset tallentuvat heti
          </span>
        </div>
      </div>
    </div>
  )
}
