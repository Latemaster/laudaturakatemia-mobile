import katex from 'katex'
import { Fragment, useMemo } from 'react'

interface MathTextProps {
  content: string
}

function renderPlainText(text: string, keyPrefix: string) {
  return (
    <Fragment key={keyPrefix}>
      {text.split('\n').map((line, i, arr) => (
        <Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </Fragment>
      ))}
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
function renderSegments(content: string) {
  const parts = content.split(/(\$\$[\s\S]+?\$\$)/g)

  return parts.map((part, index) => {
    const key = String(index)
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

export default function MathText({ content }: MathTextProps) {
  const segments = useMemo(() => renderSegments(content), [content])
  return <>{segments}</>
}
