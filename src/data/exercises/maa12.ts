import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa12.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
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
    // Topic: Määrittely- ja arvojoukko (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Mikä on funktion f(x) = √(x − 3) määrittelyjoukko?',
    options: [
      { id: 'a', text: 'x > 0', correct: false },
      { id: 'b', text: 'x ≥ 3', correct: true },
      { id: 'c', text: 'x ≠ 3', correct: false },
      { id: 'd', text: 'x ≤ 3', correct: false },
    ],
    explanation: 'Juurrettavan on oltava epänegatiivinen: x − 3 ≥ 0 ⇒ x ≥ 3.',
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
    // Topic: Jatkuvuus ja derivoituvuus (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Jatkuvalle funktiolle f pätee f(1) = −2 ja f(3) = 4. Mitä Bolzanon lause takaa?',
    options: [
      { id: 'a', text: 'f on kasvava välillä [1, 3]', correct: false },
      { id: 'b', text: 'f(2) = 1', correct: false },
      { id: 'c', text: 'f:llä on nollakohta välillä ]1, 3[', correct: true },
      { id: 'd', text: 'f on derivoituva välillä [1, 3]', correct: false },
    ],
    explanation: 'Jatkuva funktio vaihtaa merkkiä välillä (negatiivisesta positiiviseen), joten sen on saatava arvo 0 jossain välin sisäpisteessä.',
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
    // Topic: Käänteisfunktio (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Mikä on funktion f(x) = x³ käänteisfunktio?',
    options: [
      { id: 'a', text: 'f⁻¹(x) = ∛x', correct: true },
      { id: 'b', text: 'f⁻¹(x) = 1/x³', correct: false },
      { id: 'c', text: 'f⁻¹(x) = −x³', correct: false },
      { id: 'd', text: 'f⁻¹(x) = 3x', correct: false },
    ],
    explanation: 'Vaihdetaan x ja y: x = y³ ⇒ y = ∛x. Kuutiojuuri peruuttaa kuutioon korotuksen; 1/x³ on käänteisluku, ei käänteisfunktio.',
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
    // Topic: Raja-arvot ja äärettömyys (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Mikä on raja-arvo lim (2x + 1)/(x − 3), kun x → ∞?',
    options: [
      { id: 'a', text: '0', correct: false },
      { id: 'b', text: '∞', correct: false },
      { id: 'c', text: '−1/3', correct: false },
      { id: 'd', text: '2', correct: true },
    ],
    explanation: 'Osoittajan ja nimittäjän asteet ovat samat, joten raja-arvo on korkeimman asteen termien kertoimien suhde 2/1 = 2.',
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
  {
    // Topic: Jakaumat (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Normaalijakaumassa N(μ, σ²) mikä parametri määrää kellokäyrän keskikohdan?',
    options: [
      { id: 'a', text: 'σ', correct: false },
      { id: 'b', text: 'σ²', correct: false },
      { id: 'c', text: 'μ', correct: true },
      { id: 'd', text: 'Käyrä on aina keskellä nollaa', correct: false },
    ],
    explanation: 'Odotusarvo μ on symmetrisen kellokäyrän keskikohta; σ ja σ² kuvaavat hajontaa eli käyrän leveyttä.',
  },
]

export default maa12Exercises
