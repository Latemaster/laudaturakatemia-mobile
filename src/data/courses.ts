import type { Topic, TopicCode } from '../types'

export interface CourseMeta extends Topic {
  description: string
}

// Where a course needs a tag beside other tags (exercise boxes, lists), it
// is a neutral one: courses have no colours of their own.
export const COURSE_TAG_CLASS = 'bg-surface-2 text-ink-dim ring-ink/10'

export const COURSES: CourseMeta[] = [
  {
    code: 'MAA2',
    name: 'Funktiot ja yhtälöt',
    description: 'Polynomit, toisen asteen yhtälö ja diskriminantti, juuri- ja rationaaliyhtälöt.',
  },
  {
    code: 'MAA3',
    name: 'Geometria',
    description: 'Kolmiot, Pythagoraan lause, sini- ja kosinilause sekä pinta-alat ja tilavuudet.',
  },
  {
    code: 'MAA4',
    name: 'Analyyttinen geometria ja vektorit',
    description: 'Suorien ja ympyröiden yhtälöt, vektorilaskenta ja pistetulo.',
  },
  {
    code: 'MAA5',
    name: 'Funktiot ja yhtälöt 2',
    description: 'Radiaanit, yksikköympyrä, trigonometriset yhtälöt sekä eksponentti- ja logaritmifunktiot.',
  },
  {
    code: 'MAA6',
    name: 'Derivaatta',
    description: 'Derivoinnin säännöt, ääriarvot ja funktion kulun tutkiminen.',
  },
  {
    code: 'MAA7',
    name: 'Integraalilaskenta',
    description: 'Integraalifunktio, määrätty integraali ja pinta-alan laskeminen.',
  },
  {
    code: 'MAA9',
    name: 'Talousmatematiikka',
    description: 'Lukujonot, korkoa korolle -laskenta sekä tasaerä- ja tasalyhennyslainat.',
  },
  {
    code: 'MAA10',
    name: 'Avaruusgeometria',
    description: 'Avaruusvektorit, suorat ja tasot sekä ristitulo kolmiulotteisessa avaruudessa.',
  },
  {
    code: 'MAA11',
    name: 'Algoritmit ja lukuteoria',
    description: 'Algoritmit, logiikka, jaollisuus ja alkuluvut sekä ohjelmoinnin perusteet.',
  },
  {
    code: 'MAA12',
    name: 'Analyysi ja jatkuva jakauma',
    description: 'Jatkuvuus ja derivoituvuus, käänteisfunktiot sekä jatkuvat todennäköisyysjakaumat.',
  },
]

export const COURSE_MAP: Record<TopicCode, CourseMeta> = Object.fromEntries(
  COURSES.map((course) => [course.code, course]),
) as Record<TopicCode, CourseMeta>
