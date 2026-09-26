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

export interface GradeBand {
  grade: FinnishGrade
  min: number
}

// Placeholder thresholds until real scoring (MCQ correctness, lesson
// completion) exists — for now grade is driven purely by how much of each
// course has been engaged with, not by how well. `min` is the percentage a
// band starts at; bands are listed high to low and cover 0-100 with no gaps.
export const GRADE_BANDS: GradeBand[] = [
  { grade: FINNISH_GRADES[0], min: 90 }, // L
  { grade: FINNISH_GRADES[1], min: 75 }, // E
  { grade: FINNISH_GRADES[2], min: 60 }, // M
  { grade: FINNISH_GRADES[3], min: 45 }, // C
  { grade: FINNISH_GRADES[4], min: 30 }, // B
  { grade: FINNISH_GRADES[5], min: 15 }, // A
  { grade: FINNISH_GRADES[6], min: 0 }, // I
]

export function predictGrade(overallPct: number): FinnishGrade {
  const band = GRADE_BANDS.find((b) => overallPct >= b.min)
  return band ? band.grade : FINNISH_GRADES[FINNISH_GRADES.length - 1]
}
