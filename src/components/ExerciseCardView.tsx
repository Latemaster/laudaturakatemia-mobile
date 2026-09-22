import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ExerciseCard } from '../types'
import CardShell from './CardShell'

interface ExerciseCardViewProps {
  card: ExerciseCard
}

export default function ExerciseCardView({ card }: ExerciseCardViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const isAnswered = selectedId !== null
  const selectedOption = card.options.find((o) => o.id === selectedId)

  function optionClasses(optionId: string, correct: boolean) {
    if (!isAnswered) {
      return 'border-ink/15 bg-surface active:bg-surface-2'
    }
    if (correct) {
      return 'border-good bg-good/10 text-good'
    }
    if (optionId === selectedId) {
      return 'border-bad bg-bad/10 text-bad'
    }
    return 'border-ink/10 bg-surface opacity-40'
  }

  return (
    <CardShell topic={card.topic}>
      <h2 className="mb-6 text-2xl font-semibold leading-snug text-ink">{card.question}</h2>

      <div className="flex flex-col gap-3">
        {card.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={isAnswered}
            onClick={() => setSelectedId(option.id)}
            className={`rounded-2xl border px-4 py-3 text-left font-mono text-base shadow-sm transition-colors ${optionClasses(
              option.id,
              option.correct,
            )}`}
          >
            {option.text}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-2xl bg-surface-2 p-4"
          >
            <p
              className={`mb-1 text-sm font-semibold ${
                selectedOption?.correct ? 'text-good' : 'text-bad'
              }`}
            >
              {selectedOption?.correct ? 'Oikein!' : 'Ei aivan.'}
            </p>
            <p className="text-sm leading-relaxed text-ink-dim">{card.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  )
}
