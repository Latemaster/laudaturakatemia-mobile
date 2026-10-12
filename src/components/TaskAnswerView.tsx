import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { TaskCard } from '../types'
import AnswerEditor from './AnswerEditor'
import MathText from './MathText'
import ProblemBlocks from './ProblemBlocks'
import SolutionToggle from './SolutionToggle'
import { toKatexAnswer } from './mathAnswerFormat'
import { XIcon } from './icons'

interface TaskAnswerViewProps {
  card: TaskCard
  draft: string
  onDraftChange: (draft: string) => void
  submittedAnswer: string | null
  isEditing: boolean
  onEditingChange: (editing: boolean) => void
  onSubmit: (answer: string) => void
  showSolution: boolean
  onToggleSolution: () => void
  onClose: () => void
}

// Full-screen white view opened by "Vastaa tehtävään": the problem (or, once
// an answer is sent, optionally the solution) with the answer editor right
// below it, so the two read as one page instead of the question drifting
// away from an editor pinned to the bottom. Portalled to body so it escapes the
// scroll-snapping feed, like ExpandableBox's expanded state.
export default function TaskAnswerView({
  card,
  draft,
  onDraftChange,
  submittedAnswer,
  isEditing,
  onEditingChange,
  onSubmit,
  showSolution,
  onToggleSolution,
  onClose,
}: TaskAnswerViewProps) {
  const { problem } = card
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [showSolution])

  function cancel() {
    onDraftChange(submittedAnswer ?? '')
    if (submittedAnswer === null) onClose()
    else onEditingChange(false)
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`answer-title-${card.id}`}
      className="fixed inset-0 z-50 flex h-dvh flex-col bg-surface"
    >
      <div className="flex items-start justify-between gap-3 px-6 pb-3 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <h2 id={`answer-title-${card.id}`} className="pt-1.5 text-lg font-semibold leading-snug text-ink">
          {showSolution ? 'Ratkaisu' : `${problem.section} · ${problem.title}`}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          {submittedAnswer !== null && <SolutionToggle showSolution={showSolution} onToggle={onToggleSolution} />}
          <button
            type="button"
            onClick={onClose}
            aria-label="Sulje"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-ink/10"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]"
      >
        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          <ProblemBlocks blocks={showSolution ? problem.answerBlocks : problem.promptBlocks} />

          {isEditing || submittedAnswer === null ? (
            <AnswerEditor initialValue={draft} onChange={onDraftChange} onCancel={cancel} onSubmit={onSubmit} />
          ) : (
            <div className="rounded-2xl border border-good/30 bg-good/10 p-3">
              <p className="mb-1 text-sm font-semibold text-good">Vastaus lähetetty</p>
              <div className="text-sm leading-relaxed text-ink">
                <MathText content={toKatexAnswer(submittedAnswer)} />
              </div>
              <button
                type="button"
                onClick={() => onEditingChange(true)}
                className="mt-2 text-sm font-semibold text-accent"
              >
                Muokkaa vastausta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
