import type { Card } from '../types'

export const cards: Card[] = [
  // --- Derivaatta ---
  {
    id: 'der-lesson',
    type: 'lesson',
    topic: 'Derivaatta',
    title: 'Derivaatan perussäännöt',
    body:
      'Derivaatta kertoo funktion muutosnopeuden. Potenssisääntö: (xⁿ)′ = n·xⁿ⁻¹.\n\n' +
      'Tulon derivaatta: (f·g)′ = f′·g + f·g′.\n\n' +
      'Esimerkki: kun f(x) = x³, niin f′(x) = 3x².',
  },
  {
    id: 'der-ex-1',
    type: 'exercise',
    topic: 'Derivaatta',
    question: 'Mikä on funktion f(x) = x³ − 2x² + 5 derivaatta?',
    options: [
      { id: 'a', text: '3x² − 4x', correct: true },
      { id: 'b', text: '3x² − 2x', correct: false },
      { id: 'c', text: 'x² − 4x + 5', correct: false },
      { id: 'd', text: '3x² − 4x + 5', correct: false },
    ],
    explanation:
      'Derivoidaan termeittäin: (x³)′ = 3x², (−2x²)′ = −4x ja vakion 5 derivaatta on 0. Vastaus: 3x² − 4x.',
  },
  {
    id: 'der-ex-2',
    type: 'exercise',
    topic: 'Derivaatta',
    question: 'Derivoi tulon avulla: f(x) = x·sin(x)',
    options: [
      { id: 'a', text: 'cos(x)', correct: false },
      { id: 'b', text: 'sin(x) + x·cos(x)', correct: true },
      { id: 'c', text: 'x·cos(x)', correct: false },
      { id: 'd', text: 'sin(x) − x·cos(x)', correct: false },
    ],
    explanation:
      'Tulon derivaattasäännöllä (f·g)′ = f′·g + f·g′, kun f(x) = x ja g(x) = sin(x): 1·sin(x) + x·cos(x).',
  },
  {
    id: 'der-ex-3',
    type: 'exercise',
    topic: 'Derivaatta',
    question: 'Mikä on funktion f(x) = e^(2x) derivaatta?',
    options: [
      { id: 'a', text: 'e^(2x)', correct: false },
      { id: 'b', text: '2x·e^(2x)', correct: false },
      { id: 'c', text: '2e^(2x)', correct: true },
      { id: 'd', text: 'e²ˣ / 2', correct: false },
    ],
    explanation:
      'Ketjusäännöllä: sisäfunktion 2x derivaatta on 2, joten (e^(2x))′ = 2·e^(2x).',
  },

  // --- Trigonometria ---
  {
    id: 'trig-lesson',
    type: 'lesson',
    topic: 'Trigonometria',
    title: 'Yksikköympyrä ja peruskaavat',
    body:
      'Yksikköympyrällä pisteen koordinaatit kulman α kohdalla ovat (cos α, sin α).\n\n' +
      'Peruskaava: sin²α + cos²α = 1.\n\n' +
      'Kaksinkertaisen kulman kaava: sin(2α) = 2·sin α·cos α.',
  },
  {
    id: 'trig-ex-1',
    type: 'exercise',
    topic: 'Trigonometria',
    question: 'Mikä on sin(30°) arvo?',
    options: [
      { id: 'a', text: '1/2', correct: true },
      { id: 'b', text: '√2/2', correct: false },
      { id: 'c', text: '√3/2', correct: false },
      { id: 'd', text: '1', correct: false },
    ],
    explanation: 'sin(30°) = 1/2 on yksi peruskulmien tunnetuista arvoista.',
  },
  {
    id: 'trig-ex-2',
    type: 'exercise',
    topic: 'Trigonometria',
    question: 'Mitä sin²x + cos²x on aina, kun x on reaaliluku?',
    options: [
      { id: 'a', text: '0', correct: false },
      { id: 'b', text: '1', correct: true },
      { id: 'c', text: '2x', correct: false },
      { id: 'd', text: 'Riippuu x:n arvosta', correct: false },
    ],
    explanation:
      'Trigonometrian peruskaava sin²x + cos²x = 1 pätee kaikilla reaaliluvuilla x.',
  },
  {
    id: 'trig-ex-3',
    type: 'exercise',
    topic: 'Trigonometria',
    question:
      'Ratkaise yhtälö sin(x) = 1/2, kun x ∈ [0°, 360°). Kuinka monta ratkaisua yhtälöllä on?',
    options: [
      { id: 'a', text: '1', correct: false },
      { id: 'b', text: '2', correct: true },
      { id: 'c', text: '3', correct: false },
      { id: 'd', text: '4', correct: false },
    ],
    explanation:
      'Välillä [0°, 360°) ratkaisut ovat x = 30° ja x = 150°, eli yhtälöllä on kaksi ratkaisua.',
  },

  // --- Integraalit ---
  {
    id: 'int-lesson',
    type: 'lesson',
    topic: 'Integraalit',
    title: 'Integraalifunktio',
    body:
      'Integrointi on derivoinnin käänteisoperaatio. Potenssisääntö integroinnille:\n\n' +
      '∫xⁿ dx = xⁿ⁺¹ / (n+1) + C, kun n ≠ −1.\n\n' +
      'Määrätyssä integraalissa lasketaan integraalifunktion arvojen erotus rajoilla.',
  },
  {
    id: 'int-ex-1',
    type: 'exercise',
    topic: 'Integraalit',
    question: 'Laske ∫3x² dx',
    options: [
      { id: 'a', text: 'x³ + C', correct: true },
      { id: 'b', text: '3x³ + C', correct: false },
      { id: 'c', text: 'x² + C', correct: false },
      { id: 'd', text: '6x + C', correct: false },
    ],
    explanation: 'Potenssisäännöllä ∫3x² dx = 3·(x³/3) + C = x³ + C.',
  },
  {
    id: 'int-ex-2',
    type: 'exercise',
    topic: 'Integraalit',
    question: 'Laske määrätty integraali ∫₀² (2x + 1) dx',
    options: [
      { id: 'a', text: '4', correct: false },
      { id: 'b', text: '5', correct: false },
      { id: 'c', text: '6', correct: true },
      { id: 'd', text: '8', correct: false },
    ],
    explanation:
      'Integraalifunktio on x² + x. Sijoittamalla rajat: (2² + 2) − (0² + 0) = 6 − 0 = 6.',
  },
  {
    id: 'int-ex-3',
    type: 'exercise',
    topic: 'Integraalit',
    question: 'Mikä on funktion cos(x) integraalifunktio?',
    options: [
      { id: 'a', text: '−sin(x) + C', correct: false },
      { id: 'b', text: 'sin(x) + C', correct: true },
      { id: 'c', text: '−cos(x) + C', correct: false },
      { id: 'd', text: 'tan(x) + C', correct: false },
    ],
    explanation:
      'Koska (sin x)′ = cos x, integraalifunktio on ∫cos(x) dx = sin(x) + C.',
  },
]
