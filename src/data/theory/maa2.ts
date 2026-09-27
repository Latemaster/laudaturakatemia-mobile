import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA2_K.md in the laudaturakatemia repo): one
// card per summary section, with added context sentences and fuller worked
// examples on top of the original rule bullets. "Toisen asteen yhtälö" and
// "Diskriminantti" are merged into a single card since they share the
// interactive visual.
const maa2Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Polynomien laskutoimitukset',
    body:
      'Polynomi on lauseke, joka koostuu muuttujan potenssien summista. Polynomeja lasketaan yhteen, ' +
      'vähennetään ja kerrotaan samoin periaattein kuin tavallisia lukuja.\n\n' +
      '- Yhteen- ja vähennyslasku: lasketaan yhteen vain samanasteiset termit (esim. $x^2$-termit erikseen, $x$-termit erikseen)\n' +
      '- Kertolasku: jokainen termi kerrotaan jokaisella toisen polynomin termillä, minkä jälkeen samanasteiset termit yhdistetään\n\n' +
      'Esimerkki: $f(x) = x^2 + 3$, $g(x) = x - 2$\n' +
      '$$f(x) + g(x) = x^2 + x + 1$$\n' +
      '$$f(x) \\cdot g(x) = x^3 - 2x^2 + 3x - 6$$',
  },
  {
    title: 'Arvon määrittäminen',
    body:
      'Funktion arvo tietyssä pisteessä saadaan sijoittamalla muuttujan paikalle annettu luku ja laskemalla ' +
      'lauseke.\n\n' +
      '- Korvaa $x$ annetulla arvolla ja laske lopputulos\n' +
      '- Sijoita negatiiviset luvut aina sulkeisiin: $(-x)^2 \\neq -x^2$\n\n' +
      'Esimerkki: $f(x) = x^2 + 3$\n' +
      '$$f(2) = 2^2 + 3 = 7, \\qquad f(-2) = (-2)^2 + 3 = 7$$',
  },
  {
    title: 'Binomin neliö',
    visual: 'binomial-square',
    body:
      'Binomin neliö on kaava, jolla kahden termin summan tai erotuksen neliö avataan ilman, että lasku ' +
      'tehdään pitkästi sulku kerrallaan.\n\n' +
      '- $(a + b)^2 = a^2 + 2ab + b^2$\n' +
      '- $(a - b)^2 = a^2 - 2ab + b^2$\n' +
      '- Läheinen sukulaiskaava: $(a+b)(a-b) = a^2 - b^2$ (neliöiden erotus)\n\n' +
      'Esimerkki: $(x + 3)^2 = x^2 + 6x + 9$',
  },
  {
    title: 'Neliöjuuri',
    body:
      'Neliöjuuri on toiseen potenssiin korottamisen käänteisoperaatio: se vastaa kysymykseen, mikä ' +
      'epänegatiivinen luku toiseen potenssiin korotettuna antaa luvun $a$.\n\n' +
      '- $\\sqrt{a} = b$ ⇒ $b^2 = a$, kun $a \\ge 0$\n' +
      '- Neliöjuuri on aina epänegatiivinen: $\\sqrt{a} \\ge 0$\n\n' +
      'Esimerkki: $\\sqrt{25} = 5$, koska $5^2 = 25$.',
  },
  {
    title: 'Potenssiyhtälö',
    body:
      'Potenssiyhtälössä tuntematon on kannassa eikä eksponentissa, esimerkiksi $x^3 = 8$.\n\n' +
      '- Muoto: $x^a = b$\n' +
      '- Ratkaise ottamalla vastapotenssi: $x = b^{1/a}$\n' +
      '- Jos $a$ on parillinen, muista molemmat etumerkit: $x^2 = 9 \\Rightarrow x = \\pm 3$\n\n' +
      'Esimerkki: $x^3 = 27 \\Rightarrow x = 27^{1/3} = 3$',
  },
  {
    title: 'Toisen asteen yhtälö ja diskriminantti',
    visual: 'quadratic-discriminant',
    body:
      'Toisen asteen yhtälössä muuttuja esiintyy toisessa potenssissa. Sen ratkaisut löytyvät aina ' +
      'ratkaisukaavalla, ja diskriminantti kertoo etukäteen, montako ratkaisua yhtälöllä on.\n\n' +
      '- Muoto: $ax^2 + bx + c = 0$\n' +
      '- Ratkaistaan kaavalla:\n\n' +
      '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n' +
      '- Diskriminantti $D = b^2 - 4ac$ kertoo ratkaisujen lukumäärän:\n' +
      '- $D > 0$: 2 ratkaisua\n' +
      '- $D = 0$: 1 ratkaisu\n' +
      '- $D < 0$: ei reaaliratkaisuja\n\n' +
      'Esimerkki: $x^2 - 2x - 3 = 0 \\Rightarrow D = 4 + 12 = 16 \\Rightarrow x = \\frac{2 \\pm 4}{2}$, eli $x=3$ tai $x=-1$.',
  },
  {
    title: 'Soveltaminen',
    body:
      'Sanallisissa tehtävissä tilanne käännetään ensin yhtälöksi tuntemattoman avulla, minkä jälkeen ' +
      'yhtälö ratkaistaan tavalliseen tapaan.\n\n' +
      '- Esimerkiksi pinta-ala, hinta tai liike mallinnetaan yhtälöllä\n' +
      '- Tarkista lopuksi, että ratkaisu on tilanteen kannalta järkevä (esim. pituus ei voi olla negatiivinen)\n\n' +
      'Esimerkki: Suorakulmion pinta-ala on $A = x(x+3) = 40$. Yhtälöstä $x^2 + 3x - 40 = 0$ saadaan ' +
      '$x = 5$ tai $x = -8$; jälkimmäinen hylätään, koska sivun pituus ei voi olla negatiivinen.',
  },
  {
    title: 'Tekijöihin jakaminen',
    body:
      'Tekijöihin jakaminen tarkoittaa lausekkeen kirjoittamista tulona. Se helpottaa yhtälöiden ' +
      'ratkaisua ja lausekkeiden sieventämistä.\n\n' +
      '- Yhtälön ratkaiseminen helpottuu, kun lauseke jaetaan tekijöihin\n' +
      '- Tunnista tuttu kaava, esim. neliöiden erotus $a^2 - b^2 = (a-b)(a+b)$\n\n' +
      'Esimerkki: $x^2 - 4 = (x - 2)(x + 2)$',
  },
  {
    title: 'Funktion nollakohdat',
    body:
      'Funktion nollakohta on se $x$:n arvo, jossa funktion kuvaaja leikkaa x-akselin eli funktion arvo ' +
      'on nolla.\n\n' +
      '- Ratkaise yhtälö $f(x) = 0$\n\n' +
      'Esimerkki: $f(x) = x - 3$. Nollakohta on $x = 3$, koska $f(3) = 0$.',
  },
  {
    title: 'Juurifunktio ja -yhtälö',
    body:
      'Juurifunktio $f(x) = \\sqrt{x}$ on määritelty vain, kun $x \\ge 0$. Juuriyhtälöä ratkaistaessa ' +
      'juuri poistetaan korottamalla yhtälön molemmat puolet neliöön.\n\n' +
      '- Esimerkki funktiosta: $f(x) = \\sqrt{x}$\n' +
      '- Juuriyhtälö ratkaistaan neliöimällä: $\\sqrt{x+1} = 3 \\Rightarrow x + 1 = 9 \\Rightarrow x = 8$\n' +
      '- Tarkista aina ratkaisu alkuperäisestä yhtälöstä, sillä neliöiminen voi tuoda ylimääräisiä ratkaisuja',
  },
  {
    title: 'Rationaalifunktio ja -yhtälö',
    body:
      'Rationaalifunktio on kahden polynomin osamäärä. Nimittäjä ei koskaan saa olla nolla.\n\n' +
      '- Murtolausekkeet, esimerkiksi $\\frac{1}{x+1}$, missä $x \\neq -1$\n' +
      '- Nimittäjät poistetaan ristiinkertomalla\n\n' +
      'Esimerkki: $\\frac{1}{x+1} = \\frac{1}{3} \\Rightarrow x + 1 = 3 \\Rightarrow x = 2$',
  },
  {
    title: 'Tulon nollasääntö',
    body:
      'Tulon nollasääntö on peruste tekijöihinjaon avulla ratkaisemiselle: tulo voi olla nolla vain, jos ' +
      'jokin sen tekijöistä on nolla.\n\n' +
      '- Jos $ab = 0$, niin $a = 0$ tai $b = 0$\n\n' +
      'Esimerkki: $(x - 2)(x + 5) = 0 \\Rightarrow x = 2$ tai $x = -5$',
  },
  {
    title: 'Korkeamman asteen yhtälöt',
    body:
      'Kolmannen tai korkeamman asteen yhtälöitä ratkaistaan usein jakamalla lauseke tekijöihin ja ' +
      'soveltamalla tulon nollasääntöä.\n\n' +
      '- Pyritään jakamaan tekijöihin\n\n' +
      'Esimerkki: $x^3 - x = x(x-1)(x+1) = 0 \\Rightarrow x = 0, \\ x = 1$ tai $x = -1$',
  },
]

export default maa2Theory
