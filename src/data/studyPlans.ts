import { cards } from './cards'
import { COURSES, COURSE_MAP } from './courses'
import { FINNISH_GRADES, type FinnishGrade } from './grade'
import { classifyDifficulty, type Difficulty } from './progress'
import type { Card, TopicCode } from '../types'

// Grades a student can set as their target. A and I have no study plan on
// the LaudaturAkatemia site, so they aren't offered here either.
export type TargetGrade = 'L' | 'E' | 'M' | 'C' | 'B'

export const TARGET_GRADES: TargetGrade[] = ['L', 'E', 'M', 'C', 'B']

// Courses that appear in the study plans but aren't in this app (yet). They
// still show up in the plan outline so the student sees the whole picture.
export type PlanCourseCode = TopicCode | 'MAY' | 'MAA8'

export const EXTERNAL_COURSE_NAMES: Record<Exclude<PlanCourseCode, TopicCode>, string> = {
  MAY: 'Luvut ja yhtälöt',
  MAA8: 'Tilastot ja todennäköisyys',
}

export interface PlanCourse {
  code: PlanCourseCode
  // What to revise from this course, in the student's words.
  focus: string
  // Which task tiers the recommended feed should pull from this course.
  difficulties: Difficulty[]
}

export interface PlanTier {
  title: string
  note?: string
  courses: PlanCourse[]
}

export interface StudyPlan {
  grade: TargetGrade
  // Typical exam point cutoff for this grade: mean and roughly one standard
  // deviation either side.
  points: { min: number; avg: number; max: number }
  strategy: string
  tiers: PlanTier[]
  important: string
  schedule: string
}

const ALL: Difficulty[] = ['easy', 'mid', 'hard']
const EASY: Difficulty[] = ['easy']
const EASY_MID: Difficulty[] = ['easy', 'mid']
const MID: Difficulty[] = ['mid']
const HARD: Difficulty[] = ['hard']

const FUNDAMENTALS: PlanCourse[] = [
  { code: 'MAY', focus: 'Teoria ja kaikki tehtävät', difficulties: ALL },
  { code: 'MAA2', focus: 'Teoria ja kaikki tehtävät', difficulties: ALL },
  { code: 'MAA3', focus: 'Teoria ja kaikki tehtävät', difficulties: ALL },
]

// Shared "minimum requirement" tier of the M, E and L plans.
const MINIMUM_REQUIREMENT: PlanCourse[] = [
  ...FUNDAMENTALS,
  {
    code: 'MAA6',
    focus: 'Funktiot, derivaatta ja jatkuvuus. Helpot ja keskivaikeat tehtävät',
    difficulties: EASY_MID,
  },
  { code: 'MAA7', focus: 'Määrätty integraali. Helpot ja keskivaikeat tehtävät', difficulties: EASY_MID },
  {
    code: 'MAA8',
    focus: 'Tilastot ja todennäköisyys 1.0 ja 2.0. Helpot ja keskivaikeat tehtävät',
    difficulties: EASY_MID,
  },
  {
    code: 'MAA4',
    focus: 'Suora, vektorin peruskäsitteet ja yhtälöt. Helpot ja keskivaikeat tehtävät',
    difficulties: EASY_MID,
  },
  {
    code: 'MAA5',
    focus: 'Asteet, yksikköympyrä ja trigonometria. Helpot ja keskivaikeat tehtävät',
    difficulties: EASY_MID,
  },
]

