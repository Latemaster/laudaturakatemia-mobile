import { useMemo, useState } from 'react'
import { cards, getExerciseCards } from '../../data/cards'
import { COURSE_MAP } from '../../data/courses'
import type { Card, TaskCard, TopicCode } from '../../types'
import ExerciseWorkspace from './ExerciseWorkspace'
import type { FullViewMode } from './TaskFullView'
import { LEVEL_LABELS, QUICK_LABEL, useEvaluation } from './exerciseState'

interface CourseTasksViewProps {
  code: TopicCode
  onEngage: (cardId: string) => void
  onAnswer: (cardId: string, correct: boolean) => void
}

interface TaskGroup {
  label: string
  cards: Card[]
}

// The course's quick exercises first, then its open-answer problems by
// difficulty level, in source order.
function groupCourseCards(code: TopicCode): TaskGroup[] {
  const groups: TaskGroup[] = []
  const exercises = getExerciseCards(code)
  if (exercises.length > 0) groups.push({ label: QUICK_LABEL, cards: exercises })
  for (const card of cards) {
    if (card.topic.code !== code || card.type !== 'task') continue
    const section = (card as TaskCard).problem.section
    const label = LEVEL_LABELS[section] ?? section
    const group = groups.find((g) => g.label === label)
    if (group) group.cards.push(card)
    else groups.push({ label, cards: [card] })
  }
  return groups
}

// Kurssit › Tehtävät in the laptop layout: one exercise at a time with
// level tabs and Edellinen / Seuraava, like the laptop site, instead of
// the phone's scrolling feed.
export default function CourseTasksView({ code, onEngage, onAnswer }: CourseTasksViewProps) {
  const groups = useMemo(() => groupCourseCards(code), [code])
  const [groupIndex, setGroupIndex] = useState(0)
  const [cardIndex, setCardIndex] = useState(0)
  // Answers and self-scores are shared with the Arviointi page.
  const forExercise = useEvaluation()
  const [fullView, setFullView] = useState<FullViewMode | null>(null)

  if (groups.length === 0) {
    return <p className="p-8 text-sm text-ink-dim">Tämän kurssin tehtäviä ei ole vielä lisätty.</p>
  }

  const group = groups[Math.min(groupIndex, groups.length - 1)]
  const card = group.cards[Math.min(cardIndex, group.cards.length - 1)]
  const isFirst = groupIndex === 0 && cardIndex === 0
  const isLast = groupIndex === groups.length - 1 && cardIndex === group.cards.length - 1
  // The level is on the badge beside the title.
  const title = card.type === 'task' ? card.problem.title : `${QUICK_LABEL.slice(0, -1)} ${cardIndex + 1}`

  function selectGroup(index: number) {
    setGroupIndex(index)
    setCardIndex(0)
    setFullView(null)
  }

  // The exercise `delta` steps away, across levels too, so the whole course
  // can be done with Edellinen / Seuraava. With `tasksOnly` (the full view,
  // which only open-answer problems have) quick exercises are skipped.
  function neighbour(delta: 1 | -1, tasksOnly = false): [number, number] | null {
    let g = groupIndex
    let c = cardIndex
    for (;;) {
      c += delta
      if (c < 0) {
        if (g === 0) return null
        g -= 1
        c = groups[g].cards.length - 1
      } else if (c >= groups[g].cards.length) {
        if (g === groups.length - 1) return null
        g += 1
        c = 0
      }
      if (!tasksOnly || groups[g].cards[c].type === 'task') return [g, c]
    }
  }

  function step(delta: 1 | -1, tasksOnly = false) {
    const target = neighbour(delta, tasksOnly)
    if (!target) return
    setGroupIndex(target[0])
    setCardIndex(target[1])
    // A new exercise opens unanswered, so the full view goes back to
    // answering; quick exercises have no full view.
    const next = groups[target[0]].cards[target[1]]
    setFullView((mode) => (mode && next.type === 'task' ? 'answer' : null))
  }


  return (
    <div className="flex h-full flex-col px-8 pb-6 pt-7">
      <div className="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-ink">
            {code}: {COURSE_MAP[code].name}
          </h1>
          <p className="mt-1 text-sm text-ink-dim">Tehtävät</p>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-2xl bg-surface p-1.5 shadow-sm ring-1 ring-ink/5" role="tablist" aria-label="Tehtävätyyppi">
          {groups.map((g, index) => (
            <button
              key={g.label}
              type="button"
              role="tab"
              aria-selected={index === groupIndex}
              onClick={() => selectGroup(index)}
              className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors ${
                index === groupIndex ? 'bg-accent text-white shadow-sm' : 'text-ink hover:bg-surface-2'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <ExerciseWorkspace
        key={card.id}
        card={card}
        title={title}
        badge={group.label}
        {...forExercise(card)}
        onEngage={() => onEngage(card.id)}
        onQuickAnswer={(correct) => onAnswer(card.id, correct)}
        fullView={fullView}
        onFullViewChange={setFullView}
        nav={{
          position: `${group.label} · ${cardIndex + 1} / ${group.cards.length}`,
          onPrev: neighbour(-1, true) ? () => step(-1, true) : undefined,
          onNext: neighbour(1, true) ? () => step(1, true) : undefined,
        }}
      />

      <div className="mt-4 flex shrink-0 items-center justify-end gap-2">
        <span className="mr-2 text-xs font-semibold text-ink-dim">
          {group.label} · {cardIndex + 1} / {group.cards.length}
        </span>
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={isFirst}
          className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-surface"
        >
          ← Edellinen
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={isLast}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-30"
        >
          Seuraava →
        </button>
      </div>
    </div>
  )
}
