import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa5.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
const maa5Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Radiaanit ja yksikköympyrä
    kind: 'numeric',
    visual: 'unit-circle',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä θ. Millä θ:n arvolla piste on yksikköympyrän huipulla (sin θ = 1)?',
    answer: 90,
    tolerance: 0,
    unit: '°',
    min: 0,
    max: 360,
    step: 5,
    sliderStart: 200,
    explanation: 'sin θ = 1 vain, kun θ = 90°.',
  },
  {
    // Topic: Radiaanit ja yksikköympyrä (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Kuinka monta radiaania on 60°?',
    options: [
      { id: 'a', text: 'π/6', correct: false },
      { id: 'b', text: 'π/3', correct: true },
      { id: 'c', text: 'π/2', correct: false },
      { id: 'd', text: '2π/3', correct: false },
    ],
    explanation: '180° = π rad, joten 60° = 60·π/180 = π/3.',
  },
  {
    // Topic: Vastakulmat, suplementtikulmat ja jaksollisuus
    kind: 'numeric',
    visual: 'angle-symmetry',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Millä x:n arvolla kulma x ja sen suplementtikulma 180°−x ovat yhtä suuret?',
    answer: 90,
    tolerance: 0,
    unit: '°',
    min: 5,
    max: 175,
    step: 5,
    sliderStart: 30,
    explanation: 'x = 180° − x ⇒ 2x = 180° ⇒ x = 90° (ainoa symmetriapiste).',
  },
  {
    // Topic: Vastakulmat, suplementtikulmat ja jaksollisuus (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Mikä on cos 120°?',
    options: [
      { id: 'a', text: '1/2', correct: false },
      { id: 'b', text: '√3/2', correct: false },
      { id: 'c', text: '−√3/2', correct: false },
      { id: 'd', text: '−1/2', correct: true },
    ],
    explanation: 'cos(180° − x) = −cos x, joten cos 120° = −cos 60° = −1/2.',
  },
  {
    // Topic: Tangentti
    kind: 'numeric',
    visual: 'tangent-graph',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Millä x:n arvolla tan x on tasan 1?',
    answer: 45,
    tolerance: 2,
    unit: '°',
    min: -85,
    max: 85,
    step: 5,
    sliderStart: -20,
    explanation: 'tan(45°) = sin(45°)/cos(45°) = 1, koska sin ja cos ovat yhtä suuret.',
  },
  {
    // Topic: Tangentti (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Missä seuraavista kulmista tan x ei ole määritelty?',
    options: [
      { id: 'a', text: '0°', correct: false },
      { id: 'b', text: '45°', correct: false },
      { id: 'c', text: '90°', correct: true },
      { id: 'd', text: '180°', correct: false },
    ],
    explanation: 'tan x = sin x / cos x, ja cos 90° = 0, joten tangenttia ei voi laskea kulmassa 90°.',
  },
  {
    // Topic: Trigonometriset yhtälöt
    kind: 'numeric',
    visual: 'sine-equation-graph',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä c. Millä c:n arvolla yhtälöllä sin x = c on viisi ratkaisua kuvan välillä [0, 4π]?',
    answer: 0,
    tolerance: 0.05,
    min: -1,
    max: 1,
    step: 0.1,
    sliderStart: 0.6,
    explanation: 'Vain c = 0 antaa viisi ratkaisua (0, π, 2π, 3π, 4π); muut c-arvot antavat neljä.',
  },
  {
    // Topic: Trigonometriset yhtälöt (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Mitkä ovat yhtälön sin x = 1 kaikki ratkaisut (k ∈ ℤ)?',
    options: [
      { id: 'a', text: 'x = π/2 + 2kπ', correct: true },
      { id: 'b', text: 'x = π/2 + kπ', correct: false },
      { id: 'c', text: 'x = kπ', correct: false },
      { id: 'd', text: 'x = π + 2kπ', correct: false },
    ],
    explanation: 'Sini on 1 vain yksikköympyrän huipulla x = π/2, ja se toistuu jakson 2π välein.',
  },
  {
    // Topic: Trigonometristen funktioiden kuvaajat
    kind: 'numeric',
    visual: 'sine-wave-params',
    answerVia: 'slider',
    question: 'B-liukusäädin on kiinnitetty arvoon 1. Säädä A-liukusäädintä. Kuvaaja on y = A·sin(Bx). Millä A:n arvolla y on tasan 1, kun x = π/6 ≈ 0,524?',
    answer: 2,
    tolerance: 0.15,
    min: 0.5,
    max: 3,
    step: 0.25,
    sliderStart: 1,
    explanation: 'y = A·sin(π/6) = A·0,5 = 1 ⇒ A = 2.',
  },
  {
    // Topic: Trigonometristen funktioiden kuvaajat (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Mikä on funktion y = 3·sin(2x) amplitudi?',
    options: [
      { id: 'a', text: '2', correct: false },
      { id: 'b', text: '6', correct: false },
      { id: 'c', text: '3', correct: true },
      { id: 'd', text: '1', correct: false },
    ],
    explanation: 'Muodossa A·sin(Bx) amplitudi on A = 3; kerroin B = 2 vaikuttaa vain jakson pituuteen.',
  },
  {
    // Topic: Logaritmin määritelmä ja merkinnät
    kind: 'numeric',
    visual: 'log-point-graph',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Millä x:n arvolla log₂(x) on tasan 3?',
    answer: 8,
    tolerance: 0.1,
    min: 0.5,
    max: 16,
    step: 0.5,
    sliderStart: 2,
    explanation: 'log₂(x) = 3 ⇒ x = 2³ = 8.',
  },
  {
    // Topic: Logaritmin määritelmä ja merkinnät (quick)
    conceptIndex: 5,
    kind: 'choice',
    question: 'Mikä on log₃(81)?',
    options: [
      { id: 'a', text: '3', correct: false },
      { id: 'b', text: '27', correct: false },
      { id: 'c', text: '9', correct: false },
      { id: 'd', text: '4', correct: true },
    ],
    explanation: 'log₃(81) = 4, koska 3⁴ = 81.',
  },
  {
    // Topic: Logaritmin ja murtopotenssien laskusäännöt
    kind: 'numeric',
    visual: 'log-rule-check',
    answerVia: 'slider',
    question: 'y-liukusäädin on kiinnitetty arvoon 5. Säädä x-liukusäädintä. Millä x:n arvolla log(x·y) on tasan 1,000 (kymmenkantainen logaritmi)?',
    answer: 2,
    tolerance: 0.1,
    min: 1,
    max: 20,
    step: 1,
    sliderStart: 10,
    explanation: 'log(5x) = 1 ⇒ 5x = 10 ⇒ x = 2.',
  },
  {
    // Topic: Logaritmin ja murtopotenssien laskusäännöt (quick)
    conceptIndex: 6,
    kind: 'choice',
    question: 'Sievennä lg 8 + lg 125.',
    options: [
      { id: 'a', text: 'lg 133', correct: false },
      { id: 'b', text: '3', correct: true },
      { id: 'c', text: '1000', correct: false },
      { id: 'd', text: '5', correct: false },
    ],
    explanation: 'lg 8 + lg 125 = lg(8·125) = lg 1000 = 3.',
  },
  {
    // Topic: Eksponentti- ja logaritmifunktio
    kind: 'choice',
    visual: 'exp-log-mirror',
    question: 'Aseta yllä olevan kuvan liukusäädin a:lle arvoon 2. Mikä väittämä pätee funktioille f(x)=aˣ ja g(x)=log_a x?',
    options: [
      { id: 'a', text: 'f ja g ovat toistensa käänteisfunktioita', correct: true },
      { id: 'b', text: 'f ja g ovat sama funktio', correct: false },
      { id: 'c', text: 'f on vähenevä, kun a = 2', correct: false },
      { id: 'd', text: 'g ei ole määritelty millekään x:n arvolle', correct: false },
    ],
    explanation: 'Eksponenttifunktio ja logaritmifunktio (samalla kannalla) ovat aina toistensa käänteisfunktioita; niiden kuvaajat peilautuvat suoran y=x suhteen.',
  },
  {
    // Topic: Eksponentti- ja logaritmifunktio (quick)
    conceptIndex: 7,
    kind: 'choice',
    question: 'Mikä seuraavista eksponenttifunktioista on vähenevä?',
    options: [
      { id: 'a', text: 'f(x) = 2ˣ', correct: false },
      { id: 'b', text: 'f(x) = 3ˣ', correct: false },
      { id: 'c', text: 'f(x) = (1/2)ˣ', correct: true },
      { id: 'd', text: 'f(x) = 1,5ˣ', correct: false },
    ],
    explanation: 'aˣ on vähenevä, kun 0 < a < 1; vain kanta 1/2 täyttää tämän.',
  },
  {
    // Topic: Eksponentti- ja logaritmiyhtälöt
    kind: 'numeric',
    visual: 'exp-equation-graph',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä b. Yhtälö on 2ˣ = b. Millä b:n arvolla ratkaisu on tasan x = 3?',
    answer: 8,
    tolerance: 0.5,
    min: 0.5,
    max: 16,
    step: 0.5,
    sliderStart: 3,
    explanation: 'x = log₂(b) = 3 ⇒ b = 2³ = 8.',
  },
  {
    // Topic: Eksponentti- ja logaritmiyhtälöt (quick)
    conceptIndex: 8,
    kind: 'choice',
    question: 'Ratkaise yhtälö log₂ x = 5.',
    options: [
      { id: 'a', text: 'x = 32', correct: true },
      { id: 'b', text: 'x = 10', correct: false },
      { id: 'c', text: 'x = 25', correct: false },
      { id: 'd', text: 'x = 2,5', correct: false },
    ],
    explanation: 'Logaritmiyhtälö puretaan eksponenttimuotoon: x = 2⁵ = 32.',
  },
]

export default maa5Exercises
