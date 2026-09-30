import type { Card, DistributiveOmit, ExerciseCard, LessonCard, Problem, TopicCode } from '../types'
import { COURSE_MAP } from './courses'
import maa2Theory from './theory/maa2'
import maa3Theory from './theory/maa3'
import maa4Theory from './theory/maa4'
import maa5Theory from './theory/maa5'
import maa6Theory from './theory/maa6'
import maa7Theory from './theory/maa7'
import maa9Theory from './theory/maa9'
import maa10Theory from './theory/maa10'
import maa11Theory from './theory/maa11'
import maa12Theory from './theory/maa12'

import maa2Exercises from './exercises/maa2'
import maa3Exercises from './exercises/maa3'
import maa4Exercises from './exercises/maa4'
import maa5Exercises from './exercises/maa5'
import maa6Exercises from './exercises/maa6'
import maa7Exercises from './exercises/maa7'
import maa9Exercises from './exercises/maa9'
import maa10Exercises from './exercises/maa10'
import maa11Exercises from './exercises/maa11'
import maa12Exercises from './exercises/maa12'

import maa2Problems from './problems/maa2.json'
import maa3Problems from './problems/maa3.json'
import maa4Problems from './problems/maa4.json'
import maa5Problems from './problems/maa5.json'
import maa6Problems from './problems/maa6.json'
import maa7Problems from './problems/maa7.json'
import maa9Problems from './problems/maa9.json'
import maa10Problems from './problems/maa10.json'
import maa11Problems from './problems/maa11.json'
import maa12Problems from './problems/maa12.json'

const PROBLEM_SETS: Record<TopicCode, Problem[]> = {
  MAA2: maa2Problems as Problem[],
  MAA3: maa3Problems as Problem[],
  MAA4: maa4Problems as Problem[],
  MAA5: maa5Problems as Problem[],
  MAA6: maa6Problems as Problem[],
  MAA7: maa7Problems as Problem[],
  MAA9: maa9Problems as Problem[],
  MAA10: maa10Problems as Problem[],
  MAA11: maa11Problems as Problem[],
  MAA12: maa12Problems as Problem[],
}

