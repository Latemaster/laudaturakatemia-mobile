import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa3.ts, in the same order.
// Several are numeric-answer exercises tied to an interactive slider visual
// (set the slider to a given value, read off the resulting number, submit
// it) rather than multiple choice.
const maa3Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Yksikkömuutokset ja mittakaava
    kind: 'numeric',
    visual: 'scale-factor',
    question: 'Aseta yllä olevan kuvan liukusäädin k:lle arvoon 2. Mikä on tällöin suuremman neliön pinta-ala A₂?',
    answer: 16,
    tolerance: 0.5,
    min: 0.5,
    max: 2.5,
    step: 0.25,
    explanation: 'A₂ = A₁·k² = 4·2² = 16.',
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
    // Topic: Suorakulmainen kolmio, trigonometria ja Pythagoraan lause
    kind: 'numeric',
    visual: 'right-triangle-trig',
    question: 'Aseta yllä olevan kuvan liukusäädin θ:lle arvoon 30°. Mikä on tällöin sivu a (pyöristä kahteen desimaaliin)?',
    answer: 2.0,
    tolerance: 0.05,
    min: 10,
    max: 80,
    step: 5,
    explanation: 'a = c·sin θ = 4·sin 30° = 4·0,5 = 2,00.',
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
    // Topic: Sini- ja kosinilause
    kind: 'numeric',
    visual: 'triangle-laws',
    question: 'Kolmiossa a = 7, b = 9 ja niiden välinen kulma C = 60°. Mikä on sivu c kosinilauseella (pyöristä yhteen desimaaliin)?',
    answer: 8.2,
    tolerance: 0.15,
    explanation: 'c² = 7² + 9² − 2·7·9·cos 60° = 130 − 63 = 67, joten c = √67 ≈ 8,2.',
  },
  {
    // Topic: Ympyrä: määritelmä, sektori ja kaari
    kind: 'numeric',
    visual: 'circle-sector',
    question: 'Aseta yllä olevan kuvan keskuskulmaksi θ = 120°. Mikä on sektorin pinta-ala (pyöristä kahteen desimaaliin)?',
    answer: 12.82,
    tolerance: 0.1,
    min: 10,
    max: 350,
    step: 10,
    explanation: 'A = (θ/360)·π·r² = (120/360)·π·3,5² ≈ 12,82.',
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
]

export default maa3Exercises
