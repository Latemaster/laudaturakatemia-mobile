import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { CriterionScores, EvaluationExercise } from '../data/evaluation'
import AnswerEditor from './AnswerEditor'
import MathText from './MathText'
import ProblemBlocks from './ProblemBlocks'
import RubricPanel from './RubricPanel'
import { toKatexAnswer } from './mathAnswerFormat'
import { XIcon } from './icons'

interface EvaluationViewProps {
  exercise: EvaluationExercise
  answer: string | null
  scores: CriterionScores
  onAnswer: (answer: string) => void
  onScore: (criterionId: string, points: number | undefined) => void
  onReset: () => void
  onClose: () => void
}

// Full-screen view for a self-evaluated exercise: the problem and answer
// editor, and after "Tarkista vastaus" the point breakdown beside them.
// On wide screens the breakdown is a column next to the answer; on phones
// it slides in over it and repeats the student's answer at its top.
export default function EvaluationView({
  exercise,
  answer,
  scores,
  onAnswer,
  onScore,
  onReset,
  onClose,
}: EvaluationViewProps) {
  const [isEditing, setIsEditing] = useState(answer === null)
  const [draft, setDraft] = useState(answer ?? '')
  const [showRubric, setShowRubric] = useState(false)

  function cancel() {
    setDraft(answer ?? '')
    if (answer === null) onClose()
    else setIsEditing(false)
  }

  function check(value: string) {
    onAnswer(value)
    setIsEditing(false)
    setShowRubric(true)
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`eval-title-${exercise.id}`}
      className="fixed inset-0 z-50 flex h-dvh bg-surface"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3 px-6 pb-3 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <h2 id={`eval-title-${exercise.id}`} className="pt-1.5 text-lg font-semibold leading-snug text-ink">
            {exercise.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-ink/10"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          <div className="mx-auto flex w-full max-w-md flex-col gap-5">
            <ProblemBlocks blocks={exercise.promptBlocks} />

            {isEditing || answer === null ? (
              <AnswerEditor
                initialValue={draft}
                onChange={setDraft}
                onCancel={cancel}
                onSubmit={check}
                submitLabel="Tarkista vastaus"
              />
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-surface-2 p-3">
                <p className="mb-1 text-sm font-semibold text-ink-dim">Vastauksesi</p>
                <div className="text-sm leading-relaxed text-ink">
                  <MathText content={toKatexAnswer(answer)} />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-accent"
                  >
                    Muokkaa vastausta
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRubric(true)}
                    disabled={showRubric}
                    className="flex-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    Tarkista vastaus
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRubric && answer !== null && (
          <motion.aside
            key="rubric"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            aria-label="Pisteytys"
            className="fixed inset-y-0 right-0 z-10 w-full shadow-2xl sm:max-w-md lg:static lg:w-[28rem] lg:max-w-none lg:shrink-0 lg:border-l lg:border-ink/10 lg:shadow-none"
          >
            <RubricPanel
              exercise={exercise}
              answer={answer}
              scores={scores}
              onScore={onScore}
              onReset={onReset}
              onClose={() => setShowRubric(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