const LESSONS: Record<TopicCode, Omit<LessonCard, 'id' | 'type' | 'topic'>> = {
  MAA2: {
    title: 'Polynomit ja toisen asteen yhtälö',
    body:
      'Polynomien lasku- ja tekijöihinjakotoimitukset ovat funktioiden käsittelyn perusta. ' +
      'Toisen asteen yhtälö ratkaistaan yleisellä ratkaisukaavalla:\n\n' +
      '$$x = \\dfrac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$\n\n' +
      'Diskriminantti $D = b^2-4ac$ kertoo ratkaisujen lukumäärän: kaksi, jos $D>0$, yksi, jos $D=0$, ei yhtään reaaliratkaisua, jos $D<0$.',
  },
  MAA3: {
    title: 'Geometrian peruskäsitteet',
    body:
      'Suorakulmaisessa kolmiossa pätee Pythagoraan lause $a^2+b^2=c^2$ sekä trigonometriset funktiot $\\sin\\theta$, $\\cos\\theta$ ja $\\tan\\theta$. ' +
      'Muiden kolmioiden sivuja ja kulmia ratkotaan sini- ja kosinilauseilla:\n\n' +
      '$$\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}, \\qquad c^2=a^2+b^2-2ab\\cos C$$\n\n' +
      'Mittakaavassa pinta-ala kasvaa suhteen neliönä ja tilavuus kuutiona.',
  },
  MAA4: {
    title: 'Analyyttinen geometria ja vektorit',
    body:
      'Suoran yhtälö $y=kx+b$ ja ympyrän yhtälö $(x-h)^2+(y-k)^2=r^2$ kuvaavat tason pistejoukkoja. ' +
      'Vektoreilla on suunta ja suuruus; pistetulo $\\vec u \\cdot \\vec v = u_1v_1+u_2v_2$ kertoo vektorien välisen kulman ja on nolla kohtisuorille vektoreille.',
  },
  MAA5: {
    title: 'Radiaanit, yksikköympyrä ja logaritmit',
    body:
      'Yksikköympyrällä pisteen koordinaatit kulman $\\theta$ kohdalla ovat $(\\cos\\theta,\\sin\\theta)$, ja radiaanien ja asteiden välillä pätee $180^\\circ = \\pi$ rad. ' +
      'Trigonometriset funktiot ovat jaksollisia jaksolla $2\\pi$.\n\n' +
      'Logaritmi on eksponenttifunktion käänteisfunktio: $\\log_a(x)=y \\iff a^y=x$, ja sille pätee $\\log_a(xy)=\\log_a x + \\log_a y$.',
  },
  MAA6: {
    title: 'Derivaatan perussäännöt',
    body:
      'Derivaatta kertoo funktion muutosnopeuden. Potenssisääntö: $(x^n)\' = n \\cdot x^{n-1}$.\n\n' +
      'Tulon derivaatta: $(f \\cdot g)\' = f\' \\cdot g + f \\cdot g\'$.\n\n' +
      'Esimerkki: kun $f(x) = x^3$, niin $f\'(x) = 3x^2$.',
  },
  MAA7: {
    title: 'Integraalifunktio',
    body:
      'Integrointi on derivoinnin käänteisoperaatio. Potenssisääntö integroinnille:\n\n' +
      '$$\\int x^n \\, dx = \\dfrac{x^{n+1}}{n+1} + C$$, kun $n \\neq -1$.\n\n' +
      'Määrätyssä integraalissa lasketaan integraalifunktion arvojen erotus rajoilla.',
  },
  MAA9: {
    title: 'Lukujonot ja talousmatematiikka',
    body:
      'Aritmeettisessa lukujonossa peräkkäisten jäsenten erotus on vakio $d$: $a_n=a_1+(n-1)d$. ' +
      'Geometrisessa lukujonossa peräkkäisten jäsenten suhde on vakio $r$: $a_n=a_1 \\cdot r^{n-1}$.\n\n' +
      'Korkoa korolle -ilmiössä pääoma kasvaa kaavalla $A=A_0(1+r)^t$, jota sovelletaan muun muassa laina- ja säästölaskelmiin.',
  },
  MAA10: {
    title: 'Avaruusgeometria',
    body:
      'Avaruusvektori $\\vec v=(x,y,z)$ yleistää tason vektorit kolmeen ulottuvuuteen. ' +
      'Suora esitetään muodossa $\\vec r(t)=\\vec a+t\\vec v$ ja taso muodossa $\\vec n \\cdot (\\vec r - \\vec a)=0$.\n\n' +
      'Ristitulo $\\vec a \\times \\vec b$ tuottaa vektorin, joka on kohtisuorassa molempia vektoreita vastaan, ja sitä käytetään tason normaalivektorin määrittämiseen.',
  },
  MAA11: {
    title: 'Algoritmit ja lukuteoria',
    body:
      'Algoritmi on tarkka ohjeiden sarja, joka koostuu peräkkäisyydestä, toistosta ja valinnasta. ' +
      'Jakoyhtälö $a=bq+r$ ($0\\le r<b$) on jaollisuuden ja kongruenssien perusta.\n\n' +
      'Aritmetiikan peruslauseen mukaan jokainen ykköstä suurempi kokonaisluku voidaan esittää yksikäsitteisesti alkulukujen tulona.',
  },
  MAA12: {
    title: 'Analyysi ja jatkuva jakauma',
    body:
      'Funktio on derivoituva pisteessä, jos sen vasemman- ja oikeanpuoleiset raja-arvot ovat yhtä suuret. ' +
      'Käänteisfunktion derivaatalle pätee $(f^{-1})\'(y)=\\dfrac{1}{f\'(x)}$, kun $y=f(x)$.\n\n' +
      'Jatkuvan muuttujan todennäköisyysjakaumaa kuvaa tiheysfunktio $f$, jolle kertymäfunktio on $F(x)=\\int_{-\\infty}^{x} f(t)\\,dt$. Normaalijakauma $N(\\mu,\\sigma^2)$ on tunnetuin esimerkki.',
  },
}

