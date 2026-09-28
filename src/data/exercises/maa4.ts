import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa4.ts, in the same order.
const maa4Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Itseisarvoyhtälöt ja -epäyhtälöt
    kind: 'choice',
    visual: 'absolute-value-line',
    question: 'Aseta yllä olevan kuvan liukusäädin a:lle arvoon 5. Mikä epäyhtälö vastaa muotoa |x| < a?',
    options: [
      { id: 'a', text: '−5 < x < 5', correct: true },
      { id: 'b', text: 'x < −5 tai x > 5', correct: false },
      { id: 'c', text: 'x = 5 tai x = −5', correct: false },
      { id: 'd', text: '0 < x < 5', correct: false },
    ],
    explanation: '|x| < a tarkoittaa, että x:n etäisyys nollasta on pienempi kuin a, eli −a < x < a.',
  },
  {
    // Topic: Pisteiden välinen etäisyys ja janan keskipiste
    kind: 'numeric',
    visual: 'distance-midpoint',
    question: 'Aseta yllä olevan kuvan liukusäätimet arvoihin Bx = 4 ja By = 3. Mikä on pisteiden A ja B välinen etäisyys?',
    answer: 5,
    tolerance: 0.1,
    min: 0,
    max: 5,
    step: 0.5,
    explanation: 'd = √(4² + 3²) = √25 = 5.',
  },
  {
    // Topic: Suoran yhtälö ja kulmakerroin
    kind: 'numeric',
    visual: 'line-slope',
    question: 'Aseta yllä olevan kuvan liukusäädin k:lle arvoon 2. Suora on muotoa y = kx + 1. Mikä on y, kun x = 3?',
    answer: 7,
    tolerance: 0.1,
    min: -3,
    max: 3,
    step: 0.25,
    explanation: 'y = 2·3 + 1 = 7.',
  },
  {
    // Topic: Suorien keskinäinen asema
    kind: 'numeric',
    visual: 'perpendicular-lines',
    question: 'Ensimmäisen suoran kulmakerroin on k₁ = 1. Aseta liukusäädin k₂:lle arvoon, jolla suorat ovat kohtisuorassa. Mikä on k₂?',
    answer: -1,
    tolerance: 0.05,
    min: -3,
    max: 3,
    step: 0.1,
    explanation: 'Suorat ovat kohtisuorassa, kun k₁·k₂ = −1, joten k₂ = −1/k₁ = −1.',
  },
  {
    // Topic: Ympyrän yhtälö
    kind: 'numeric',
    visual: 'circle-equation',
    question: 'Aseta yllä olevan kuvan liukusäädin r:lle arvoon 4. Mikä on tällöin ympyrän yhtälön x² + y² oikea puoli?',
    answer: 16,
    tolerance: 0.5,
    min: 1,
    max: 5,
    step: 0.5,
    explanation: 'x² + y² = r² = 4² = 16.',
  },
  {
    // Topic: Pisteen ja suoran sekä ympyröiden etäisyydet
    kind: 'numeric',
    visual: 'point-line-distance',
    question: 'Mikä on pisteen (0, 0) etäisyys suorasta 3x + 4y − 10 = 0?',
    answer: 2,
    tolerance: 0.05,
    explanation: 'd = |3·0 + 4·0 − 10| / √(3² + 4²) = 10/5 = 2.',
  },
  {
    // Topic: Paraabelin yhtälö
    kind: 'numeric',
    visual: 'parabola-shape',
    question: 'Aseta yllä olevan kuvan liukusäädin a:lle arvoon 2. Paraabeli on muotoa y = ax². Mikä on y, kun x = 3?',
    answer: 18,
    tolerance: 0.5,
    min: -2,
    max: 2,
    step: 0.25,
    explanation: 'y = 2·3² = 2·9 = 18.',
  },
  {
    // Topic: Vektorin perusominaisuudet ja laskutoimitukset
    kind: 'numeric',
    visual: 'vector-addition',
    question:
      'Aseta yllä olevan kuvan liukusäädin θ:lle arvoon 90°. Kuvassa u = (3, 1) on kiinteä. Mikä on tällöin summavektorin u+v x-komponentti (pyöristä yhteen desimaaliin)?',
    answer: 3.0,
    tolerance: 0.15,
    min: 0,
    max: 360,
    step: 10,
    explanation: 'θ=90°: v = (2,5·cos90°, 2,5·sin90°) = (0, 2,5), joten u+v = (3+0, 1+2,5) = (3,0, 3,5).',
  },
  {
    // Topic: Pistetulo ja vektorien välinen kulma
    kind: 'numeric',
    visual: 'dot-product-angle',
    question: 'Aseta yllä olevan kuvan liukusäädin θ:lle arvoon, jolla vektorit u ja v ovat kohtisuorassa. Mikä on θ (astetta)?',
    answer: 90,
    tolerance: 0,
    unit: '°',
    min: 0,
    max: 180,
    step: 5,
    explanation: 'Pistetulo on 0, kun θ = 90°, koska cos 90° = 0.',
  },
  {
    // Topic: Yksikkövektori
    kind: 'numeric',
    visual: 'unit-vector',
    question: 'Aseta yllä olevan kuvan liukusäädin θ:lle arvoon 0°. Mikä on tällöin yksikkövektorin x-komponentti?',
    answer: 1,
    tolerance: 0.05,
    min: 0,
    max: 360,
    step: 10,
    explanation: 'θ=0°: v̂ = (cos 0°, sin 0°) = (1, 0).',
  },
]

export default maa4Exercises
