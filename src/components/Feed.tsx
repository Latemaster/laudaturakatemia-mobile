import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Card } from '../types'
import LessonCardView from './LessonCardView'
import ExerciseCardView from './ExerciseCardView'
import TaskCardView from './TaskCardView'
import { useLayout } from '../layout/LayoutContext'
import ExerciseWorkspace from './course/ExerciseWorkspace'
import type { FullViewMode } from './course/TaskFullView'
import { levelOf, useEvaluation } from './course/exerciseState'

interface FeedProps {
  cards: Card[]
  onEngage?: (cardId: string) => void
  // A checked quick-exercise answer; fires on every attempt, the knowledge
  // model keeps only the first one per card.
  onAnswer?: (cardId: string, correct: boolean) => void
  onBack?: () => void
  backLabel?: string
  // A card shown before all the others (Suositellut's FeedIntroCard).
  intro?: ReactNode
}

// The feed holds well over a hundred cards, each with KaTeX and an answer
// box, so they are rendered in batches: the first batch up front, and the
// next one once the reader has only LOAD_AHEAD cards left to go.
const FIRST_BATCH = 10
const NEXT_BATCH = 5
const LOAD_AHEAD = 5

interface FeedExerciseProps {
  card: Card
  exercise: ReturnType<ReturnType<typeof useEvaluation>>
  onEngage?: (cardId: string) => void
  onAnswer?: (cardId: string, correct: boolean) => void
}

// Laptop feed: an exercise in the same box as Kurssit › Tehtävät, with its
// course tag, but no level tabs or Edellinen / Seuraava; the feed scrolls.
// The right gutter leaves room for the feed's info button.
function FeedExercise({ card, exercise, onEngage, onAnswer }: FeedExerciseProps) {
  const [fullView, setFullView] = useState<FullViewMode | null>(null)
  return (
    <section className="snap-card relative flex w-full flex-col py-6 pl-8 pr-14">
      <ExerciseWorkspace
        card={card}
        title={card.type === 'task' ? card.problem.title : 'Pikatehtävä'}
        badge={levelOf(card)}
        {...exercise}
        onEngage={() => onEngage?.(card.id)}
        onQuickAnswer={(correct) => onAnswer?.(card.id, correct)}
        fullView={fullView}
        onFullViewChange={setFullView}
        showCourse
      />
    </section>
  )
}

export default function Feed({ cards, onEngage, onAnswer, onBack, backLabel = 'Takaisin', intro }: FeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [renderedCount, setRenderedCount] = useState(FIRST_BATCH)
  const { isDesktop } = useLayout()
  // Answers and self-scores, shared with Kurssit and Arviointi.
  const forExercise = useEvaluation()

  useEffect(() => {
    if (renderedCount < cards.length && renderedCount - currentIndex <= LOAD_AHEAD) {
      setRenderedCount((count) => Math.min(count + NEXT_BATCH, cards.length))
    }
  }, [currentIndex, renderedCount, cards.length])

  // Every card is exactly one feed-height tall (snap-card), so the card in
  // view follows from the scroll position.
  function handleScroll() {
    const container = containerRef.current
    if (!container || container.clientHeight === 0) return
    setCurrentIndex(Math.round(container.scrollTop / container.clientHeight))
  }

  return (
    <>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className={`${
            isDesktop ? 'absolute left-6 top-3' : 'fixed left-4 top-[calc(env(safe-area-inset-top)+3.5rem)]'
          } z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-lg text-ink shadow-md ring-1 ring-ink/5 backdrop-blur`}
        >
          ←
        </button>
      )}
      <div ref={containerRef} className="snap-feed" onScroll={handleScroll}>
        {intro}
        {cards.slice(0, renderedCount).map((card, index) => (
          <div key={card.id}>
            {card.type === 'lesson' ? (
              // The intro has its own hint to scroll on.
              <LessonCardView card={card} showSwipeHint={!intro && index === 0} />
            ) : isDesktop ? (
              <FeedExercise card={card} exercise={forExercise(card)} onEngage={onEngage} onAnswer={onAnswer} />
            ) : card.type === 'exercise' ? (
              <ExerciseCardView
                card={card}
                onAnswer={(correct) => {
                  onEngage?.(card.id)
                  onAnswer?.(card.id, correct)
                }}
              />
            ) : (
              <TaskCardView
                card={card}
                {...forExercise(card)}
                onTaskAnswer={(answer) => {
                  onEngage?.(card.id)
                  forExercise(card).onTaskAnswer(answer)
                }}
                onViewSolution={() => onEngage?.(card.id)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
