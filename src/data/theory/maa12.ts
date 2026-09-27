import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA12_K.md in the laudaturakatemia repo).
const maa12Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Määrittely- ja arvojoukko',
    body:
      'Ennen funktion tarkempaa tutkimista on hyvä tietää, mitkä $x$:n arvot funktio hyväksyy ja mitä ' +
      'arvoja se voi tuottaa.\n\n' +
      '- Määrittelyjoukko: kaikki $x$:n arvot, joille funktio on määritelty\n' +
      '- Arvojoukko: kaikki arvot, joita funktio voi saada\n' +
      '- Paloittain määritelty funktio: käyttää eri lauseketta eri osajoukoissa\n\n' +
      'Esimerkki: $f(x) = \\dfrac{1}{x}$ ei ole määritelty kohdassa $x=0$, joten sen määrittelyjoukko on $x \\neq 0$.',
  },
  {
    title: 'Jatkuvuus ja derivoituvuus',
    body:
      'Jatkuva funktio ei "hyppää", ja derivoituva funktio on lisäksi tasainen ilman teräviä kulmia. ' +
      'Näillä ominaisuuksilla on tärkeitä seurauksia funktion käyttäytymiselle.\n\n' +
      '- Funktio on derivoituva pisteessä, jos vasemman- ja oikeanpuoleinen raja-arvo ovat yhtä suuret\n' +
      '- Bolzanon lause: jos jatkuva funktio vaihtaa merkkiä välillä, sillä on nollakohta välissä\n' +
      '- Aidosti monotoninen funktio on koko ajan joko kasvava tai vähenevä, ei koskaan tasainen\n\n' +
      'Bolzanon lausetta käytetään usein osoittamaan, että yhtälöllä on ratkaisu tietyllä välillä, ' +
      'vaikka ratkaisua ei laskettaisi tarkasti.',
  },
  {
    title: 'Käänteisfunktio',
    body:
      'Käänteisfunktio "peruuttaa" alkuperäisen funktion vaikutuksen: jos $f$ vie $x$:n arvoksi $y$, ' +
      'käänteisfunktio vie $y$:n takaisin arvoksi $x$.\n\n' +
      '- Käänteisfunktio $f^{-1}$ saadaan vaihtamalla $x$ ja $y$ keskenään ja ratkaisemalla uusi funktio\n' +
      '- Derivointi: $(f^{-1})\'(y) = \\dfrac{1}{f\'(x)}$, missä $y=f(x)$\n\n' +
      'Esimerkki: Funktion $f(x)=2x+3$ käänteisfunktio on $f^{-1}(x) = \\dfrac{x-3}{2}$.',
  },
  {
    title: 'Raja-arvot ja äärettömyys',
    body:
      'Raja-arvo kertoo, mitä funktio "lähestyy" muuttujan kasvaessa rajatta tai lähestyessä tiettyä ' +
      'kohtaa, vaikka funktiolla ei siinä olisi täsmällistä arvoa.\n\n' +
      '- Rationaalifunktion raja-arvo äärettömyydessä riippuu osoittajan ja nimittäjän asteista\n' +
      '- $e^x \\to \\infty$ ja $e^{-x} \\to 0$, kun $x \\to \\infty$\n' +
      '- Epäoleellinen integraali: integroimisrajana on äärettömyys tai epäjatkuvuuskohta\n' +
      '- Suppeneminen: integraali lähestyy tiettyä arvoa; hajaantuminen: näin ei käy\n\n' +
      'Esimerkki: $\\displaystyle\\int_1^{\\infty} \\frac{1}{x^2}\\,dx$ suppenee arvoon $1$, vaikka integroimisväli on ääretön.',
  },
  {
    title: 'Jakaumat',
    body:
      'Jatkuvan satunnaismuuttujan todennäköisyyksiä kuvataan tiheysfunktiolla, ja normaalijakauma on ' +
      'yleisin ja tärkein esimerkki tällaisesta jakaumasta.\n\n' +
      '- Tiheysfunktio $f$ kuvaa jatkuvan muuttujan todennäköisyysjakaumaa\n' +
      '- Kertymäfunktio: $F(x) = \\displaystyle\\int_{-\\infty}^x f(t)\\,dt$ kertoo todennäköisyyden $X \\le x$\n' +
      '- Normaalijakauma $N(\\mu,\\sigma^2)$ on symmetrinen "kellokäyrä", jota kuvaavat odotusarvo $\\mu$ ja varianssi $\\sigma^2$\n\n' +
      'Esimerkki: Merkintä $X \\sim N(1,2)$ tarkoittaa, että muuttujan $X$ odotusarvo on $1$ ja varianssi $2$.',
  },
]

export default maa12Theory
