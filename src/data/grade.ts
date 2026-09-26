export interface FinnishGrade {
  letter: string
  name: string
  tier: 'high' | 'mid' | 'low'
}

export const FINNISH_GRADES: FinnishGrade[] = [
  { letter: 'L', name: 'Laudatur', tier: 'high' },
  { letter: 'E', name: 'Eximia cum laude approbatur', tier: 'high' },
  { letter: 'M', name: 'Magna cum laude approbatur', tier: 'high' },
  { letter: 'C', name: 'Cum laude approbatur', tier: 'mid' },
  { letter: 'B', name: 'Lubenter approbatur', tier: 'mid' },
  { letter: 'A', name: 'Approbatur', tier: 'low' },
  { letter: 'I', name: 'Improbatur', tier: 'low' },
]

// Placeholder mapping until real scoring (MCQ correctness, lesson completion)
// exists — for now it's driven purely by how much of each course has been
// engaged with, not by how well. Thresholds are provisional.
export function predictGrade(overallPct: number): FinnishGrade {
  if (overallPct >= 90) return FINNISH_GRADES[0] // L
  if (overallPct >= 75) return FINNISH_GRADES[1] // E
  if (overallPct >= 60) return FINNISH_GRADES[2] // M
  if (overallPct >= 45) return FINNISH_GRADES[3] // C
  if (overallPct >= 30) return FINNISH_GRADES[4] // B
  if (overallPct >= 15) return FINNISH_GRADES[5] // A
  return FINNISH_GRADES[6] // I
}
