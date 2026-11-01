import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getConceptCards } from '../data/cards'
import { COURSE_MAP } from '../data/courses'
import { POLL_OPTIONS, type KnowledgeState, type PollLevel } from '../data/knowledge'
import { getCourseThemes, type Theme, type ThemeId } from '../data/themes'
import type { TopicCode, VisualKey } from '../types'
import MathText from './MathText'
import { VISUALS } from './visuals'
import { CheckIcon, ChevronRightIcon, ListCheckIcon, XIcon } from './icons'
import KindLabel from './KindLabel'

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
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-dim/80">
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

// Shows its child at its natural size when there is room, and scales it
// down to the height the column has left when there isn't (a theme's
// visual), so the esikysely fits a laptop screen without scrolling. It is
// as tall as the child or the room, whichever is less.
function FitToHeight({ children, maxWidth, className = '' }: { children: ReactNode; maxWidth: number; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ width: 0, natural: 0, room: 0 })

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const measure = () =>
      setBox((prev) => {
        const next = { width: outer.clientWidth, natural: inner.offsetHeight, room: outer.clientHeight }
        return prev.width === next.width && prev.natural === next.natural && prev.room === next.room ? prev : next
      })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  const scale = box.natural > 0 && box.room > 0 ? Math.min(1, box.room / box.natural) : 1
  return (
    <div ref={outerRef} className={`relative min-h-0 ${className}`} style={{ flex: `0 1 ${box.natural}px` }}>
      <div
        ref={innerRef}
        className="absolute left-1/2 top-0"
        style={{
          width: Math.min(box.width, maxWidth) || undefined,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface ThemePollStepperProps {
  code: TopicCode
  startIndex?: number
  polls: KnowledgeState['polls']
  onPollChange: (themeId: ThemeId, level: PollLevel | undefined) => void
  // Back to the course's grade and theme list.
  onClose: () => void
}

// Laptops: the esikysely inside EsitiedotView, one theme at a time in the
// same frame as Kurssit › Tehtävät's exercises: the theme on the left like
// a problem, the four answers on the right like a pikatehtävä's options,
// and Edellinen / Seuraava under it.
export function ThemePollStepper({ code, startIndex = 0, polls, onPollChange, onClose }: ThemePollStepperProps) {
  const themes = getCourseThemes(code)
  const [index, setIndex] = useState(Math.min(startIndex, Math.max(0, themes.length - 1)))
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [index])

  const theme = themes[index]
  const value = polls[theme.id]
  const isFirst = index === 0
  const isLast = index === themes.length - 1
  const visual = themeVisual(code, theme)
  const Visual = visual ? VISUALS[visual] : null
  const titles = conceptTitles(code, theme)
  const answeredOption = value === undefined ? undefined : POLL_OPTIONS[value]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-ink/5">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 px-7 pb-3 pt-4">
          <div className="min-w-0">
            <KindLabel icon={<ListCheckIcon />} label="Esikysely" />
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 id="theme-poll-title" className="text-xl font-bold leading-snug text-ink">
                Teema {index + 1}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  answeredOption ? 'bg-accent/15 text-accent ring-accent/30' : 'bg-ink/5 text-ink-dim ring-ink/10'
                }`}
              >
                {answeredOption ? answeredOption.label : 'Ei vastattu'}
              </span>
            </div>
          </div>
          {/* One segment per theme: where you are and what is answered. */}
          <div className="flex w-48 shrink-0 gap-1 pt-6" aria-hidden>
            {themes.map((t, i) => (
              <button
                key={t.id}
                type="button"
                tabIndex={-1}
                onClick={() => setIndex(i)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i === index ? 'bg-accent' : polls[t.id] !== undefined ? 'bg-accent/40' : 'bg-ink/15'
                }`}
              />
            ))}
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* The name, summary and concepts keep their size; the visual
              scales into the height they leave (scrolling only as a last
              resort on a very short screen). */}
          <div ref={scrollRef} className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-7 pb-6 pt-4">
            <h3 className="mb-3 shrink-0 text-lg font-semibold leading-snug text-ink">{theme.name}</h3>
            {Visual ? (
              <FitToHeight key={theme.id} maxWidth={576} className="mb-4 min-h-[8rem]">
                <div className="overflow-hidden rounded-2xl bg-surface-2 p-3">
                  <Visual />
                </div>
              </FitToHeight>
            ) : theme.formula ? (
              <div className="mb-4 shrink-0 overflow-x-auto rounded-2xl bg-surface-2 px-3 py-2 text-base text-ink">
                <MathText content={`$$${theme.formula}$$`} />
              </div>
            ) : null}
            <div className="shrink-0 text-base leading-relaxed text-ink">
              <MathText content={theme.summary} />
            </div>
            {titles.length > 0 && (
              <ul className="mt-3 flex shrink-0 flex-wrap gap-1.5">
                {titles.map((title) => (
                  <li
                    key={title}
                    className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink-dim ring-1 ring-ink/10"
                  >
                    {title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex w-[26rem] shrink-0 flex-col overflow-y-auto border-l border-ink/10 bg-surface-2/50 p-5">
            <h3 className="mb-3 text-base font-semibold text-ink">Kuinka hyvin osaat tämän?</h3>
            <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={`${theme.name}: kuinka hyvin osaat`}>
              {POLL_OPTIONS.map((option) => {
                const selected = option.level === value
                return (
                  <button
                    key={option.level}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    // Tapping the selected answer again clears it.
                    onClick={() => onPollChange(theme.id, selected ? undefined : option.level)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-left shadow-sm transition-colors ${
                      selected ? 'border-accent bg-accent/10' : 'border-ink/15 bg-surface hover:bg-surface-2'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                        selected ? 'border-accent bg-accent text-white' : 'border-ink/25 text-ink-dim'
                      }`}
                    >
                      {selected ? <CheckIcon className="h-4 w-4" /> : option.level + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className={`text-sm font-semibold ${selected ? 'text-accent' : 'text-ink'}`}>
                        {option.label}
                      </span>
                      <span className="text-xs leading-snug text-ink-dim">{option.description}</span>
                    </span>
                    <LevelPips level={option.level} active={false} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-3 flex shrink-0 items-center justify-between gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-dim transition-colors hover:bg-surface hover:text-ink"
        >
          ← Takaisin kurssiin
        </button>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-xs font-semibold text-ink-dim">
            Esikysely · {index + 1} / {themes.length} · vastaukset tallentuvat heti
          </span>
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            disabled={isFirst}
            className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-surface"
          >
            ← Edellinen
          </button>
          <button
            type="button"
            onClick={() => (isLast ? onClose() : setIndex(index + 1))}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            {isLast ? 'Esikysely valmis' : 'Seuraava →'}
          </button>
        </div>
      </div>
    </div>
  )
}
