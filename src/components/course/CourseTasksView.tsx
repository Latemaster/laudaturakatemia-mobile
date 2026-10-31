import { useMemo, useState, type CSSProperties } from 'react'
import { cards, getExerciseCards } from '../../data/cards'
import { COURSE_MAP } from '../../data/courses'
import type { Card, TaskCard, TopicCode } from '../../types'
import ExerciseCardView from '../ExerciseCardView'
import TaskCardView from '../TaskCardView'

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
// exam part (Osa I, Osa II, ...), in source order.
function groupCourseCards(code: TopicCode): TaskGroup[] {
  const groups: TaskGroup[] = []
  const exercises = getExerciseCards(code)
  if (exercises.length > 0) groups.push({ label: 'Pikatehtävät', cards: exercises })
  for (const card of cards) {
    if (card.topic.code !== code || card.type !== 'task') continue
    const section = (card as TaskCard).problem.section
    const group = groups.find((g) => g.label === section)
    if (group) group.cards.push(card)
    else groups.push({ label: section, cards: [card] })
  }
  return groups
}

// Kurssit › Tehtävät in the laptop layout: one exercise at a time with
// part tabs and Edellinen / Seuraava, like the laptop site, instead of the
// phone's scrolling feed.
export default function CourseTasksView({ code, onEngage, onAnswer }: CourseTasksViewProps) {
  const groups = useMemo(() => groupCourseCards(code), [code])
  const [groupIndex, setGroupIndex] = useState(0)
  const [cardIndex, setCardIndex] = useState(0)

  if (groups.length === 0) {
    return <p className="p-8 text-sm text-ink-dim">Tämän kurssin tehtäviä ei ole vielä lisätty.</p>
  }

  const group = groups[Math.min(groupIndex, groups.length - 1)]
  const card = group.cards[Math.min(cardIndex, group.cards.length - 1)]
  const isFirst = groupIndex === 0 && cardIndex === 0
  const isLast = groupIndex === groups.length - 1 && cardIndex === group.cards.length - 1

  function selectGroup(index: number) {
    setGroupIndex(index)
    setCardIndex(0)
  }

  // Edellinen / Seuraava step through the parts too, so the whole course
  // can be done with the two buttons.
  function step(delta: 1 | -1) {
    const next = cardIndex + delta
    if (next >= 0 && next < group.cards.length) setCardIndex(next)
    else if (delta === 1 && groupIndex < groups.length - 1) selectGroup(groupIndex + 1)
    else if (delta === -1 && groupIndex > 0) {
      setGroupIndex(groupIndex - 1)
      setCardIndex(groups[groupIndex - 1].cards.length - 1)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-8 pt-7">
        <h1 className="text-2xl font-bold text-ink">
          {code}: {COURSE_MAP[code].name}
        </h1>
        <p className="mt-1 text-sm text-ink-dim">Tehtävät</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-3xl bg-surface p-3 shadow-sm ring-1 ring-ink/5">
          {groups.map((g, index) => (
            <button
              key={g.label}
              type="button"
              onClick={() => selectGroup(index)}
              className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors ${
                index === groupIndex ? 'bg-accent text-white shadow-sm' : 'text-ink ring-1 ring-ink/10 hover:bg-surface-2'
              }`}
            >
              {g.label}
            </button>
          ))}
          <span className="ml-auto text-xs font-semibold text-ink-dim">
            {cardIndex + 1} / {group.cards.length}
          </span>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={isFirst}
            className="rounded-xl px-4 py-1.5 text-sm font-semibold text-ink ring-1 ring-ink/10 transition-colors hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ← Edellinen
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={isLast}
            className="rounded-xl px-4 py-1.5 text-sm font-semibold text-ink ring-1 ring-ink/10 transition-colors hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            Seuraava →
          </button>
        </div>
      </div>

      {/* The card views size themselves to --feed-height (index.css). */}
      <div
        className="course-tasks min-h-0 flex-1"
        style={{ '--feed-height': '100%', '--card-max-h': 'min(36rem, calc(100dvh - 21rem))' } as CSSProperties}
      >
        {card.type === 'exercise' ? (
          <ExerciseCardView
            key={card.id}
            card={card}
            onAnswer={(correct) => {
              onEngage(card.id)
              onAnswer(card.id, correct)
            }}
          />
        ) : card.type === 'task' ? (
          <TaskCardView key={card.id} card={card} onViewSolution={() => onEngage(card.id)} />
        ) : null}
      </div>
    </div>
  )
}
