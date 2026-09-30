import katex from 'katex'
import { useMemo, useState } from 'react'

// A LaTeX fragment the palette can drop into the answer. Empty `{}` pairs are
// placeholders: the first one receives whatever text was selected in the
// answer, and the caret lands in the first empty one that remains.
export interface MathSnippet {
  latex: string
  label: string
  // What the palette button shows; defaults to `latex` with each placeholder
  // drawn as a small box.
  preview?: string
}

interface SymbolGroup {
  id: string
  name: string
  snippets: MathSnippet[]
}

const GREEK: MathSnippet[] = [
  { latex: '\\alpha', label: 'alfa' },
  { latex: '\\beta', label: 'beeta' },
  { latex: '\\gamma', label: 'gamma' },
  { latex: '\\delta', label: 'delta' },
  { latex: '\\varepsilon', label: 'epsilon' },
  { latex: '\\theta', label: 'theeta' },
  { latex: '\\lambda', label: 'lambda' },
  { latex: '\\mu', label: 'myy' },
  { latex: '\\pi', label: 'pii' },
  { latex: '\\rho', label: 'rhoo' },
  { latex: '\\sigma', label: 'sigma' },
  { latex: '\\tau', label: 'tau' },
  { latex: '\\varphi', label: 'fii' },
  { latex: '\\omega', label: 'oomega' },
  { latex: '\\Delta', label: 'iso delta' },
  { latex: '\\Sigma', label: 'iso sigma' },
  { latex: '\\Omega', label: 'iso oomega' },
]

const OPERATORS: MathSnippet[] = [
  { latex: '\\pm', label: 'plus miinus' },
  { latex: '\\cdot', label: 'kertomerkki' },
  { latex: '\\times', label: 'kertomerkki (risti)' },
  { latex: '\\div', label: 'jakomerkki' },
  { latex: '\\le', label: 'pienempi tai yhtä suuri' },
  { latex: '\\ge', label: 'suurempi tai yhtä suuri' },
  { latex: '\\ne', label: 'eri suuri' },
  { latex: '\\approx', label: 'likimain' },
  { latex: '\\infty', label: 'ääretön' },
  { latex: '^\\circ', label: 'aste', preview: '^\\circ' },
  { latex: '\\%', label: 'prosentti' },
  { latex: '\\rightarrow', label: 'nuoli' },
  { latex: '\\Rightarrow', label: 'seuraa' },
  { latex: '\\Leftrightarrow', label: 'yhtäpitävä' },
  { latex: '\\in', label: 'kuuluu joukkoon' },
  { latex: '\\notin', label: 'ei kuulu joukkoon' },
  { latex: '\\mathbb{R}', label: 'reaaliluvut' },
  { latex: '\\emptyset', label: 'tyhjä joukko' },
  { latex: '\\cup', label: 'yhdiste' },
  { latex: '\\cap', label: 'leikkaus' },
  { latex: '\\angle', label: 'kulma' },
  { latex: '\\perp', label: 'kohtisuora' },
  { latex: '\\parallel', label: 'yhdensuuntainen' },
  { latex: '\\ldots', label: 'kolme pistettä' },
]

const STRUCTURES: MathSnippet[] = [
  { latex: '\\frac{}{}', label: 'murtoluku' },
  { latex: '\\sqrt{}', label: 'neliöjuuri' },
  { latex: '\\sqrt[]{}', label: 'n:s juuri', preview: '\\sqrt[n]{\\square}' },
  { latex: '{}^{}', label: 'potenssi' },
  { latex: '{}_{}', label: 'alaindeksi' },
  { latex: '\\left|{}\\right|', label: 'itseisarvo' },
  { latex: '\\left({}\\right)', label: 'sulkeet' },
  { latex: '\\int {} \\,dx', label: 'integraali', preview: '\\int \\square \\,dx' },
  { latex: '\\int_{}^{} {} \\,dx', label: 'määrätty integraali', preview: '\\int_{\\square}^{\\square}' },
  { latex: '\\sum_{}^{} {}', label: 'summa', preview: '\\sum_{\\square}^{\\square}' },
  { latex: '\\lim_{{} \\to {}} {}', label: 'raja-arvo', preview: '\\lim' },
  { latex: "f'({})", label: 'derivaatta', preview: "f'(x)" },
  { latex: '\\frac{d}{dx}{}', label: 'derivaatta d/dx', preview: '\\frac{d}{dx}' },
  { latex: '\\vec{}', label: 'vektori' },
  { latex: '\\overline{}', label: 'yläviiva' },
  { latex: '\\binom{}{}', label: 'binomikerroin' },
  { latex: '\\log_{}{}', label: 'logaritmi', preview: '\\log_{\\square}' },
  { latex: '\\sin{}', label: 'sini', preview: '\\sin' },
  { latex: '\\cos{}', label: 'kosini', preview: '\\cos' },
  { latex: '\\tan{}', label: 'tangentti', preview: '\\tan' },
  { latex: '\\begin{cases} {} \\\\ {} \\end{cases}', label: 'yhtälöpari', preview: '\\begin{cases} \\square \\\\ \\square \\end{cases}' },
]

const GROUPS: SymbolGroup[] = [
  { id: 'greek', name: 'Kreikka', snippets: GREEK },
  { id: 'operators', name: 'Merkit', snippets: OPERATORS },
  { id: 'structures', name: 'Rakenteet', snippets: STRUCTURES },
]

function previewHtml(snippet: MathSnippet): string {
  const source = snippet.preview ?? snippet.latex.replace(/\{\}/g, '{\\square}')
  return katex.renderToString(source, { throwOnError: false, displayMode: false })
}

interface MathSymbolPickerProps {
  onInsert: (snippet: MathSnippet) => void
}

// The symbol palette that opens from the answer box. Buttons swallow their
// pointerdown so tapping one never steals focus (and the caret) from the
// textarea the snippet is going into.
export default function MathSymbolPicker({ onInsert }: MathSymbolPickerProps) {
  const [groupId, setGroupId] = useState(GROUPS[0].id)
  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0]

  const previews = useMemo(
    () => Object.fromEntries(GROUPS.flatMap((g) => g.snippets.map((s) => [s.latex, previewHtml(s)]))),
    [],
  )

  return (
    <div className="mt-2 rounded-xl border border-ink/10 bg-page p-2" role="group" aria-label="Matemaattiset symbolit">
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
            key={snippet.latex}
            type="button"
            aria-label={snippet.label}
            title={snippet.label}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => onInsert(snippet)}
            className="flex h-10 items-center justify-center overflow-hidden rounded-lg bg-surface text-sm text-ink ring-1 ring-ink/10 active:bg-surface-2"
            dangerouslySetInnerHTML={{ __html: previews[snippet.latex] }}
          />
        ))}
      </div>
    </div>
  )
}
