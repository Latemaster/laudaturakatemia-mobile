import { useState } from 'react'
import type { ProblemBlock, TaskCard } from '../types'
import CardShell from './CardShell'
import KindLabel from './KindLabel'
import MathText from './MathText'
import { PencilIcon } from './icons'

interface TaskCardViewProps {
  card: TaskCard
}

function BlockList({ blocks }: { blocks: ProblemBlock[] }) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) =>
        block.type === 'image' ? (
          <img key={index} src={block.src} alt={block.alt} className="w-full rounded-xl" />
        ) : (
          <p key={index} className="text-base leading-relaxed text-ink">
            <MathText content={block.content} />
          </p>
        ),
      )}
    </div>
  )
}

export default function TaskCardView({ card }: TaskCardViewProps) {
  const [showSolution, setShowSolution] = useState(false)
  const { problem } = card

  return (
    <CardShell topic={card.topic}>
      <KindLabel icon={<PencilIcon />} label="Tehtävä" />
      <h2 className="mb-3 text-lg font-semibold text-ink">
        {problem.section} · {problem.title}
      </h2>

      <div className="rounded-2xl border border-ink/10 bg-surface p-4 shadow-sm">
        <BlockList blocks={showSolution ? problem.answerBlocks : problem.promptBlocks} />
      </div>

      <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-page from-60% to-transparent pb-4 pt-6">
        <button
          type="button"
          onClick={() => setShowSolution((v) => !v)}
          className="w-full rounded-2xl bg-accent px-4 py-3 text-center font-semibold text-white shadow-md"
        >
          {showSolution ? 'Takaisin tehtävään' : 'Näytä ratkaisu'}
        </button>
      </div>
    </CardShell>
  )
}
