import type { DistributiveOmit, ExerciseCard } from '../../types'

// Exercises for the lecture topics in theory/maa11.ts. The entries without a
// conceptIndex pair up with the concept boxes in order, one per concept;
// the extra quick multiple-choice questions carry an explicit conceptIndex
// and sit right after their sibling.
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
    // Topic: Algoritmi, silmukka ja vuokaavio (quick)
    conceptIndex: 0,
    kind: 'choice',
    question: 'Mikä perusrakenne vastaa ohjetta "jos ehto pätee, tee A, muuten tee B"?',
    options: [
      { id: 'a', text: 'Peräkkäisyys', correct: false },
      { id: 'b', text: 'Toisto', correct: false },
      { id: 'c', text: 'Valinta', correct: true },
      { id: 'd', text: 'Rekursio', correct: false },
    ],
    explanation: 'Valinnassa ohjelma haarautuu ehdon perusteella; vuokaaviossa se piirretään timanttikuviona.',
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
    // Topic: Logiikka (quick)
    conceptIndex: 1,
    kind: 'choice',
    question: 'Milloin konjunktio p ∧ q on tosi?',
    options: [
      { id: 'a', text: 'Kun ainakin toinen on tosi', correct: false },
      { id: 'b', text: 'Vain kun molemmat ovat tosia', correct: true },
      { id: 'c', text: 'Kun p on epätosi', correct: false },
      { id: 'd', text: 'Aina', correct: false },
    ],
    explanation: '"Ja"-lause vaatii molemmat osaväitteet tosiksi; "ainakin toinen" kuvaa disjunktiota p ∨ q.',
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
    // Topic: Jaollisuus ja kongruenssi (quick)
    conceptIndex: 2,
    kind: 'choice',
    question: 'Mikä on jakojäännös, kun 29 jaetaan luvulla 6?',
    options: [
      { id: 'a', text: '4', correct: false },
      { id: 'b', text: '3', correct: false },
      { id: 'c', text: '0', correct: false },
      { id: 'd', text: '5', correct: true },
    ],
    explanation: 'Jakoyhtälö: 29 = 6·4 + 5, joten jakojäännös on 5 eli 29 ≡ 5 (mod 6).',
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
    // Topic: Tekijät, SYT ja PYM (quick)
    conceptIndex: 3,
    kind: 'choice',
    question: 'Mikä on PYM(4, 6) eli lukujen 4 ja 6 pienin yhteinen monikerta?',
    options: [
      { id: 'a', text: '2', correct: false },
      { id: 'b', text: '24', correct: false },
      { id: 'c', text: '12', correct: true },
      { id: 'd', text: '10', correct: false },
    ],
    explanation: 'Luvun 4 monikerrat 4, 8, 12, … ja luvun 6 monikerrat 6, 12, …: pienin yhteinen on 12. (SYT(4, 6) = 2 ja 4·6/2 = 12.)',
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
    // Topic: Alkuluvut (quick)
    conceptIndex: 4,
    kind: 'choice',
    question: 'Mikä seuraavista luvuista on alkuluku?',
    options: [
      { id: 'a', text: '29', correct: true },
      { id: 'b', text: '21', correct: false },
      { id: 'c', text: '27', correct: false },
      { id: 'd', text: '33', correct: false },
    ],
    explanation: '21 = 3·7, 27 = 3³ ja 33 = 3·11, mutta luvulla 29 ei ole muita tekijöitä kuin 1 ja 29.',
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
  {
    // Topic: Ohjelmointi (Python) (quick)
    conceptIndex: 5,
    kind: 'choice',
    question: 'Mikä on lausekkeen 2 ** 3 arvo Pythonissa?',
    options: [
      { id: 'a', text: '6', correct: false },
      { id: 'b', text: '8', correct: true },
      { id: 'c', text: '9', correct: false },
      { id: 'd', text: '5', correct: false },
    ],
    explanation: 'Pythonissa ** on potenssioperaattori: 2 ** 3 = 2³ = 8. Kertolasku 2 * 3 antaisi 6.',
  },
]

export default maa11Exercises
