import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa10.ts, in the same order.
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
    // Topic: Taso ja sen normaalimuoto
    kind: 'numeric',
    visual: 'plane-normal-3d',
    question: 'Kuvan taso on jännitetty vektoreilla u = (2.5, 0, 0) ja v = (0, 2, 1). Mikä on normaalivektorin n = u×v z-komponentti?',
    answer: 5,
    tolerance: 0.2,
    explanation: 'u×v = (0·1−0·2, 0·0−2,5·1, 2,5·2−0·0) = (0, −2,5, 5), joten z-komponentti on 5.',
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
    // Topic: Ristitulo ja normaalivektori
    kind: 'numeric',
    visual: 'cross-product-viz',
    question: 'Kuvan vektorit ovat u = (3, 0.5, 0) ja v = (0.5, 2.5, 0). Mikä on ristitulon u×v z-komponentti?',
    answer: 7.25,
    tolerance: 0.1,
    explanation: 'u×v z-komponentti = u₁v₂ − u₂v₁ = 3·2,5 − 0,5·0,5 = 7,5 − 0,25 = 7,25.',
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
    // Topic: Etäisyys pisteestä suoralle tai tasolle
    kind: 'numeric',
    visual: 'point-line-distance',
    question: 'Kuvan piste P = (4, 4) ja suora y = 0,5x + 1. Mikä on pisteen etäisyys suorasta (pyöristä kahteen desimaaliin)?',
    answer: 0.89,
    tolerance: 0.05,
    explanation: 'Suora on 0,5x − y + 1 = 0, joten d = |0,5·4 − 4 + 1|/√(0,5²+1²) = 1/√1,25 ≈ 0,89.',
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
]

export default maa10Exercises
