import type { DistributiveOmit, ExerciseCard } from '../../types'

// One exercise per lecture topic in theory/maa11.ts, in the same order.
const maa11Exercises: Array<DistributiveOmit<ExerciseCard, 'id' | 'type' | 'topic'>> = [
  {
    // Topic: Algoritmi, silmukka ja vuokaavio
    kind: 'choice',
    visual: 'algorithm-flowchart',
    question: 'Mikä perusrakenne vastaa tilannetta, jossa ohjelma toistaa komentoja niin kauan kuin ehto pätee?',
    options: [
      { id: 'a', text: 'Toisto (silmukka)', correct: true },
      { id: 'b', text: 'Valinta', correct: false },
      { id: 'c', text: 'Peräkkäisyys', correct: false },
      { id: 'd', text: 'Rekursio', correct: false },
    ],
    explanation: 'Toisto (silmukka) suorittaa samat vaiheet uudestaan niin kauan kuin ehto on voimassa.',
  },
  {
    // Topic: Logiikka
    kind: 'choice',
    visual: 'logic-truth-table',
    question: 'Jos p on tosi ja q on epätosi, mikä on implikaation p → q totuusarvo?',
    options: [
      { id: 'a', text: 'Epätosi', correct: true },
      { id: 'b', text: 'Tosi', correct: false },
      { id: 'c', text: 'Riippuu q:n arvosta', correct: false },
      { id: 'd', text: 'Ei voida määrittää', correct: false },
    ],
    explanation: 'p → q on epätosi ainoastaan silloin, kun p on tosi ja q on epätosi.',
  },
  {
    // Topic: Jaollisuus ja kongruenssi
    kind: 'numeric',
    visual: 'modular-clock',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä a. Millä SUURIMMALLA a:n arvolla (väliltä 0-24) pätee a mod 5 = 2?',
    answer: 22,
    tolerance: 0,
    min: 0,
    max: 24,
    step: 1,
    sliderStart: 5,
    explanation: 'a mod 5 = 2 toteutuu arvoilla 2, 7, 12, 17, 22; suurin näistä on 22.',
  },
  {
    // Topic: Tekijät, SYT ja PYM
    kind: 'numeric',
    visual: 'euclidean-algorithm',
    question: 'Mikä on SYT(48, 18) Eukleideen algoritmilla?',
    answer: 6,
    tolerance: 0,
    explanation: '48=2·18+12, 18=1·12+6, 12=2·6+0, joten SYT(48,18)=6.',
  },
  {
    // Topic: Alkuluvut
    kind: 'numeric',
    visual: 'sieve-of-eratosthenes',
    answerVia: 'slider',
    question: 'Säädä liukusäädintä (askel). Millä pienimmällä askeleen arvolla kuvassa näkyy kaikki 15 alkulukua väliltä 2-50?',
    answer: 3,
    tolerance: 0,
    min: 0,
    max: 4,
    step: 1,
    sliderStart: 0,
    explanation: 'Kun alkuluvut 2, 3 ja 5 on käytetty (askel 3), yksikään todellinen alkuluku ≤50 ei enää tarvitse lukua 7 jakajakseen, joten kaikki 15 alkulukua näkyvät jo oikein - vain luku 49 jää vielä harmaana, kunnes 7 sovelletaan.',
  },
  {
    // Topic: Ohjelmointi (Python)
    kind: 'choice',
    visual: 'python-conditional',
    question: 'Aseta yllä olevan kuvan liukusäädin x:lle arvoon -3. Minkä tekstin koodi tulostaa?',
    options: [
      { id: 'a', text: '"negatiivinen"', correct: true },
      { id: 'b', text: '"positiivinen"', correct: false },
      { id: 'c', text: '"nolla"', correct: false },
      { id: 'd', text: 'Koodi antaa virheen', correct: false },
    ],
    explanation: 'x = -3 < 0, joten elif-haara suoritetaan ja tulostuu "negatiivinen".',
  },
]

export default maa11Exercises
