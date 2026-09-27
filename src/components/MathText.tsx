import katex from 'katex'
import { Fragment, useMemo } from 'react'

interface MathTextProps {
  content: string
}

// Some source problems embed bare LaTeX prose escapes (decimal-comma and
// thin-space/percent spacing commands) outside of $...$ math. Those commands
// are never rendered here, so normalize them to plain characters.
function cleanProseEscapes(text: string): string {
  return text
    .replace(/\{,\}/g, ',')
    .replace(/\\,/g, ' ')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
}

// Splits on **bold** spans that stay within a single line, so a stray pair
// of ** inside a code snippet's exponentiation operator can't be mistaken
// for a bold marker (this path never sees code blocks, which are carved out
// before it runs).
function renderPlainText(text: string, keyPrefix: string) {
  const lines = cleanProseEscapes(text).split('\n')
  return (
    <Fragment key={keyPrefix}>
      {lines.map((line, i) => {
        const boldParts = line.split(/(\*\*[^*\n]+?\*\*)/g)
        return (
          <Fragment key={i}>
            {boldParts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                <Fragment key={j}>{part}</Fragment>
              ),
            )}
            {i < lines.length - 1 && <br />}
          </Fragment>
        )
      })}
    </Fragment>
  )
}

// Splits a text run on single $...$ inline math, rendering everything else
// as plain text with newlines preserved.
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\$[^$\n]+?\$)/g)
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
      try {
        const html = katex.renderToString(part.slice(1, -1), { throwOnError: false, displayMode: false })
        return <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
      } catch {
        return renderPlainText(part, key)
      }
    }
    return renderPlainText(part, key)
  })
}

// Some source problems have malformed/asymmetric $$ vs $ delimiters around
// \begin{cases} blocks. Extracting well-formed $$...$$ blocks in their own
// pass first, before splitting the surrounding text on single $...$, keeps
// a single-$ neighboring a $$ block from "stealing" one of its delimiters
// and swallowing unrelated prose into math mode.
function renderMathSegments(content: string, keyPrefix: string) {
  const parts = content.split(/(\$\$[\s\S]+?\$\$)/g)

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (part.startsWith('$$') && part.endsWith('$$')) {
      try {
        const html = katex.renderToString(part.slice(2, -2), { throwOnError: false, displayMode: true })
        return <span key={key} className="block my-2" dangerouslySetInnerHTML={{ __html: html }} />
      } catch {
        return <Fragment key={key}>{renderInline(part, key)}</Fragment>
      }
    }
    return <Fragment key={key}>{renderInline(part, key)}</Fragment>
  })
}

type LineGroup = { type: 'list'; items: string[] } | { type: 'text'; text: string }

// Groups a block's lines so consecutive "- "/"* " lines become one list
// instead of plain text lines with a stray leading dash. Content with no
// bullet lines collapses back to a single text group holding the original
// string untouched, so existing non-bulleted content renders exactly as
// before.
function groupLines(content: string): LineGroup[] {
  const groups: LineGroup[] = []

  for (const line of content.split('\n')) {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/)
    const last = groups[groups.length - 1]
    if (bulletMatch) {
      if (last?.type === 'list') last.items.push(bulletMatch[1])
      else groups.push({ type: 'list', items: [bulletMatch[1]] })
    } else if (last?.type === 'text') {
      last.text += '\n' + line
    } else {
      groups.push({ type: 'text', text: line })
    }
  }

  return groups
}

// Renders a code-free block, turning grouped bullet lines into a real
// <ul>/<li> list (each item still runs through the math/bold pipeline)
// and passing everything else straight through as before.
function renderTextBlock(content: string, keyPrefix: string) {
  return groupLines(content).map((group, index) => {
    const key = `${keyPrefix}-g${index}`
    if (group.type === 'list') {
      return (
        <ul key={key} className="my-2 list-disc space-y-1 pl-5 marker:text-ink-dim">
          {group.items.map((item, i) => (
            <li key={i}>{renderMathSegments(item, `${key}-${i}`)}</li>
          ))}
        </ul>
      )
    }
    return <Fragment key={key}>{renderMathSegments(group.text, key)}</Fragment>
  })
}

// Fenced ```code``` blocks are carved out first and rendered verbatim in
// monospace, so their content (which often contains ** as an exponentiation
// operator) never reaches the math or bold-span parsing below.
function renderSegments(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g)

  return parts.map((part, index) => {
    const key = String(index)
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\n/, '').replace(/\n$/, '')
      return (
        <pre key={key} className="my-2 overflow-x-auto rounded-xl bg-surface-2 p-3 font-mono text-sm text-ink">
          {code}
        </pre>
      )
    }
    return <Fragment key={key}>{renderTextBlock(part, key)}</Fragment>
  })
}

export default function MathText({ content }: MathTextProps) {
  const segments = useMemo(() => renderSegments(content), [content])
  return <>{segments}</>
}
