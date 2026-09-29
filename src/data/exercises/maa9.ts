import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa9.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
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
    // Topic: Rekursiivinen, aritmeettinen ja geometrinen lukujono (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Millainen on lukujono 3, 6, 12, 24, …?',
    options: [
      { id: 'a', text: 'Aritmeettinen, erotus d = 3', correct: false },
      { id: 'b', text: 'Geometrinen, suhde r = 2', correct: true },
      { id: 'c', text: 'Geometrinen, suhde r = 3', correct: false },
      { id: 'd', text: 'Aritmeettinen, erotus d = 6', correct: false },
    ],
    explanation: 'Jokainen jäsen on edellinen kerrottuna kahdella (6/3 = 12/6 = 24/12 = 2), joten jono on geometrinen ja r = 2.',
  },
  {
    // Topic: Rekursiivinen, aritmeettinen ja geometrinen lukujono (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Aritmeettisessa jonossa a₁ = 5 ja d = −2. Mikä on a₄?',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '−3', correct: false },
      { id: 'c', text: '11', correct: false },
      { id: 'd', text: '−1', correct: true },
    ],
    explanation: 'a₄ = a₁ + 3d = 5 + 3·(−2) = 5 − 6 = −1.',
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
    // Topic: Aritmeettinen ja geometrinen summa (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Mikä on summa 1 + 2 + 3 + … + 100?',
    options: [
      { id: 'a', text: '5000', correct: false },
      { id: 'b', text: '10 100', correct: false },
      { id: 'c', text: '5050', correct: true },
      { id: 'd', text: '100', correct: false },
    ],
    explanation: 'Aritmeettinen summa: S₁₀₀ = 100/2 · (1 + 100) = 50 · 101 = 5050.',
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
    // Topic: Korkoa korolle (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Pääoma 2000 € kasvaa 4 %:n vuosikorolla korkoa korolle. Mikä lauseke antaa pääoman 3 vuoden kuluttua?',
    options: [
      { id: 'a', text: '2000 · 1,04³', correct: true },
      { id: 'b', text: '2000 · 1,04 · 3', correct: false },
      { id: 'c', text: '2000 · 0,04³', correct: false },
      { id: 'd', text: '2000 + 3 · 0,04', correct: false },
    ],
    explanation: 'A = A₀(1 + r)ᵗ, missä r = 0,04 ja t = 3, joten A = 2000 · 1,04³ ≈ 2249,73 €.',
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
  {
    // Topic: Tasaerälaina ja tasalyhennyslaina (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Missä lainatyypissä maksuerä pysyy samana koko laina-ajan?',
    options: [
      { id: 'a', text: 'Tasalyhennyslainassa', correct: false },
      { id: 'b', text: 'Kummassakin', correct: false },
      { id: 'c', text: 'Tasaerälainassa', correct: true },
      { id: 'd', text: 'Ei kummassakaan', correct: false },
    ],
    explanation: 'Tasaerälainassa lyhennyksen ja koron summa on vakio; tasalyhennyslainassa lyhennys on vakio ja maksuerä pienenee.',
  },
]

export default maa9Exercises
