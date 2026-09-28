import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa12.ts, in the same order.
const maa12Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Määrittely- ja arvojoukko
    kind: 'numeric',
    visual: 'domain-range-hyperbola',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Millä x:n arvolla f(x) = 1/x on tasan 0,25?',
    answer: 4,
    tolerance: 0.1,
    min: -4,
    max: 4,
    step: 0.1,
    sliderStart: 1,
    explanation: '1/x = 0,25 ⇒ x = 4.',
  },
  {
    // Topic: Jatkuvuus ja derivoituvuus
    kind: 'choice',
    visual: 'continuity-kink',
    question: 'Funktio |x| on jatkuva kaikkialla, mutta se ei ole derivoituva kohdassa x=0. Miksi?',
    options: [
      { id: 'a', text: 'Vasemman- ja oikeanpuoleinen kulmakerroin eroavat toisistaan', correct: true },
      { id: 'b', text: 'Funktio ei ole määritelty kohdassa x=0', correct: false },
      { id: 'c', text: 'Funktio ei ole jatkuva kohdassa x=0', correct: false },
      { id: 'd', text: 'Derivaatta on ääretön kohdassa x=0', correct: false },
    ],
    explanation: 'Kohdassa x=0 vasemmalta lähestyttäessä kulmakerroin on −1 ja oikealta +1, joten yhtä yhteistä tangentin kulmakerrointa ei ole.',
  },
  {
    // Topic: Käänteisfunktio
    kind: 'numeric',
    visual: 'inverse-function-mirror',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä x. Funktio on f(x) = 2x+3. Millä x:n arvolla f(x) on tasan 5 (eli x = f⁻¹(5))?',
    answer: 1,
    tolerance: 0.1,
    min: -3,
    max: 2,
    step: 0.1,
    sliderStart: -2,
    explanation: '2x+3 = 5 ⇒ x = 1, joten myös f⁻¹(5) = 1.',
  },
  {
    // Topic: Raja-arvot ja äärettömyys
    kind: 'numeric',
    visual: 'improper-integral-convergence',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä N. Millä N:n arvolla integraali ∫₁^N 1/x² dx on tasan 0,9?',
    answer: 10,
    tolerance: 0.5,
    min: 2,
    max: 50,
    step: 1,
    sliderStart: 3,
    explanation: '1 − 1/N = 0,9 ⇒ 1/N = 0,1 ⇒ N = 10.',
  },
  {
    // Topic: Jakaumat
    kind: 'choice',
    visual: 'normal-distribution',
    question: 'Aseta yllä olevan kuvan liukusäädin σ:lle suurelle arvolle (esim. 3). Mitä tapahtuu kellokäyrälle?',
    options: [
      { id: 'a', text: 'Käyrä levenee ja madaltuu', correct: true },
      { id: 'b', text: 'Käyrä kapenee ja terävöityy', correct: false },
      { id: 'c', text: 'Käyrä siirtyy sivulle', correct: false },
      { id: 'd', text: 'Käyrä ei muutu', correct: false },
    ],
    explanation: 'Suurempi σ tarkoittaa suurempaa hajontaa: todennäköisyysmassa jakautuu laajemmalle alueelle, joten käyrä levenee ja madaltuu.',
  },
]

export default maa12Exercises