const COURSE_ORDER: TopicCode[] = [
  'MAA2',
  'MAA3',
  'MAA4',
  'MAA5',
  'MAA6',
  'MAA7',
  'MAA9',
  'MAA10',
  'MAA11',
  'MAA12',
]

function buildCourseCards(code: TopicCode): Card[] {
  const topic = COURSE_MAP[code]
  const slug = code.toLowerCase()
  const lessonCard: Card = {
    id: `${slug}-lesson`,
    type: 'lesson',
    topic,
    ...LESSONS[code],
  }
  const taskCards: Card[] = PROBLEM_SETS[code].map((problem) => ({
    id: `${slug}-task-${problem.id}`,
    type: 'task',
    topic,
    problem,
  }))
  return [lessonCard, ...taskCards]
}

export const cards: Card[] = COURSE_ORDER.flatMap(buildCourseCards)

// Per-course theory boxes, used only when browsing a single course (not the
// blended feed above). Courses with no entry here fall back to that course's
// single LESSONS blurb, so this is purely additive per course.
const CONCEPTS: Partial<Record<TopicCode, Array<Omit<LessonCard, 'id' | 'type' | 'topic'>>>> = {
  MAA2: maa2Theory,
  MAA3: maa3Theory,
  MAA4: maa4Theory,
  MAA5: maa5Theory,
  MAA6: maa6Theory,
  MAA7: maa7Theory,
  MAA9: maa9Theory,
  MAA10: maa10Theory,
  MAA11: maa11Theory,
  MAA12: maa12Theory,
}

export function getConceptCards(code: TopicCode): LessonCard[] {
  const topic = COURSE_MAP[code]
  const slug = code.toLowerCase()
  return (CONCEPTS[code] ?? []).map((concept, index) => ({
    id: `${slug}-concept-${index + 1}`,
    type: 'lesson',
    topic,
    ...concept,
  }))
}

// Quick exercises (multiple-choice, numeric, slider) for the concept boxes
// above, kept in a separate map from both the concept boxes and the
// open-answer task cards. See groupExercisesByConcept for how they pair up.
const EXERCISES: Partial<Record<TopicCode, Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>>>> = {
  MAA2: maa2Exercises,
  MAA3: maa3Exercises,
  MAA4: maa4Exercises,
  MAA5: maa5Exercises,
  MAA6: maa6Exercises,
  MAA7: maa7Exercises,
  MAA9: maa9Exercises,
  MAA10: maa10Exercises,
  MAA11: maa11Exercises,
  MAA12: maa12Exercises,
}

export function getExerciseCards(code: TopicCode): ExerciseCard[] {
  const topic = COURSE_MAP[code]
  const slug = code.toLowerCase()
  return (EXERCISES[code] ?? []).map((exercise, index) => ({
    id: `${slug}-exercise-${index + 1}`,
    type: 'exercise',
    topic,
    ...exercise,
  }))
}

// Buckets a course's exercises by the concept box (index into the course's
// theory file) each one reinforces, in file order within a bucket. An
// exercise with an explicit conceptIndex goes there; the others pair up with
// the concepts in order, one per concept, which is how every course's
// original one-exercise-per-topic list is written.
export function groupExercisesByConcept(exercises: ExerciseCard[]): Map<number, ExerciseCard[]> {
  const byConcept = new Map<number, ExerciseCard[]>()
  let nextPositional = 0
  for (const exercise of exercises) {
    const index = exercise.conceptIndex ?? nextPositional++
    byConcept.set(index, [...(byConcept.get(index) ?? []), exercise])
  }
  return byConcept
}
