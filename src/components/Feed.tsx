import { useEffect, useRef, useState } from 'react'
import type { Card } from '../types'
import LessonCardView from './LessonCardView'
import ExerciseCardView from './ExerciseCardView'
import TaskCardView from './TaskCardView'
import { useLayout } from '../layout/LayoutContext'

interface FeedProps {
  cards: Card[]
  onEngage?: (cardId: string) => void
  // A checked quick-exercise answer; fires on every attempt, the knowledge
  // model keeps only the first one per card.
  onAnswer?: (cardId: string, correct: boolean) => void
  onBack?: () => void
  backLabel?: string
}

// The feed holds well over a hundred cards, each with KaTeX and an answer
// box, so they are rendered in batches: the first batch up front, and the
// next one once the reader has only LOAD_AHEAD cards left to go.
const FIRST_BATCH = 10
const NEXT_BATCH = 5
const LOAD_AHEAD = 5

export default function Feed({ cards, onEngage, onAnswer, onBack, backLabel = 'Takaisin' }: FeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [renderedCount, setRenderedCount] = useState(FIRST_BATCH)
  const { isDesktop } = useLayout()

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
        {cards.slice(0, renderedCount).map((card, index) => (
          <div key={card.id}>
            {card.type === 'lesson' ? (
              <LessonCardView card={card} showSwipeHint={index === 0} />
            ) : card.type === 'exercise' ? (
              <ExerciseCardView
                card={card}
                onAnswer={(correct) => {
                  onEngage?.(card.id)
                  onAnswer?.(card.id, correct)
                }}
              />
            ) : (
              <TaskCardView card={card} onViewSolution={() => onEngage?.(card.id)} />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
