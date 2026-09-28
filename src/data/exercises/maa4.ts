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
    answerVia: 'slider',
    question: 'By-liukusäädin on kiinnitetty arvoon 3. Säädä Bx-liukusäädintä. Millä Bx:n arvolla pisteiden A ja B välinen etäisyys on tasan 5?',
    answer: 4,
    tolerance: 0.1,
    min: 0,
    max: 5,
    step: 0.5,
    sliderStart: 1,
    explanation: 'd = √(Bx² + 3²) = 5 ⇒ Bx² = 16 ⇒ Bx = 4.',
  },
  {
    // Topic: Suoran yhtälö ja kulmakerroin
    kind: 'numeric',
    visual: 'line-slope',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä k. Suora on muotoa y = kx + 1. Millä k:n arvolla suora kulkee pisteen (3, 7) kautta?',
    answer: 2,
    tolerance: 0.05,
    min: -3,
    max: 3,
    step: 0.25,
    sliderStart: -1,
    explanation: '7 = 3k + 1 ⇒ k = 2.',
  },
  {
    // Topic: Suorien keskinäinen asema
    kind: 'numeric',
    visual: 'perpendicular-lines',
    answerVia: 'slider',
    question: 'Ensimmäisen suoran kulmakerroin on k₁ = 1. Säädä liukusäädintä k₂. Millä k₂:n arvolla suorat ovat kohtisuorassa?',
    answer: -1,
    tolerance: 0.05,
    min: -3,
    max: 3,
    step: 0.1,
    sliderStart: 1,
    explanation: 'Suorat ovat kohtisuorassa, kun k₁·k₂ = −1, joten k₂ = −1/k₁ = −1.',
  },
  {
    // Topic: Ympyrän yhtälö
    kind: 'numeric',
    visual: 'circle-equation',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä r. Millä r:n arvolla ympyrän yhtälö x² + y² = r² on tasan x² + y² = 16?',
    answer: 4,
    tolerance: 0.1,
    min: 1,
    max: 5,
    step: 0.5,
    sliderStart: 2,
    explanation: 'r² = 16 ⇒ r = 4.',
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
    answerVia: 'slider',
    question: 'Säädä liukusäädintä a. Paraabeli on muotoa y = ax². Millä a:n arvolla paraabeli kulkee pisteen (3, 18) kautta?',
    answer: 2,
    tolerance: 0.1,
    min: -2,
    max: 2,
    step: 0.25,
    sliderStart: -1,
    explanation: '18 = a·3² = 9a ⇒ a = 2.',
  },
  {
    // Topic: Vektorin perusominaisuudet ja laskutoimitukset
    kind: 'numeric',
    visual: 'vector-addition',
    answerVia: 'slider',
    question: 'Kuvassa u = (3, 1) on kiinteä. Säädä liukusäädintä θ. Millä θ:n arvolla summavektorin u+v y-komponentti on suurimmillaan?',
    answer: 90,
    tolerance: 5,
    unit: '°',
    min: 0,
    max: 360,
    step: 10,
    sliderStart: 200,
    explanation: 'y-komponentti 1 + 2,5·sin θ on suurimmillaan, kun sin θ = 1 eli θ = 90°.',
  },
  {
    // Topic: Pistetulo ja vektorien välinen kulma
    kind: 'numeric',
    visual: 'dot-product-angle',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä θ. Millä θ:n arvolla vektorit u ja v ovat kohtisuorassa?',
    answer: 90,
    tolerance: 0,
    unit: '°',
    min: 0,
    max: 180,
    step: 5,
    sliderStart: 60,
    explanation: 'Pistetulo on 0, kun θ = 90°, koska cos 90° = 0.',
  },
  {
    // Topic: Yksikkövektori
    kind: 'numeric',
    visual: 'unit-vector',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä θ. Millä θ:n arvolla yksikkövektorin x-komponentti on pienimmillään (eli tasan −1)?',
    answer: 180,
    tolerance: 0,
    unit: '°',
    min: 0,
    max: 360,
    step: 10,
    sliderStart: 30,
    explanation: 'x-komponentti cos θ on pienimmillään (=−1), kun θ = 180°.',
  },
]

export default maa4Exercises
