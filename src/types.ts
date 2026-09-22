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

export type Card = LessonCard | ExerciseCard
