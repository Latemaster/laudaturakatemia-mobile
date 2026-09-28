import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa9.ts, in the same order.
const maa9Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Rekursiivinen, aritmeettinen ja geometrinen lukujono
    kind: 'numeric',
    visual: 'sequence-bars',
    answerVia: 'slider',
    question: 'r-liukusäädin ei vaikuta tähän. Säädä d-liukusäädintä (aritmeettinen jono, a₁ = 2). Millä d:n arvolla a₅ on tasan 18?',
    answer: 4,
    tolerance: 0.1,
    min: 0.5,
    max: 5,
    step: 0.5,
    sliderStart: 1,
    explanation: 'a₅ = a₁ + 4d = 2 + 4d = 18 ⇒ d = 4.',
  },
  {
    // Topic: Aritmeettinen ja geometrinen summa
    kind: 'numeric',
    visual: 'series-sum',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä n (jono a₁ = 1, d = 1). Millä n:n arvolla summa Sₙ on tasan 55?',
    answer: 10,
    tolerance: 0.5,
    min: 1,
    max: 10,
    step: 1,
    sliderStart: 3,
    explanation: 'Sₙ = n/2·(n+1) = 55 ⇒ n² + n − 110 = 0 ⇒ n = 10.',
  },
  {
    // Topic: Korkoa korolle
    kind: 'numeric',
    visual: 'compound-interest',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä r %. Millä korkoprosentilla 1000 € kasvaa noin 2653 euroon 20 vuodessa?',
    answer: 5,
    tolerance: 0.5,
    unit: '%',
    min: 1,
    max: 12,
    step: 0.5,
    sliderStart: 2,
    explanation: '1000·(1+r/100)²⁰ = 2653 ⇒ r ≈ 5.',
  },
  {
    // Topic: Tasaerälaina ja tasalyhennyslaina
    kind: 'choice',
    visual: 'loan-comparison',
    question: 'Aseta yllä olevan kuvan liukusäädin erien lukumäärälle n arvoon 8. Kumpi on suurempi: tasaerä vai tasalyhennyksen ensimmäinen maksuerä?',
    options: [
      { id: 'a', text: 'Tasalyhennyksen ensimmäinen erä on suurempi', correct: true },
      { id: 'b', text: 'Tasaerä on suurempi', correct: false },
      { id: 'c', text: 'Ne ovat yhtä suuret', correct: false },
      { id: 'd', text: 'Ei voida sanoa ilman lisätietoja', correct: false },
    ],
    explanation: 'Tasalyhennyslainassa alkupääoma on suurin, joten sen korko-osuus ja siten ensimmäinen maksuerä on suurempi kuin tasaerä.',
  },
]

export default maa9Exercises
