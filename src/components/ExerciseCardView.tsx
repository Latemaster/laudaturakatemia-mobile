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
      return 'border-white/15 bg-white/5 active:bg-white/10'
    }
    if (correct) {
      return 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
    }
    if (optionId === selectedId) {
      return 'border-rose-400 bg-rose-500/20 text-rose-200'
    }
    return 'border-white/10 bg-white/5 opacity-50'
  }

  return (
    <CardShell topic={card.topic}>
      <h2 className="mb-6 text-2xl font-semibold leading-snug">{card.question}</h2>

      <div className="flex flex-col gap-3">
        {card.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={isAnswered}
            onClick={() => setSelectedId(option.id)}
            className={`rounded-2xl border px-4 py-3 text-left text-base transition-colors ${optionClasses(
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
            className="mt-6 rounded-2xl bg-surface p-4"
          >
            <p
              className={`mb-1 text-sm font-semibold ${
                selectedOption?.correct ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {selectedOption?.correct ? 'Oikein!' : 'Ei aivan.'}
            </p>
            <p className="text-sm leading-relaxed text-white/70">{card.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  )
}