// Transcribed from the "Lukusuunnitelmat / Tavoitteena X" pages of the
// LaudaturAkatemia site (public/content/Opetussuunnitelmat/{B,C,M,E,L}.md),
// condensed for a phone screen.
export const STUDY_PLANS: Record<TargetGrade, StudyPlan> = {
  B: {
    grade: 'B',
    points: { min: 21, avg: 24, max: 27 },
    strategy:
      'B-arvosanaan riittää noin 20 % pisteistä, joten kertaus kannattaa kohdistaa rajattuihin aihealueisiin. ' +
      'A-osan tehtävät ja B-osan ensimmäiset tehtävät ovat helpoimpia: panosta siihen, että ne onnistuvat mahdollisimman varmasti. ' +
      'Haasteellisiin tehtäviin ei kannata uhrata aikaa – ne aiheuttavat vain turhautumista ilman merkittäviä tuloksia.',
    tiers: [
      {
        title: 'Tärkeimmät: kertaa ainakin nämä',
        note: 'Priorisoi järjestyksessä',
        courses: FUNDAMENTALS,
      },
      {
        title: 'Seuraavaksi tärkeimmät: nämä kannattaa kerrata',
        note: 'Priorisoi järjestyksessä',
        courses: [
          {
            code: 'MAA4',
            focus: 'Suora ja vektorin peruskäsitteet. Helpot ja keskivaikeat tehtävät',
            difficulties: EASY_MID,
          },
          { code: 'MAA6', focus: 'Funktiot ja derivaatta. Helpot tehtävät', difficulties: EASY },
          { code: 'MAA7', focus: 'Integraalin määritelmä ja helpot tehtävät', difficulties: EASY },
          { code: 'MAA8', focus: 'Tilastot ja todennäköisyys 1.0. Helpot tehtävät', difficulties: EASY },
        ],
      },
    ],
    important:
      'Jos jokin tuntuu liian vaikealta, siirry eteenpäin. Jos jokin aihe on sinulle mieluisa ja helpompi, harjoittele sitä. ' +
      'Tärkeintä on, että osaat jotain – ja että jaksat harjoitella säännöllisesti.',
    schedule:
      'Aloita viimeistään 3–4 viikkoa ennen koetta, vähintään 2–3 kertaa viikossa. Hyvä strategia on tehdä vähän tosi usein, esim. 1–2 tehtävää päivässä.',
  },

  C: {
    grade: 'C',
    points: { min: 31, avg: 36, max: 41 },
    strategy:
      'C:n pisteisiin voi teoriassa päästä pelkällä A-osalla, mutta panostusta kannattaa jakaa myös B-osan puolelle. ' +
      'Keskity erityisesti kolmeen ensimmäiseen kurssiin – kun ne ovat hallussa, olet vahvoilla. ' +
      'Lisäksi derivaatan, integraalin sekä tilastojen ja todennäköisyyden perusasiat ovat tehtävien yleisyyden takia hyvin kannattavia. ' +
      'Haasteellisimpiin tehtäviin ei vielä kannata uhrata aikaa.',
    tiers: [
      {
        title: 'Tärkeimmät: kertaa ainakin nämä',
        note: 'Priorisoi järjestyksessä',
        courses: [
          ...FUNDAMENTALS,
          {
            code: 'MAA4',
            focus: 'Suora ja vektorin peruskäsitteet. Helpot ja keskivaikeat tehtävät',
            difficulties: EASY_MID,
          },
          { code: 'MAA6', focus: 'Funktiot ja derivaatta. Helpot tehtävät', difficulties: EASY },
        ],
      },
      {
        title: 'Seuraavaksi tärkeimmät: nämä kannattaa osata',
        note: 'Priorisoi järjestyksessä',
        courses: [
          { code: 'MAA4', focus: 'Yhtälöt. Helpot ja keskivaikeat tehtävät', difficulties: EASY_MID },
          { code: 'MAA6', focus: 'Jatkuvuus. Keskivaikeat tehtävät', difficulties: MID },
          { code: 'MAA7', focus: 'Määrätty integraali. Keskivaikeat tehtävät', difficulties: MID },
          {
            code: 'MAA8',
            focus: 'Tilastot ja todennäköisyys 1.0 ja 2.0. Helpot ja keskivaikeat tehtävät',
            difficulties: EASY_MID,
          },
          { code: 'MAA9', focus: 'Lukujonot ja talouskäsitteet. Helpot tehtävät', difficulties: EASY },
        ],
      },
    ],
    important:
      'Jos jokin tuntuu liian vaikealta, siirry eteenpäin. Jos jokin aihe on sinulle mieluisa ja helpompi, harjoittele sitä. ' +
      'Tärkeintä on, että osaat jotain – ja että jaksat harjoitella säännöllisesti.',
    schedule:
      'Aloita viimeistään 3–4 viikkoa ennen koetta, vähintään 2–3 kertaa viikossa. Hyvä strategia on tehdä vähän tosi usein, esim. 1–2 tehtävää päivässä.',
  },

  M: {
    grade: 'M',
    points: { min: 44, avg: 47, max: 51 },
    strategy:
      'M:n pisteisiin on jo vaikeampi päästä pelkällä A-osalla, joten panostusta kannattaa selkeästi jakaa B-osan puolelle. ' +
      'Kertaus kannattaa silti kohdistaa: ota muutama aihealue kunnolla haltuun sen sijaan, että uhraat aikaa kaikkein haastavimpiin tehtäviin. ' +
      'Hallitse ensin MAY–MAA3 ja perusasiat kursseilta MAA4–MAA8, sitten analyyttinen geometria, vektorit, trigonometria ja logaritmit.',
    tiers: [
      {
        title: 'Tärkeimmät: kertaa ainakin nämä',
        note: 'Priorisoi järjestyksessä',
        courses: MINIMUM_REQUIREMENT,
      },
      {
        title: 'Seuraavaksi tärkeimmät: nämä kannattaa osata',
        note: 'Valitse näistä 4–5',
        courses: [
          { code: 'MAA4', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA5', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA6', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA7', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA8', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA9', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA11', focus: 'Se mikä onnistuu', difficulties: EASY_MID },
        ],
      },
      {
        title: 'Kertaa jos aikaa',
        note: 'Jos jokin sujuu, opettele se huolellisemmin. Jos jokin on mahdotonta, skippaa.',
        courses: [
          { code: 'MAA10', focus: 'Helpot ja perustehtävät', difficulties: EASY },
          { code: 'MAA12', focus: 'Helpot tehtävät', difficulties: EASY },
        ],
      },
    ],
    important:
      'Ensimmäisen osion aiheet tulee hallita – muut aiheet pohjautuvat niille. ' +
      'Toisessa osiossa voit jo tehdä valintoja: jos jokin tuntuu mahdottomalta, siirry eteenpäin, mutta hallitse yli puolet osion aiheista. ' +
      'Isoin haasteesi tulee olemaan, että jaksat harjoitella säännöllisesti.',
    schedule:
      'Aloita viimeistään 4 viikkoa ennen koetta, vähintään 2–3 kertaa viikossa. Hyvä strategia on tehdä jonkin verran ja usein, esim. 2–4 tehtävää päivässä.',
  },

  E: {
    grade: 'E',
    points: { min: 65, avg: 70, max: 75 },
    strategy:
      'E:tä tavoitellessa panostus jaetaan tasan A- ja B-osan välillä, painotus jopa hieman B-osan puolelle: A-osan alkutehtävien tulisi olla jo lähes ilmaisia. ' +
      'Kohdista kertaus omiin heikkouksiin, ei materiaalin järjestykseen. ' +
      'Fokus kannattaa jo asettaa haasteellisempiin, syventäviin tehtäviin – helpoimmat voit sivuuttaa, jotta vaikeimpiin jää enemmän aikaa.',
    tiers: [
      {
        title: 'Minimiedellytys: tulisi olla hallinnassa',
        note: 'Priorisoi järjestyksessä',
        courses: MINIMUM_REQUIREMENT,
      },
      {
        title: 'Seuraavaksi tärkeimmät: nämä tulee osata',
        note: 'Valitse näistä 4–5',
        courses: [
          { code: 'MAA4', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA5', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA6', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA7', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA8', focus: 'Kaikki + keskivaikeat tehtävät', difficulties: EASY_MID },
          { code: 'MAA9', focus: 'Kaikki + keskivaikeat tehtävät', difficulties: EASY_MID },
        ],
      },
      {
        title: 'Panosta seuraaviin: näissä luodaan ero',
        note: 'Jos jokin sujuu, opettele se huolellisemmin. Jos jokin on mahdotonta, skippaa.',
        courses: [
          { code: 'MAA8', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA9', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA10', focus: 'Helpot ja perustehtävät', difficulties: EASY },
          { code: 'MAA11', focus: 'Helpot ja perustehtävät', difficulties: EASY },
          { code: 'MAA12', focus: 'Helpot ja perustehtävät', difficulties: EASY },
        ],
      },
      {
        title: 'Lisänä: ei välttämätöntä mutta suositeltavaa',
        courses: [
          { code: 'MAA10', focus: 'Vaikeat tehtävät', difficulties: HARD },
          { code: 'MAA11', focus: 'Vaikeat tehtävät', difficulties: HARD },
          { code: 'MAA12', focus: 'Vaikeat tehtävät', difficulties: HARD },
        ],
      },
    ],
    important:
      'Ensimmäisen osion aiheet tulee hallita. E antaa hieman enemmän anteeksi kuin L: muutaman inhokkiaiheen voi pudottaa, ' +
      'mutta kovin montaa ei kannata hylätä – eikä varsinkaan perusasioista. Muista testata itseäsi säännöllisesti.',
    schedule:
      'Aloita 4–8 viikkoa ennen koetta omasta tasostasi riippuen, noin 4–5 kertaa viikossa. Hyvä strategia on tehdä jonkin verran ja usein, esim. 3–5 tehtävää päivässä.',
  },

  L: {
    grade: 'L',
    points: { min: 81, avg: 89, max: 97 },
    strategy:
      'L:ää tavoitellessa tulee osata lähes kaikki. Painotus on selkeästi B-osan puolella, sillä A-osan alkutehtävien tulisi olla ilmaisia. ' +
      'Kohdista kertaus omiin heikkouksiin ja fokusoi haasteellisimpiin, syventäviin tehtäviin. ' +
      'Sivuuta helpoimmat tehtävät, jotta vaikeimpiin jää enemmän aikaa – turha uhrata aikaa siihen, minkä jo osaat.',
    tiers: [
      {
        title: 'Minimiedellytys: tulisi olla jo hallinnassa',
        note: 'Älä käytä liikaa aikaa – priorisoi järjestyksessä',
        courses: MINIMUM_REQUIREMENT,
      },
      {
        title: 'Seuraavaksi tärkeimmät: nämä tulee osata',
        note: 'Painotus vaikeissa tehtävissä',
        courses: [
          { code: 'MAA4', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA5', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA6', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA7', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA8', focus: 'Kaikki + keskivaikeat tehtävät', difficulties: EASY_MID },
          { code: 'MAA9', focus: 'Kaikki + keskivaikeat tehtävät', difficulties: EASY_MID },
        ],
      },
      {
        title: 'Panosta seuraaviin: näissä luodaan ero',
        note: 'Tähän kuluu L:n tavoittelijan isoin aika. Haasta itseäsi.',
        courses: [
          { code: 'MAA8', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA9', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA10', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA11', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
          { code: 'MAA12', focus: 'Kaikki + vaikeat tehtävät', difficulties: ALL },
        ],
      },
    ],
    important:
      'Ensimmäisen osion aiheet tulee hallita. L:n tavoittelussa lähes kaikki tulee osata, joten kyse on tehokkuudesta ja grindistä. ' +
      'Tee vanhoja yo-kokeita tai Laudatur Akatemian tehtäviä ajastimen kanssa ja arvioi tuloksesi rehellisesti. Keskity tehtävien laatuun, älä tunteihin.',
    schedule:
      'Aloita heti kun pystyt, noin 4–5 kertaa viikossa. Hyvä strategia on tehdä jonkin verran ja usein, esim. 3–5 tehtävää päivässä. Lue mahdollisimman paljon, mutta pysy järjissäsi.',
  },
}

export function getFinnishGrade(letter: TargetGrade): FinnishGrade {
  return FINNISH_GRADES.find((grade) => grade.letter === letter) ?? FINNISH_GRADES[0]
}

// Position in the L..I scale, 0 being the best. Lets callers compare a
// predicted grade against the target.
export function gradeRank(letter: string): number {
  const index = FINNISH_GRADES.findIndex((grade) => grade.letter === letter)
  return index === -1 ? FINNISH_GRADES.length - 1 : index
}

export function isAppCourse(code: PlanCourseCode): code is TopicCode {
  return code in COURSE_MAP
}

// The Suositellut feed for a target grade: the plan's tiers in order, each
// course's lesson card on its first appearance followed by that tier's task
// cards for the course. A course that reappears in a later tier with wider
// difficulties only contributes the tasks not shown yet, so the feed climbs
// from fundamentals to the hard problems the plan says to end on.
export function getRecommendedCards(grade: TargetGrade): Card[] {
  const plan = STUDY_PLANS[grade]
  const result: Card[] = []
  const shownLessons = new Set<TopicCode>()
  const shownIds = new Set<string>()

  for (const tier of plan.tiers) {
    for (const course of tier.courses) {
      if (!isAppCourse(course.code)) continue
      const code = course.code
      const wanted = new Set(course.difficulties)

      if (!shownLessons.has(code)) {
        shownLessons.add(code)
        const lesson = cards.find((card) => card.topic.code === code && card.type === 'lesson')
        if (lesson) result.push(lesson)
      }

      for (const card of cards) {
        if (card.topic.code !== code || card.type !== 'task' || shownIds.has(card.id)) continue
        if (!wanted.has(classifyDifficulty(card.problem.section))) continue
        shownIds.add(card.id)
        result.push(card)
      }
    }
  }

  return result
}

export interface CourseBucket {
  title: string
  courses: { code: TopicCode; focus?: string }[]
}

const BUCKET_TITLES = ['Tärkeimmät', 'Seuraavaksi tärkeimmät', 'Jos aikaa jää'] as const

// The app's courses split into three priority buckets for a target grade:
// the plan's first tier, its second tier, and everything after that. A
// course the plan never mentions lands in the last bucket without a focus
// note. Each course is placed by its first appearance, in plan order.
export function getCourseBuckets(grade: TargetGrade): CourseBucket[] {
  const buckets: CourseBucket[] = BUCKET_TITLES.map((title) => ({ title, courses: [] }))
  const placed = new Set<TopicCode>()

  STUDY_PLANS[grade].tiers.forEach((tier, index) => {
    const bucket = buckets[Math.min(index, buckets.length - 1)]
    for (const course of tier.courses) {
      if (!isAppCourse(course.code) || placed.has(course.code)) continue
      placed.add(course.code)
      bucket.courses.push({ code: course.code, focus: course.focus })
    }
  })

  for (const course of COURSES) {
    if (!placed.has(course.code)) buckets[buckets.length - 1].courses.push({ code: course.code })
  }

  return buckets
}

const STORAGE_KEY = 'laudatur.targetGrade'
const DEFAULT_TARGET_GRADE: TargetGrade = 'M'

function isTargetGrade(value: unknown): value is TargetGrade {
  return typeof value === 'string' && (TARGET_GRADES as string[]).includes(value)
}

export function loadTargetGrade(): TargetGrade {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isTargetGrade(stored) ? stored : DEFAULT_TARGET_GRADE
  } catch {
    return DEFAULT_TARGET_GRADE
  }
}

export function saveTargetGrade(grade: TargetGrade): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, grade)
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // in-memory state still works for the session.
  }
}
