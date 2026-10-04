// The answer is stored as one string in the same $...$ inline-math
// convention the task text uses, so MathText can render it once submitted.
// The editor turns that string into text nodes and formula boxes and back.

export type AnswerSegment = { type: 'text'; text: string } | { type: 'math'; latex: string }

// MathLive macros that KaTeX doesn't know, mapped to what they render as.
const KATEX_REPLACEMENTS: [RegExp, string][] = [
  [/\\exponentialE\b/g, 'e'],
  [/\\imaginaryI\b/g, 'i'],
  [/\\imaginaryJ\b/g, 'j'],
  [/\\differentialD\b/g, 'd'],
  [/\\placeholder\{[^}]*\}/g, '{}'],
]

// Prepares a stored answer for MathText: swaps MathLive-only macros for
// plain KaTeX and renders each formula in display style, as the editor did.
export function toKatexAnswer(answer: string): string {
  const cleaned = KATEX_REPLACEMENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), answer)
  return cleaned.replace(/\$([^$\n]+?)\$/g, (_, latex: string) => `$\\displaystyle ${latex}$`)
}

export function parseAnswer(answer: string): AnswerSegment[] {
  const segments: AnswerSegment[] = []
  for (const part of answer.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g)) {
    if (!part) continue
    if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
      segments.push({ type: 'math', latex: part.slice(2, -2).trim() })
    } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      segments.push({ type: 'math', latex: part.slice(1, -1).trim() })
    } else {
      segments.push({ type: 'text', text: part })
    }
  }
  return segments
}

export function joinSegments(segments: AnswerSegment[]): string {
  let out = ''
  for (const segment of segments) {
    if (segment.type === 'text') {
      out += segment.text
      continue
    }
    const latex = segment.latex.trim()
    if (!latex) continue
    // Two formulas back to back would read as a $$display$$ block.
    if (out.endsWith('$')) out += ' '
    out += `$${latex}$`
  }
  return out
}
