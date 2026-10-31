import { useState } from 'react'
import { loadEvaluation, saveEvaluation, type EvaluationAttempt, type EvaluationState } from '../../data/evaluation'
import type { Card } from '../../types'

// Shared by the laptop exercise box's two homes, Kurssit › Tehtävät and the
// Suositellut feed.

// The problem sets' exam parts, by how hard their problems are.
export const LEVEL_LABELS: Record<string, string> = {
  'Osa I': 'Perus',
  'Osa II': 'Keskivaikeat',
  'Osa III': 'Vaikeat',
  'Osa IV': 'Soveltavat',
}

export const QUICK_LABEL = 'Pikatehtävät'

// The level tag an exercise shows.
export function levelOf(card: Card): string {
  if (card.type === 'task') return LEVEL_LABELS[card.problem.section] ?? card.problem.section
  return QUICK_LABEL
}

// The key an exercise's answer and self-scores are stored under, the same
// one the Arviointi page uses. Problem ids repeat across courses, so the
// course is part of it.
export function evaluationId(card: Card): string {
  return card.type === 'task' ? `${card.topic.code.toLowerCase()}-${card.problem.id}` : card.id
}

// Answers and self-scores, persisted with the Arviointi page's storage, and
// the callbacks the exercise box takes for one exercise.
export function useEvaluation() {
  const [evaluation, setEvaluation] = useState<EvaluationState>(loadEvaluation)

  function update(id: string, change: (prev: EvaluationAttempt) => EvaluationAttempt) {
    setEvaluation((prev) => {
      const next = { ...prev, [id]: change(prev[id] ?? { answer: '', scores: {} }) }
      saveEvaluation(next)
      return next
    })
  }

  function forExercise(card: Card) {
    const id = evaluationId(card)
    return {
      attempt: evaluation[id],
      onTaskAnswer: (answer: string) => update(id, (prev) => ({ ...prev, answer })),
      onScore: (criterionId: string, points: number | undefined) =>
        update(id, (prev) => {
          const scores = { ...prev.scores }
          if (points === undefined) delete scores[criterionId]
          else scores[criterionId] = points
          return { ...prev, scores }
        }),
      onResetScores: () => update(id, (prev) => ({ ...prev, scores: {} })),
    }
  }

  return forExercise
}
