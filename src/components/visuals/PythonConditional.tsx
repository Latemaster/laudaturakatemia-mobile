import { useState } from 'react'

export default function PythonConditional() {
  const [x, setX] = useState(3)
  const branch = x > 0 ? 'if' : x < 0 ? 'elif' : 'else'
  const output = x > 0 ? 'positiivinen' : x < 0 ? 'negatiivinen' : 'nolla'

  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 rounded-xl bg-surface p-4 font-mono text-sm">
        <p className="text-ink-dim">x = {x}</p>
        <p className={branch === 'if' ? 'font-semibold text-accent' : 'text-ink-dim'}>
          if x &gt; 0: print(&quot;positiivinen&quot;)
        </p>
        <p className={branch === 'elif' ? 'font-semibold text-accent' : 'text-ink-dim'}>
          elif x &lt; 0: print(&quot;negatiivinen&quot;)
        </p>
        <p className={branch === 'else' ? 'font-semibold text-accent' : 'text-ink-dim'}>
          else: print(&quot;nolla&quot;)
        </p>
        <p className="mt-2 rounded-lg bg-ink/5 px-2 py-1 text-ink">&gt;&gt;&gt; {output}</p>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-10 font-mono font-semibold text-ink">x</span>
        <input
          type="range"
          min={-10}
          max={10}
          step={1}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="h-2 flex-1 accent-accent"
        />
        <span className="w-10 text-right font-mono text-ink-dim">{x}</span>
      </label>
    </div>
  )
}
