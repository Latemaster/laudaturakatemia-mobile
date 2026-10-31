import { useEffect, useRef, useState } from 'react'
import { getConceptCards } from '../../data/cards'
import { COURSE_MAP } from '../../data/courses'
import type { LessonCard, TopicCode } from '../../types'
import MathText from '../MathText'
import { VISUALS } from '../visuals'

// One theory concept with its interactive visual beside the text.
function TheorySlide({ card }: { card: LessonCard }) {
  const Visual = card.visual ? VISUALS[card.visual] : null
  return (
    <div className={Visual ? 'grid items-start gap-6 xl:grid-cols-2' : ''}>
      {Visual && (
        <div className="rounded-2xl bg-surface-2 p-4 ring-1 ring-ink/5">
          <Visual />
        </div>
      )}
      <div className="min-w-0 text-base leading-relaxed text-ink">
        <MathText content={card.body} />
      </div>
    </div>
  )
}

// Topic picker shown above an open module: jumps straight to any other.
function ModuleDropdown({ modules, active, onSelect }: { modules: LessonCard[]; active: number; onSelect: (i: number) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full max-w-xl items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left shadow-sm ring-1 ring-ink/10 transition-colors hover:ring-accent/40"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-ink-dim/70">Aihe</span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
          <span className="mr-1.5 text-accent">{active + 1}</span>
          {modules[active].title}
        </span>
        <span className={`text-ink-dim transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <ul role="listbox" className="absolute left-0 z-20 mt-2 max-h-[60vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-surface p-1.5 shadow-lg ring-1 ring-ink/10">
          {modules.map((module, index) => (
            <li key={module.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === active}
                onClick={() => {
                  onSelect(index)
                  setOpen(false)
                }}
                className={`flex w-full items-baseline gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  index === active ? 'bg-accent text-white' : 'text-ink hover:bg-surface-2'
                }`}
              >
                <span className={`w-5 shrink-0 text-right text-xs ${index === active ? 'opacity-80' : 'text-ink-dim'}`}>
                  {index + 1}
                </span>
                <span className="min-w-0">{module.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Kurssit › Tiivistelmä: the course's theory concepts. It opens on a list
// of the topics; picking one opens it in a reader whose box keeps the same
// size whatever the topic's length (long ones scroll inside it), so
// Edellinen / Seuraava stay put while clicking through.
export default function CourseSummaryView({ code }: { code: TopicCode }) {
  const modules = getConceptCards(code)
  const [active, setActive] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const title = `${code}: ${COURSE_MAP[code].name}`

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [active])

  if (modules.length === 0) {
    return <p className="px-8 pt-7 text-sm text-ink-dim">Tämän kurssin tiivistelmää ei ole vielä lisätty.</p>
  }

  if (active === null) {
    return (
      <div className="h-full overflow-y-auto px-8 pb-10 pt-7">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-5">
            <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/30">
              Tiivistelmä
            </span>
            <h1 className="mt-3 text-2xl font-bold text-ink">{title}</h1>
            <p className="mt-1 text-sm text-ink-dim">{modules.length} aihetta · valitse aihe, josta haluat aloittaa</p>
          </header>
          <ol className="overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-ink/5">
            {modules.map((module, index) => (
              <li key={module.id} className="border-b border-ink/5 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-2"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold text-ink">{module.title}</span>
                  <span className="text-ink-dim" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }

  const current = modules[active]

  return (
    <div className="flex h-full flex-col px-8 pb-6 pt-7">
      <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col">
        <div className="mb-4 flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setActive(null)}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-accent ring-1 ring-accent/30 transition-colors hover:bg-accent/10"
          >
            ← Kaikki aiheet
          </button>
          <ModuleDropdown modules={modules} active={active} onSelect={setActive} />
        </div>

        <section className="flex min-h-0 flex-1 flex-col rounded-3xl bg-surface shadow-sm ring-1 ring-ink/5">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-7 pb-6 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-dim">
              {title} · Aihe {active + 1} / {modules.length}
            </p>
            <h2 className="mb-4 mt-1 text-xl font-bold text-ink">{current.title}</h2>
            <TheorySlide card={current} />
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-ink/10 px-7 py-4">
            <button
              type="button"
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="rounded-full px-4 py-2 text-sm font-semibold text-accent ring-1 ring-accent/30 transition-colors hover:bg-accent/10 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ← Edellinen
            </button>
            <button
              type="button"
              onClick={() => setActive(Math.min(modules.length - 1, active + 1))}
              disabled={active === modules.length - 1}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              Seuraava →
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
