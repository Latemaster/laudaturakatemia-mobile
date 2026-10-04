import katex from 'katex'
import { useMemo, useState } from 'react'
import type { EditorMode } from './MathAnswerEditor'

// A snippet the palette can drop into a formula, in MathLive's insert
// syntax: #? is an empty slot to fill, #0 the current selection and #@ the
// selection or, failing that, the item just before the caret (so "x" then
// the power button gives x to the power of a slot).
export interface MathSnippet {
  insert: string
  label: string
  // What the palette button shows; defaults to `insert` with every slot
  // drawn as a small box.
  preview?: string
}

interface SymbolGroup {
  id: string
  name: string
  snippets: MathSnippet[]
}

const GREEK: MathSnippet[] = [
  { insert: '\\alpha', label: 'alfa' },
  { insert: '\\beta', label: 'beeta' },
  { insert: '\\gamma', label: 'gamma' },
  { insert: '\\delta', label: 'delta' },
  { insert: '\\varepsilon', label: 'epsilon' },
  { insert: '\\theta', label: 'theeta' },
  { insert: '\\lambda', label: 'lambda' },
  { insert: '\\mu', label: 'myy' },
  { insert: '\\pi', label: 'pii' },
  { insert: '\\rho', label: 'rhoo' },
  { insert: '\\sigma', label: 'sigma' },
  { insert: '\\tau', label: 'tau' },
  { insert: '\\varphi', label: 'fii' },
  { insert: '\\omega', label: 'oomega' },
  { insert: '\\Delta', label: 'iso delta' },
  { insert: '\\Sigma', label: 'iso sigma' },
  { insert: '\\Omega', label: 'iso oomega' },
]

const OPERATORS: MathSnippet[] = [
  { insert: '\\pm', label: 'plus miinus' },
  { insert: '\\cdot', label: 'kertomerkki' },
  { insert: '\\times', label: 'kertomerkki (risti)' },
  { insert: '\\div', label: 'jakomerkki' },
  { insert: '\\le', label: 'pienempi tai yhtä suuri' },
  { insert: '\\ge', label: 'suurempi tai yhtä suuri' },
  { insert: '\\ne', label: 'eri suuri' },
  { insert: '\\approx', label: 'likimain' },
  { insert: '\\infty', label: 'ääretön' },
  { insert: '#@^\\circ', label: 'aste', preview: '^\\circ' },
  { insert: '\\%', label: 'prosentti' },
  { insert: '\\rightarrow', label: 'nuoli' },
  { insert: '\\Rightarrow', label: 'seuraa' },
  { insert: '\\Leftrightarrow', label: 'yhtäpitävä' },
  { insert: '\\in', label: 'kuuluu joukkoon' },
  { insert: '\\notin', label: 'ei kuulu joukkoon' },
  { insert: '\\mathbb{R}', label: 'reaaliluvut' },
  { insert: '\\emptyset', label: 'tyhjä joukko' },
  { insert: '\\cup', label: 'yhdiste' },
  { insert: '\\cap', label: 'leikkaus' },
  { insert: '\\angle', label: 'kulma' },
  { insert: '\\perp', label: 'kohtisuora' },
  { insert: '\\parallel', label: 'yhdensuuntainen' },
  { insert: '\\ldots', label: 'kolme pistettä' },
]

