import { useState } from 'react'
import { COURSE_MAP } from '../data/courses'
import {
  EVALUATION_EXERCISES,
  exerciseMaxPoints,
  loadEvaluation,
  markedCount,
  saveEvaluation,
  scoredPoints,
  type EvaluationAttempt,
  type EvaluationState,
} from '../data/evaluation'
import EvaluationView from './EvaluationView'

// Test tab for self-evaluation: a handful of exercises the student answers
// and then scores against a YTL-style point breakdown.
export default function EvaluationList() {
  const [state, setState] = useState<EvaluationState>(loadEvaluation)
  const [openId, setOpenId] = useState<string | null>(null)
  const openExercise = EVALUATION_EXERCISES.find((exercise) => exercise.id === openId)

  function update(exerciseId: string, change: (prev: EvaluationAttempt) => EvaluationAttempt) {
    setState((prev) => {
      const next = { ...prev, [exerciseId]: change(prev[exerciseId] ?? { answer: '', scores: {} }) }
      saveEvaluation(next)
      return next
    })
  }

  return (
    <div className="grid-bg h-dvh overflow-y-auto bg-page px-6 pb-10 pt-[calc(env(safe-area-inset-top)+4.5rem)]">
      <div className="mx-auto w-full max-w-md">
        <h1 className="mb-1 text-2xl font-bold text-ink">Arviointi</h1>
        <p className="mb-6 text-sm text-ink-dim">
          Vastaa tehtävään ja tarkista vastauksesi. Saat näkyviin pisteytyksen, jonka kriteerien perusteella arvioit
          itse, montako pistettä vastauksesi ansaitsee.
        </p>
        <div className="flex flex-col gap-3">
          {EVALUATION_EXERCISES.map((exercise) => {
            const attempt = state[exercise.id]
            const max = exerciseMaxPoints(exercise)
            const progress = attempt ? markedCount(exercise, attempt.scores) : null
            const evaluated = progress !== null && progress.marked === progress.total
            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => setOpenId(exercise.id)}
                className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface p-4 text-left shadow-sm transition-colors active:bg-surface-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[exercise.topic.code].badgeClass}`}
                  >
                    {exercise.topic.code}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink-dim">
                    {exercise.length === 'short' ? 'Lyhyt' : 'Pitkä'} · {max} p
                  </span>
                </div>
                <span className="font-semibold text-ink">{exercise.title}</span>
                <span className={`text-xs font-semibold ${evaluated ? 'text-good' : 'text-ink-dim'}`}>
                  {attempt === undefined
                    ? 'Ei vastattu'
                    : evaluated
                      ? `Arvioitu: ${scoredPoints(exercise, attempt.scores)} / ${max} p`
                      : `Vastattu · arvioitu ${progress!.marked} / ${progress!.total} kriteeriä`}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {openExercise && (
        <EvaluationView
          key={openExercise.id}
          exercise={openExercise}
          answer={state[openExercise.id]?.answer ?? null}
          scores={state[openExercise.id]?.scores ?? {}}
          onAnswer={(answer) => update(openExercise.id, (prev) => ({ ...prev, answer }))}
          onScore={(criterionId, points) =>
            update(openExercise.id, (prev) => {
              const scores = { ...prev.scores }
              if (points === undefined) delete scores[criterionId]
              else scores[criterionId] = points
              return { ...prev, scores }
            })
          }
          onReset={() => update(openExercise.id, (prev) => ({ ...prev, scores: {} }))}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  )
}
