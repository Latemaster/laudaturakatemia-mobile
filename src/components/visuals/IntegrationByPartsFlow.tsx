// Static flow diagram for ∫u dv = uv − ∫v du.
export default function IntegrationByPartsFlow() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <div className="mb-3 flex flex-col items-center gap-2 rounded-xl bg-surface p-5">
        <div className="rounded-xl border-2 border-accent bg-accent/10 px-4 py-2 font-mono text-base text-ink">
          ∫ u dv
        </div>
        <span className="text-xl text-ink-dim">↓</span>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border-2 border-good bg-good/10 px-4 py-2 font-mono text-base text-ink">
            u·v
          </div>
          <span className="text-xl text-ink-dim">−</span>
          <div className="rounded-xl border-2 border-bad bg-bad/10 px-4 py-2 font-mono text-base text-ink">
            ∫ v du
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-ink-dim">
        Valitse u ja dv niin, että jäljelle jäävä integraali on helpompi
      </p>
    </div>
  )
}
