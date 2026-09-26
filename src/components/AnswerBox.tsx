import { useState } from 'react'

type AnswerState = 'closed' | 'editing' | 'submitted'

export default function AnswerBox() {
  const [state, setState] = useState<AnswerState>('closed')
  const [answer, setAnswer] = useState('')

  return (
    <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-page from-60% to-transparent pb-4 pt-6">
      {state === 'closed' && (
        <button
          type="button"
          onClick={() => setState('editing')}
          className="w-full rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md"
        >
          Vastaa tehtävään
        </button>
      )}

      {state === 'editing' && (
        <div className="rounded-2xl border border-ink/10 bg-surface p-3 shadow-md">
          <textarea
            autoFocus
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Kirjoita vastauksesi tähän..."
            className="w-full resize-none rounded-xl border border-ink/10 bg-page px-3 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-ink-dim/60"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setState('closed')}
              className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-ink-dim"
            >
              Peruuta
            </button>
            <button
              type="button"
              disabled={!answer.trim()}
              onClick={() => setState('submitted')}
              className="flex-1 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              Lähetä
            </button>
          </div>
        </div>
      )}

      {state === 'submitted' && (
        <div className="rounded-2xl border border-good/30 bg-good/10 p-3 shadow-md">
          <p className="mb-1 text-sm font-semibold text-good">Vastaus lähetetty</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{answer}</p>
          <button
            type="button"
            onClick={() => setState('editing')}
            className="mt-2 text-sm font-semibold text-accent"
          >
            Muokkaa vastausta
          </button>
        </div>
      )}
    </div>
  )
}
