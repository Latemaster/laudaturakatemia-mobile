import type { DistributiveOmit, ExerciseCard } from '../../types'

// One multiple-choice exercise per lecture topic in theory/maa2.ts, in the
// same order, so index i here reinforces concept box i. Separate from the
// open-answer task cards in problems/maa2.json. The correct option's
// position is deliberately varied (not always "A") so the answer can't be
// guessed from a pattern.
const maa2Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Polynomien laskutoimitukset
    question: 'Mikä on tulon (x + 3)(x − 2) kehitetty muoto?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x² − x − 6', correct: false },
      { id: 'b', text: 'x² + 5x − 6', correct: false },
      { id: 'c', text: 'x² + x − 6', correct: true },
      { id: 'd', text: 'x² + x + 6', correct: false },
    ],
    explanation: '(x+3)(x−2) = x²−2x+3x−6 = x²+x−6.',
  },
  {
    // Topic: Arvon määrittäminen
    question: 'Olkoon f(x) = x² − 2x + 1. Mikä on f(3)?',
    kind: 'choice',
    options: [
      { id: 'a', text: '4', correct: true },
      { id: 'b', text: '7', correct: false },
      { id: 'c', text: '3', correct: false },
      { id: 'd', text: '16', correct: false },
    ],
    explanation: 'f(3) = 3² − 2·3 + 1 = 9 − 6 + 1 = 4.',
  },
  {
    // Topic: Binomin neliö
    visual: 'binomial-square',
    question: 'Mikä lauseke vastaa binomin neliötä (a + b)²?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'a² + b²', correct: false },
      { id: 'b', text: 'a² − 2ab + b²', correct: false },
      { id: 'c', text: 'a² + ab + b²', correct: false },
      { id: 'd', text: 'a² + 2ab + b²', correct: true },
    ],
    explanation: 'Yllä olevassa kuvassa neliö jakautuu neljään osaan: a², ab, ab ja b² — yhteensä a²+2ab+b².',
  },
  {
    // Topic: Neliöjuuri
    question: 'Mikä on √49?',
    kind: 'choice',
    options: [
      { id: 'a', text: '98', correct: false },
      { id: 'b', text: '7', correct: true },
      { id: 'c', text: '−7', correct: false },
      { id: 'd', text: '24.5', correct: false },
    ],
    explanation: '√49 = 7, koska 7² = 49 ja neliöjuuri on aina epänegatiivinen.',
  },
  {
    // Topic: Potenssiyhtälö
    question: 'Ratkaise yhtälö x³ = 8.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 4', correct: false },
      { id: 'b', text: 'x = −2', correct: false },
      { id: 'c', text: 'x = 8/3', correct: false },
      { id: 'd', text: 'x = 2', correct: true },
    ],
    explanation: 'x = 8^(1/3) = 2, koska 2³ = 8.',
  },
  {
    // Topic: Toisen asteen yhtälö ja diskriminantti
    // Framed as an interaction with the visual above (matching the "set the
    // slider until a condition holds" pattern), since the visual's own
    // default (D=16>0) would otherwise contradict a static D<0 question.
    visual: 'quadratic-discriminant',
    question:
      'Säädä yllä olevan kuvan liukusäätimiä niin, ettei paraabeli leikkaa x-akselia lainkaan. Mikä on tällöin diskriminantin D = b² − 4ac etumerkki?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'positiivinen', correct: false },
      { id: 'b', text: 'negatiivinen', correct: true },
      { id: 'c', text: 'nolla', correct: false },
      { id: 'd', text: 'ei voida päätellä', correct: false },
    ],
    explanation:
      'Kun paraabeli ei leikkaa x-akselia, yhtälöllä ei ole reaaliratkaisuja, mikä tarkoittaa D = b²−4ac < 0.',
  },
  {
    // Topic: Soveltaminen
    question: 'Suorakulmion pinta-ala on x(x + 3) = 40. Mikä on x, kun sivun pituus on positiivinen?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = −8', correct: false },
      { id: 'b', text: 'x = 5', correct: true },
      { id: 'c', text: 'x = 8', correct: false },
      { id: 'd', text: 'x = −5', correct: false },
    ],
    explanation: 'x² + 3x − 40 = 0 antaa x = 5 tai x = −8; negatiivinen sivun pituus hylätään.',
  },
  {
    // Topic: Tekijöihin jakaminen
    question: 'Mikä on x² − 9 jaettuna tekijöihin?',
    kind: 'choice',
    options: [
      { id: 'a', text: '(x − 3)(x + 3)', correct: true },
      { id: 'b', text: '(x − 9)(x + 1)', correct: false },
      { id: 'c', text: '(x − 3)²', correct: false },
      { id: 'd', text: '(x + 3)²', correct: false },
    ],
    explanation: 'x² − 9 on neliöiden erotus: x² − 3² = (x−3)(x+3).',
  },
  {
    // Topic: Funktion nollakohdat
    question: 'Mikä on funktion f(x) = 2x − 6 nollakohta?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = −3', correct: false },
      { id: 'b', text: 'x = 6', correct: false },
      { id: 'c', text: 'x = 3', correct: true },
      { id: 'd', text: 'x = 2', correct: false },
    ],
    explanation: '2x − 6 = 0 ⇒ x = 3.',
  },
  {
    // Topic: Juurifunktio ja -yhtälö
    question: 'Ratkaise juuriyhtälö √(x + 1) = 3.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 9', correct: false },
      { id: 'b', text: 'x = 2', correct: false },
      { id: 'c', text: 'x = 10', correct: false },
      { id: 'd', text: 'x = 8', correct: true },
    ],
    explanation: 'Neliöimällä: x + 1 = 9, joten x = 8.',
  },
  {
    // Topic: Rationaalifunktio ja -yhtälö
    question: 'Millä x:n arvolla funktio f(x) = 1/(x + 1) ei ole määritelty?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 0', correct: false },
      { id: 'b', text: 'x = −1', correct: true },
      { id: 'c', text: 'x = 1', correct: false },
      { id: 'd', text: 'x = −2', correct: false },
    ],
    explanation: 'Nimittäjä ei saa olla nolla: x + 1 = 0 ⇒ x = −1 on poissuljettu.',
  },
  {
    // Topic: Tulon nollasääntö
    question: 'Ratkaise yhtälö (x − 2)(x + 5) = 0.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 2 tai x = −5', correct: true },
      { id: 'b', text: 'x = −2 tai x = 5', correct: false },
      { id: 'c', text: 'x = 2 tai x = 5', correct: false },
      { id: 'd', text: 'x = 10 (ainoa ratkaisu)', correct: false },
    ],
    explanation: 'Tulo on nolla, jos jompikumpi tekijä on nolla: x−2=0 tai x+5=0.',
  },
  {
    // Topic: Korkeamman asteen yhtälöt
    question: 'Ratkaise yhtälö x³ − x = 0.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 0 tai x = 1', correct: false },
      { id: 'b', text: 'x = 1 tai x = −1', correct: false },
      { id: 'c', text: 'x = 0, x = 1 tai x = −1', correct: true },
      { id: 'd', text: 'x = 0 (ainoa ratkaisu)', correct: false },
    ],
    explanation: 'x³ − x = x(x−1)(x+1) = 0, joten ratkaisut ovat x=0, x=1 ja x=−1.',
  },
]

export default maa2Exercises
