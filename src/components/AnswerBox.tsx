import { lazy, Suspense, useRef, useState } from 'react'
import ExpandableBox from './ExpandableBox'
import type { EditorMode, MathAnswerEditorHandle } from './MathAnswerEditor'
import MathSymbolPicker from './MathSymbolPicker'
import MathText from './MathText'
import { toKatexAnswer } from './mathAnswerFormat'
import { MathSymbolIcon } from './icons'

// The formula editor pulls in MathLive, which is heavier than the rest of
// the app, so it only loads once someone starts answering.
const MathAnswerEditor = lazy(() => import('./MathAnswerEditor'))

type AnswerState = 'closed' | 'editing' | 'submitted'

export default function AnswerBox() {
  const [state, setState] = useState<AnswerState>('closed')
  const [answer, setAnswer] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSymbols, setShowSymbols] = useState(false)
  const [mode, setMode] = useState<EditorMode>('text')
  const editorRef = useRef<MathAnswerEditorHandle>(null)

  function startEditing() {
    setMode('text')
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

  // z-20 keeps the panel above the task box's expand button, which would
  // otherwise poke through once the palette makes it tall.
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
            <Suspense fallback={<div className="min-h-[4.5rem] w-full animate-pulse rounded-xl border border-ink/10 bg-page" />}>
              <MathAnswerEditor
                ref={editorRef}
                initialValue={answer}
                placeholder="Kirjoita vastauksesi tähän..."
                onChange={setAnswer}
                onModeChange={setMode}
              />
            </Suspense>
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

          {showSymbols && (
            <MathSymbolPicker
              mode={mode}
              onInsert={(snippet) => editorRef.current?.insert(snippet.insert)}
              onNewFormula={() => editorRef.current?.newFormula()}
              onExitFormula={() => editorRef.current?.exitFormula()}
            />
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
              <MathText content={toKatexAnswer(answer)} />
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
