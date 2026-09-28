export type TopicCode =
  | 'MAA2'
  | 'MAA3'
  | 'MAA4'
  | 'MAA5'
  | 'MAA6'
  | 'MAA7'
  | 'MAA9'
  | 'MAA10'
  | 'MAA11'
  | 'MAA12'

export interface Topic {
  code: TopicCode
  name: string
}

interface BaseCard {
  id: string
  topic: Topic
}

export type VisualKey =
  | 'quadratic-discriminant'
  | 'binomial-square'
  | 'unit-circle'
  | 'tangent-line'
  | 'scale-factor'
  | 'angle-types'
  | 'similar-triangles'
  | 'angle-bisector'
  | 'right-triangle-trig'
  | 'shape-area-grid'
  | 'triangle-laws'
  | 'circle-sector'
  | 'solid-shapes-grid'
  | 'absolute-value-line'
  | 'distance-midpoint'
  | 'line-slope'
  | 'perpendicular-lines'
  | 'circle-equation'
  | 'point-line-distance'
  | 'parabola-shape'
  | 'vector-addition'
  | 'dot-product-angle'
  | 'unit-vector'
  | 'angle-symmetry'
  | 'tangent-graph'
  | 'sine-equation-graph'
  | 'sine-wave-params'
  | 'log-point-graph'
  | 'log-rule-check'
  | 'exp-log-mirror'
  | 'exp-equation-graph'
  | 'secant-to-tangent'
  | 'power-rule-graph'
  | 'extrema-graph'
  | 'riemann-sum'
  | 'power-rule-integral'
  | 'integration-by-parts-flow'
  | 'area-under-curve'
  | 'revolution-solid'
  | 'sequence-bars'
  | 'series-sum'
  | 'compound-interest'
  | 'loan-comparison'
  | 'space-vector-axes'
  | 'parametric-line-3d'
  | 'plane-normal-3d'
  | 'cross-product-viz'
  | 'parallelepiped-viz'
  | 'level-curves'
  | 'gradient-field'
  | 'algorithm-flowchart'
  | 'logic-truth-table'
  | 'modular-clock'
  | 'euclidean-algorithm'
  | 'sieve-of-eratosthenes'
  | 'python-conditional'
  | 'domain-range-hyperbola'
  | 'continuity-kink'
  | 'inverse-function-mirror'
  | 'improper-integral-convergence'
  | 'normal-distribution'

export interface LessonCard extends BaseCard {
  type: 'lesson'
  title: string
  body: string
  visual?: VisualKey
}

export interface ExerciseOption {
  id: string
  text: string
  correct: boolean
}

interface BaseExerciseCard extends BaseCard {
  type: 'exercise'
  question: string
  explanation: string
  visual?: VisualKey
}

export interface ChoiceExerciseCard extends BaseExerciseCard {
  kind: 'choice'
  options: ExerciseOption[]
}

export interface NumericExerciseCard extends BaseExerciseCard {
  kind: 'numeric'
  // Correct value and the +/- tolerance accepted around it (e.g. for
  // rounded or read-off-a-graph answers).
  answer: number
  tolerance: number
  unit?: string
  min?: number
  max?: number
  step?: number
}

export type ExerciseCard = ChoiceExerciseCard | NumericExerciseCard

// Plain Omit collapses a union to its shared keys, which drops `options` /
// `answer` / `tolerance` since they aren't common to both ExerciseCard
// variants. This distributes Omit over the union member-by-member instead,
// so exercise data keeps its discriminated 'choice' | 'numeric' shape.
export type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never

export interface ProblemTextBlock {
  type: 'text'
  content: string
}

export interface ProblemImageBlock {
  type: 'image'
  src: string
  alt: string
}

export type ProblemBlock = ProblemTextBlock | ProblemImageBlock

export interface Problem {
  id: string
  section: string
  title: string
  promptBlocks: ProblemBlock[]
  answerBlocks: ProblemBlock[]
}

export interface TaskCard extends BaseCard {
  type: 'task'
  problem: Problem
}

export type Card = LessonCard | ExerciseCard | TaskCard
