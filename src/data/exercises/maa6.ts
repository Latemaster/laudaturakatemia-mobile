import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa6.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
// The four slider exercises ask "find the x (or n, or h) where some
// derivative-related property holds" and are answered by dragging the
// visual's own slider to that value - not by typing a separately-read-off
// number into a text box.
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
    // Topic: Derivaatan määritelmä (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Mitä derivaatta f\'(a) kuvaa geometrisesti?',
    options: [
      { id: 'a', text: 'Käyrän ja x-akselin välistä pinta-alaa', correct: false },
      { id: 'b', text: 'Tangentin kulmakerrointa kohdassa x = a', correct: true },
      { id: 'c', text: 'Funktion arvoa kohdassa x = a', correct: false },
      { id: 'd', text: 'Funktion nollakohtaa', correct: false },
    ],
    explanation: 'Derivaatta on erotusosamäärän raja-arvo, eli sekantin kulmakerroin, kun pisteet lähestyvät toisiaan: tangentin kulmakerroin.',
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
    // Topic: Derivointisäännöt (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Mikä on funktion f(x) = 4x³ − 2x + 7 derivaatta?',
    options: [
      { id: 'a', text: '12x² − 2x + 7', correct: false },
      { id: 'b', text: '4x² − 2', correct: false },
      { id: 'c', text: '12x² − 2', correct: true },
      { id: 'd', text: '12x² + 7', correct: false },
    ],
    explanation: 'Potenssisääntö termeittäin: (4x³)\' = 12x², (−2x)\' = −2 ja vakion 7 derivaatta on 0.',
  },
  {
    // Topic: Derivointisäännöt (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Mikä on vakiofunktion f(x) = 5 derivaatta?',
    options: [
      { id: 'a', text: '5', correct: false },
      { id: 'b', text: '1', correct: false },
      { id: 'c', text: '0', correct: true },
      { id: 'd', text: '5x', correct: false },
    ],
    explanation: 'Vakiofunktio ei muutu, joten sen muutosnopeus on 0 kaikkialla.',
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
    // Topic: Käyrän tangentti (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Mikä on käyrän y = x² tangentin kulmakerroin kohdassa x = 3?',
    options: [
      { id: 'a', text: '3', correct: false },
      { id: 'b', text: '9', correct: false },
      { id: 'c', text: '2', correct: false },
      { id: 'd', text: '6', correct: true },
    ],
    explanation: 'Tangentin kulmakerroin on derivaatan arvo: f\'(x) = 2x, joten f\'(3) = 6.',
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
  {
    // Topic: Ääriarvot (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Derivaatta f\'(x) vaihtaa merkkinsä positiivisesta negatiiviseksi kohdassa x = 2. Mikä kohdassa x = 2 on?',
    options: [
      { id: 'a', text: 'Paikallinen maksimi', correct: true },
      { id: 'b', text: 'Paikallinen minimi', correct: false },
      { id: 'c', text: 'Funktion nollakohta', correct: false },
      { id: 'd', text: 'Ei ääriarvoa', correct: false },
    ],
    explanation: 'Funktio kasvaa ennen kohtaa (f\' > 0) ja vähenee sen jälkeen (f\' < 0), joten kohdassa on huippu eli paikallinen maksimi.',
  },
]

export default maa6Exercises
