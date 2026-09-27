import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA9_K.md in the laudaturakatemia repo).
const maa9Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Rekursiivinen, aritmeettinen ja geometrinen lukujono',
    visual: 'sequence-bars',
    body:
      'Lukujono voidaan määritellä sen edellisten jäsenten avulla (rekursiivisesti) tai suoraan ' +
      'kaavalla. Kaksi tärkeintä lukujonotyyppiä ovat aritmeettinen ja geometrinen.\n\n' +
      '- Rekursiivinen jono: $a_n = a_{n-1} + d$ (seuraava jäsen edellisestä)\n' +
      '- Aritmeettinen jono (vakioerotus $d$): $a_n = a_1 + (n-1)d$\n' +
      '- Geometrinen jono (vakiosuhde $r$): $a_n = a_1 \\cdot r^{n-1}$\n\n' +
      'Esimerkki: Aritmeettisessa jonossa $a_1=3$, $d=4$: $a_5 = 3 + 4\\cdot4 = 19$. Geometrisessa jonossa ' +
      '$a_1=2$, $r=3$: $a_4 = 2\\cdot3^3 = 54$.',
  },
  {
    title: 'Aritmeettinen ja geometrinen summa',
    visual: 'series-sum',
    body:
      'Lukujonon ensimmäisten jäsenten summa voidaan laskea suoraan kaavalla ilman, että kaikkia ' +
      'jäseniä lasketaan yhteen erikseen.\n\n' +
      '- Aritmeettinen summa: $S_n = \\dfrac{n}{2}(a_1+a_n) = \\dfrac{n}{2}(2a_1+(n-1)d)$\n' +
      '- Geometrinen summa: $S_n = a_1\\dfrac{1-r^n}{1-r}$, kun $r \\neq 1$\n\n' +
      'Esimerkki: Jonon $2,4,6,\\dots,20$ summa on $S_{10} = \\frac{10}{2}(2+20) = 110$.',
  },
  {
    title: 'Korkoa korolle',
    visual: 'compound-interest',
    body:
      'Korkoa korolle -ilmiössä pääoma kasvaa geometrisen lukujonon tavoin, koska joka jaksolla ' +
      'kasvu lasketaan jo kasvaneesta pääomasta.\n\n' +
      '- Pääoman kasvu ajan $t$ jälkeen: $A = A_0(1+r)^t$, missä $A_0$ on alkupääoma ja $r$ korkoprosentti desimaalina\n\n' +
      'Esimerkki: $1000\\,€$ kasvaa $3\\,\\%$ vuosikorolla viidessä vuodessa summaksi ' +
      '$A = 1000\\cdot1{,}03^5 \\approx 1159{,}27\\,€$.',
  },
  {
    title: 'Tasaerälaina ja tasalyhennyslaina',
    visual: 'loan-comparison',
    body:
      'Lainan takaisinmaksu voidaan järjestää kahdella tavalla riippuen siitä, pysyykö maksuerä vai ' +
      'lyhennys vakiona.\n\n' +
      '- Tasaerälaina: lyhennyksen ja koron summa (maksuerä) pysyy vakiona koko laina-ajan\n' +
      '  $$A = \\frac{Pr(1+r)^n}{(1+r)^n - 1}$$\n' +
      '  missä $P$ on lainapääoma, $r$ korko per jakso ja $n$ maksuerien määrä\n' +
      '- Tasalyhennyslaina: lyhennys pysyy samana, mutta koron osuus ja siten maksuerä pienenee ajan myötä\n\n' +
      'Tasalyhennyslainassa maksetaan yleensä hieman vähemmän korkoa yhteensä, koska jäljellä oleva ' +
      'pääoma pienenee nopeammin alussa.',
  },
]

export default maa9Theory
