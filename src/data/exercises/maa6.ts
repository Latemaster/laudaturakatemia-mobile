import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa6.ts, in the same order. All
// four ask "find the x (or n, or h) where some derivative-related property
// holds" and are answered by dragging the visual's own slider to that value
// - not by typing a separately-read-off number into a text box.
const maa6Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Derivaatan määritelmä
    kind: 'numeric',
    visual: 'secant-to-tangent',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä h. Millä h:n arvolla sekantin kulmakerroin Δy/Δx on tasan 0?',
    answer: 2,
    tolerance: 0.05,
    min: 0.1,
    max: 3,
    step: 0.1,
    sliderStart: 1,
    explanation: 'Pisteet x=-1 ja x=1 (h=2) ovat yhtä kaukana paraabelin f(x)=0,4x²-1,5 huipusta, joten f(-1)=f(1) ja sekantin kulmakerroin on 0.',
  },
  {
    // Topic: Derivointisäännöt
    kind: 'numeric',
    visual: 'power-rule-graph',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä n. Millä n:n arvolla derivaattafunktio f\'(x) = n·xⁿ⁻¹ on vakiofunktio (ei riipu x:stä)?',
    answer: 1,
    tolerance: 0,
    min: 1,
    max: 4,
    step: 1,
    sliderStart: 3,
    explanation: 'Kun n=1, f(x)=x ja f\'(x)=1 - vakio kaikilla x:n arvoilla, koska eksponentti n-1=0.',
  },
  {
    // Topic: Käyrän tangentti
    kind: 'numeric',
    visual: 'tangent-line',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Millä x:n arvolla tangentin kulmakerroin f\'(x) on tasan 0?',
    answer: 0,
    tolerance: 0.05,
    min: -5,
    max: 5,
    step: 0.25,
    sliderStart: 2,
    explanation: 'f\'(x) = 0,8x = 0 ⇒ x = 0. Paraabelin huipussa tangentti on vaakasuora.',
  },
  {
    // Topic: Ääriarvot
    kind: 'numeric',
    visual: 'extrema-graph',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Millä positiivisella x:n arvolla derivaatta f\'(x) on tasan 0?',
    answer: 1,
    tolerance: 0.05,
    min: -2.5,
    max: 2.5,
    step: 0.1,
    sliderStart: -2,
    explanation: 'f\'(x) = 3x² − 3 = 0 ⇒ x² = 1 ⇒ x = 1 tai x = −1; positiivinen ratkaisu on x = 1.',
  },
]

export default maa6Exercises
