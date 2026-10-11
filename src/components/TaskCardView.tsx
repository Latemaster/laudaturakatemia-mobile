import { useState } from 'react'
import type { TaskCard } from '../types'
import CardShell from './CardShell'
import ExpandableBox from './ExpandableBox'
import KindLabel from './KindLabel'
import MathText from './MathText'
import ProblemBlocks from './ProblemBlocks'
import SolutionToggle from './SolutionToggle'
import TaskAnswerView from './TaskAnswerView'
import { toKatexAnswer } from './mathAnswerFormat'
import { PencilIcon } from './icons'

interface TaskCardViewProps {
  card: TaskCard
  onViewSolution?: () => void
}

export default function TaskCardView({ card, onViewSolution }: TaskCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState('')
  // Kept for the session only; nothing is persisted or checked yet.
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const { problem } = card
  const hasAnswered = submittedAnswer !== null

  function toggleSolution() {
    setShowSolution((v) => {
      if (!v) onViewSolution?.()
      return !v
    })
  }

  // The card itself always shows the problem; the solution is only offered
  // in the full-screen views, so leaving one resets it.
  function handleExpandedChange(expanded: boolean) {
    setIsExpanded(expanded)
    if (!expanded) setShowSolution(false)
  }

  function openAnswer() {
    setIsEditing(!hasAnswered)
    setAnswerOpen(true)
  }

  function closeAnswer() {
    setAnswerOpen(false)
    setShowSolution(false)
  }

  function submit(answer: string) {
    setSubmittedAnswer(answer)
    setDraft(answer)
    setIsEditing(false)
  }

  return (
    <CardShell topic={card.topic}>
      <KindLabel icon={<PencilIcon />} label="Tehtävä" />
      <h2 className="mb-3 text-lg font-semibold text-ink">
        {problem.section} · {problem.title}
      </h2>

      <ExpandableBox
        className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm"
        isExpanded={isExpanded}
        onExpandedChange={handleExpandedChange}
      >
        {isExpanded && hasAnswered && (
          // Sits left of ExpandableBox's close button, which is fixed at the
          // top right of the expanded view.
          <div className="mb-4 mr-12 flex justify-end">
            <SolutionToggle showSolution={showSolution} onToggle={toggleSolution} />
          </div>
        )}
        <ProblemBlocks blocks={showSolution ? problem.answerBlocks : problem.promptBlocks} />
      </ExpandableBox>

      {!isExpanded && (
        <div className="sticky bottom-0 z-20 mt-4 bg-gradient-to-t from-page from-60% to-transparent pb-4 pt-6">
          {hasAnswered ? (
            <button
              type="button"
              onClick={openAnswer}
              className="w-full rounded-2xl border border-good/30 bg-good-tint p-3 text-left shadow-md"
            >
              <span className="mb-1 block text-sm font-semibold text-good">Vastaus lähetetty</span>
              <span className="line-clamp-2 block text-sm leading-relaxed text-ink">
                <MathText content={toKatexAnswer(submittedAnswer)} />
              </span>
              <span className="mt-2 block text-sm font-semibold text-accent">Avaa vastaus ja ratkaisu</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAnswer}
              className="w-full rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md"
            >
              Vastaa tehtävään
            </button>
          )}
        </div>
      )}

      {answerOpen && (
        <TaskAnswerView
          card={card}
          draft={draft}
          onDraftChange={setDraft}
          submittedAnswer={submittedAnswer}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onSubmit={submit}
          showSolution={showSolution}
          onToggleSolution={toggleSolution}
          onClose={closeAnswer}
        />
      )}
    </CardShell>
  )
}
