import type { CourseKnowledge, KnowledgeLevel } from '../data/knowledge'

interface LevelColors {
  // The course box's edge, and the same lighter for a level that comes from
  // the course grade alone.
  border: string
  borderLight: string
  // The blob in the box's corner, filled or outlined likewise.
  filled: string
  outlined: string
}

// Red, orange, yellow, light green, dark green: the app's own bad, amber
// (topic-maa7) and good, with two steps between.
export const LEVEL_COLORS: Record<KnowledgeLevel, LevelColors> = {
  heikko: {
    border: 'border-[#d9636f]',
    borderLight: 'border-[#d9636f]/40',
    filled: 'border-[#d9636f] bg-[#d9636f] text-white',
    outlined: 'border-[#d9636f] bg-surface text-[#a52f3d]',
  },
  kehittyvä: {
    border: 'border-[#d98a3d]',
    borderLight: 'border-[#d98a3d]/45',
    filled: 'border-[#d98a3d] bg-[#d98a3d] text-[#432400]',
    outlined: 'border-[#d98a3d] bg-surface text-[#8a4b08]',
  },
  kohtalainen: {
    border: 'border-[#e3c04f]',
    borderLight: 'border-[#e3c04f]/60',
    filled: 'border-[#e3c04f] bg-[#e3c04f] text-[#453600]',
    outlined: 'border-[#e3c04f] bg-surface text-[#6f5800]',
  },
  vahva: {
    border: 'border-[#86cfa6]',
    borderLight: 'border-[#86cfa6]/55',
    filled: 'border-[#86cfa6] bg-[#86cfa6] text-[#0b3d1f]',
    outlined: 'border-[#86cfa6] bg-surface text-[#1a6136]',
  },
  erinomainen: {
    border: 'border-[#2f9e6e]',
    borderLight: 'border-[#2f9e6e]/45',
    filled: 'border-[#2f9e6e] bg-[#2f9e6e] text-white',
    outlined: 'border-[#2f9e6e] bg-surface text-[#1f7a53]',
  },
}

// The edge of a course's box, in the colour of the student's level. The box
// is `relative` and holds the course's KnowledgeBlob.
export function knowledgeBorder({ level, gradeOnly }: CourseKnowledge): string {
  if (!level) return 'border-2 border-ink/10'
  const colors = LEVEL_COLORS[level.level]
  return `border-2 ${gradeOnly ? colors.borderLight : colors.border}`
}
