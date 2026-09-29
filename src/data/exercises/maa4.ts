import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa4.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
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
    // Topic: Itseisarvoyhtälöt ja -epäyhtälöt (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Ratkaise yhtälö |x − 2| = 5.',
    options: [
      { id: 'a', text: 'x = 7 (ainoa ratkaisu)', correct: false },
      { id: 'b', text: 'x = 7 tai x = −3', correct: true },
      { id: 'c', text: 'x = 3 tai x = −3', correct: false },
      { id: 'd', text: 'x = 5 tai x = −5', correct: false },
    ],
    explanation: 'x − 2 = 5 tai x − 2 = −5, joten x = 7 tai x = −3.',
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
    // Topic: Pisteiden välinen etäisyys ja janan keskipiste (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Mikä on janan AB keskipiste, kun A = (1, 2) ja B = (5, 6)?',
    options: [
      { id: 'a', text: '(4, 4)', correct: false },
      { id: 'b', text: '(6, 8)', correct: false },
      { id: 'c', text: '(3, 4)', correct: true },
      { id: 'd', text: '(2, 2)', correct: false },
    ],
    explanation: 'M = ((1 + 5)/2, (2 + 6)/2) = (3, 4).',
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
    // Topic: Suoran yhtälö ja kulmakerroin (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Mikä on suoran y = −3x + 2 kulmakerroin k ja y-akselin leikkauskohta b?',
    options: [
      { id: 'a', text: 'k = −3, b = 2', correct: true },
      { id: 'b', text: 'k = 2, b = −3', correct: false },
      { id: 'c', text: 'k = 3, b = 2', correct: false },
      { id: 'd', text: 'k = −3, b = −2', correct: false },
    ],
    explanation: 'Ratkaistussa muodossa y = kx + b kulmakerroin on x:n kerroin −3 ja vakiotermi 2 on y-akselin leikkauskohta.',
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
    // Topic: Suorien keskinäinen asema (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Miten suorat y = 2x + 1 ja y = 2x − 4 sijaitsevat toisiinsa nähden?',
    options: [
      { id: 'a', text: 'Ne ovat kohtisuorassa', correct: false },
      { id: 'b', text: 'Ne ovat sama suora', correct: false },
      { id: 'c', text: 'Ne leikkaavat pisteessä (0, 1)', correct: false },
      { id: 'd', text: 'Ne ovat yhdensuuntaiset', correct: true },
    ],
    explanation: 'Kulmakertoimet ovat samat (k = 2) mutta vakiotermit eri, joten suorat ovat yhdensuuntaiset eivätkä leikkaa.',
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
    // Topic: Ympyrän yhtälö (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Mikä on ympyrän (x − 1)² + (y + 2)² = 9 keskipiste ja säde?',
    options: [
      { id: 'a', text: '(−1, 2), r = 9', correct: false },
      { id: 'b', text: '(1, −2), r = 3', correct: true },
      { id: 'c', text: '(1, −2), r = 9', correct: false },
      { id: 'd', text: '(−1, 2), r = 3', correct: false },
    ],
    explanation: 'Keskipistemuodossa (x − h)² + (y − k)² = r²: h = 1, k = −2 (koska y + 2 = y − (−2)) ja r = √9 = 3.',
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
    // Topic: Pisteen ja suoran sekä ympyröiden etäisyydet (quick)
    conceptIndex: 5,
    kind: 'choice',
    question: 'Kahden ympyrän säteet ovat 2 ja 3, ja niiden keskipisteiden etäisyys on 5. Miten ympyrät sijaitsevat?',
    options: [
      { id: 'a', text: 'Ne eivät kosketa toisiaan', correct: false },
      { id: 'b', text: 'Ne leikkaavat kahdessa pisteessä', correct: false },
      { id: 'c', text: 'Ne sivuavat toisiaan', correct: true },
      { id: 'd', text: 'Toinen on toisen sisällä', correct: false },
    ],
    explanation: 'Keskipisteiden etäisyys on tasan säteiden summa 2 + 3 = 5, joten ympyrät sivuavat toisiaan ulkopuolisesti.',
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
    // Topic: Paraabelin yhtälö (quick)
    conceptIndex: 6,
    kind: 'choice',
    question: 'Mihin suuntaan paraabeli y = −2x² + 3x − 1 aukeaa?',
    options: [
      { id: 'a', text: 'Alaspäin', correct: true },
      { id: 'b', text: 'Ylöspäin', correct: false },
      { id: 'c', text: 'Oikealle', correct: false },
      { id: 'd', text: 'Riippuu x:n arvosta', correct: false },
    ],
    explanation: 'Aukeamissuunnan määrää x²-termin kerroin a = −2 < 0, joten paraabeli aukeaa alaspäin.',
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
    // Topic: Vektorin perusominaisuudet ja laskutoimitukset (quick)
    conceptIndex: 7,
    kind: 'choice',
    question: 'Kun u = (2, −1) ja v = (−3, 4), mikä on erotus u − v?',
    options: [
      { id: 'a', text: '(−1, 3)', correct: false },
      { id: 'b', text: '(−5, 5)', correct: false },
      { id: 'c', text: '(5, −5)', correct: true },
      { id: 'd', text: '(5, 3)', correct: false },
    ],
    explanation: 'Komponenteittain: (2 − (−3), −1 − 4) = (5, −5).',
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
    // Topic: Pistetulo ja vektorien välinen kulma (quick)
    conceptIndex: 8,
    kind: 'choice',
    question: 'Mikä on vektorien (3, 2) ja (−2, 3) pistetulo?',
    options: [
      { id: 'a', text: '12', correct: false },
      { id: 'b', text: '5', correct: false },
      { id: 'c', text: '−12', correct: false },
      { id: 'd', text: '0', correct: true },
    ],
    explanation: '3·(−2) + 2·3 = −6 + 6 = 0, joten vektorit ovat kohtisuorassa.',
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
  {
    // Topic: Yksikkövektori (quick)
    conceptIndex: 9,
    kind: 'choice',
    question: 'Mikä on vektorin (0, −5) suuntainen yksikkövektori?',
    options: [
      { id: 'a', text: '(0, 5)', correct: false },
      { id: 'b', text: '(0, −1)', correct: true },
      { id: 'c', text: '(1, 0)', correct: false },
      { id: 'd', text: '(0, −5)', correct: false },
    ],
    explanation: 'Jaetaan vektori pituudellaan: (0, −5) / 5 = (0, −1).',
  },
]

export default maa4Exercises
