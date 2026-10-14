import type { RubricExercise } from './rubrics'

// The reviewer's verdicts on draft rubrics, made in the Arviointi tab's
// review mode. The site is static, so verdicts can't be written back to the
// repo; they are kept in this browser and copied out as a feedback message
// that is pasted into a Claude session, which applies them.

export interface ReviewVerdict {
  decision: 'accept' | 'fix'
  comment: string
  // Fingerprint of the rubric the verdict was given on. When a fix changes
  // the rubric, the old verdict no longer applies and the rubric shows as
  // open again.
  version: string
}

export interface ReviewState {
  verdicts: Record<string, ReviewVerdict>
  // Free-text rules meant for the Korjausloki in docs/rubric-guidelines.md.
  generalNotes: string
}

const STORAGE_KEY = 'laudatur.rubricReview'

export function rubricVersion(exercise: RubricExercise): string {
  const text = JSON.stringify(exercise.parts)
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0
  return (hash >>> 0).toString(36)
}

// The verdict for a rubric, or undefined when there is none for its current
// content.
export function currentVerdict(state: ReviewState, exercise: RubricExercise): ReviewVerdict | undefined {
  const verdict = state.verdicts[exercise.id]
  return verdict && verdict.version === rubricVersion(exercise) ? verdict : undefined
}

export function loadReview(): ReviewState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return { verdicts: {}, generalNotes: '' }
    const parsed = JSON.parse(stored) as Partial<ReviewState>
    return {
      verdicts: typeof parsed.verdicts === 'object' && parsed.verdicts !== null ? parsed.verdicts : {},
      generalNotes: typeof parsed.generalNotes === 'string' ? parsed.generalNotes : '',
    }
  } catch {
    return { verdicts: {}, generalNotes: '' }
  }
}

export function saveReview(state: ReviewState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable; the review still works for this visit.
  }
}

function label(exercise: RubricExercise): string {
  return `${exercise.topic.code} ${exercise.problemId} (${exercise.section}, ${exercise.title.split(' · ').pop()})`
}

// The message the reviewer pastes into a Claude session.
export function feedbackMessage(exercises: RubricExercise[], state: ReviewState): string {
  const accepted: string[] = []
  const fixes: string[] = []
  for (const exercise of exercises) {
    const verdict = currentVerdict(state, exercise)
    if (verdict?.decision === 'accept') accepted.push(label(exercise))
    if (verdict?.decision === 'fix') fixes.push(`- ${label(exercise)}: ${verdict.comment.trim() || '(ei kommenttia)'}`)
  }
  const lines = [
    'Rubriikkien tarkistus. Merkitse hyväksytyt "reviewed"-tilaan, korjaa korjattavat ja lisää yleiset säännöt Korjauslokiin (docs/rubric-guidelines.md).',
    '',
    `Hyväksytyt (${accepted.length}):`,
    ...(accepted.length > 0 ? accepted.map((item) => `- ${item}`) : ['- ei yhtään']),
    '',
    `Korjattavat (${fixes.length}):`,
    ...(fixes.length > 0 ? fixes : ['- ei yhtään']),
  ]
  if (state.generalNotes.trim()) lines.push('', 'Yleiset säännöt Korjauslokiin:', state.generalNotes.trim())
  return lines.join('\n')
}
