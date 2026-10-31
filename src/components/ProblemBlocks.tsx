import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ProblemImageBlock, ProblemBlock } from '../types'
import MathText from './MathText'
import { XIcon } from './icons'

interface ProblemBlocksProps {
  blocks: ProblemBlock[]
  // Makes the formulas tappable; see MathText.
  onFormulaTap?: (latex: string) => void
}

// A figure kept small enough to leave room for the text and the answer
// around it; clicking opens it full-size over the page.
function ProblemImage({ block }: { block: ProblemImageBlock }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Suurenna kuva: ${block.alt}`}
        className="w-fit max-w-full cursor-zoom-in rounded-xl ring-1 ring-ink/10 transition-shadow hover:shadow-md"
      >
        <img src={block.src} alt={block.alt} className="max-h-[min(16rem,30vh)] w-auto max-w-full rounded-xl object-contain" />
      </button>
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={block.alt}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-ink/60 p-6 backdrop-blur-sm"
          >
            <img src={block.src} alt={block.alt} className="max-h-full max-w-full rounded-2xl bg-surface object-contain shadow-2xl" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sulje kuva"
              className="fixed right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink shadow-md"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}

export default function ProblemBlocks({ blocks, onFormulaTap }: ProblemBlocksProps) {
  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) =>
        block.type === 'image' ? (
          <ProblemImage key={index} block={block} />
        ) : (
          <div key={index} className="text-base leading-relaxed text-ink">
            <MathText content={block.content} onMathClick={onFormulaTap} />
          </div>
        ),
      )}
    </div>
  )
}
