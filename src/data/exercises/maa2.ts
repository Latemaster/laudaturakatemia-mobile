import type { DistributiveOmit, ExerciseCard } from '../../types'

// Multiple-choice exercises for the lecture topics in theory/maa2.ts. The
// entries without a conceptIndex pair up with the concept boxes in order,
// one per concept; the extra quick questions carry an explicit conceptIndex
// and sit right after their sibling. Separate from the open-answer task
// cards in problems/maa2.json. The correct option's position is
// deliberately varied (not always "A") so the answer can't be guessed from
// a pattern.
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
    // Topic: Polynomien laskutoimitukset (quick)
    conceptIndex: 0,
    question: 'Mikä on polynomien 2x² + x ja x² − 3x summa?',
    kind: 'choice',
    options: [
      { id: 'a', text: '3x² − 2x', correct: true },
      { id: 'b', text: '3x² + 4x', correct: false },
      { id: 'c', text: '2x⁴ − 2x', correct: false },
      { id: 'd', text: 'x² − 2x', correct: false },
    ],
    explanation: 'Lasketaan samanasteiset termit yhteen: 2x² + x² = 3x² ja x − 3x = −2x.',
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
    // Topic: Arvon määrittäminen (quick)
    conceptIndex: 1,
    question: 'Olkoon g(x) = −x² + 4. Mikä on g(−3)?',
    kind: 'choice',
    options: [
      { id: 'a', text: '13', correct: false },
      { id: 'b', text: '5', correct: false },
      { id: 'c', text: '−5', correct: true },
      { id: 'd', text: '−13', correct: false },
    ],
    explanation: 'g(−3) = −(−3)² + 4 = −9 + 4 = −5. Negatiivinen luku sijoitetaan sulkeisiin: (−3)² = 9.',
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
    // Topic: Binomin neliö (quick)
    conceptIndex: 2,
    question: 'Mikä on (x − 4)² kehitettynä?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x² − 16', correct: false },
      { id: 'b', text: 'x² − 8x + 16', correct: true },
      { id: 'c', text: 'x² + 8x + 16', correct: false },
      { id: 'd', text: 'x² − 4x + 16', correct: false },
    ],
    explanation: '(a − b)² = a² − 2ab + b², joten (x − 4)² = x² − 8x + 16.',
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
    // Topic: Neliöjuuri (quick)
    conceptIndex: 3,
    question: 'Mikä on √(16 · 9)?',
    kind: 'choice',
    options: [
      { id: 'a', text: '144', correct: false },
      { id: 'b', text: '25', correct: false },
      { id: 'c', text: '7', correct: false },
      { id: 'd', text: '12', correct: true },
    ],
    explanation: '√(16·9) = √144 = 12, tai yhtä hyvin √16 · √9 = 4 · 3 = 12.',
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
    // Topic: Potenssiyhtälö (quick)
    conceptIndex: 4,
    question: 'Ratkaise yhtälö x² = 25.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 5 tai x = −5', correct: true },
      { id: 'b', text: 'x = 5 (ainoa ratkaisu)', correct: false },
      { id: 'c', text: 'x = 12,5', correct: false },
      { id: 'd', text: 'x = 25 tai x = −25', correct: false },
    ],
    explanation: 'Parillisen potenssin yhtälössä on kaksi ratkaisua: 5² = 25 ja (−5)² = 25.',
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
    // Topic: Toisen asteen yhtälö ja diskriminantti (quick)
    conceptIndex: 5,
    question: 'Yhtälön x² + 2x + 1 = 0 diskriminantti on D = 0. Montako reaaliratkaisua yhtälöllä on?',
    kind: 'choice',
    options: [
      { id: 'a', text: '0', correct: false },
      { id: 'b', text: '1', correct: true },
      { id: 'c', text: '2', correct: false },
      { id: 'd', text: 'äärettömän monta', correct: false },
    ],
    explanation: 'D = 0 tarkoittaa tasan yhtä ratkaisua: x² + 2x + 1 = (x + 1)² = 0 ⇒ x = −1.',
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
    // Topic: Soveltaminen (quick)
    conceptIndex: 6,
    question: 'Positiivisen luvun ja sen neliön summa on 12. Mikä luku on?',
    kind: 'choice',
    options: [
      { id: 'a', text: '4', correct: false },
      { id: 'b', text: '6', correct: false },
      { id: 'c', text: '3', correct: true },
      { id: 'd', text: '2', correct: false },
    ],
    explanation: 'x + x² = 12 ⇒ x² + x − 12 = (x + 4)(x − 3) = 0 ⇒ x = 3 (x = −4 hylätään).',
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
    // Topic: Tekijöihin jakaminen (quick)
    conceptIndex: 7,
    question: 'Mikä on x² + 6x + 9 tekijöihin jaettuna?',
    kind: 'choice',
    options: [
      { id: 'a', text: '(x + 3)(x − 3)', correct: false },
      { id: 'b', text: '(x + 9)(x + 1)', correct: false },
      { id: 'c', text: '(x − 3)²', correct: false },
      { id: 'd', text: '(x + 3)²', correct: true },
    ],
    explanation: 'Tunnista binomin neliö: x² + 2·3·x + 3² = (x + 3)².',
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
    // Topic: Funktion nollakohdat (quick)
    conceptIndex: 8,
    question: 'Montako nollakohtaa funktiolla f(x) = x² + 1 on?',
    kind: 'choice',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '0', correct: true },
      { id: 'c', text: '2', correct: false },
      { id: 'd', text: 'äärettömän monta', correct: false },
    ],
    explanation: 'x² ≥ 0 kaikilla x, joten x² + 1 ≥ 1 > 0 eikä funktio saa koskaan arvoa 0.',
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
    // Topic: Juurifunktio ja -yhtälö (quick)
    conceptIndex: 9,
    question: 'Ratkaise juuriyhtälö √(2x) = 4.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 2', correct: false },
      { id: 'b', text: 'x = 16', correct: false },
      { id: 'c', text: 'x = 8', correct: true },
      { id: 'd', text: 'x = 32', correct: false },
    ],
    explanation: 'Neliöimällä: 2x = 16 ⇒ x = 8. Tarkistus: √(2·8) = √16 = 4.',
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
    // Topic: Rationaalifunktio ja -yhtälö (quick)
    conceptIndex: 10,
    question: 'Ratkaise yhtälö 6/x = 3.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 18', correct: false },
      { id: 'b', text: 'x = 1/2', correct: false },
      { id: 'c', text: 'x = 3', correct: false },
      { id: 'd', text: 'x = 2', correct: true },
    ],
    explanation: 'Kerrotaan puolittain x:llä (x ≠ 0): 6 = 3x ⇒ x = 2.',
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
    // Topic: Tulon nollasääntö (quick)
    conceptIndex: 11,
    question: 'Ratkaise yhtälö x(x − 4) = 0.',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 0 tai x = 4', correct: true },
      { id: 'b', text: 'x = 4 (ainoa ratkaisu)', correct: false },
      { id: 'c', text: 'x = 0 tai x = −4', correct: false },
      { id: 'd', text: 'x = 0 (ainoa ratkaisu)', correct: false },
    ],
    explanation: 'Tekijät ovat x ja x − 4, joten x = 0 tai x − 4 = 0 eli x = 4.',
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
  {
    // Topic: Korkeamman asteen yhtälöt (quick)
    conceptIndex: 12,
    question: 'Mitkä ovat yhtälön x⁴ = 16 reaaliratkaisut?',
    kind: 'choice',
    options: [
      { id: 'a', text: 'x = 4', correct: false },
      { id: 'b', text: 'x = 2 (ainoa ratkaisu)', correct: false },
      { id: 'c', text: 'x = 2 tai x = −2', correct: true },
      { id: 'd', text: 'x = 8', correct: false },
    ],
    explanation: 'x⁴ − 16 = (x² − 4)(x² + 4) = (x − 2)(x + 2)(x² + 4); vain x = ±2 ovat reaalisia.',
  },
]

export default maa2Exercises
