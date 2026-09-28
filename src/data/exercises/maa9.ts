import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa9.ts, in the same order.
const maa9Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Rekursiivinen, aritmeettinen ja geometrinen lukujono
    kind: 'numeric',
    visual: 'sequence-bars',
    question: 'Aseta yllä olevan kuvan liukusäädin d:lle arvoon 4 (aritmeettinen jono, a₁ = 2). Mikä on a₅?',
    answer: 18,
    tolerance: 0.5,
    min: 0.5,
    max: 5,
    step: 0.5,
    explanation: 'a₅ = a₁ + 4d = 2 + 4·4 = 18.',
  },
  {
    // Topic: Aritmeettinen ja geometrinen summa
    kind: 'numeric',
    visual: 'series-sum',
    question: 'Aseta yllä olevan kuvan liukusäädin n:lle arvoon 10 (jono a₁ = 1, d = 1). Mikä on S₁₀?',
    answer: 55,
    tolerance: 1,
    min: 1,
    max: 10,
    step: 1,
    explanation: 'S₁₀ = (10/2)·(1+10) = 5·11 = 55.',
  },
  {
    // Topic: Korkoa korolle
    kind: 'numeric',
    visual: 'compound-interest',
    question: 'Aseta yllä olevan kuvan liukusäädin korolle r %:lle arvoon 5. Mikä on 1000 € pääoman arvo 20 vuoden kuluttua (pyöristä lähimpään euroon)?',
    answer: 2653,
    tolerance: 5,
    unit: '€',
    min: 1,
    max: 12,
    step: 0.5,
    explanation: 'A = 1000·(1,05)²⁰ ≈ 2653 €.',
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
