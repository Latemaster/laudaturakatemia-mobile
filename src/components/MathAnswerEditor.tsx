import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { MathfieldElement } from 'mathlive'
import 'mathlive/fonts.css'
import { joinSegments, parseAnswer, type AnswerSegment } from './mathAnswerFormat'

// Fonts come from the CSS import above; MathLive must not try to fetch
// them (or its key-click sounds) itself.
MathfieldElement.fontsDirectory = null
MathfieldElement.soundsDirectory = null

export type EditorMode = 'text' | 'math'

export interface MathAnswerEditorHandle {
  // Inserts a MathLive snippet (#? = placeholder, #0 = selection, #@ =
  // selection or the item before the caret) into the focused formula, or
  // into a new formula at the text caret.
  insert: (latex: string) => void
  newFormula: () => void
  exitFormula: () => void
  focus: () => void
}

interface MathAnswerEditorProps {
  initialValue: string
  placeholder?: string
  onChange: (value: string) => void
  onModeChange?: (mode: EditorMode) => void
}

// Lets the caret sit next to a formula box, which browsers won't allow
// against a non-editable element with no text beside it.
const ZWSP = '​'
const FIELD_CLASS = 'math-answer__field'

function isField(node: Node | null): node is HTMLElement {
  return node instanceof HTMLElement && node.classList.contains(FIELD_CLASS)
}

function fieldOf(mf: MathfieldElement): HTMLElement | null {
  const wrapper = mf.parentElement
  return isField(wrapper) ? wrapper : null
}

function serialize(root: HTMLElement): string {
  const segments: AnswerSegment[] = []
  const nodes = Array.from(root.childNodes)
  nodes.forEach((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) {
      segments.push({ type: 'text', text: (node.textContent ?? '').replaceAll(ZWSP, '') })
    } else if (node instanceof HTMLBRElement) {
      // The browser keeps a trailing <br> so the caret can sit on the last
      // line; it isn't a line break the student typed.
      if (index < nodes.length - 1) segments.push({ type: 'text', text: '\n' })
    } else if (isField(node)) {
      const mf = node.querySelector('math-field') as MathfieldElement | null
      segments.push({ type: 'math', latex: mf?.getValue('latex-without-placeholders') ?? '' })
    } else if (node instanceof HTMLElement) {
      segments.push({ type: 'text', text: node.innerText })
    }
  })
  return joinSegments(segments).replace(/\n+$/, '')
}

// Breaks the line at the caret with a <br>. The browser's own command
// would insert "\n" text into this pre-wrap box, and a doubled one at the
// end, so the break is placed by hand; a break at the very end gets a
// trailing <br> (ignored by serialize) so the new line is visible.
function insertLineBreak(root: HTMLElement) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  const range = selection.getRangeAt(0)
  if (!root.contains(range.startContainer)) return
  range.deleteContents()
  const br = document.createElement('br')
  range.insertNode(br)

  const next = br.nextSibling
  const nothingAfter = !next || (next.nodeType === Node.TEXT_NODE && !next.nextSibling && !(next.textContent ?? '').replaceAll(ZWSP, ''))
  if (nothingAfter) {
    const pad = document.createTextNode(ZWSP)
    br.after(pad, document.createElement('br'))
    placeCaret(pad, 1)
    return
  }
  range.setStartAfter(br)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

function textNodeBeside(field: HTMLElement, side: 'before' | 'after'): Text {
  const sibling = side === 'after' ? field.nextSibling : field.previousSibling
  if (sibling?.nodeType === Node.TEXT_NODE) return sibling as Text
  const text = document.createTextNode(ZWSP)
  if (side === 'after') field.after(text)
  else field.before(text)
  return text
}

