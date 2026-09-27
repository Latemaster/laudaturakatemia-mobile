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

export interface ExerciseCard extends BaseCard {
  type: 'exercise'
  question: string
  options: ExerciseOption[]
  explanation: string
}

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
