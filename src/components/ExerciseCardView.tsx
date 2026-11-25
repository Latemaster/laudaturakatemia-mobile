import { useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { ExerciseCard } from '../types'
import CardShell from './CardShell'
import ExpandableBox from './ExpandableBox'
import KindLabel from './KindLabel'
import { VISUALS } from './visuals'
import type { VisualProps } from './visuals'
import { CheckIcon, ListCheckIcon, PencilIcon, XIcon } from './icons'
import { useLayout } from '../layout/LayoutContext'
import PointsBadge, { CardGlow, QUICK_POINTS_HINT, useQuickPoints } from './course/PointsBadge'
import { WrongShake } from './Celebrations'

interface ExerciseCardViewProps {
  card: ExerciseCard
  onAnswer?: (correct: boolean) => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// The feedback after a wrong answer: a short shake, the right answer and
// why. A right answer has no panel: the points tile in the card's corner
// fills with "+1 p" and the card lights up (useQuickPoints, CardGlow), and
// a panel arriving under the answer would only push the card past the
// screen.
function MissPanel({ heading, explanation, children }: { heading: string; explanation: string; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, x: [0, -8, 8, -5, 5, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="mt-4 rounded-2xl bg-surface-2 p-4 ring-1 ring-ink/5"
    >
      <p className="mb-1 text-sm font-semibold text-bad">{heading}</p>
      <p className="text-sm leading-relaxed text-ink-dim">{explanation}</p>
      {children}
    </motion.div>
  )
}

function ChoiceExercise({ card, onAnswer }: { card: Extract<ExerciseCard, { kind: 'choice' }>; onAnswer?: (correct: boolean) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const isAnswered = selectedId !== null
  const selectedOption = card.options.find((o) => o.id === selectedId)
  const { isDesktop } = useLayout()
  // Phones: after a wrong answer only the right option and the one picked
  // stay; the rest fold away so the "Ei aivan" panel fits on the card.
  const missed = isAnswered && !selectedOption?.correct
  const shown = (option: { id: string; correct: boolean }) =>
    isDesktop || !missed || option.correct || option.id === selectedId

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
      <div className="flex flex-col">
        <AnimatePresence initial={false}>
        {card.options.map((option, index) => shown(option) && (
          <motion.button
            key={option.id}
            exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, borderWidth: 0 }}
            type="button"
            disabled={isAnswered}
            onClick={() => {
              setSelectedId(option.id)
              onAnswer?.(option.correct)
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            // The right choice, when it is the one picked, bumps up as the
            // points come in.
            animate={isAnswered && option.correct && option.id === selectedId ? { scale: [1, 1.05, 1] } : undefined}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.3, delay: isAnswered ? 0 : index * 0.06 }}
            className={`mb-3 flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left shadow-sm transition-colors last:mb-0 ${rowClasses(
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
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAnswered && !selectedOption?.correct && <MissPanel heading="Ei aivan." explanation={card.explanation} />}
      </AnimatePresence>
    </>
  )
}

function SliderAnswerExercise({
  card,
  Visual,
  onAnswer,
  split,
}: {
  card: Extract<ExerciseCard, { kind: 'numeric' }>
  Visual: ComponentType<VisualProps>
  onAnswer?: (correct: boolean) => void
  // The laptop box's two columns: the question (given here), the check and
  // the feedback on the left, the slider visual on the right.
  split?: { question: ReactNode }
}) {
  const [value, setValue] = useState(card.sliderStart ?? card.min ?? 0)
  const [checked, setChecked] = useState(false)
  const isCorrect = Math.abs(value - card.answer) <= card.tolerance

  function handleCheck() {
    setChecked(true)
    onAnswer?.(isCorrect)
  }

  const visual = <Visual value={value} onChange={setValue} hideReadout />
  const controls = (
    <>
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
        {checked && !isCorrect && (
          <MissPanel
            heading={`Ei aivan - liukusäädin on nyt kohdassa ${value}${card.unit ? ` ${card.unit}` : ''}. Oikea vastaus: ${card.answer}${card.unit ? ` ${card.unit}` : ''}.`}
            explanation={card.explanation}
          >
            <button type="button" onClick={() => setChecked(false)} className="mt-2 text-sm font-semibold text-accent">
              Säädä uudelleen
            </button>
          </MissPanel>
        )}
      </AnimatePresence>
    </>
  )

  if (split) {
    return (
      <SplitColumns
        left={
          <>
            {split.question}
            <p className="mb-5 text-sm text-ink-dim">Säädä oikealla olevaa liukusäädintä ja tarkista vastauksesi.</p>
            {controls}
          </>
        }
        right={visual}
      />
    )
  }

  return (
    <>
      <div className="mb-4">{visual}</div>
      {controls}
    </>
  )
}

// The laptop exercise box's body, split like the open-answer problems: the
// question (and, for most exercises, the answer) on the left, the visual or
// the choices filling the tinted right side.
export function SplitColumns({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2">
      <div className="min-h-0 overflow-y-auto px-8 pb-8 pt-7">{left}</div>
      <div className="flex min-h-0 flex-col overflow-y-auto border-l border-ink/10 bg-surface-2/50 px-8 py-7">
        <div className="my-auto w-full">{right}</div>
      </div>
    </div>
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
          className={`w-full rounded-2xl border bg-surface px-4 py-3 text-lg font-mono outline-none focus:border-accent ${
            submitted && isCorrect ? 'border-good bg-good/10 text-good' : 'border-ink/15 text-ink disabled:opacity-60'
          }`}
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
        {submitted && !isCorrect && (
          <MissPanel
            heading={`Ei aivan. Oikea vastaus: ${card.answer}${card.unit ? ` ${card.unit}` : ''}`}
            explanation={card.explanation}
          >
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-sm font-semibold text-accent"
            >
              Yritä uudelleen
            </button>
          </MissPanel>
        )}
      </AnimatePresence>
    </>
  )
}

// The exercise itself: its visual and the choices, number input or slider.
// Shared by the phone feed card and the laptop exercise box, which passes
// `split` to lay the question and the exercise out in two columns.
export function ExerciseBody({ card, onAnswer, split = false }: ExerciseCardViewProps & { split?: boolean }) {
  const Visual = card.visual ? VISUALS[card.visual] : null
  const isSliderAnswer = card.kind === 'numeric' && card.answerVia === 'slider'

  if (split) {
    const question = <h3 className="mb-6 text-2xl font-semibold leading-snug text-ink">{card.question}</h3>
    const controls =
      card.kind === 'numeric' ? (
        <NumericExercise card={card} onAnswer={onAnswer} />
      ) : (
        <ChoiceExercise card={card} onAnswer={onAnswer} />
      )
    if (isSliderAnswer && Visual && card.kind === 'numeric') {
      return <SliderAnswerExercise card={card} Visual={Visual} onAnswer={onAnswer} split={{ question }} />
    }
    // With a visual, it gets the right side and the answer goes under the
    // question; without one, the answer itself fills the right.
    return Visual ? (
      <SplitColumns
        left={
          <>
            {question}
            {controls}
          </>
        }
        right={<Visual />}
      />
    ) : (
      <SplitColumns left={question} right={controls} />
    )
  }

  return (
    <>
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
    </>
  )
}

export default function ExerciseCardView({ card, onAnswer }: ExerciseCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isDesktop } = useLayout()
  // The exercise's one point, in a tile like the long tasks' (phones). An
  // answer in the full-screen view lights that view's edges, and the
  // card's tile and glow wait until it closes.
  const { points, celebrate, heldCelebrate, wrong, heldWrong, answer } = useQuickPoints(card.id, onAnswer, isExpanded)
  const kind = (
    <KindLabel
      icon={card.kind === 'numeric' ? <PencilIcon /> : <ListCheckIcon />}
      label={card.kind === 'numeric' ? 'Laske ja vastaa' : 'Monivalinta'}
    />
  )

  if (!isDesktop) {
    // Phones: the card's header only names the kind; the question opens
    // the content, so a long one fades out with the rest under "Vastaa
    // koko näytöllä" rather than pushing the answer off the card.
    return (
      <CardShell
        topic={card.topic}
        glow={
          <>
            <CardGlow trigger={celebrate} />
            <WrongShake trigger={wrong} />
          </>
        }
        header={
          <div className="flex items-center justify-between gap-3">
            <div className="-mb-2">{kind}</div>
            <PointsBadge points={points} celebrate={celebrate} hint={QUICK_POINTS_HINT} compact />
          </div>
        }
      >
        <ExpandableBox
          className="px-5 pb-5 pt-4"
          isExpanded={isExpanded}
          onExpandedChange={setIsExpanded}
          overflowAction={{ label: 'Vastaa koko näytöllä' }}
        >
          <h2 className={`mb-4 font-semibold leading-snug text-ink ${isExpanded ? 'mr-12 text-2xl' : 'text-xl'}`}>
            {card.question}
          </h2>
          <ExerciseBody card={card} onAnswer={answer} />
        </ExpandableBox>
        {isExpanded &&
          createPortal(
            <>
              <CardGlow trigger={heldCelebrate} fullScreen />
              <WrongShake trigger={heldWrong} className="" fullScreen />
            </>,
            document.body,
          )}
      </CardShell>
    )
  }

  return (
    <CardShell
      topic={card.topic}
      header={
        <>
          {kind}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.4 }}
            className="mb-6 text-3xl font-semibold leading-snug text-ink"
          >
            {card.question}
          </motion.h2>
        </>
      }
    >
      <ExpandableBox className="card-box-max" sizing="natural" isExpanded={isExpanded} onExpandedChange={setIsExpanded}>
        {isExpanded && <h2 className="mb-4 text-2xl font-semibold leading-snug text-ink">{card.question}</h2>}
        <ExerciseBody card={card} onAnswer={onAnswer} />
      </ExpandableBox>
    </CardShell>
  )
}
