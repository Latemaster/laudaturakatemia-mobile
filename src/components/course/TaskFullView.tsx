import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import type { CriterionScores } from '../../data/evaluation'
import type { RubricExercise } from '../../data/rubrics'
import type { TaskCard } from '../../types'
import AnswerEditor, { type AnswerEditorHandle } from '../AnswerEditor'
import AnswerDisplay from '../AnswerDisplay'
import PartedAnswerEditor from '../PartedAnswerEditor'
import { answerPartsFromPrompt, type AnswerPart } from '../answerParts'
import ProblemBlocks from '../ProblemBlocks'
import RubricPanel from '../RubricPanel'
import { XIcon } from '../icons'

// Shown in place of the point breakdown for problems whose rubric hasn't
// been written yet: the student's answer and the model solution.
function SolutionPanel({ card, answer, onClose }: { card: TaskCard; answer: string; onClose: () => void }) {
  const parts = useMemo(() => answerPartsFromPrompt(card.problem.promptBlocks), [card.problem.promptBlocks])
  return (
    <div className="flex h-full flex-col bg-page">
      <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
        <div className="pt-1">
          <h2 className="text-lg font-semibold leading-snug text-ink">Pisteytys</h2>
          <p className="text-xs text-ink-dim">Tämän tehtävän pisteytys on vielä tulossa.</p>
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
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <section className="mb-4 rounded-2xl border border-ink/10 bg-surface-2 p-3">
          <p className="mb-1 text-sm font-semibold text-ink">Oma vastauksesi</p>
          <AnswerDisplay answer={answer} parts={parts} />
        </section>
        <section className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-ink">Mallivastaus</h3>
          <div className="text-sm leading-relaxed text-ink">
            <ProblemBlocks blocks={card.problem.answerBlocks} />
          </div>
        </section>
      </div>
    </div>
  )
}

export type FullViewMode = 'answer' | 'check'

// The answer side's share of the full view's width, set by dragging the
// divider and kept across exercises and visits. Null is the default split.
const SPLIT_KEY = 'laudatur.fullViewSplit'
const MIN_ANSWER_PX = 380
const MIN_PROBLEM_PX = 320

function loadSplit(): number | null {
  try {
    const stored = Number(window.localStorage.getItem(SPLIT_KEY))
    return stored > 0 && stored < 1 ? stored : null
  } catch {
    return null
  }
}

function saveSplit(split: number | null): void {
  try {
    if (split === null) window.localStorage.removeItem(SPLIT_KEY)
    else window.localStorage.setItem(SPLIT_KEY, split.toFixed(4))
  } catch {
    // Storage can be unavailable; the split then lasts for the session.
  }
}

