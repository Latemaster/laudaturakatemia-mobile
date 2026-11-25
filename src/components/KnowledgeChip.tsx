import type { CourseKnowledge, KnowledgeLevel } from '../data/knowledge'

// `real` when the level rests on answers; `outline`, lighter, when it comes
// from the course grade alone.
const LEVEL_CLASSES: Record<KnowledgeLevel, { real: string; outline: string }> = {
  heikko: { real: 'bg-bad/15 text-bad ring-bad/15', outline: 'text-bad/80 ring-bad/40' },
  kehittyvä: { real: 'bg-topic-maa7/20 text-[#9a5a1a] ring-topic-maa7/20', outline: 'text-[#9a5a1a]/80 ring-topic-maa7/50' },
  kohtalainen: { real: 'bg-accent/15 text-accent ring-accent/15', outline: 'text-accent/80 ring-accent/40' },
  vahva: { real: 'bg-good/15 text-good ring-good/15', outline: 'text-good/80 ring-good/40' },
  erinomainen: { real: 'bg-good text-white ring-good', outline: '' },
}

// A course's knowledge level in one word.
export default function KnowledgeChip({ course }: { course: CourseKnowledge }) {
  const { level, gradeOnly } = course
  if (!level) return <span className="shrink-0 whitespace-nowrap text-[11px] font-medium text-ink-dim/70">ei tietoa</span>
  const classes = LEVEL_CLASSES[level.level]
  return (
    <span
      className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] leading-4 ring-1 ring-inset ${
        gradeOnly ? `font-medium ${classes.outline}` : `font-semibold ${classes.real}`
      }`}
    >
      {level.label}
    </span>
  )
}
