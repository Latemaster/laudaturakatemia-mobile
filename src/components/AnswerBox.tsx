import { useLayoutEffect, useRef, useState } from 'react'
import ExpandableBox from './ExpandableBox'
import MathSymbolPicker, { type MathSnippet } from './MathSymbolPicker'
import MathText from './MathText'
import { MathSymbolIcon } from './icons'
import { insertMathSnippet } from './insertMathSnippet'

type AnswerState = 'closed' | 'editing' | 'submitted'

export default function AnswerBox() {
  const [state, setState] = useState<AnswerState>('closed')
  const [answer, setAnswer] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSymbols, setShowSymbols] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const pendingCaret = useRef<number | null>(null)

  // The caret can only be placed once React has written the new value into
  // the textarea, so it's parked here and applied after the render.
  useLayoutEffect(() => {
    const caret = pendingCaret.current
    const textarea = textareaRef.current
    if (caret === null || !textarea) return
    pendingCaret.current = null
    textarea.focus()
    textarea.setSelectionRange(caret, caret)
  }, [answer])

  function handleInsert(snippet: MathSnippet) {
    const textarea = textareaRef.current
    const selStart = textarea?.selectionStart ?? answer.length
    const selEnd = textarea?.selectionEnd ?? answer.length
    const next = insertMathSnippet(answer, selStart, selEnd, snippet)
    pendingCaret.current = next.caret
    setAnswer(next.text)
  }

  function startEditing() {
    setState('editing')
  }

  function cancelEditing() {
    setShowSymbols(false)
    setState('closed')
  }

  function submit() {
    setShowSymbols(false)
    setState('submitted')
  }

  const hasMath = answer.includes('$')

  // z-20 keeps the panel above the task box's expand button, which would
  // otherwise poke through once the palette and preview make it tall.
  return (
    <div className="sticky bottom-0 z-20 mt-4 bg-gradient-to-t from-page from-60% to-transparent pb-4 pt-6">
      {state === 'closed' && (
        <button
          type="button"
          onClick={startEditing}
          className="w-full rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md"
        >
          Vastaa tehtävään
        </button>
      )}

      {state === 'editing' && (
        <div className="rounded-2xl border border-ink/10 bg-surface p-3 shadow-md">
          <div className="relative">
            <textarea
              ref={textareaRef}
              autoFocus
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Kirjoita vastauksesi tähän..."
              className="w-full resize-none rounded-xl border border-ink/10 bg-page py-2 pl-3 pr-11 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-dim/60"
            />
            <button
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => setShowSymbols((v) => !v)}
              aria-label={showSymbols ? 'Sulje symbolit' : 'Lisää matemaattinen symboli'}
              aria-pressed={showSymbols}
              className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                showSymbols ? 'bg-accent text-white' : 'bg-surface text-ink-dim ring-1 ring-ink/10 active:bg-ink/5'
              }`}
            >
              <MathSymbolIcon className="h-4 w-4" />
            </button>
          </div>

          {showSymbols && <MathSymbolPicker onInsert={handleInsert} />}

          {hasMath && (
            <div className="mt-2 rounded-xl bg-surface-2 px-3 py-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-dim">Esikatselu</p>
              <div className="text-sm leading-relaxed text-ink">
                <MathText content={answer} />
              </div>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-ink-dim"
            >
              Peruuta
            </button>
            <button
              type="button"
              disabled={!answer.trim()}
              onClick={submit}
              className="flex-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Lähetä
            </button>
          </div>
        </div>
      )}

      {state === 'submitted' && (
        <div className="rounded-2xl border border-good/30 bg-good-tint p-3 shadow-md">
          {/* A long answer would otherwise grow this sticky panel until it
              swallowed the task box above it, so it's capped here and gets
              the same expand button as the task box when it overflows. */}
          <ExpandableBox
            sizing="natural"
            className="max-h-40"
            fadeClassName="from-good-tint"
            buttonClassName="-right-1 -top-2"
            isExpanded={isExpanded}
            onExpandedChange={setIsExpanded}
          >
            <p className="mb-1 text-sm font-semibold text-good">Vastaus lähetetty</p>
            <div className="text-sm leading-relaxed text-ink">
              <MathText content={answer} />
            </div>
          </ExpandableBox>
          <button
            type="button"
            onClick={startEditing}
            className="mt-2 text-sm font-semibold text-accent"
          >
            Muokkaa vastausta
          </button>
        </div>
      )}
    </div>
  )
}
