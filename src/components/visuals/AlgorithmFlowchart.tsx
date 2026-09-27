// Static flowchart illustrating the three basic control structures:
// sequence, decision (branch), and loop (repeat until condition holds).
export default function AlgorithmFlowchart() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface-2 p-4">
      <svg viewBox="0 0 220 260" className="mb-3 h-56 w-full overflow-hidden rounded-xl bg-surface">
        <ellipse cx={110} cy={20} rx={45} ry={16} className="fill-good/15 stroke-good" strokeWidth={1.5} />
        <text x={110} y={24} textAnchor="middle" fontSize={11} className="fill-ink font-semibold">
          Aloitus
        </text>

        <line x1={110} y1={36} x2={110} y2={56} className="stroke-ink/40" strokeWidth={1.5} />
        <polygon points="110,60 106,54 114,54" className="fill-ink/40" />

        <rect x={65} y={58} width={90} height={30} rx={6} className="fill-accent/15 stroke-accent" strokeWidth={1.5} />
        <text x={110} y={77} textAnchor="middle" fontSize={10} className="fill-ink">
          Käsky (peräkkäisyys)
        </text>

        <line x1={110} y1={88} x2={110} y2={108} className="stroke-ink/40" strokeWidth={1.5} />
        <polygon points="110,112 106,106 114,106" className="fill-ink/40" />

        <polygon
          points="110,112 155,145 110,178 65,145"
          className="fill-bad/15 stroke-bad"
          strokeWidth={1.5}
        />
        <text x={110} y={141} textAnchor="middle" fontSize={9.5} className="fill-ink">
          Ehto
        </text>
        <text x={110} y={153} textAnchor="middle" fontSize={9.5} className="fill-ink">
          (valinta)
        </text>

        <line x1={65} y1={145} x2={20} y2={145} className="stroke-ink/40" strokeWidth={1.5} />
        <line x1={20} y1={145} x2={20} y2={73} className="stroke-ink/40" strokeWidth={1.5} />
        <line x1={20} y1={73} x2={63} y2={73} className="stroke-ink/40" strokeWidth={1.5} />
        <polygon points="65,73 58,69 58,77" className="fill-ink/40" />
        <text x={22} y={110} fontSize={9} className="fill-ink-dim">
          ei (toisto)
        </text>

        <line x1={110} y1={178} x2={110} y2={198} className="stroke-ink/40" strokeWidth={1.5} />
        <polygon points="110,202 106,196 114,196" className="fill-ink/40" />
        <text x={120} y={192} fontSize={9} className="fill-ink-dim">
          kyllä
        </text>

        <ellipse cx={110} cy={216} rx={45} ry={16} className="fill-bad/15 stroke-bad" strokeWidth={1.5} />
        <text x={110} y={220} textAnchor="middle" fontSize={11} className="fill-ink font-semibold">
          Lopetus
        </text>
      </svg>

      <p className="text-center text-sm text-ink-dim">Peräkkäisyys, valinta ja toisto ovat algoritmin peruspalikat</p>
    </div>
  )
}
