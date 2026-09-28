import { useState, type ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ExerciseCard } from '../types'
import CardShell from './CardShell'
import ExpandableBox from './ExpandableBox'
import KindLabel from './KindLabel'
import { VISUALS } from './visuals'
import type { VisualProps } from './visuals'
import { CheckIcon, ListCheckIcon, PencilIcon, XIcon } from './icons'

interface ExerciseCardViewProps {
  card: ExerciseCard
  onAnswer?: (correct: boolean) => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function ChoiceExercise({ card, onAnswer }: { card: Extract<ExerciseCard, { kind: 'choice' }>; onAnswer?: (correct: boolean) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isAnswered = selectedId !== null
  const selectedOption = card.options.find((o) => o.id === selectedId)

  function rowClasses(optionId: string, correct: boolean) {
    if (!isAnswered) return 'border-ink/15 bg-surface active:bg-surface-2'
    if (correct) return 'border-good bg-good/10'
    if (optionId === selectedId) return 'border-bad bg-bad/10'
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
    <>
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
            <span className={`font-mono text-base ${textClasses(option.id, option.correct)}`}>{option.text}</span>
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
            <p className={`mb-1 text-sm font-semibold ${selectedOption?.correct ? 'text-good' : 'text-bad'}`}>
              {selectedOption?.correct ? 'Oikein!' : 'Ei aivan.'}
            </p>
            <p className="text-sm leading-relaxed text-ink-dim">{card.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SliderAnswerExercise({
  card,
  Visual,
  onAnswer,
}: {
  card: Extract<ExerciseCard, { kind: 'numeric' }>
  Visual: ComponentType<VisualProps>
  onAnswer?: (correct: boolean) => void
}) {
  const [value, setValue] = useState(card.sliderStart ?? card.min ?? 0)
  const [checked, setChecked] = useState(false)
  const isCorrect = Math.abs(value - card.answer) <= card.tolerance

  function handleCheck() {
    setChecked(true)
    onAnswer?.(isCorrect)
  }

  return (
    <>
      <div className="mb-4">
        <Visual value={value} onChange={setValue} hideReadout />
      </div>

      {!checked && (
        <button
          type="button"
          onClick={handleCheck}
          className="w-full rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md"
        >
          Tarkista vastaus
        </button>
      )}

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-2xl bg-surface-2 p-4"
          >
            <p className={`mb-1 text-sm font-semibold ${isCorrect ? 'text-good' : 'text-bad'}`}>
              {isCorrect ? 'Oikein!' : `Ei aivan - liukusäädin on nyt kohdassa ${value}${card.unit ? ` ${card.unit}` : ''}. Oikea vastaus: ${card.answer}${card.unit ? ` ${card.unit}` : ''}.`}
            </p>
            <p className="text-sm leading-relaxed text-ink-dim">{card.explanation}</p>
            <button type="button" onClick={() => setChecked(false)} className="mt-2 text-sm font-semibold text-accent">
              Säädä uudelleen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NumericExercise({ card, onAnswer }: { card: Extract<ExerciseCard, { kind: 'numeric' }>; onAnswer?: (correct: boolean) => void }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const parsed = Number(value.replace(',', '.'))
  const isValid = value.trim() !== '' && !Number.isNaN(parsed)
  const isCorrect = isValid && Math.abs(parsed - card.answer) <= card.tolerance

  function handleSubmit() {
    if (!isValid) return
    setSubmitted(true)
    onAnswer?.(isCorrect)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={card.min}
          max={card.max}
          step={card.step ?? 'any'}
          value={value}
          disabled={submitted}
          onChange={(e) => setValue(e.target.value)}
          placeholder={card.min !== undefined && card.max !== undefined ? `${card.min} … ${card.max}` : 'Vastaus'}
          className="w-full rounded-2xl border border-ink/15 bg-surface px-4 py-3 text-lg font-mono text-ink outline-none focus:border-accent disabled:opacity-60"
        />
        {card.unit && <span className="shrink-0 font-mono text-base text-ink-dim">{card.unit}</span>}
      </div>

      {!submitted && (
        <button
          type="button"
          disabled={!isValid}
          onClick={handleSubmit}
          className="mt-4 w-full rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md disabled:opacity-40"
        >
          Lähetä vastaus
        </button>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-2xl bg-surface-2 p-4"
          >
            <p className={`mb-1 text-sm font-semibold ${isCorrect ? 'text-good' : 'text-bad'}`}>
              {isCorrect ? 'Oikein!' : `Ei aivan. Oikea vastaus: ${card.answer}${card.unit ? ` ${card.unit}` : ''}`}
            </p>
            <p className="text-sm leading-relaxed text-ink-dim">{card.explanation}</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-sm font-semibold text-accent"
            >
              Yritä uudelleen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function ExerciseCardView({ card, onAnswer }: ExerciseCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Visual = card.visual ? VISUALS[card.visual] : null
  const isSliderAnswer = card.kind === 'numeric' && card.answerVia === 'slider'

  return (
    <CardShell topic={card.topic}>
      <KindLabel
        icon={card.kind === 'numeric' ? <PencilIcon /> : <ListCheckIcon />}
        label={card.kind === 'numeric' ? 'Laske ja vastaa' : 'Monivalinta'}
      />
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-2xl font-semibold leading-snug text-ink"
      >
        {card.question}
      </motion.h2>

      <ExpandableBox isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
        {isExpanded && (
          <h2 className="mb-4 text-2xl font-semibold leading-snug text-ink">{card.question}</h2>
        )}
        {/* Slider-answer exercises own the Visual themselves, so they can
            drive it with controlled value/onChange - it must not also be
            rendered uncontrolled here. */}
        {Visual && !isSliderAnswer && (
          <div className="mb-4">
            <Visual />
          </div>
        )}
        {card.kind === 'numeric' ? (
          isSliderAnswer && Visual ? (
            <SliderAnswerExercise card={card} Visual={Visual} onAnswer={onAnswer} />
          ) : (
            <NumericExercise card={card} onAnswer={onAnswer} />
          )
        ) : (
          <ChoiceExercise card={card} onAnswer={onAnswer} />
        )}
      </ExpandableBox>
    </CardShell>
  )
}
