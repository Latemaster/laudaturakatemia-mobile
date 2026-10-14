import { useState } from 'react'
import { COURSE_MAP } from '../data/courses'
import { exerciseMaxPoints, partMaxPoints } from '../data/evaluation'
import type { RubricExercise } from '../data/rubrics'
import {
  currentVerdict,
  feedbackMessage,
  loadReview,
  rubricVersion,
  saveReview,
  type ReviewState,
  type ReviewVerdict,
} from '../data/rubricReview'
import type { RubricPart } from '../types'
import MathText from './MathText'
import ProblemBlocks from './ProblemBlocks'
import { CheckIcon, CopyIcon } from './icons'

type Filter = 'open' | 'fix' | 'all'

interface RubricReviewProps {
  exercises: RubricExercise[]
}

// Review mode for draft rubrics: each draft is shown in full (problem,
// model solution, criteria, notes and the author's doubts) with Hyväksy /
// Korjattavaa buttons. Verdicts stay in this browser until they are copied
// out as one feedback message for a Claude session (data/rubricReview.ts).
export default function RubricReview({ exercises }: RubricReviewProps) {
  const [state, setState] = useState<ReviewState>(loadReview)
  const [filter, setFilter] = useState<Filter>('open')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')

  const verdicts = exercises.map((exercise) => currentVerdict(state, exercise))
  const accepted = verdicts.filter((v) => v?.decision === 'accept').length
  const fixes = verdicts.filter((v) => v?.decision === 'fix').length
  const open = exercises.length - accepted - fixes
  const shown = exercises.filter((_, i) => {
    if (filter === 'open') return verdicts[i] === undefined
    if (filter === 'fix') return verdicts[i]?.decision === 'fix'
    return true
  })

  function update(change: (prev: ReviewState) => ReviewState) {
    setState((prev) => {
      const next = change(prev)
      saveReview(next)
      return next
    })
    setCopyState('idle')
  }

  function setVerdict(exercise: RubricExercise, verdict: Omit<ReviewVerdict, 'version'> | undefined) {
    update((prev) => {
      const next = { ...prev.verdicts }
      if (verdict === undefined) delete next[exercise.id]
      else next[exercise.id] = { ...verdict, version: rubricVersion(exercise) }
      return { ...prev, verdicts: next }
    })
  }

  async function copyFeedback() {
    try {
      await navigator.clipboard.writeText(feedbackMessage(exercises, state))
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <div className="pb-28">
      <p className="mb-4 text-sm text-ink-dim">
        Käy luonnokset läpi ja merkitse ne hyväksytyiksi tai korjattaviksi. Lopuksi kopioi palaute ja liitä se
        Claude-istuntoon, joka tekee korjaukset ja merkitsee hyväksytyt valmiiksi.
      </p>

      <div role="tablist" className="mb-4 flex gap-1.5">
        {(
          [
            ['open', `Avoimet ${open}`],
            ['fix', `Korjattavat ${fixes}`],
            ['all', `Kaikki ${exercises.length}`],
          ] as const
        ).map(([id, text]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              filter === id ? 'bg-accent text-white' : 'bg-surface text-ink-dim ring-1 ring-ink/10'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {shown.length === 0 && (
          <p className="rounded-2xl bg-surface p-4 text-sm text-ink-dim shadow-sm">
            {filter === 'open' ? 'Kaikki luonnokset on käyty läpi. Kopioi palaute alta.' : 'Ei rubriikkeja tässä näkymässä.'}
          </p>
        )}
        {shown.map((exercise) => (
          <ReviewCard
            key={exercise.id}
            exercise={exercise}
            verdict={currentVerdict(state, exercise)}
            onVerdict={(verdict) => setVerdict(exercise, verdict)}
          />
        ))}
      </div>

      <section className="mt-6 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-ink/5">
        <h3 className="mb-1 font-semibold text-ink">Yleiset säännöt</h3>
        <p className="mb-2 text-xs text-ink-dim">
          Säännöt, joiden pitää koskea kaikkia tulevia rubriikkeja. Ne lisätään Korjauslokiin.
        </p>
        <textarea
          value={state.generalNotes}
          onChange={(event) => {
            const generalNotes = event.target.value
            update((prev) => ({ ...prev, generalNotes }))
          }}
          rows={3}
          placeholder="Esim. Älä anna pistettä pelkästä kaavan kirjoittamisesta."
          className="w-full rounded-xl border border-ink/10 bg-surface-2 p-3 text-sm text-ink placeholder:text-ink-dim/70"
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-surface/95 px-6 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
          <p className="text-xs font-semibold text-ink-dim">
            <span className="text-good">{accepted} hyväksytty</span> · <span className="text-bad">{fixes} korjattavaa</span>{' '}
            · {open} avoinna
          </p>
          <button
            type="button"
            onClick={copyFeedback}
            disabled={accepted + fixes === 0 && !state.generalNotes.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {copyState === 'copied' ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            {copyState === 'copied' ? 'Kopioitu' : 'Kopioi palaute'}
          </button>
        </div>
        {copyState === 'failed' && (
          <div className="mx-auto mt-2 w-full max-w-md">
            <p className="mb-1 text-xs text-bad">Kopiointi ei onnistunut. Valitse teksti ja kopioi se itse:</p>
            <textarea
              readOnly
              value={feedbackMessage(exercises, state)}
              rows={5}
              onFocus={(event) => event.target.select()}
              className="w-full rounded-xl border border-ink/10 bg-surface-2 p-2 text-xs text-ink"
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface ReviewCardProps {
  exercise: RubricExercise
  verdict: ReviewVerdict | undefined
  onVerdict: (verdict: Omit<ReviewVerdict, 'version'> | undefined) => void
}

function ReviewCard({ exercise, verdict, onVerdict }: ReviewCardProps) {
  const ring =
    verdict?.decision === 'accept' ? 'ring-2 ring-good' : verdict?.decision === 'fix' ? 'ring-2 ring-bad' : 'ring-1 ring-ink/10'

  return (
    <article className={`rounded-2xl bg-surface p-4 shadow-sm ${ring}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[exercise.topic.code].badgeClass}`}
        >
          {exercise.topic.code}
        </span>
        <span className="text-xs font-semibold text-ink-dim">
          {exercise.problemId} · {exerciseMaxPoints(exercise)} p
        </span>
      </div>
      <h3 className="mb-3 font-semibold text-ink">{exercise.title}</h3>

      <div className="mb-4 text-sm">
        <ProblemBlocks blocks={exercise.promptBlocks} />
      </div>

      {exercise.reviewNote && (
        <div className="mb-4 rounded-xl bg-bad/10 p-3 text-xs leading-relaxed text-ink">
          <p className="mb-1 font-semibold text-bad">Huomio tarkistajalle</p>
          {exercise.reviewNote}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {exercise.parts.map((part, index) => (
          <PartView key={part.label ?? index} part={part} />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          aria-pressed={verdict?.decision === 'accept'}
          onClick={() => onVerdict(verdict?.decision === 'accept' ? undefined : { decision: 'accept', comment: '' })}
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
            verdict?.decision === 'accept' ? 'bg-good text-white' : 'bg-good/10 text-good'
          }`}
        >
          Hyväksy
        </button>
        <button
          type="button"
          aria-pressed={verdict?.decision === 'fix'}
          onClick={() =>
            onVerdict(verdict?.decision === 'fix' ? undefined : { decision: 'fix', comment: verdict?.comment ?? '' })
          }
          className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
            verdict?.decision === 'fix' ? 'bg-bad text-white' : 'bg-bad/10 text-bad'
          }`}
        >
          Korjattavaa
        </button>
      </div>
      {verdict?.decision === 'fix' && (
        <textarea
          value={verdict.comment}
          onChange={(event) => onVerdict({ decision: 'fix', comment: event.target.value })}
          rows={3}
          autoFocus
          placeholder="Mitä pitää korjata? Esim. b-kohdan pisteet liian tiukat, hyväksy myös likiarvo."
          className="mt-2 w-full rounded-xl border border-ink/10 bg-surface-2 p-3 text-sm text-ink placeholder:text-ink-dim/70"
        />
      )}
    </article>
  )
}

function PartView({ part }: { part: RubricPart }) {
  return (
    <section className="rounded-xl bg-surface-2 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-ink">{part.label ? `Kohta ${part.label}` : 'Kriteerit'}</h4>
        <span className="text-xs font-semibold text-ink-dim">{partMaxPoints(part)} p</span>
      </div>
      <div className="mb-3 rounded-lg bg-surface p-2.5 text-sm leading-relaxed text-ink">
        <p className="mb-1 text-xs font-semibold text-ink-dim">Mallivastaus</p>
        <MathText content={part.solution} />
      </div>
      <ul className="flex flex-col divide-y divide-ink/10">
        {part.criteria.map((criterion) => (
          <li key={criterion.id} className="flex items-start justify-between gap-3 py-2 text-sm leading-relaxed text-ink">
            <div className="min-w-0">
              <MathText content={criterion.text} />
              {criterion.impliedBy && (
                <p className="mt-0.5 text-xs text-ink-dim">Sisältyy oikeaan lopputulokseen ({criterion.impliedBy})</p>
              )}
            </div>
            <span className="shrink-0 pt-0.5 text-xs font-semibold text-ink-dim">{criterion.points} p</span>
          </li>
        ))}
      </ul>
      {part.notes && part.notes.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-ink-dim">
          {part.notes.map((note, i) => (
            <li key={i}>
              <MathText content={note} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
