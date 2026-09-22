export type TopicCode = 'MAA5' | 'MAA6' | 'MAA7'

export interface Topic {
  code: TopicCode
  name: string
}

interface BaseCard {
  id: string
  topic: Topic
}

export interface LessonCard extends BaseCard {
  type: 'lesson'
  title: string
  body: string
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
