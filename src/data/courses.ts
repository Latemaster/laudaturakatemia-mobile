import type { Topic, TopicCode } from '../types'

export interface CourseMeta extends Topic {
  description: string
  badgeClass: string
  barClass: string
}

export const COURSES: CourseMeta[] = [
  {
    code: 'MAA5',
    name: 'Trigonometria',
    description: 'Yksikköympyrä, trigonometriset funktiot ja niiden sovellukset.',
    badgeClass: 'bg-topic-maa5/15 text-topic-maa5 ring-topic-maa5/30',
    barClass: 'bg-topic-maa5',
  },
  {
    code: 'MAA6',
    name: 'Derivaatta',
    description: 'Derivoinnin säännöt, ääriarvot ja funktion kulun tutkiminen.',
    badgeClass: 'bg-topic-maa6/15 text-topic-maa6 ring-topic-maa6/30',
    barClass: 'bg-topic-maa6',
  },
  {
    code: 'MAA7',
    name: 'Integraalilaskenta',
    description: 'Integraalifunktio, määrätty integraali ja pinta-alan laskeminen.',
    badgeClass: 'bg-topic-maa7/15 text-topic-maa7 ring-topic-maa7/30',
    barClass: 'bg-topic-maa7',
  },
]

export const COURSE_MAP: Record<TopicCode, CourseMeta> = Object.fromEntries(
  COURSES.map((course) => [course.code, course]),
) as Record<TopicCode, CourseMeta>
