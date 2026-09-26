import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ExerciseCard } from '../types'
import CardShell from './CardShell'
import KindLabel from './KindLabel'
import { CheckIcon, ListCheckIcon, XIcon } from './icons'

interface ExerciseCardViewProps {
  card: ExerciseCard
  onAnswer?: (correct: boolean) => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function ExerciseCardView({ card, onAnswer }: ExerciseCardViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const isAnswered = selectedId !== null
  const selectedOption = card.options.find((o) => o.id === selectedId)

  function rowClasses(optionId: string, correct: boolean) {
    if (!isAnswered) {
      return 'border-ink/15 bg-surface active:bg-surface-2'
    }
    if (correct) {
      return 'border-good bg-good/10'
    }
    if (optionId === selectedId) {
      return 'border-bad bg-bad/10'
    }
    return 'border-ink/10 bg-surface opacity-40'
  }

  function textClasses(optionId: string, correct: boolean) {
    if (!isAnswered) return 'text-ink'
    if (correct) return 'text-good'
    if (optionId === selectedId) return 'text-bad'
    return 'text-ink'
  }

  function badgeClasses(optionId: string, correct: boolean) {
    if (!isAnswered) return 'border-ink/25 text-ink-dim'
    if (correct) return 'border-good bg-good text-white'
    if (optionId === selectedId) return 'border-bad bg-bad text-white'
    return 'border-ink/15 text-ink-dim/40'
  }

  return (
    <CardShell topic={card.topic}>
      <KindLabel icon={<ListCheckIcon />} label="Monivalinta" />
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-2xl font-semibold leading-snug text-ink"
      >
        {card.question}
      </motion.h2>

      <div className="flex flex-col gap-3">
        {card.options.map((option, index) => (
          <motion.button
            key={option.id}
            type="button"
            disabled={isAnswered}
            onClick={() => {
              setSelectedId(option.id)
              onAnswer?.(option.correct)
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-sm transition-colors ${rowClasses(
              option.id,
              option.correct,
            )}`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${badgeClasses(
                option.id,
                option.correct,
              )}`}
            >
              {isAnswered && option.correct ? (
                <CheckIcon className="h-4 w-4" />
              ) : isAnswered && option.id === selectedId ? (
                <XIcon className="h-4 w-4" />
              ) : (
                LETTERS[index] ?? index + 1
              )}
            </span>
            <span className={`font-mono text-base ${textClasses(option.id, option.correct)}`}>
              {option.text}
            </span>
          </motion.button>
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