const STRUCTURES: MathSnippet[] = [
  { insert: '\\frac{#@}{#?}', label: 'murtoluku' },
  { insert: '\\sqrt{#0}', label: 'neliöjuuri' },
  { insert: '\\sqrt[#?]{#0}', label: 'n:s juuri', preview: '\\sqrt[n]{\\square}' },
  { insert: '#@^{#?}', label: 'potenssi' },
  { insert: '#@_{#?}', label: 'alaindeksi' },
  { insert: '\\left|#0\\right|', label: 'itseisarvo' },
  { insert: '\\left(#0\\right)', label: 'sulkeet' },
  { insert: '\\int #0\\,dx', label: 'integraali', preview: '\\int \\square \\,dx' },
  { insert: '\\int_{#?}^{#?} #0\\,dx', label: 'määrätty integraali', preview: '\\int_{\\square}^{\\square}' },
  { insert: '\\sum_{#?}^{#?} #0', label: 'summa', preview: '\\sum_{\\square}^{\\square}' },
  { insert: '\\lim_{#? \\to #?} #0', label: 'raja-arvo', preview: '\\lim' },
  { insert: "f'(#?)", label: 'derivaatta', preview: "f'(x)" },
  { insert: '\\frac{d}{dx}', label: 'derivaatta d/dx' },
  { insert: '\\vec{#0}', label: 'vektori' },
  { insert: '\\overline{#0}', label: 'yläviiva' },
  { insert: '\\binom{#?}{#?}', label: 'binomikerroin' },
  { insert: '\\log_{#?}', label: 'logaritmi' },
  { insert: '\\sin', label: 'sini' },
  { insert: '\\cos', label: 'kosini' },
  { insert: '\\tan', label: 'tangentti' },
  { insert: '\\begin{cases} #? \\\\ #? \\end{cases}', label: 'yhtälöpari' },
]

const GROUPS: SymbolGroup[] = [
  { id: 'greek', name: 'Kreikka', snippets: GREEK },
  { id: 'operators', name: 'Merkit', snippets: OPERATORS },
  { id: 'structures', name: 'Rakenteet', snippets: STRUCTURES },
]

function previewHtml(snippet: MathSnippet): string {
  const source = snippet.preview ?? snippet.insert.replace(/#[?0@]/g, '\\square')
  return katex.renderToString(source, { throwOnError: false, displayMode: false })
}

interface MathSymbolPickerProps {
  mode: EditorMode
  onInsert: (snippet: MathSnippet) => void
  onNewFormula: () => void
  onExitFormula: () => void
}

// The symbol palette that opens from the answer box. Every button swallows
// its pointerdown so tapping one never steals focus (and the caret) from
// the text or the formula the snippet is going into.
export default function MathSymbolPicker({ mode, onInsert, onNewFormula, onExitFormula }: MathSymbolPickerProps) {
  const [groupId, setGroupId] = useState(GROUPS[0].id)
  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0]

  const previews = useMemo(
    () => Object.fromEntries(GROUPS.flatMap((g) => g.snippets.map((s) => [s.insert, previewHtml(s)]))),
    [],
  )

  const inFormula = mode === 'math'

  return (
    <div className="mt-2 rounded-xl border border-ink/10 bg-page p-2" role="group" aria-label="Matemaattiset symbolit">
      <div className="mb-2 flex items-center gap-2">
        <p className="min-w-0 flex-1 text-xs leading-snug text-ink-dim">
          {inFormula ? 'Kirjoitat kaavaa. Symbolit lisätään kaavaan.' : 'Symboli aloittaa kaavan kohdistimen kohdalle.'}
        </p>
        <button
          type="button"
          onPointerDown={(e) => e.preventDefault()}
          onClick={inFormula ? onExitFormula : onNewFormula}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            inFormula ? 'bg-surface text-ink ring-1 ring-ink/10 active:bg-surface-2' : 'bg-accent text-white'
          }`}
        >
          {inFormula ? 'Valmis' : 'Uusi kaava'}
        </button>
      </div>
      <div className="mb-2 flex gap-1" role="tablist">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={g.id === group.id}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => setGroupId(g.id)}
            className={`flex-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${
              g.id === group.id ? 'bg-accent text-white' : 'text-ink-dim active:bg-ink/5'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
      <div className="scrollbar-hide grid max-h-32 grid-cols-6 gap-1 overflow-y-auto">
        {group.snippets.map((snippet) => (
          <button
            key={snippet.insert}
            type="button"
            aria-label={snippet.label}
            title={snippet.label}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onInsert(snippet)}
            className="flex h-10 items-center justify-center overflow-hidden rounded-lg bg-surface text-sm text-ink ring-1 ring-ink/10 active:bg-surface-2"
            dangerouslySetInnerHTML={{ __html: previews[snippet.insert] }}
          />
        ))}
      </div>
    </div>
  )
}
