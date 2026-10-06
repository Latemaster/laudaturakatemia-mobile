import { useEffect, useRef, useState } from 'react'
import type { Card } from '../types'
import LessonCardView from './LessonCardView'
import ExerciseCardView from './ExerciseCardView'
import TaskCardView from './TaskCardView'
import ProgressDots from './ProgressDots'

interface FeedProps {
  cards: Card[]
  onEngage?: (cardId: string) => void
  // A checked quick-exercise answer; fires on every attempt, the knowledge
  // model keeps only the first one per card.
  onAnswer?: (cardId: string, correct: boolean) => void
  onBack?: () => void
  backLabel?: string
}

export default function Feed({ cards, onEngage, onAnswer, onBack, backLabel = 'Takaisin' }: FeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setCurrentIndex(index)
          }
        }
      },
      { root: container, threshold: 0.6 },
    )

    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [cards])

  return (
    <>
      <ProgressDots total={cards.length} current={currentIndex} />
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="fixed left-4 top-[calc(env(safe-area-inset-top)+3.5rem)] z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-lg text-ink shadow-md ring-1 ring-ink/5 backdrop-blur"
        >
          ←
        </button>
      )}
      <div ref={containerRef} className="snap-feed">
        {cards.map((card, index) => (
          <div key={card.id} ref={(el) => (cardRefs.current[index] = el)}>
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
