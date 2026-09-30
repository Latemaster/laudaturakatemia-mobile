import type { MathSnippet } from './MathSymbolPicker'

export interface Insertion {
  text: string
  caret: number
}

// Drops a palette snippet into the answer at the current selection. Answers
// use the same $...$ inline-math convention as the task text, so a snippet
// inserted in plain prose gets wrapped in $...$; one inserted inside an open
// math span (an odd number of $ before the caret) goes in bare. A snippet
// inserted right after a closing $ is merged into that span instead of
// opening a second one, since "$\pi$$\theta$" would otherwise read as a
// $$display$$ block.
export function insertMathSnippet(text: string, selStart: number, selEnd: number, snippet: MathSnippet): Insertion {
  let start = selStart
  let before = text.slice(0, start)
  const selected = text.slice(selStart, selEnd)
  let after = text.slice(selEnd)

  let inMath = (before.match(/\$/g) ?? []).length % 2 === 1
  let merged = false
  if (!inMath && selected === '' && /(^|[^$])\$$/.test(before)) {
    start -= 1
    before = text.slice(0, start)
    after = text.slice(start)
    inMath = true
    merged = true
  }

  let body = snippet.latex
  let caretInBody = body.length
  const firstSlot = body.indexOf('{}')
  if (firstSlot !== -1) {
    if (selected) {
      body = body.slice(0, firstSlot + 1) + selected + body.slice(firstSlot + 1)
      const nextSlot = body.indexOf('{}', firstSlot + 2 + selected.length)
      caretInBody = nextSlot !== -1 ? nextSlot + 1 : body.length
    } else {
      caretInBody = firstSlot + 1
    }
  }

  if (!inMath) {
    body = `$${body}$`
    caretInBody += 1
  }

  // With no slot to fill, park the caret after the closing $ so prose typed
  // next stays prose; the merge rule above still lets the next symbol join
  // this span. Inside an existing span the caret simply stays where it is.
  if (firstSlot === -1) {
    if (!inMath) caretInBody = body.length
    else if (merged) caretInBody = body.length + 1
  }

  return { text: before + body + after, caret: start + caretInBody }
}
