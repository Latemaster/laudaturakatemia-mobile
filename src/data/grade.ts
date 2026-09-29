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

// The pitkä matematiikka exam is scored out of 120 points.
export const EXAM_MAX_POINTS = 120

export interface GradePoints {
  // Typical point cutoff for the grade: the mean, and roughly one standard
  // deviation either side of it.
  min: number
  avg: number
  max: number
}

// Cutoffs from the LaudaturAkatemia study plans (L..B). A has no plan; its
// figures are a typical cutoff. I is everything below A.
export const GRADE_POINTS: Record<string, GradePoints> = {
  L: { min: 81, avg: 89, max: 97 },
  E: { min: 65, avg: 70, max: 75 },
  M: { min: 44, avg: 47, max: 51 },
  C: { min: 31, avg: 36, max: 41 },
  B: { min: 21, avg: 24, max: 27 },
  A: { min: 12, avg: 15, max: 18 },
  I: { min: 0, avg: 0, max: 0 },
}

export function pointsToPct(points: number): number {
  return Math.round((points / EXAM_MAX_POINTS) * 100)
}

export interface GradeBand {
  grade: FinnishGrade
  min: number
}

// Each grade band starts at its typical point cutoff, expressed as a share
// of the exam's maximum, so the predicted grade, the chart bands and the
// target markers all sit on the same scale. Bands are listed high to low
// and cover 0-100 with no gaps. Scoring itself is still a placeholder:
// the percentage is driven by how much of each course has been engaged
// with, not by how well.
export const GRADE_BANDS: GradeBand[] = FINNISH_GRADES.map((grade) => ({
  grade,
  min: pointsToPct(GRADE_POINTS[grade.letter].avg),
}))

export function predictGrade(overallPct: number): FinnishGrade {
  const band = GRADE_BANDS.find((b) => overallPct >= b.min)
  return band ? band.grade : FINNISH_GRADES[FINNISH_GRADES.length - 1]
}
