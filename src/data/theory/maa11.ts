import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA11_K.md in the laudaturakatemia repo).
const maa11Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Algoritmi, silmukka ja vuokaavio',
    body:
      'Algoritmi on tarkka, yksikäsitteinen ohjeiden sarja, joka koostuu kolmesta perusrakenteesta. ' +
      'Vuokaavio esittää algoritmin kaaviomaisesti.\n\n' +
      '- Peräkkäisyys: toimenpiteet suoritetaan yksi kerrallaan järjestyksessä\n' +
      '- Toisto (silmukka): tiettyjä vaiheita toistetaan ehdon täyttyessä\n' +
      '- Valinta: ohjelma haarautuu ehdon perusteella\n\n' +
      'Vuokaavio kuvaa nämä rakenteet visuaalisesti: nuolet osoittavat suoritusjärjestyksen ja ' +
      'timanttikuviot ehtoja, joista haarat lähtevät.',
  },
  {
    title: 'Logiikka',
    body:
      'Logiikassa väitelauseita yhdistetään konnektiiveilla, ja lausekkeen totuusarvo lasketaan ' +
      'kiinteän laskujärjestyksen mukaan.\n\n' +
      '- Negaatio ($\\neg$): väitteen kieltäminen\n' +
      '- Konjunktio ($\\land$, "ja"), disjunktio ($\\lor$, "tai")\n' +
      '- Implikaatio ($\\to$, "jos... niin"), ekvivalenssi ($\\leftrightarrow$, "jos ja vain jos")\n' +
      '- Laskujärjestys: ensin sulut, sitten negaatio, konjunktio, disjunktio\n' +
      '- Tautologia: väitelause, joka on aina tosi riippumatta osaväitteiden totuusarvoista\n\n' +
      'Esimerkki: Lause $A \\lor \\neg A$ on tautologia, koska se on aina tosi riippumatta $A$:n totuusarvosta.',
  },
  {
    title: 'Jaollisuus ja kongruenssi',
    body:
      'Jakoyhtälö kuvaa, kuinka mikä tahansa kokonaisluku voidaan jakaa toisella jäljelle jäävän ' +
      'jakojäännöksen kanssa. Kongruenssi vertaa kahden luvun jakojäännöksiä.\n\n' +
      '- Jakoyhtälö: $a = bq + r$, missä $0 \\le r < b$\n' +
      '- Kongruenssi: $a \\equiv b \\pmod{n}$, jos $n \\mid (a-b)$\n' +
      '- Kongruenssin laskusäännöt: $a+c \\equiv b+d \\pmod n$ ja $ac \\equiv bd \\pmod n$, kun $a\\equiv b$ ja $c\\equiv d$\n\n' +
      'Esimerkki: $17 = 5\\cdot3 + 2$, joten $17 \\equiv 2 \\pmod 5$.',
  },
  {
    title: 'Tekijät, SYT ja PYM',
    body:
      'Kahden luvun suurin yhteinen tekijä ja pienin yhteinen monikerta lasketaan tehokkaasti ' +
      'Eukleideen algoritmilla, ilman että kaikkia tekijöitä tarvitsee etsiä käsin.\n\n' +
      '- SYT: suurin yhteinen tekijä, PYM: pienin yhteinen monikerta\n' +
      '- Eukleideen algoritmi laskee SYT:n peräkkäisillä jakolaskuilla\n' +
      '- Diofantoksen yhtälö $ax+by=c$ ratkaistaan kokonaisluvuilla\n\n' +
      'Esimerkki: SYT(48, 18): $48 = 2\\cdot18+12$, $18=1\\cdot12+6$, $12=2\\cdot6+0$, joten SYT $=6$.',
  },
  {
    title: 'Alkuluvut',
    body:
      'Alkuluvut ovat lukuteorian rakennuspalikoita: jokainen ykköstä suurempi kokonaisluku voidaan ' +
      'jakaa alkulukujen tuloksi täsmälleen yhdellä tavalla.\n\n' +
      '- Alkuluku: luku, jolla on vain kaksi positiivista tekijää (1 ja luku itse)\n' +
      '- Aritmetiikan peruslause: jokaisella $n>1$ on yksikäsitteinen alkutekijähajotelma\n' +
      '- Eratostheneen seula on menetelmä alkulukujen löytämiseen tietyltä väliltä\n\n' +
      'Esimerkki: $60 = 2^2 \\cdot 3 \\cdot 5$ on luvun $60$ yksikäsitteinen alkutekijähajotelma.',
  },
  {
    title: 'Ohjelmointi (Python)',
    body:
      'Ohjelmoinnissa algoritmit kirjoitetaan koodiksi, jota tietokone suorittaa rivi riviltä.\n\n' +
      '- Tietotyypit: kokonaisluku (`int`), liukuluku (`float`), merkkijono (`"teksti"`), totuusarvo (`True`/`False`)\n' +
      '- Laskuoperaatiot: `+`, `-`, `*`, `/`, `**` (potenssi)\n' +
      '- Vertailuoperaattorit: `==`, `!=`, `<`, `>`, `<=`, `>=`\n' +
      '- Ehtolause: `if`, `elif`, `else` toteuttaa valinnan\n\n' +
      'Esimerkki: `x = 3` luo kokonaislukumuuttujan, ja `if x > 0: print("positiivinen")` tulostaa tekstin ehdon täyttyessä.',
  },
]

export default maa11Theory
