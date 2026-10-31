import type { ProblemBlock, RubricPart } from '../types'

// A multi-part problem ("a)", "b)", ...) is answered kohta by kohta: one
// editor per kohta, each showing what it's worth. The answer is still
// stored as one string, "a) ...\n\nb) ...", so everything that shows or
// keeps answers works unchanged; these helpers convert between the two.

export interface AnswerPart {
  label: string
  // Unknown for problems split from their prompt (no rubric yet).
  points?: number
}

// The kohdat of a rubric, or null when it isn't split into labelled parts
// (a single-part problem keeps the plain editor).
export function answerPartsFromRubric(parts: RubricPart[] | undefined): AnswerPart[] | null {
  if (!parts || parts.length < 2 || parts.some((part) => !part.label)) return null
  return parts.map((part) => ({
    label: part.label!,
    points: part.criteria.reduce((sum, criterion) => sum + criterion.points, 0),
  }))
}

// The kohdat of a problem without a rubric, read from its prompt: lines
// starting "a)", "b)"... in order from a). Null when there are fewer than
// two, so the problem keeps a single answer box.
export function answerPartsFromPrompt(blocks: ProblemBlock[]): AnswerPart[] | null {
  const text = blocks.map((block) => (block.type === 'text' ? block.content : '')).join('\n')
  const parts: AnswerPart[] = []
  for (const match of text.matchAll(/(?:^|\n)\s*([a-h])\)/g)) {
    const expected = String.fromCharCode(97 + parts.length)
    if (match[1] === expected) parts.push({ label: `${expected})` })
  }
  return parts.length >= 2 ? parts : null
}

export function joinPartAnswers(parts: AnswerPart[], answers: string[]): string {
  return parts
    .map((part, i) => ({ label: part.label, text: (answers[i] ?? '').trim() }))
    .filter(({ text }) => text)
    .map(({ label, text }) => `${label} ${text}`)
    .join('\n\n')
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Inverse of joinPartAnswers. Text that doesn't start with a kohta label
// (e.g. an answer written before the problem was split) goes to the first
// kohta so nothing the student wrote is lost.
export function splitPartAnswers(answer: string, parts: AnswerPart[]): string[] {
  const result = parts.map(() => '')
  if (!answer) return result
  const found: { index: number; start: number; contentStart: number }[] = []
  let from = 0
  parts.forEach((part, index) => {
    const pattern = new RegExp(`(^|\\n\\n)${escapeRegExp(part.label)} `, 'g')
    pattern.lastIndex = from
    const match = pattern.exec(answer)
    if (!match) return
    const start = match.index + match[1].length
    found.push({ index, start, contentStart: start + part.label.length + 1 })
    from = start + part.label.length + 1
  })
  if (found.length === 0 || found[0].start > 0) {
    result[0] = answer.slice(0, found[0]?.start ?? answer.length).replace(/\n+$/, '')
  }
  found.forEach((entry, k) => {
    const end = k + 1 < found.length ? found[k + 1].start : answer.length
    const text = answer.slice(entry.contentStart, end).replace(/\n+$/, '')
    result[entry.index] = result[entry.index] ? `${result[entry.index]}\n\n${text}` : text
  })
  return result
}
