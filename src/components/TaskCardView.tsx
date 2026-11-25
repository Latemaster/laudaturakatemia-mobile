import { useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import type { TaskCard } from '../types'
import type { EvaluationAttempt } from '../data/evaluation'
import { RUBRIC_EXERCISES } from '../data/rubrics'
import CardShell from './CardShell'
import ExpandableBox from './ExpandableBox'
import KindLabel from './KindLabel'
import MathText from './MathText'
import ProblemBlocks from './ProblemBlocks'
import RubricPanel from './RubricPanel'
import SolutionToggle from './SolutionToggle'
import TaskAnswerView from './TaskAnswerView'
import { toKatexAnswer } from './mathAnswerFormat'
import { ExpandIcon, PencilIcon } from './icons'
import { answerPartsFromPrompt, answerPartsFromRubric } from './answerParts'
import PointsBadge, { CardGlow, pointsColor, useTaskPoints } from './course/PointsBadge'
import { evaluationId } from './course/exerciseState'
import { WrongShake } from './Celebrations'
import { awardPoints } from '../data/points'
import { useLayout } from '../layout/LayoutContext'

interface TaskCardViewProps {
  card: TaskCard
  // The saved answer and self-scores, shared with Kurssit and Arviointi.
  attempt?: EvaluationAttempt
  onTaskAnswer?: (answer: string) => void
  onScore?: (criterionId: string, points: number | undefined) => void
  onResetScores?: () => void
  onViewSolution?: () => void
}

// Phone feed task card. Like the laptop exercise box, the header's top
// right is the points tile: "– / N p" until the answer is self-scored,
// then the tally on a filling scale. Sending an answer goes straight to
// Pisteytys, whose "Tallenna pisteet" returns here and fills the tile.
export default function TaskCardView({
  card,
  attempt,
  onTaskAnswer,
  onScore,
  onResetScores,
  onViewSolution,
}: TaskCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const submittedAnswer = attempt?.answer ? attempt.answer : null
  const [draft, setDraft] = useState(submittedAnswer ?? '')
  const [showSolution, setShowSolution] = useState(false)
  const [checkOpen, setCheckOpen] = useState(false)
  const [celebrate, setCelebrate] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const handleOverflowChange = useCallback((overflowing: boolean) => setIsOverflowing(overflowing), [])
  const { problem } = card
  const { isDesktop } = useLayout()
  const rubricExercise = useMemo(() => RUBRIC_EXERCISES.find((e) => e.id === evaluationId(card)), [card])
  const parts = useMemo(
    () => answerPartsFromRubric(rubricExercise?.parts) ?? answerPartsFromPrompt(problem.promptBlocks),
    [rubricExercise, problem.promptBlocks],
  )
  const points = useTaskPoints(rubricExercise, attempt?.scores)
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
    onTaskAnswer?.(answer)
    setDraft(answer)
    setIsEditing(false)
    // Scoring follows the answer, as on the laptop. Problems without a
    // rubric stay in the answer view, where the solution can be opened.
    if (rubricExercise) setCheckOpen(true)
  }

  // "Tallenna pisteet": back to the card, where the tile fills up.
  function saveScores() {
    setCheckOpen(false)
    closeAnswer()
    if (points?.done && points.scored === 0) {
      setWrong((c) => c + 1)
      return
    }
    if (points?.scored) awardPoints(card.id, points.scored)
    setCelebrate((c) => c + 1)
  }

  const openCheck = hasAnswered && rubricExercise ? () => setCheckOpen(true) : undefined

  return (
    <CardShell
      topic={card.topic}
      glow={
        <>
          <CardGlow trigger={celebrate} points={points} />
          <WrongShake trigger={wrong} />
        </>
      }
      header={
        <div className={`flex items-start justify-between gap-3 ${isDesktop ? 'mb-3' : ''}`}>
          <div className="min-w-0">
            <KindLabel icon={<PencilIcon />} label="Tehtävä" />
            <h2 className={`font-semibold text-ink ${isDesktop ? 'text-2xl' : 'text-lg leading-snug'}`}>
              {problem.section} · {problem.title}
            </h2>
          </div>
          {points && (
            <div className="shrink-0">
              <PointsBadge points={points} onOpen={openCheck} celebrate={celebrate} compact />
            </div>
          )}
        </div>
      }
    >
      <ExpandableBox
        className={
          isDesktop ? 'card-box-max rounded-2xl border border-ink/10 bg-surface p-6 shadow-sm' : 'px-5 pb-5 pt-4'
        }
        sizing={isDesktop ? 'natural' : 'fill'}
        isExpanded={isExpanded}
        onExpandedChange={handleExpandedChange}
        onOverflowChange={handleOverflowChange}
        // Unanswered, the footer button takes over (see below). Once
        // answered, a button over the fade opens the whole problem.
        overflowAction={isDesktop ? undefined : hasAnswered ? { label: 'Näytä koko tehtävä' } : 'fade'}
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

      {/* Phones: the card's footer, always the same height so it can't
          change whether the problem overflows. A problem too long for the
          card is answered "koko näytöllä": the answer view shows all of it
          above the editor. */}
      {!isExpanded && (
        <div className={isDesktop ? 'mt-4' : 'shrink-0 border-t border-ink/10 px-4 py-3'}>
          {hasAnswered ? (
            <button
              type="button"
              onClick={openAnswer}
              className="w-full rounded-2xl bg-surface p-3 text-left"
              // Outlined in the points' colour, as the laptop box is.
              style={{ boxShadow: `0 0 0 2px ${pointsColor(points)}` }}
            >
              <span className="mb-1 block text-sm font-semibold" style={{ color: pointsColor(points) }}>
                Vastaus lähetetty
              </span>
              <span className="line-clamp-2 block text-sm leading-relaxed text-ink">
                <MathText content={toKatexAnswer(submittedAnswer)} />
              </span>
              <span className="mt-2 block text-sm font-semibold text-accent">Avaa vastaus ja ratkaisu</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={openAnswer}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md"
            >
              {isOverflowing && !isDesktop && <ExpandIcon className="h-4 w-4" />}
              {isOverflowing && !isDesktop ? 'Vastaa koko näytöllä' : 'Vastaa tehtävään'}
            </button>
          )}
        </div>
      )}

      {answerOpen && (
        <TaskAnswerView
          card={card}
          parts={parts}
          draft={draft}
          onDraftChange={setDraft}
          submittedAnswer={submittedAnswer}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onSubmit={submit}
          showSolution={showSolution}
          onToggleSolution={toggleSolution}
          onClose={closeAnswer}
          onOpenCheck={openCheck}
        />
      )}

      {checkOpen &&
        rubricExercise &&
        submittedAnswer !== null &&
        createPortal(
          // Over the answer view when opened from it, so closing returns
          // there; "Tallenna pisteet" closes both.
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pisteytys"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] h-dvh"
          >
            <RubricPanel
              exercise={rubricExercise}
              answer={submittedAnswer}
              scores={attempt?.scores ?? {}}
              onScore={(id, value) => onScore?.(id, value)}
              onReset={() => onResetScores?.()}
              onClose={() => setCheckOpen(false)}
              onSave={saveScores}
            />
          </motion.div>,
          document.body,
        )}
    </CardShell>
  )
}
