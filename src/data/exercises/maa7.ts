import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa7.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
const maa7Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Integraalin määritelmä
    kind: 'numeric',
    visual: 'riemann-sum',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä n. Millä n:n arvolla Riemannin summa on lähimpänä tarkkaa arvoa 10,4?',
    answer: 24,
    tolerance: 0.5,
    min: 2,
    max: 24,
    step: 1,
    sliderStart: 4,
    explanation: 'Mitä suurempi n, sitä tarkempi summa - lähimpänä ollaan suurimmalla mahdollisella n:n arvolla, 24.',
  },
  {
    // Topic: Integraalin määritelmä (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Mitä määrätty integraali ∫ₐᵇ f(x) dx kuvaa, kun f(x) ≥ 0 välillä [a, b]?',
    options: [
      { id: 'a', text: 'Tangentin kulmakerrointa', correct: false },
      { id: 'b', text: 'Funktion muutosnopeutta', correct: false },
      { id: 'c', text: 'Käyrän ja x-akselin välistä pinta-alaa', correct: true },
      { id: 'd', text: 'Funktion suurinta arvoa välillä', correct: false },
    ],
    explanation: 'Määrätty integraali on suikaleiden pinta-alojen summan raja-arvo, eli käyrän ja x-akselin väliin jäävä pinta-ala välillä [a, b].',
  },
  {
    // Topic: Perusintegraalit
    kind: 'numeric',
    visual: 'power-rule-integral',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä n. Integraalifunktio on F(x) = xⁿ⁺¹/(n+1). Millä n:n arvolla F(3) on tasan 9?',
    answer: 2,
    tolerance: 0,
    min: 0,
    max: 3,
    step: 1,
    sliderStart: 0,
    explanation: 'F(3) = 3ⁿ⁺¹/(n+1); kokeilemalla n=2: F(3) = 3³/3 = 27/3 = 9.',
  },
  {
    // Topic: Perusintegraalit (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Mikä on ∫ 3x² dx?',
    options: [
      { id: 'a', text: '6x + C', correct: false },
      { id: 'b', text: 'x³ + C', correct: true },
      { id: 'c', text: '3x³ + C', correct: false },
      { id: 'd', text: 'x³/3 + C', correct: false },
    ],
    explanation: '∫ 3x² dx = 3·x³/3 + C = x³ + C. Tarkistus derivoimalla: (x³)\' = 3x².',
  },
  {
    // Topic: Osittaisintegrointi
    kind: 'choice',
    visual: 'integration-by-parts-flow',
    question: 'Osittaisintegroinnin kaavassa ∫u dv = uv − ∫v du, mikä periaate ohjaa u:n ja dv:n valintaa?',
    options: [
      { id: 'a', text: 'Valitaan niin, että jäljelle jäävä integraali ∫v du on helpompi ratkaista', correct: true },
      { id: 'b', text: 'Valitaan aina u = vakio', correct: false },
      { id: 'c', text: 'Valitaan niin, että v on mahdollisimman monimutkainen', correct: false },
      { id: 'd', text: 'Valinnalla ei ole väliä lopputuloksen kannalta', correct: false },
    ],
    explanation: 'Hyvä valinta tekee jäljelle jäävästä integraalista ∫v du alkuperäistä yksinkertaisemman.',
  },
  {
    // Topic: Osittaisintegrointi (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Integraali ∫ x·cos x dx lasketaan osittaisintegroinnilla. Mikä on luonteva valinta u:ksi?',
    options: [
      { id: 'a', text: 'u = cos x', correct: false },
      { id: 'b', text: 'u = x·cos x', correct: false },
      { id: 'c', text: 'u = sin x', correct: false },
      { id: 'd', text: 'u = x', correct: true },
    ],
    explanation: 'Kun u = x, saadaan du = dx ja jäljelle jäävä integraali ∫ sin x dx on helppo; dv = cos x dx antaa v = sin x.',
  },
  {
    // Topic: Käyrän pinta-ala
    kind: 'numeric',
    visual: 'area-under-curve',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä b. Millä b:n arvolla pinta-ala A = ∫₀^b √x dx on tasan 5,33?',
    answer: 4,
    tolerance: 0.1,
    min: 1,
    max: 6,
    step: 0.5,
    sliderStart: 2,
    explanation: 'A = (2/3)·b^1,5 = 5,33 ⇒ b = 4.',
  },
  {
    // Topic: Käyrän pinta-ala (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Mikä on suoran y = 2x ja x-akselin väliin jäävä pinta-ala välillä [0, 3]?',
    options: [
      { id: 'a', text: '9', correct: true },
      { id: 'b', text: '6', correct: false },
      { id: 'c', text: '18', correct: false },
      { id: 'd', text: '3', correct: false },
    ],
    explanation: '∫₀³ 2x dx = [x²]₀³ = 9 − 0 = 9. (Sama tulos kolmion pinta-alana: ½·3·6 = 9.)',
  },
  {
    // Topic: Tilavuus pyörähdyskappaleesta
    kind: 'numeric',
    visual: 'revolution-solid',
    question: 'Käyrä y = √x pyörähtää x-akselin ympäri välillä [0,4]. Tilavuus on V = π·∫₀⁴ x dx. Mikä on integraalin ∫₀⁴ x dx arvo?',
    answer: 8,
    tolerance: 0.1,
    explanation: '∫₀⁴ x dx = [x²/2]₀⁴ = 16/2 = 8, joten V = 8π.',
  },
  {
    // Topic: Tilavuus pyörähdyskappaleesta (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Vakiofunktio y = 2 pyörähtää x-akselin ympäri välillä [0, 3]. Mikä on syntyvän lieriön tilavuus?',
    options: [
      { id: 'a', text: '6π', correct: false },
      { id: 'b', text: '4π', correct: false },
      { id: 'c', text: '12π', correct: true },
      { id: 'd', text: '36π', correct: false },
    ],
    explanation: 'V = π·∫₀³ 2² dx = π·4·3 = 12π, sama kuin lieriön kaava π·r²·h.',
  },
]

export default maa7Exercises
