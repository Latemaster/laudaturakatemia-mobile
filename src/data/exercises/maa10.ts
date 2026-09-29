import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa10.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
const maa10Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Avaruusvektori ja kantavektorit
    kind: 'numeric',
    visual: 'space-vector-axes',
    question: 'Kuvan vektori on v = (3, 2, 2). Mikä on sen pituus |v| (pyöristä kahteen desimaaliin)?',
    answer: 4.12,
    tolerance: 0.05,
    explanation: '|v| = √(3²+2²+2²) = √17 ≈ 4,12.',
  },
  {
    // Topic: Avaruusvektori ja kantavektorit (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Mikä on vektorin (1, −2, 2) pituus?',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '3', correct: true },
      { id: 'c', text: '5', correct: false },
      { id: 'd', text: '9', correct: false },
    ],
    explanation: '|v| = √(1² + (−2)² + 2²) = √(1 + 4 + 4) = √9 = 3.',
  },
  {
    // Topic: Suoran parametrimuotoinen esitys ja leikkauspiste
    kind: 'numeric',
    visual: 'parametric-line-3d',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä t. Suora on r(t) = a + t·v, missä a=(0,0,0) ja v=(2,1,1.3). Millä t:n arvolla pisteen x-koordinaatti on tasan 4?',
    answer: 2,
    tolerance: 0.1,
    min: -2,
    max: 2,
    step: 0.1,
    sliderStart: -1,
    explanation: 'x(t) = 2t = 4 ⇒ t = 2.',
  },
  {
    // Topic: Suoran parametrimuotoinen esitys ja leikkauspiste (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Suora on r(t) = (1, 0, 2) + t·(3, 1, −1). Mikä seuraavista pisteistä on suoralla?',
    options: [
      { id: 'a', text: '(3, 1, −1)', correct: false },
      { id: 'b', text: '(1, 1, 2)', correct: false },
      { id: 'c', text: '(4, 1, 1)', correct: true },
      { id: 'd', text: '(4, 1, 3)', correct: false },
    ],
    explanation: 'Arvolla t = 1 saadaan (1 + 3, 0 + 1, 2 − 1) = (4, 1, 1). Suuntavektori (3, 1, −1) itse ei ole suoran piste.',
  },
  {
    // Topic: Taso ja sen normaalimuoto
    kind: 'numeric',
    visual: 'plane-normal-3d',
    question: 'Kuvan taso on jännitetty vektoreilla u = (2.5, 0, 0) ja v = (0, 2, 1). Mikä on normaalivektorin n = u×v z-komponentti?',
    answer: 5,
    tolerance: 0.2,
    explanation: 'u×v = (0·1−0·2, 0·0−2,5·1, 2,5·2−0·0) = (0, −2,5, 5), joten z-komponentti on 5.',
  },
  {
    // Topic: Taso ja sen normaalimuoto (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Tason yhtälö on 2x − y + 3z = 6. Mikä on tason normaalivektori?',
    options: [
      { id: 'a', text: '(2, −1, 3)', correct: true },
      { id: 'b', text: '(2, 1, 3)', correct: false },
      { id: 'c', text: '(1, 2, 3)', correct: false },
      { id: 'd', text: '(2, −1, 6)', correct: false },
    ],
    explanation: 'Muodossa ax + by + cz = d normaalivektori on kertoimista koottu (a, b, c) = (2, −1, 3).',
  },
  {
    // Topic: Pistetulo ja vektorien välinen kulma
    kind: 'numeric',
    visual: 'dot-product-angle',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä θ (|u|=3, |v|=2.5). Millä θ:n arvolla pistetulo u·v on tasan 3,75?',
    answer: 60,
    tolerance: 2,
    unit: '°',
    min: 0,
    max: 180,
    step: 5,
    sliderStart: 120,
    explanation: 'u·v = |u||v|cos θ = 7,5·cos θ = 3,75 ⇒ cos θ = 0,5 ⇒ θ = 60°.',
  },
  {
    // Topic: Pistetulo ja vektorien välinen kulma (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Mikä on vektorien (1, 2, 3) ja (2, −1, 0) pistetulo?',
    options: [
      { id: 'a', text: '4', correct: false },
      { id: 'b', text: '6', correct: false },
      { id: 'c', text: '−4', correct: false },
      { id: 'd', text: '0', correct: true },
    ],
    explanation: '1·2 + 2·(−1) + 3·0 = 2 − 2 + 0 = 0, joten vektorit ovat kohtisuorassa.',
  },
  {
    // Topic: Ristitulo ja normaalivektori
    kind: 'numeric',
    visual: 'cross-product-viz',
    question: 'Kuvan vektorit ovat u = (3, 0.5, 0) ja v = (0.5, 2.5, 0). Mikä on ristitulon u×v z-komponentti?',
    answer: 7.25,
    tolerance: 0.1,
    explanation: 'u×v z-komponentti = u₁v₂ − u₂v₁ = 3·2,5 − 0,5·0,5 = 7,5 − 0,25 = 7,25.',
  },
  {
    // Topic: Ristitulo ja normaalivektori (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Mikä on kantavektorien ristitulo i × j?',
    options: [
      { id: 'a', text: '(1, 1, 0)', correct: false },
      { id: 'b', text: '(0, 0, 1)', correct: true },
      { id: 'c', text: '0', correct: false },
      { id: 'd', text: '(0, 0, −1)', correct: false },
    ],
    explanation: '(1,0,0) × (0,1,0) = (0·0 − 0·1, 0·0 − 1·0, 1·1 − 0·0) = (0, 0, 1) = k, joka on kohtisuorassa sekä i:tä että j:tä vastaan.',
  },
  {
    // Topic: Skalaarikolmitulo
    kind: 'numeric',
    visual: 'parallelepiped-viz',
    question: 'Suuntaissärmiö on jännitetty vektoreilla a = (2.5,0,0), b = (0,2,0) ja c = (0.6,0.6,2). Mikä on sen tilavuus V = |a·(b×c)|?',
    answer: 10,
    tolerance: 0.3,
    explanation: 'b×c = (4, 0, −1,2), ja a·(b×c) = 2,5·4 + 0 + 0 = 10.',
  },
  {
    // Topic: Skalaarikolmitulo (quick)
    conceptIndex: 5,
    kind: 'choice',
    question: 'Vektorien a, b ja c skalaarikolmitulo a·(b×c) on 0. Mitä tästä seuraa?',
    options: [
      { id: 'a', text: 'Vektorit ovat kohtisuorassa toisiaan vastaan', correct: false },
      { id: 'b', text: 'Vektorit ovat yhdensuuntaiset', correct: false },
      { id: 'c', text: 'Vektorit ovat samassa tasossa', correct: true },
      { id: 'd', text: 'Jokin vektoreista on yksikkövektori', correct: false },
    ],
    explanation: 'Skalaarikolmitulo on vektorien virittämän suuntaissärmiön tilavuus; tilavuus 0 tarkoittaa, että vektorit ovat samassa tasossa.',
  },
  {
    // Topic: Etäisyys pisteestä suoralle tai tasolle
    kind: 'numeric',
    visual: 'point-line-distance',
    question: 'Kuvan piste P = (4, 4) ja suora y = 0,5x + 1. Mikä on pisteen etäisyys suorasta (pyöristä kahteen desimaaliin)?',
    answer: 0.89,
    tolerance: 0.05,
    explanation: 'Suora on 0,5x − y + 1 = 0, joten d = |0,5·4 − 4 + 1|/√(0,5²+1²) = 1/√1,25 ≈ 0,89.',
  },
  {
    // Topic: Etäisyys pisteestä suoralle tai tasolle (quick)
    conceptIndex: 6,
    kind: 'choice',
    question: 'Mikä on pisteen (3, −4, 5) etäisyys xy-tasosta z = 0?',
    options: [
      { id: 'a', text: '0', correct: false },
      { id: 'b', text: '25', correct: false },
      { id: 'c', text: '√50', correct: false },
      { id: 'd', text: '5', correct: true },
    ],
    explanation: 'xy-tason normaalivektori on (0, 0, 1), joten etäisyys on |n·(p − a)| / |n| = |5| / 1 = 5: pelkkä z-koordinaatin itseisarvo.',
  },
  {
    // Topic: Kahden muuttujan funktio, nollakohdat ja tasa-arvokäyrä
    kind: 'numeric',
    visual: 'level-curves',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä c. Funktio on f(x,y) = x²+y². Millä c:n arvolla tasa-arvokäyrän säde on tasan 4?',
    answer: 16,
    tolerance: 0.5,
    min: 1,
    max: 24,
    step: 1,
    sliderStart: 9,
    explanation: 'r = √c = 4 ⇒ c = 16.',
  },
  {
    // Topic: Kahden muuttujan funktio, nollakohdat ja tasa-arvokäyrä (quick)
    conceptIndex: 7,
    kind: 'choice',
    question: 'Minkä kuvion funktion f(x, y) = x² + y² − 4 nollakohdat muodostavat xy-tasossa?',
    options: [
      { id: 'a', text: 'Suoran', correct: false },
      { id: 'b', text: 'Ympyrän, jonka säde on 4', correct: false },
      { id: 'c', text: 'Ympyrän, jonka säde on 2', correct: true },
      { id: 'd', text: 'Paraabelin', correct: false },
    ],
    explanation: 'f(x, y) = 0 ⇔ x² + y² = 4, joka on origokeskinen ympyrä säteellä √4 = 2.',
  },
  {
    // Topic: Osittaisderivaatta, kriittiset pisteet ja gradientti
    kind: 'choice',
    visual: 'gradient-field',
    question: 'Funktiolle f(x,y) = x²+y², mihin suuntaan gradientti ∇f osoittaa mistä tahansa origon ulkopuolisesta pisteestä?',
    options: [
      { id: 'a', text: 'Aina origosta poispäin (radiaalisesti ulos)', correct: true },
      { id: 'b', text: 'Aina origoon päin', correct: false },
      { id: 'c', text: 'Aina samaan kiinteään suuntaan', correct: false },
      { id: 'd', text: 'Suunta ei riipu pisteestä lainkaan', correct: false },
    ],
    explanation: '∇f = (2x, 2y) osoittaa aina samaan suuntaan kuin paikkavektori itse, eli suoraan poispäin origosta.',
  },
  {
    // Topic: Osittaisderivaatta, kriittiset pisteet ja gradientti (quick)
    conceptIndex: 8,
    kind: 'choice',
    question: 'Mikä on funktion f(x, y) = x²y + 3y osittaisderivaatta ∂f/∂x?',
    options: [
      { id: 'a', text: '2xy', correct: true },
      { id: 'b', text: 'x² + 3', correct: false },
      { id: 'c', text: '2xy + 3', correct: false },
      { id: 'd', text: '2x', correct: false },
    ],
    explanation: 'x:n suhteen derivoitaessa y on vakio: (x²y)\' = 2xy ja (3y)\' = 0. (∂f/∂y olisi x² + 3.)',
  },
]

export default maa10Exercises
