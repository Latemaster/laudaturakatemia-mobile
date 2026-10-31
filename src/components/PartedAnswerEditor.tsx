import { forwardRef, lazy, Suspense, useImperativeHandle, useRef, useState } from 'react'
import type { EditorMode, MathAnswerEditorHandle } from './MathAnswerEditor'
import MathSymbolPicker from './MathSymbolPicker'
import type { AnswerEditorHandle } from './AnswerEditor'
import { joinPartAnswers, splitPartAnswers, type AnswerPart } from './answerParts'
import { CheckIcon, CopyIcon, MathSymbolIcon } from './icons'

const MathAnswerEditor = lazy(() => import('./MathAnswerEditor'))

interface PartedAnswerEditorProps {
  parts: AnswerPart[]
  initialValue: string
  onChange: (answer: string) => void
  // Peruuta is left out when there's nothing to cancel back to, e.g. an
  // editor that is always shown under the problem.
  onCancel?: () => void
  onSubmit: (answer: string) => void
  submitLabel?: string
  // 'stacked' (default): one box per kohta, one under the other. 'tabs':
  // a single box filling the editor's height, with a button per kohta to
  // switch which one it edits (the laptop exercise workspace).
  layout?: 'stacked' | 'tabs'
}

// The answer editor for a problem with kohdat a), b), c)...: one box per
// kohta, labelled with its points, so a long answer is written (and later
// checked) piece by piece the way the YTL scores it. Same symbol picker,
// formula copy and Peruuta / Lähetä as the single-box AnswerEditor; the
// picker and formula taps from the question go to the kohta being edited.
const PartedAnswerEditor = forwardRef<AnswerEditorHandle, PartedAnswerEditorProps>(function PartedAnswerEditor(
  { parts, initialValue, onChange, onCancel, onSubmit, submitLabel = 'Lähetä', layout = 'stacked' },
  ref,
) {
  // Like AnswerEditor, the editors only read the initial value on mount.
  const [initialAnswers] = useState(() => splitPartAnswers(initialValue, parts))
  const [answers, setAnswers] = useState<string[]>(initialAnswers)
  const [active, setActive] = useState(0)
  const [showSymbols, setShowSymbols] = useState(false)
  const [modes, setModes] = useState<EditorMode[]>(() => parts.map(() => 'text'))
  const editorRefs = useRef<(MathAnswerEditorHandle | null)[]>([])

  const totalPoints = parts.every((part) => part.points !== undefined)
    ? parts.reduce((sum, part) => sum + (part.points ?? 0), 0)
    : null
  const tabs = layout === 'tabs'
  const answeredCount = answers.filter((a) => a.trim()).length
  const joined = joinPartAnswers(parts, answers)

  useImperativeHandle(ref, () => ({
    insertFormula(latex) {
      editorRefs.current[active]?.insert(latex)
    },
  }))

  function update(index: number, value: string) {
    // Built from the current answers rather than inside a state updater,
    // so the parent's onChange isn't called while React renders.
    const next = [...answers]
    next[index] = value
    setAnswers(next)
    onChange(joinPartAnswers(parts, next))
  }

  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-surface p-3 shadow-sm ${tabs ? 'flex h-full min-h-0 flex-1 flex-col' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <span className="text-sm font-semibold text-ink">Vastaa kohdittain</span>
        <span className="text-xs font-semibold text-ink-dim">
          {answeredCount} / {parts.length} kohtaa{totalPoints !== null && ` · ${totalPoints} p`}
        </span>
      </div>

      {tabs && (
        <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Kohdat">
          {parts.map((part, index) => {
            const isActive = index === active
            const answered = answers[index].trim() !== ''
            return (
              <button
                key={part.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(index)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-accent text-white shadow-sm' : 'text-ink ring-1 ring-ink/10 hover:bg-surface-2'
                }`}
              >
                {part.label}
                {answered && <CheckIcon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-good'}`} />}
                {part.points !== undefined && (
                  <span className={`text-xs ${isActive ? 'text-white/75' : 'text-ink-dim'}`}>{part.points} p</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className={tabs ? 'flex min-h-0 flex-1 flex-col' : 'flex flex-col gap-3'}>
        {parts.map((part, index) => {
          // Tabs show only the active kohta; its editor remounts on each
          // switch, so it starts from that kohta's current answer.
          if (tabs && index !== active) return null
          const isActive = index === active
          const answered = answers[index].trim() !== ''
          const letter = part.label.replace(/\)$/, '')
          return (
            <section
              key={part.label}
              onFocusCapture={() => setActive(index)}
              onPointerDown={() => setActive(index)}
              aria-label={`Kohta ${part.label}`}
              className={
                tabs
                  ? 'flex min-h-0 flex-1 flex-col'
                  : `rounded-xl p-2.5 ring-1 transition-colors ${isActive ? 'bg-accent/[0.04] ring-accent/40' : 'ring-ink/10'}`
              }
            >
              <div className={`mb-2 flex items-center gap-2 ${tabs ? 'hidden' : ''}`}>
                <span
                  className={`flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                    answered ? 'bg-good text-white' : isActive ? 'bg-accent text-white' : 'bg-ink/10 text-ink-dim'
                  }`}
                >
                  {answered ? <CheckIcon className="h-3.5 w-3.5" /> : letter}
                </span>
                <span className="text-sm font-semibold text-ink">Kohta {part.label}</span>
                {part.points !== undefined && (
                  <span className="ml-auto rounded-full bg-ink/5 px-2.5 py-0.5 text-xs font-semibold text-ink-dim">
                    {part.points} p
                  </span>
                )}
              </div>

              <div className={tabs ? 'answer-fill-editor relative min-h-[8rem] flex-1 overflow-y-auto' : 'relative'}>
                <Suspense
                  fallback={<div className="min-h-[4.5rem] w-full animate-pulse rounded-xl border border-ink/10 bg-page" />}
                >
                  <MathAnswerEditor
                    ref={(el) => (editorRefs.current[index] = el)}
                    initialValue={tabs ? answers[index] : initialAnswers[index]}
                    placeholder={`Kohdan ${part.label} vastaus...`}
                    onChange={(value) => update(index, value)}
                    onModeChange={(mode) =>
                      setModes((prev) => {
                        const next = [...prev]
                        next[index] = mode
                        return next
                      })
                    }
                  />
                </Suspense>
                <button
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (isActive) setShowSymbols((v) => !v)
                    else {
                      setActive(index)
                      setShowSymbols(true)
                    }
                  }}
                  aria-label={isActive && showSymbols ? 'Sulje symbolit' : 'Lisää matemaattinen symboli'}
                  aria-pressed={isActive && showSymbols}
                  className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isActive && showSymbols
                      ? 'bg-accent text-white'
                      : 'bg-surface text-ink-dim ring-1 ring-ink/10 active:bg-ink/5'
                  }`}
                >
                  <MathSymbolIcon className="h-4 w-4" />
                </button>
              </div>

              {isActive && modes[index] === 'math' && (
                <button
                  type="button"
                  onPointerDown={(e) => e.preventDefault()}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editorRefs.current[index]?.duplicateFormula()}
                  className="mt-2 flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent active:bg-accent/20"
                >
                  <CopyIcon className="h-3.5 w-3.5" />
                  Kopioi kaava uudelle riville
                </button>
              )}

              {isActive && showSymbols && (
                <MathSymbolPicker
                  mode={modes[index]}
                  onInsert={(snippet) => editorRefs.current[index]?.insert(snippet.insert)}
                  onNewFormula={() => editorRefs.current[index]?.newFormula()}
                  onExitFormula={() => editorRefs.current[index]?.exitFormula()}
                  onClose={() => setShowSymbols(false)}
                />
              )}
            </section>
          )
        })}
      </div>

      <div className="mt-3 flex gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-ink-dim">
            Peruuta
          </button>
        )}
        <button
          type="button"
          disabled={!joined}
          onClick={() => onSubmit(joined)}
          className="flex-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
})

export default PartedAnswerEditor
