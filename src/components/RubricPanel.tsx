import { useState } from 'react'
import {
  exerciseMaxPoints,
  markedCount,
  partMaxPoints,
  partScore,
  scoredPoints,
  type CriterionScores,
  type EvaluationExercise,
  type RubricCriterion,
  type RubricPart,
} from '../data/evaluation'
import MathText from './MathText'
import { toKatexAnswer } from './mathAnswerFormat'
import { ChevronDownIcon, XIcon } from './icons'

interface RubricPanelProps {
  exercise: EvaluationExercise
  answer: string
  scores: CriterionScores
  onScore: (criterionId: string, points: number | undefined) => void
  onReset: () => void
  onClose: () => void
}

// The point breakdown shown beside the answer after "Tarkista vastaus":
// each part's model solution and scoring criteria, in the style of the YTL
// "hyvän vastauksen piirteet". The student marks how many points their own
// answer earns for each criterion.
export default function RubricPanel({ exercise, answer, scores, onScore, onReset, onClose }: RubricPanelProps) {
  const [showAnswer, setShowAnswer] = useState(true)
  const max = exerciseMaxPoints(exercise)
  const total = scoredPoints(exercise, scores)
  const { marked, total: criteriaCount } = markedCount(exercise, scores)
  const done = marked === criteriaCount

  return (
    <div className="flex h-full flex-col bg-page">
      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="pt-1">
          <h2 className="text-lg font-semibold leading-snug text-ink">Pisteytys</h2>
          <p className="text-xs text-ink-dim">Käy kriteerit läpi ja anna vastauksellesi pisteet.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Sulje pisteytys"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-ink/10"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="sticky top-0 z-10 -mx-5 bg-page px-5 pb-3">
          <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-ink-dim">{done ? 'Pisteesi' : 'Pisteet tähän mennessä'}</span>
              <span className="text-2xl font-bold text-ink">
                {total}
                <span className="text-base font-semibold text-ink-dim"> / {max} p</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className={`h-full rounded-full transition-[width] ${done ? 'bg-good' : 'bg-accent'}`}
                style={{ width: `${(total / max) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-dim">
              {done ? 'Kaikki kriteerit arvioitu.' : `Arvioitu ${marked} / ${criteriaCount} kriteeriä`}
            </p>
          </div>
        </div>

        <section className="mb-4 rounded-2xl border border-ink/10 bg-surface-2 p-3">
          <button
            type="button"
            onClick={() => setShowAnswer((v) => !v)}
            aria-expanded={showAnswer}
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-ink"
          >
            Oma vastauksesi
            <ChevronDownIcon className={`h-4 w-4 text-ink-dim transition-transform ${showAnswer ? 'rotate-180' : ''}`} />
          </button>
          {showAnswer && (
            <div className="scrollbar-hide mt-2 max-h-48 overflow-y-auto text-sm leading-relaxed text-ink">
              <MathText content={toKatexAnswer(answer)} />
            </div>
          )}
        </section>

        <div className="flex flex-col gap-4">
          {exercise.parts.map((part, index) => (
            <RubricPartCard key={part.label ?? index} part={part} scores={scores} onScore={onScore} />
          ))}
        </div>

        {marked > 0 && (
          <button type="button" onClick={onReset} className="mt-5 text-sm font-semibold text-ink-dim">
            Nollaa arviointi
          </button>
        )}
      </div>
    </div>
  )
}

interface RubricPartCardProps {
  part: RubricPart
  scores: CriterionScores
  onScore: (criterionId: string, points: number | undefined) => void
}

function RubricPartCard({ part, scores, onScore }: RubricPartCardProps) {
  const [showSolution, setShowSolution] = useState(false)
  const max = partMaxPoints(part)
  const score = partScore(part, scores)

  return (
    <section className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-ink">{part.label ? `Kohta ${part.label}` : 'Arviointikriteerit'}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            score === null ? 'bg-ink/5 text-ink-dim' : 'bg-good/15 text-good'
          }`}
        >
          {score === null ? `${max} p` : `${score} / ${max} p`}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setShowSolution((v) => !v)}
        aria-expanded={showSolution}
        className="mb-3 flex items-center gap-1 text-sm font-semibold text-accent"
      >
        {showSolution ? 'Piilota mallivastaus' : 'Näytä mallivastaus'}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showSolution ? 'rotate-180' : ''}`} />
      </button>
      {showSolution && (
        <div className="mb-4 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-ink">
          <MathText content={part.solution} />
        </div>
      )}

      <ul className="flex flex-col divide-y divide-ink/10">
        {part.criteria.map((criterion) => (
          <CriterionRow
            key={criterion.id}
            criterion={criterion}
            value={scores[criterion.id]}
            onChange={(points) => onScore(criterion.id, points)}
          />
        ))}
      </ul>

      {part.notes && part.notes.length > 0 && (
        <div className="mt-3 rounded-xl bg-page/60 p-3 text-xs leading-relaxed text-ink-dim">
          <p className="mb-1 font-semibold">Huomioita</p>
          <ul className="list-disc space-y-1 pl-4">
            {part.notes.map((note, i) => (
              <li key={i}>
                <MathText content={note} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

interface CriterionRowProps {
  criterion: RubricCriterion
  value: number | undefined
  onChange: (points: number | undefined) => void
}

function CriterionRow({ criterion, value, onChange }: CriterionRowProps) {
  const options = Array.from({ length: criterion.points + 1 }, (_, i) => i)

  return (
    <li className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-3 text-sm leading-relaxed text-ink">
        <div className="min-w-0">
          <MathText content={criterion.text} />
        </div>
        <span className="shrink-0 pt-0.5 text-xs font-semibold text-ink-dim">{criterion.points} p</span>
      </div>
      <div role="radiogroup" aria-label="Pisteesi tästä kriteeristä" className="flex gap-1.5">
        {options.map((points) => {
          const selected = value === points
          const tone =
            points === 0 ? 'bg-bad text-white' : points === criterion.points ? 'bg-good text-white' : 'bg-accent text-white'
          return (
            <button
              key={points}
              type="button"
              role="radio"
              aria-checked={selected}
              // Tapping the selected option again clears it.
              onClick={() => onChange(selected ? undefined : points)}
              className={`min-w-[3rem] rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                selected ? tone : 'bg-page/70 text-ink-dim active:bg-ink/10'
              }`}
            >
              {points} p
            </button>
          )
        })}
      </div>
    </li>
  )
}
