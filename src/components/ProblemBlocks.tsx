import type { ProblemBlock } from '../types'
import MathText from './MathText'

interface ProblemBlocksProps {
  blocks: ProblemBlock[]
  // Makes the formulas tappable; see MathText.
  onFormulaTap?: (latex: string) => void
}

export default function ProblemBlocks({ blocks, onFormulaTap }: ProblemBlocksProps) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) =>
        block.type === 'image' ? (
          <img key={index} src={block.src} alt={block.alt} className="w-full rounded-xl" />
        ) : (
          <div key={index} className="text-base leading-relaxed text-ink">
            <MathText content={block.content} onMathClick={onFormulaTap} />
          </div>
        ),
      )}
    </div>
  )
}
