import type { Topic, TopicCode } from '../types'

export interface CourseMeta extends Topic {
  description: string
  badgeClass: string
  barClass: string
}

export const COURSES: CourseMeta[] = [
  {
    code: 'MAA2',
    name: 'Funktiot ja yhtälöt',
    description: 'Polynomit, toisen asteen yhtälö ja diskriminantti, juuri- ja rationaaliyhtälöt.',
    badgeClass: 'bg-topic-maa2/15 text-topic-maa2 ring-topic-maa2/30',
    barClass: 'bg-topic-maa2',
  },
  {
    code: 'MAA3',
    name: 'Geometria',
    description: 'Kolmiot, Pythagoraan lause, sini- ja kosinilause sekä pinta-alat ja tilavuudet.',
    badgeClass: 'bg-topic-maa3/15 text-topic-maa3 ring-topic-maa3/30',
    barClass: 'bg-topic-maa3',
  },
  {
    code: 'MAA4',
    name: 'Analyyttinen geometria ja vektorit',
    description: 'Suorien ja ympyröiden yhtälöt, vektorilaskenta ja pistetulo.',
    badgeClass: 'bg-topic-maa4/15 text-topic-maa4 ring-topic-maa4/30',
    barClass: 'bg-topic-maa4',
  },
  {
    code: 'MAA5',
    name: 'Funktiot ja yhtälöt 2',
    description: 'Radiaanit, yksikköympyrä, trigonometriset yhtälöt sekä eksponentti- ja logaritmifunktiot.',
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
  {
    code: 'MAA9',
    name: 'Talousmatematiikka',
    description: 'Lukujonot, korkoa korolle -laskenta sekä tasaerä- ja tasalyhennyslainat.',
    badgeClass: 'bg-topic-maa9/15 text-topic-maa9 ring-topic-maa9/30',
    barClass: 'bg-topic-maa9',
  },
  {
    code: 'MAA10',
    name: 'Avaruusgeometria',
    description: 'Avaruusvektorit, suorat ja tasot sekä ristitulo kolmiulotteisessa avaruudessa.',
    badgeClass: 'bg-topic-maa10/15 text-topic-maa10 ring-topic-maa10/30',
    barClass: 'bg-topic-maa10',
  },
  {
    code: 'MAA11',
    name: 'Algoritmit ja lukuteoria',
    description: 'Algoritmit, logiikka, jaollisuus ja alkuluvut sekä ohjelmoinnin perusteet.',
    badgeClass: 'bg-topic-maa11/15 text-topic-maa11 ring-topic-maa11/30',
    barClass: 'bg-topic-maa11',
  },
  {
    code: 'MAA12',
    name: 'Analyysi ja jatkuva jakauma',
    description: 'Jatkuvuus ja derivoituvuus, käänteisfunktiot sekä jatkuvat todennäköisyysjakaumat.',
    badgeClass: 'bg-topic-maa12/15 text-topic-maa12 ring-topic-maa12/30',
    barClass: 'bg-topic-maa12',
  },
]

export const COURSE_MAP: Record<TopicCode, CourseMeta> = Object.fromEntries(
  COURSES.map((course) => [course.code, course]),
) as Record<TopicCode, CourseMeta>
