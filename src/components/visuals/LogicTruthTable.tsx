import { useState } from 'react'

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`flex-1 rounded-xl border-2 px-3 py-2 font-mono text-sm font-semibold transition-colors ${
        value ? 'border-good bg-good/15 text-ink' : 'border-bad bg-bad/15 text-ink'
      }`}
    >
      {label} = {value ? 'T' : 'E'}
    </button>
  )
}

function Result({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-1.5">
      <span className="font-mono text-sm text-ink-dim">{label}</span>
      <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${value ? 'bg-good/20 text-good' : 'bg-bad/20 text-bad'}`}>
        {value ? 'tosi' : 'epätosi'}
      </span>
    </div>
  )
}

export default function LogicTruthTable() {
  const [p, setP] = useState(true)
  const [q, setQ] = useState(false)

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 flex gap-2">
        <Toggle label="p" value={p} onToggle={() => setP((v) => !v)} />
        <Toggle label="q" value={q} onToggle={() => setQ((v) => !v)} />
      </div>

      <div className="space-y-1.5">
        <Result label="¬p" value={!p} />
        <Result label="p ∧ q" value={p && q} />
        <Result label="p ∨ q" value={p || q} />
        <Result label="p → q" value={!p || q} />
        <Result label="p ↔ q" value={p === q} />
      </div>
    </div>
  )
}
