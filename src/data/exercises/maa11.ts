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
    question: 'Aseta yllä olevan kuvan liukusäädin a:lle arvoon 17. Mikä on 17 mod 5?',
    answer: 2,
    tolerance: 0,
    min: 0,
    max: 24,
    step: 1,
    explanation: '17 = 3·5 + 2, joten 17 mod 5 = 2.',
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
    question: 'Aseta yllä olevan kuvan liukusäädin askeleeksi 4 (täysi seula alkuluvuilla 2,3,5,7). Montako alkulukua on väliltä 2-50?',
    answer: 15,
    tolerance: 0,
    min: 0,
    max: 4,
    step: 1,
    explanation: 'Alkuluvut 2-50 ovat 2,3,5,7,11,13,17,19,23,29,31,37,41,43,47 - yhteensä 15 kappaletta.',
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
