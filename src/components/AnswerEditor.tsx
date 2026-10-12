import { lazy, Suspense, useRef, useState } from 'react'
import type { EditorMode, MathAnswerEditorHandle } from './MathAnswerEditor'
import MathSymbolPicker from './MathSymbolPicker'
import { MathSymbolIcon } from './icons'

// The formula editor pulls in MathLive, which is heavier than the rest of
// the app, so it only loads once someone starts answering.
const MathAnswerEditor = lazy(() => import('./MathAnswerEditor'))

interface AnswerEditorProps {
  initialValue: string
  onChange: (answer: string) => void
  onCancel: () => void
  onSubmit: (answer: string) => void
  submitLabel?: string
}

// The answer editor with its symbol picker and Peruuta / Lähetä, shown at
// the bottom of TaskAnswerView.
export default function AnswerEditor({
  initialValue,
  onChange,
  onCancel,
  onSubmit,
  submitLabel = 'Lähetä',
}: AnswerEditorProps) {
  const [answer, setAnswer] = useState(initialValue)
  const [showSymbols, setShowSymbols] = useState(false)
  const [mode, setMode] = useState<EditorMode>('text')
  const editorRef = useRef<MathAnswerEditorHandle>(null)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-3 shadow-md">
      <div className="relative">
        <Suspense fallback={<div className="min-h-[4.5rem] w-full animate-pulse rounded-xl border border-ink/10 bg-page" />}>
          <MathAnswerEditor
            ref={editorRef}
            initialValue={initialValue}
            placeholder="Kirjoita vastauksesi tähän..."
            onChange={(value) => {
              setAnswer(value)
              onChange(value)
            }}
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
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-ink-dim">
          Peruuta
        </button>
        <button
          type="button"
          disabled={!answer.trim()}
          onClick={() => onSubmit(answer)}
          className="flex-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}
