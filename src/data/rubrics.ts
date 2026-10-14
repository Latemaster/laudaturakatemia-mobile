import type { RubricPart, TopicCode } from '../types'
import { PROBLEM_SETS } from './cards'
import { COURSE_MAP, COURSES } from './courses'
import type { EvaluationExercise } from './evaluation'

// Scoring rubrics for the open-answer problems in problems/<course>.json,
// written in batches of one section at a time (docs/rubric-guidelines.md).
// Each rubrics/<course>.json maps a problem id to its rubric; problems
// without one are simply not offered for self-evaluation yet.

export interface ProblemRubric {
  // Drafts are generated and waiting for review; only reviewed rubrics are
  // shown to students. Drafts appear in dev builds and with ?drafts in the
  // URL so they can be reviewed in the real view.
  status: 'draft' | 'reviewed'
  maxPoints: number
  parts: RubricPart[]
  // For the reviewer: doubts about the source solution or judgment calls
  // made while writing the rubric. Never shown to students.
  reviewNote?: string
}

export type CourseRubrics = Record<string, ProblemRubric>

const RUBRIC_FILES = import.meta.glob<CourseRubrics>('./rubrics/*.json', { eager: true, import: 'default' })

function courseRubrics(code: TopicCode): CourseRubrics {
  return RUBRIC_FILES[`./rubrics/${code.toLowerCase()}.json`] ?? {}
}

function showDrafts(): boolean {
  if (import.meta.env.DEV) return true
  try {
    return new URLSearchParams(window.location.search).has('drafts')
  } catch {
    return false
  }
}

export interface RubricExercise extends EvaluationExercise {
  section: string
  status: ProblemRubric['status']
}

function buildRubricExercises(): RubricExercise[] {
  const includeDrafts = showDrafts()
  return COURSES.flatMap(({ code }) => {
    const rubrics = courseRubrics(code)
    const { name } = COURSE_MAP[code]
    return PROBLEM_SETS[code].flatMap((problem): RubricExercise[] => {
      const rubric = rubrics[problem.id]
      if (!rubric || (rubric.status === 'draft' && !includeDrafts)) return []
      return [
        {
          // Problem ids repeat across courses, so the course is part of the
          // key the student's answer and scores are stored under.
          id: `${code.toLowerCase()}-${problem.id}`,
          topic: { code, name },
          title: `${problem.section} · ${problem.title}`,
          length: rubric.maxPoints >= 12 ? 'long' : 'short',
          promptBlocks: problem.promptBlocks,
          parts: rubric.parts,
          section: problem.section,
          status: rubric.status,
        },
      ]
    })
  })
}

export const RUBRIC_EXERCISES: RubricExercise[] = buildRubricExercises()
