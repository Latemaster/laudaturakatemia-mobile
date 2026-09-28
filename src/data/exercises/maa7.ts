import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa7.ts, in the same order.
const maa7Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Integraalin määritelmä
    kind: 'numeric',
    visual: 'riemann-sum',
    question: 'Aseta yllä olevan kuvan liukusäädin n:lle arvoon 24. Mikä on Riemannin summa likimain (pyöristä kahteen desimaaliin)?',
    answer: 10.01,
    tolerance: 0.15,
    min: 2,
    max: 24,
    step: 1,
    explanation: 'n=24 suorakulmiolla vasen Riemannin summa on noin 10,01, mikä on lähellä tarkkaa arvoa 10,4.',
  },
  {
    // Topic: Perusintegraalit
    kind: 'numeric',
    visual: 'power-rule-integral',
    question: 'Aseta yllä olevan kuvan liukusäädin n:lle arvoon 2, jolloin f(x) = x². Integraalifunktio on F(x) = x³/3. Mikä on F(3)?',
    answer: 9,
    tolerance: 0.2,
    min: 0,
    max: 3,
    step: 1,
    explanation: 'F(3) = 3³/3 = 27/3 = 9.',
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
    question: 'Aseta yllä olevan kuvan liukusäädin b:lle arvoon 4. Mikä on pinta-ala tällöin (pyöristä kahteen desimaaliin)?',
    answer: 5.33,
    tolerance: 0.1,
    min: 1,
    max: 6,
    step: 0.5,
    explanation: 'A = ∫₀⁴ √x dx = (2/3)·4^1,5 = (2/3)·8 ≈ 5,33.',
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