function placeCaret(node: Text, offset: number) {
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.setStart(node, Math.min(offset, node.length))
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

const MathAnswerEditor = forwardRef<MathAnswerEditorHandle, MathAnswerEditorProps>(function MathAnswerEditor(
  { initialValue, placeholder, onChange, onModeChange },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = useState(!initialValue.trim())
  const onChangeRef = useRef(onChange)
  const onModeChangeRef = useRef(onModeChange)
  onChangeRef.current = onChange
  onModeChangeRef.current = onModeChange

  const emit = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const value = serialize(root)
    setIsEmpty(!value.trim())
    onChangeRef.current(value)
  }, [])

  const activeField = useCallback((): MathfieldElement | null => {
    const root = rootRef.current
    const active = document.activeElement
    return active instanceof MathfieldElement && root?.contains(active) ? active : null
  }, [])

  const leaveField = useCallback(
    (mf: MathfieldElement, side: 'before' | 'after') => {
      const field = fieldOf(mf)
      const root = rootRef.current
      if (!field || !root) return
      const text = textNodeBeside(field, side)
      root.focus({ preventScroll: true })
      placeCaret(text, side === 'after' ? (text.data.startsWith(ZWSP) ? 1 : 0) : text.length)
      onModeChangeRef.current?.('text')
    },
    [],
  )

  const createField = useCallback(
    (latex: string): HTMLElement => {
      const wrapper = document.createElement('span')
      wrapper.className = FIELD_CLASS
      wrapper.contentEditable = 'false'

      const mf = new MathfieldElement()
      mf.mathVirtualKeyboardPolicy = 'manual'
      mf.smartMode = false
      mf.value = latex
      wrapper.appendChild(mf)

      mf.addEventListener('mount', () => {
        // Only settable once the field is in the document.
        mf.menuItems = []
        // MathLive hides the phone's own keyboard, expecting its virtual
        // one; the palette plus the native keyboard is what this editor
        // uses instead, so let the native keyboard show.
        mf.shadowRoot?.querySelector('[part=keyboard-sink]')?.setAttribute('inputmode', 'text')
      })
      mf.addEventListener('input', emit)
      mf.addEventListener('move-out', (event) => {
        event.preventDefault()
        leaveField(mf, event.detail.direction === 'backward' ? 'before' : 'after')
      })
      mf.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          leaveField(mf, 'after')
          if (rootRef.current) insertLineBreak(rootRef.current)
          emit()
        } else if (event.key === 'Escape') {
          event.preventDefault()
          leaveField(mf, 'after')
        }
      })
      mf.addEventListener('focusout', () => {
        // An abandoned empty box would otherwise linger as a dashed blank.
        if (mf.value.trim() === '' && fieldOf(mf)) {
          fieldOf(mf)?.remove()
          emit()
        }
      })
      return wrapper
    },
    [emit, leaveField],
  )

  const insertFieldAtCaret = useCallback(
    (latex: string) => {
      const root = rootRef.current
      if (!root) return
      const selection = window.getSelection()
      let range: Range
      if (selection && selection.rangeCount > 0 && root.contains(selection.getRangeAt(0).startContainer)) {
        range = selection.getRangeAt(0)
        range.deleteContents()
      } else {
        range = document.createRange()
        range.selectNodeContents(root)
        range.collapse(false)
      }
      const wrapper = createField('')
      range.insertNode(wrapper)
      textNodeBeside(wrapper, 'before')
      const after = textNodeBeside(wrapper, 'after')
      // Inserting into a collapsed range leaves the selection spanning the
      // new box; park the text caret just past it so nothing typed before
      // the box takes focus can wipe it out.
      placeCaret(after, after.data.startsWith(ZWSP) ? 1 : 0)

      const mf = wrapper.querySelector('math-field') as MathfieldElement
      // MathLive moves the keyboard focus into the box a few dozen
      // milliseconds later; until then the parked text caret above is
      // what any stray keystroke lands on.
      mf.focus()
      if (latex) mf.executeCommand(['insert', latex])
      onModeChangeRef.current?.('math')
      emit()
    },
    [createField, emit],
  )

  // Build the initial content once; from then on the DOM is the source of
  // truth and React never re-renders inside the editable root.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.replaceChildren()
    for (const segment of parseAnswer(initialValue)) {
      if (segment.type === 'math') {
        root.appendChild(createField(segment.latex))
        continue
      }
      const lines = segment.text.split('\n')
      lines.forEach((line, index) => {
        if (line) root.appendChild(document.createTextNode(line))
        if (index < lines.length - 1) root.appendChild(document.createElement('br'))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    function handleFocusIn(event: FocusEvent) {
      onModeChangeRef.current?.(event.target instanceof MathfieldElement ? 'math' : 'text')
    }
    // Phone keyboards report their return key as a paragraph insertion
    // rather than an Enter keydown; both must become the same <br>.
    function handleBeforeInput(event: InputEvent) {
      if (event.target instanceof MathfieldElement) return
      if (event.inputType === 'insertParagraph' || event.inputType === 'insertLineBreak') {
        event.preventDefault()
        if (root) insertLineBreak(root)
        emit()
      }
    }
    root.addEventListener('focusin', handleFocusIn)
    root.addEventListener('beforeinput', handleBeforeInput)
    return () => {
      root.removeEventListener('focusin', handleFocusIn)
      root.removeEventListener('beforeinput', handleBeforeInput)
    }
  }, [emit])

  useImperativeHandle(
    ref,
    () => ({
      insert(latex) {
        const mf = activeField()
        if (mf) {
          mf.executeCommand(['insert', latex])
          emit()
        } else {
          insertFieldAtCaret(latex)
        }
      },
      newFormula() {
        if (!activeField()) insertFieldAtCaret('')
      },
      exitFormula() {
        const mf = activeField()
        if (mf) leaveField(mf, 'after')
      },
      focus() {
        rootRef.current?.focus()
      },
    }),
    [activeField, emit, insertFieldAtCaret, leaveField],
  )

  return (
    <div className="relative">
      <div
        ref={rootRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Vastaus"
        onInput={emit}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !(event.target instanceof MathfieldElement)) {
            event.preventDefault()
            if (rootRef.current) insertLineBreak(rootRef.current)
            emit()
          }
        }}
        onPaste={(event) => {
          event.preventDefault()
          document.execCommand('insertText', false, event.clipboardData.getData('text/plain'))
        }}
        className="math-answer min-h-[4.5rem] w-full whitespace-pre-wrap break-words rounded-xl border border-ink/10 bg-page py-2 pl-3 pr-11 text-sm leading-relaxed text-ink outline-none"
      />
      {isEmpty && placeholder && (
        <span aria-hidden className="pointer-events-none absolute left-3 top-2 text-sm leading-relaxed text-ink-dim/60">
          {placeholder}
        </span>
      )}
    </div>
  )
})

export default MathAnswerEditor
