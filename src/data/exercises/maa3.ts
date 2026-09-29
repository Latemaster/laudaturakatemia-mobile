import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa3.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
// Slider-driven numeric exercises ask "find the value where a property
// holds" and are answered by dragging the visual's own slider to that
// value - not by typing a separately-read-off number into a text box.
const maa3Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Yksikkömuutokset ja mittakaava
    kind: 'numeric',
    visual: 'scale-factor',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä k. Millä k:n arvolla suuremman neliön pinta-ala A₂ on tasan 16?',
    answer: 2,
    tolerance: 0.05,
    min: 0.5,
    max: 2.5,
    step: 0.25,
    sliderStart: 1,
    explanation: 'A₂ = A₁·k² = 4·k² = 16 ⇒ k² = 4 ⇒ k = 2.',
  },
  {
    // Topic: Yksikkömuutokset ja mittakaava (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Kartan mittakaava on 1:20 000. Kuinka pitkää matkaa 3 cm kartalla vastaa todellisuudessa?',
    options: [
      { id: 'a', text: '60 m', correct: false },
      { id: 'b', text: '600 m', correct: true },
      { id: 'c', text: '6 km', correct: false },
      { id: 'd', text: '60 km', correct: false },
    ],
    explanation: '3 cm · 20 000 = 60 000 cm = 600 m.',
  },
  {
    // Topic: Kulmien tyypit ja ominaisuudet
    kind: 'choice',
    visual: 'angle-types',
    question: 'Aseta yllä olevan kuvan liukusäädin θ:lle arvoon 120°. Minkä tyyppinen kulma tämä on?',
    options: [
      { id: 'a', text: 'Terävä kulma', correct: false },
      { id: 'b', text: 'Suora kulma', correct: false },
      { id: 'c', text: 'Tylppä kulma', correct: true },
      { id: 'd', text: 'Oikokulma', correct: false },
    ],
    explanation: '120° on suuremman kuin 90° mutta pienemmän kuin 180°, joten se on tylppä kulma.',
  },
  {
    // Topic: Kulmien tyypit ja ominaisuudet (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Kahdesta vieruskulmasta toinen on 35°. Kuinka suuri on toinen?',
    options: [
      { id: 'a', text: '55°', correct: false },
      { id: 'b', text: '35°', correct: false },
      { id: 'c', text: '145°', correct: true },
      { id: 'd', text: '325°', correct: false },
    ],
    explanation: 'Vieruskulmien summa on 180°: 180° − 35° = 145°.',
  },
  {
    // Topic: Yhdensuuntaisuus ja yhdenmuotoisuus
    kind: 'numeric',
    visual: 'similar-triangles',
    question:
      'Kuvassa suurempi kolmio on 1,6-kertainen pienempään verrattuna. Jos pienemmän kolmion sivu on 4 cm, mikä on vastaava sivu suuremmassa kolmiossa (cm)?',
    answer: 6.4,
    tolerance: 0.1,
    unit: 'cm',
    explanation: 'Yhdenmuotoisuussuhde 1,6: 4 · 1,6 = 6,4 cm.',
  },
  {
    // Topic: Yhdensuuntaisuus ja yhdenmuotoisuus (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Kaksi kolmiota ovat yhdenmuotoisia suhteessa 1:3. Kuinka moninkertainen suuremman kolmion pinta-ala on pienempään verrattuna?',
    options: [
      { id: 'a', text: '3-kertainen', correct: false },
      { id: 'b', text: '9-kertainen', correct: true },
      { id: 'c', text: '6-kertainen', correct: false },
      { id: 'd', text: '27-kertainen', correct: false },
    ],
    explanation: 'Pinta-ala kasvaa mittakaavan neliössä: 3² = 9.',
  },
  {
    // Topic: Kolmion perusominaisuudet ja kulmanpuolittaja
    kind: 'numeric',
    visual: 'angle-bisector',
    question: 'Kolmion kaksi kulmaa ovat 50° ja 70°. Mikä on kolmas kulma?',
    answer: 60,
    tolerance: 0,
    unit: '°',
    explanation: 'Kolmion kulmien summa on 180°: 180° − 50° − 70° = 60°.',
  },
  {
    // Topic: Kolmion perusominaisuudet ja kulmanpuolittaja (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Tasakylkisen kolmion huippukulma on 40°. Kuinka suuret ovat kantakulmat?',
    options: [
      { id: 'a', text: '40°', correct: false },
      { id: 'b', text: '50°', correct: false },
      { id: 'c', text: '70°', correct: true },
      { id: 'd', text: '140°', correct: false },
    ],
    explanation: 'Kantakulmat ovat yhtä suuret: (180° − 40°) / 2 = 70°.',
  },
  {
    // Topic: Suorakulmainen kolmio, trigonometria ja Pythagoraan lause
    kind: 'numeric',
    visual: 'right-triangle-trig',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä θ. Millä θ:n arvolla sivu a on tasan 2,00 (c = 4 kiinteä)?',
    answer: 30,
    tolerance: 2,
    unit: '°',
    min: 10,
    max: 80,
    step: 5,
    sliderStart: 60,
    explanation: 'a = c·sin θ = 2,00 ⇒ sin θ = 0,5 ⇒ θ = 30°.',
  },
  {
    // Topic: Suorakulmainen kolmio, trigonometria ja Pythagoraan lause (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Suorakulmaisen kolmion kateetit ovat 6 ja 8. Kuinka pitkä on hypotenuusa?',
    options: [
      { id: 'a', text: '10', correct: true },
      { id: 'b', text: '14', correct: false },
      { id: 'c', text: '√14', correct: false },
      { id: 'd', text: '48', correct: false },
    ],
    explanation: 'Pythagoraan lause: c = √(6² + 8²) = √100 = 10.',
  },
  {
    // Topic: 2D-kappaleiden pinta-alat ja lävistäjä
    kind: 'numeric',
    visual: 'shape-area-grid',
    question: 'Neliön sivu on a = 5. Mikä on sen lävistäjä (pyöristä kahteen desimaaliin)?',
    answer: 7.07,
    tolerance: 0.05,
    explanation: 'Neliön lävistäjä d = a√2 = 5√2 ≈ 7,07.',
  },
  {
    // Topic: 2D-kappaleiden pinta-alat ja lävistäjä (quick)
    conceptIndex: 5,
    kind: 'choice',
    question: 'Kolmion kanta on 10 ja korkeus 4. Mikä on sen pinta-ala?',
    options: [
      { id: 'a', text: '40', correct: false },
      { id: 'b', text: '20', correct: true },
      { id: 'c', text: '14', correct: false },
      { id: 'd', text: '80', correct: false },
    ],
    explanation: 'A = ½·a·h = ½·10·4 = 20.',
  },
  {
    // Topic: Sini- ja kosinilause
    kind: 'numeric',
    visual: 'triangle-laws',
    question: 'Kolmiossa a = 7, b = 9 ja niiden välinen kulma C = 60°. Mikä on sivu c kosinilauseella (pyöristä yhteen desimaaliin)?',
    answer: 8.2,
    tolerance: 0.15,
    explanation: 'c² = 7² + 9² − 2·7·9·cos 60° = 130 − 63 = 67, joten c = √67 ≈ 8,2.',
  },
  {
    // Topic: Sini- ja kosinilause (quick)
    conceptIndex: 6,
    kind: 'choice',
    question: 'Kolmiossa a = 5, sen vastainen kulma A = 30° ja sivun b vastainen kulma B = 90°. Mikä on b sinilauseella?',
    options: [
      { id: 'a', text: '2,5', correct: false },
      { id: 'b', text: '5', correct: false },
      { id: 'c', text: '20', correct: false },
      { id: 'd', text: '10', correct: true },
    ],
    explanation: 'a / sin A = b / sin B ⇒ 5 / 0,5 = b / 1 ⇒ b = 10.',
  },
  {
    // Topic: Ympyrä: määritelmä, sektori ja kaari
    kind: 'numeric',
    visual: 'circle-sector',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä θ (r = 3,5 kiinteä). Millä keskuskulman θ arvolla sektorin pinta-ala on tasan 12,82?',
    answer: 120,
    tolerance: 5,
    unit: '°',
    min: 10,
    max: 350,
    step: 10,
    sliderStart: 90,
    explanation: 'A = (θ/360)·π·r² = 12,82 ⇒ θ = 120°.',
  },
  {
    // Topic: Ympyrä: määritelmä, sektori ja kaari (quick)
    conceptIndex: 7,
    kind: 'choice',
    question: 'Ympyrän säde on 4. Mikä on puoliympyrän (keskuskulma 180°) pinta-ala?',
    options: [
      { id: 'a', text: '8π', correct: true },
      { id: 'b', text: '16π', correct: false },
      { id: 'c', text: '4π', correct: false },
      { id: 'd', text: '2π', correct: false },
    ],
    explanation: 'A = (180/360)·π·4² = ½·16π = 8π.',
  },
  {
    // Topic: Avaruuskappaleiden pinta-alat ja tilavuudet
    kind: 'numeric',
    visual: 'solid-shapes-grid',
    question: 'Pallon säde on r = 3. Mikä on sen tilavuus (pyöristä yhteen desimaaliin)?',
    answer: 113.1,
    tolerance: 0.5,
    explanation: 'V = (4/3)·π·r³ = (4/3)·π·27 = 36π ≈ 113,1.',
  },
  {
    // Topic: Avaruuskappaleiden pinta-alat ja tilavuudet (quick)
    conceptIndex: 8,
    kind: 'choice',
    question: 'Kuution särmä on 3. Mikä on sen tilavuus?',
    options: [
      { id: 'a', text: '9', correct: false },
      { id: 'b', text: '18', correct: false },
      { id: 'c', text: '27', correct: true },
      { id: 'd', text: '54', correct: false },
    ],
    explanation: 'V = a³ = 3³ = 27. (Pinta-ala olisi 6a² = 54.)',
  },
]

export default maa3Exercises
