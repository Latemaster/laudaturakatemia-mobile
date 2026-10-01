import { COURSES } from './courses'
import { FINNISH_GRADES, GRADE_BANDS, predictGrade, type FinnishGrade } from './grade'
import type { TopicCode } from '../types'

// Finnish lukio course grades run 4 (hylätty) .. 10 (erinomainen).
export type CourseGrade = 4 | 5 | 6 | 7 | 8 | 9 | 10

export const COURSE_GRADES: CourseGrade[] = [4, 5, 6, 7, 8, 9, 10]

// Grades the student has reported per course. Courses not yet filled in are
// simply absent.
export type CourseGrades = Partial<Record<TopicCode, CourseGrade>>

// Which yo-exam grade a course grade roughly corresponds to. The scale is
// deliberately one-to-one so the student can read it at a glance: a 10
// across the board hints at L, an 8 at M, and so on.
export const COURSE_GRADE_LETTER: Record<CourseGrade, string> = {
  10: 'L',
  9: 'E',
  8: 'M',
  7: 'C',
  6: 'B',
  5: 'A',
  4: 'I',
}

// "8,5" / "9,0": always one decimal so the figure reads the same whatever
// the grades happen to average to.
export function formatAverage(average: number): string {
  return average.toLocaleString('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export interface EarlyIndication {
  // How many of the app's courses have a grade filled in.
  filled: number
  total: number
  // Mean of the filled-in grades, one decimal; null when nothing is filled.
  average: number | null
  // The mean expressed on the same 0-100 exam-points scale the Osaaminen
  // prediction uses, so the two can be compared directly.
  pct: number
  grade: FinnishGrade
}

function bandPct(letter: string): number {
  return GRADE_BANDS.find((band) => band.grade.letter === letter)?.min ?? 0
}

// Maps a (possibly fractional) course-grade average to an exam-points
// percentage by interpolating linearly between the cutoffs of the yo
// grades the neighbouring whole grades correspond to. An average of 8.0
// lands exactly on M's cutoff, 8.5 halfway between M's and E's.
export function courseAverageToPct(average: number): number {
  const clamped = Math.min(10, Math.max(4, average))
  const lower = Math.floor(clamped) as CourseGrade
  const upper = Math.min(10, lower + 1) as CourseGrade
  const lowerPct = bandPct(COURSE_GRADE_LETTER[lower])
  const upperPct = bandPct(COURSE_GRADE_LETTER[upper])
  return Math.round(lowerPct + (upperPct - lowerPct) * (clamped - lower))
}

export function getEarlyIndication(grades: CourseGrades): EarlyIndication {
  const values = COURSES.map((course) => grades[course.code]).filter(
    (grade): grade is CourseGrade => grade !== undefined,
  )
  const total = COURSES.length
  if (values.length === 0) {
    return { filled: 0, total, average: null, pct: 0, grade: FINNISH_GRADES[FINNISH_GRADES.length - 1] }
  }
  const mean = values.reduce((sum, grade) => sum + grade, 0) / values.length
  const average = Math.round(mean * 10) / 10
  const pct = courseAverageToPct(mean)
  return { filled: values.length, total, average, pct, grade: predictGrade(pct) }
}

const STORAGE_KEY = 'laudatur.courseGrades'

function isCourseGrade(value: unknown): value is CourseGrade {
  return typeof value === 'number' && (COURSE_GRADES as number[]).includes(value)
}

export function loadCourseGrades(): CourseGrades {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const result: CourseGrades = {}
    for (const course of COURSES) {
      const value = (parsed as Record<string, unknown>)[course.code]
      if (isCourseGrade(value)) result[course.code] = value
    }
    return result
  } catch {
    return {}
  }
}

export function saveCourseGrades(grades: CourseGrades): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(grades))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // in-memory state still works for the session.
  }
}
