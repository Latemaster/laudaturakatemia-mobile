import { useState } from 'react'
import { COURSE_MAP, COURSES } from '../data/courses'
import {
  EVALUATION_EXERCISES,
  exerciseMaxPoints,
  loadEvaluation,
  markedCount,
  saveEvaluation,
  scoredPoints,
  type EvaluationAttempt,
  type EvaluationExercise,
  type EvaluationState,
} from '../data/evaluation'
import { RUBRIC_EXERCISES } from '../data/rubrics'
import EvaluationView from './EvaluationView'
import RubricReview from './RubricReview'

const ALL_EXERCISES: EvaluationExercise[] = [...EVALUATION_EXERCISES, ...RUBRIC_EXERCISES]

// Course tasks that have a rubric, grouped by course in course order.
const RUBRIC_GROUPS = COURSES.map(({ code }) => ({
  code,
  exercises: RUBRIC_EXERCISES.filter((exercise) => exercise.topic.code === code),
})).filter((group) => group.exercises.length > 0)

// Draft rubrics are only loaded in dev or with ?drafts, so their presence
// means the reviewer is here.
const DRAFTS = RUBRIC_EXERCISES.filter((exercise) => exercise.status === 'draft')

interface ExerciseButtonProps {
  exercise: EvaluationExercise
  attempt: EvaluationAttempt | undefined
  draft?: boolean
  onOpen: () => void
}

function ExerciseButton({ exercise, attempt, draft, onOpen }: ExerciseButtonProps) {
  const max = exerciseMaxPoints(exercise)
  const progress = attempt ? markedCount(exercise, attempt.scores) : null
  const evaluated = progress !== null && progress.marked === progress.total
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-surface p-4 text-left shadow-sm transition-colors active:bg-surface-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${COURSE_MAP[exercise.topic.code].badgeClass}`}
          >
            {exercise.topic.code}
          </span>
          {draft && (
            <span className="inline-flex items-center rounded-full bg-ink/5 px-2 py-1 text-xs font-semibold text-ink-dim ring-1 ring-ink/10">
              Luonnos
            </span>
          )}
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
}

// Self-evaluation tab: the student answers an exercise and then scores it
// against a YTL-style point breakdown. Lists the hand-written test set and
// every course task that has a rubric.
export default function EvaluationList() {
  const [state, setState] = useState<EvaluationState>(loadEvaluation)
  const [openId, setOpenId] = useState<string | null>(null)
  const [mode, setMode] = useState<'practice' | 'review'>(DRAFTS.length > 0 ? 'review' : 'practice')
  const openExercise = ALL_EXERCISES.find((exercise) => exercise.id === openId)

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
        {DRAFTS.length > 0 && (
          <div role="tablist" className="mb-5 mt-3 flex rounded-xl bg-surface p-1 shadow-sm ring-1 ring-ink/5">
            {(
              [
                ['review', `Luonnokset (${DRAFTS.length})`],
                ['practice', 'Harjoittele'],
              ] as const
            ).map(([id, text]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
                  mode === id ? 'bg-accent text-white' : 'text-ink-dim'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {mode === 'review' ? (
          <RubricReview exercises={DRAFTS} />
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-dim">
              Vastaa tehtävään ja tarkista vastauksesi. Saat näkyviin pisteytyksen, jonka kriteerien perusteella arvioit
              itse, montako pistettä vastauksesi ansaitsee.
            </p>
            <div className="flex flex-col gap-3">
              {EVALUATION_EXERCISES.map((exercise) => (
                <ExerciseButton
                  key={exercise.id}
                  exercise={exercise}
                  attempt={state[exercise.id]}
                  onOpen={() => setOpenId(exercise.id)}
                />
              ))}
            </div>

            {RUBRIC_GROUPS.map((group) => (
              <section key={group.code} className="mt-8">
                <h2 className="mb-3 text-lg font-semibold text-ink">
                  {group.code} · {COURSE_MAP[group.code].name}
                </h2>
                <div className="flex flex-col gap-3">
                  {group.exercises.map((exercise) => (
                    <ExerciseButton
                      key={exercise.id}
                      exercise={exercise}
                      attempt={state[exercise.id]}
                      draft={exercise.status === 'draft'}
                      onOpen={() => setOpenId(exercise.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
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