// The divider between the problem and the answer side: drag either way,
// double-click for the default split.
function SplitHandle({ onSplitChange }: { onSplitChange: (split: number | null) => void }) {
  function startDrag(e: ReactPointerEvent<HTMLDivElement>) {
    e.preventDefault()
    const handle = e.currentTarget
    const row = handle.parentElement?.parentElement
    if (!row) return
    handle.setPointerCapture(e.pointerId)
    let latest: number | null = null
    const move = (ev: PointerEvent) => {
      const rect = row.getBoundingClientRect()
      const answerPx = Math.min(rect.width - MIN_PROBLEM_PX, Math.max(MIN_ANSWER_PX, rect.right - ev.clientX))
      latest = answerPx / rect.width
      onSplitChange(latest)
    }
    const end = () => {
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', end)
      handle.removeEventListener('pointercancel', end)
      if (latest !== null) saveSplit(latest)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', end)
    handle.addEventListener('pointercancel', end)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Muuta tehtävän ja vastauksen jakoa"
      title="Vedä muuttaaksesi jakoa · tuplaklikkaus palauttaa"
      onPointerDown={startDrag}
      onDoubleClick={() => {
        onSplitChange(null)
        saveSplit(null)
      }}
      className="group absolute inset-y-0 -left-1.5 z-10 flex w-3 cursor-col-resize touch-none items-center justify-center"
    >
      <span className="h-12 w-1 rounded-full bg-ink/15 transition-colors group-hover:bg-accent group-active:bg-accent" />
    </div>
  )
}

// Stepping to the previous / next exercise without leaving the full view;
// a missing handler disables its button.
export interface FullViewNav {
  position: string
  onPrev?: () => void
  onNext?: () => void
}

interface TaskFullViewProps {
  card: TaskCard
  title: string
  // The coloured level tag from the exercise box.
  levelTag: ReactNode
  mode: FullViewMode
  onModeChange: (mode: FullViewMode) => void
  rubricExercise: RubricExercise | undefined
  parts: AnswerPart[] | null
  answer: string | null
  draft: string
  onDraftChange: (draft: string) => void
  onSend: (answer: string) => void
  scores: CriterionScores
  onScore: (criterionId: string, points: number | undefined) => void
  onResetScores: () => void
  onClose: () => void
  nav?: FullViewNav
}

// Laptop Kurssit › Tehtävät, full screen: answering a problem too long for
// the exercise box, and the point breakdown (Pisteytys) for every problem.
// The problem stays on the left; the answer box, or Pisteytys once the
// answer is sent (it repeats the answer), fills the right.
export default function TaskFullView({
  card,
  title,
  levelTag,
  mode,
  onModeChange,
  rubricExercise,
  parts,
  answer,
  draft,
  onDraftChange,
  onSend,
  scores,
  onScore,
  onResetScores,
  onClose,
  nav,
}: TaskFullViewProps) {
  const editorRef = useRef<AnswerEditorHandle>(null)
  const insertFormula = useCallback((latex: string) => editorRef.current?.insertFormula(latex), [])
  const checking = mode === 'check' && answer !== null
  const [split, setSplit] = useState<number | null>(loadSplit)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const editorProps = {
    ref: editorRef,
    initialValue: draft,
    onChange: onDraftChange,
    onSubmit: onSend,
    submitLabel: answer === null ? 'Lähetä vastaus' : 'Lähetä uudelleen',
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex h-dvh flex-col bg-surface">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-ink/10 px-8 py-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <span className="text-sm font-semibold text-ink-dim">
            {card.topic.code} · {card.topic.name}
          </span>
          <h2 className="text-xl font-bold leading-snug text-ink">{title}</h2>
          {levelTag}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Sulje koko näyttö"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-md ring-1 ring-ink/10"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </header>

      {/* Side by side across the whole width: the problem on the left
          (scrolling if it's long), and on the right the answer box filling
          the height, or Pisteytys once the answer is sent. */}
      <div className="flex min-h-0 flex-1">
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-8 pb-8 pt-6">
          <div className="text-base leading-relaxed text-ink">
            <ProblemBlocks blocks={card.problem.promptBlocks} onFormulaTap={checking ? undefined : insertFormula} />
          </div>
          {!checking && (
            <p className="mt-4 text-xs text-ink-dim">Napauta tehtävän kaavaa, niin se lisätään vastaukseesi.</p>
          )}
        </div>

        <div
          className={`relative flex shrink-0 flex-col border-l border-ink/10 bg-surface-2/50 ${
            split === null ? 'w-[min(56rem,55%)]' : ''
          }`}
          style={split === null ? undefined : { width: `${split * 100}%` }}
        >
          <SplitHandle onSplitChange={setSplit} />
          {checking ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              aria-label="Pisteytys"
              className="min-h-0 flex-1"
            >
              {rubricExercise ? (
                <RubricPanel
                  exercise={rubricExercise}
                  answer={answer}
                  scores={scores}
                  onScore={onScore}
                  onReset={onResetScores}
                  onClose={() => onModeChange('answer')}
                />
              ) : (
                <SolutionPanel card={card} answer={answer} onClose={() => onModeChange('answer')} />
              )}
            </motion.div>
          ) : (
            // The formula picker opening makes the box taller (and this
            // column scroll) rather than squeezing the writing area.
            <section className="answer-roomy flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
              <div className="flex min-h-[24rem] flex-1 flex-col">
                {parts ? (
                  <PartedAnswerEditor parts={parts} layout="tabs" {...editorProps} />
                ) : (
                  <AnswerEditor fill {...editorProps} />
                )}
              </div>
              {answer !== null && (
                <button
                  type="button"
                  onClick={() => onModeChange('check')}
                  className="mt-3 shrink-0 self-start text-sm font-semibold text-accent"
                >
                  Näytä pisteytys
                </button>
              )}
            </section>
          )}
        </div>
      </div>

      {nav && (
        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-ink/10 px-8 py-3">
          <span className="mr-1 text-xs font-semibold text-ink-dim">{nav.position}</span>
          <button
            type="button"
            onClick={nav.onPrev}
            disabled={!nav.onPrev}
            className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition-colors hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-surface"
          >
            ← Edellinen
          </button>
          <button
            type="button"
            onClick={nav.onNext}
            disabled={!nav.onNext}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            Seuraava →
          </button>
        </footer>
      )}
    </div>,
    document.body,
  )
}
