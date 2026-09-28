import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa12.ts, in the same order.
const maa12Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Määrittely- ja arvojoukko
    kind: 'numeric',
    visual: 'domain-range-hyperbola',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon 4. Mikä on f(x) = 1/x arvo tällöin?',
    answer: 0.25,
    tolerance: 0.02,
    min: -4,
    max: 4,
    step: 0.1,
    explanation: 'f(4) = 1/4 = 0,25.',
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
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon 1, jolloin f(1) = 5 (f(x)=2x+3). Mikä on käänteisfunktion arvo f⁻¹(5)?',
    answer: 1,
    tolerance: 0.1,
    min: -3,
    max: 2,
    step: 0.1,
    explanation: 'f⁻¹(y) = (y−3)/2, joten f⁻¹(5) = (5−3)/2 = 1.',
  },
  {
    // Topic: Raja-arvot ja äärettömyys
    kind: 'numeric',
    visual: 'improper-integral-convergence',
    question: 'Aseta yllä olevan kuvan liukusäädin N:lle arvoon 10. Mikä on integraalin ∫₁^N 1/x² dx arvo (pyöristä kahteen desimaaliin)?',
    answer: 0.9,
    tolerance: 0.02,
    min: 2,
    max: 50,
    step: 1,
    explanation: '∫₁^N 1/x² dx = 1 − 1/N = 1 − 1/10 = 0,9.',
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
