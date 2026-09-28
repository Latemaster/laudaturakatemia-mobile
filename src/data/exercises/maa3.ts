import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa3.ts, in the same order.
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
