import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa7.ts, in the same order.
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
    // Topic: Tilavuus pyörähdyskappaleesta
    kind: 'numeric',
    visual: 'revolution-solid',
    question: 'Käyrä y = √x pyörähtää x-akselin ympäri välillä [0,4]. Tilavuus on V = π·∫₀⁴ x dx. Mikä on integraalin ∫₀⁴ x dx arvo?',
    answer: 8,
    tolerance: 0.1,
    explanation: '∫₀⁴ x dx = [x²/2]₀⁴ = 16/2 = 8, joten V = 8π.',
  },
]

export default maa7Exercises
