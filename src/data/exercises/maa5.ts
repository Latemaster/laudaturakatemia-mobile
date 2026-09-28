import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa5.ts, in the same order.
const maa5Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Radiaanit ja yksikköympyrä
    kind: 'numeric',
    visual: 'unit-circle',
    question: 'Aseta yllä olevan kuvan liukusäädin θ:lle arvoon 90°. Mikä on cos θ tällöin?',
    answer: 0,
    tolerance: 0.05,
    min: 0,
    max: 360,
    step: 5,
    explanation: 'cos 90° = 0, koska yksikköympyrän piste on tällöin (0, 1).',
  },
  {
    // Topic: Vastakulmat, suplementtikulmat ja jaksollisuus
    kind: 'numeric',
    visual: 'angle-symmetry',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon 30°. Mikä on sin(150°) tällöin (pyöristä kahteen desimaaliin)?',
    answer: 0.5,
    tolerance: 0.05,
    min: 5,
    max: 175,
    step: 5,
    explanation: 'sin(180° − 30°) = sin(30°) = 0,5, koska vastakulmilla on sama sini.',
  },
  {
    // Topic: Tangentti
    kind: 'numeric',
    visual: 'tangent-graph',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon 45°. Mikä on tan(45°)?',
    answer: 1,
    tolerance: 0.05,
    min: -85,
    max: 85,
    step: 5,
    explanation: 'tan(45°) = sin(45°)/cos(45°) = 1, koska sin ja cos ovat yhtä suuret.',
  },
  {
    // Topic: Trigonometriset yhtälöt
    kind: 'numeric',
    visual: 'sine-equation-graph',
    question: 'Aseta yllä olevan kuvan liukusäädin c:lle arvoon 0.5. Montako ratkaisua yhtälöllä sin x = c on kuvan välillä [0, 4π]?',
    answer: 4,
    tolerance: 0,
    min: -1,
    max: 1,
    step: 0.1,
    explanation: 'Jaksolla [0,4π] (kaksi täyttä jaksoa) yhtälöllä sin x = 0,5 on 2 ratkaisua per jakso eli 4 yhteensä.',
  },
  {
    // Topic: Trigonometristen funktioiden kuvaajat
    kind: 'numeric',
    visual: 'sine-wave-params',
    question:
      'Aseta yllä olevan kuvan liukusäätimet A:lle arvoon 2 ja B:lle arvoon 1. Kuvaaja on muotoa y = A·sin(Bx). Mikä on y, kun x = π/2 ≈ 1,571?',
    answer: 2,
    tolerance: 0.1,
    min: 0.5,
    max: 3,
    step: 0.25,
    explanation: 'y = 2·sin(1·π/2) = 2·sin(90°) = 2·1 = 2.',
  },
  {
    // Topic: Logaritmin määritelmä ja merkinnät
    kind: 'numeric',
    visual: 'log-point-graph',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon 8. Mikä on log₂(8)?',
    answer: 3,
    tolerance: 0.05,
    min: 0.5,
    max: 16,
    step: 0.5,
    explanation: 'log₂(8) = 3, koska 2³ = 8.',
  },
  {
    // Topic: Logaritmin ja murtopotenssien laskusäännöt
    kind: 'numeric',
    visual: 'log-rule-check',
    question: 'Aseta yllä olevan kuvan liukusäätimet x:lle arvoon 4 ja y:lle arvoon 5. Mikä on log(x·y) (kymmenkantainen logaritmi, pyöristä kolmeen desimaaliin)?',
    answer: 1.301,
    tolerance: 0.01,
    min: 1,
    max: 20,
    step: 1,
    explanation: 'log(4·5) = log(20) ≈ 1,301, ja tämä täsmää summan log(4)+log(5) kanssa.',
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
    // Topic: Eksponentti- ja logaritmiyhtälöt
    kind: 'numeric',
    visual: 'exp-equation-graph',
    question: 'Aseta yllä olevan kuvan liukusäädin b:lle arvoon 8. Ratkaise yhtälö 2ˣ = b. Mikä on x (pyöristä kahteen desimaaliin)?',
    answer: 3,
    tolerance: 0.05,
    min: 0.5,
    max: 16,
    step: 0.5,
    explanation: 'x = log₂(8) = 3, koska 2³ = 8.',
  },
]

export default maa5Exercises
