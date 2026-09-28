import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa6.ts, in the same order.
const maa6Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Derivaatan määritelmä
    kind: 'numeric',
    visual: 'secant-to-tangent',
    question: 'Aseta yllä olevan kuvan liukusäädin h:lle arvoon 0.1 (lähelle nollaa). Mikä on sekantin kulmakerroin Δy/Δx tällöin (pyöristä kahteen desimaaliin)?',
    answer: -0.76,
    tolerance: 0.05,
    min: 0.1,
    max: 3,
    step: 0.1,
    explanation: 'Kun h on pieni, sekantin kulmakerroin lähestyy tangentin kulmakerrointa f\'(−1) = 0,8·(−1) = −0,8.',
  },
  {
    // Topic: Derivointisäännöt
    kind: 'numeric',
    visual: 'power-rule-graph',
    question: 'Aseta yllä olevan kuvan liukusäädin n:lle arvoon 3, jolloin f(x) = x³. Mikä on f\'(2)?',
    answer: 12,
    tolerance: 0.5,
    min: 1,
    max: 4,
    step: 1,
    explanation: 'f\'(x) = 3x², joten f\'(2) = 3·2² = 12.',
  },
  {
    // Topic: Käyrän tangentti
    kind: 'numeric',
    visual: 'tangent-line',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon 2. Mikä on tangentin kulmakerroin f\'(2) tällöin?',
    answer: 1.6,
    tolerance: 0.05,
    min: -5,
    max: 5,
    step: 0.25,
    explanation: 'f\'(x) = 0,8x, joten f\'(2) = 0,8·2 = 1,6.',
  },
  {
    // Topic: Ääriarvot
    kind: 'numeric',
    visual: 'extrema-graph',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle sellaiseen positiiviseen arvoon, jolla derivaatta f\'(x) = 0. Mikä on x?',
    answer: 1,
    tolerance: 0.05,
    min: -2.5,
    max: 2.5,
    step: 0.1,
    explanation: 'f\'(x) = 3x² − 3 = 0 ⇒ x² = 1 ⇒ x = 1 tai x = −1; positiivinen ratkaisu on x = 1.',
  },
]

export default maa6Exercises
