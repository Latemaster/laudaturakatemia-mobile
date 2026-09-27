import type { LessonCard } from '../../types'

// Restructured from the course site's Tiivistelmä (public/content/Tiivistelmä/MAA2_K.md
// in the laudaturakatemia repo): one card per summary section, kept close to the
// source wording. "Toisen asteen yhtälö" and "Diskriminantti" are merged into a
// single card since they share the interactive visual.
const maa2Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Polynomien laskutoimitukset',
    body:
      '- Yhteenlasku: laske saman asteen termit yhteen\n' +
      '- Kertolasku: jokainen termi kerrotaan jokaisella toisesta polynomista\n\n' +
      'Esimerkki: $f(x) = x^2 + 3$, $g(x) = x - 2$\n' +
      '$$f(x) + g(x) = x^2 + x + 1$$',
  },
  {
    title: 'Arvon määrittäminen',
    body: '- Korvaa $x$ annetulla arvolla ja laske\n\nEsimerkki: $f(2) = 2^2 + 3 = 7$',
  },
  {
    title: 'Binomin neliö',
    visual: 'binomial-square',
    body: '- $(a + b)^2 = a^2 + 2ab + b^2$\n- $(a - b)^2 = a^2 - 2ab + b^2$',
  },
  {
    title: 'Neliöjuuri',
    body: '- $\\sqrt{a} = b$ ⇒ $b^2 = a$',
  },
  {
    title: 'Potenssiyhtälö',
    body: '- Muoto: $x^a = b$\n- Ratkaise ottamalla vastapotenssi: $x = b^{1/a}$',
  },
  {
    title: 'Toisen asteen yhtälö ja diskriminantti',
    visual: 'quadratic-discriminant',
    body:
      '- Muoto: $ax^2 + bx + c = 0$\n' +
      '- Ratkaistaan kaavalla:\n\n' +
      '$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n' +
      '- Diskriminantti $D = b^2 - 4ac$ kertoo ratkaisujen lukumäärän:\n' +
      '- $D > 0$: 2 ratkaisua\n' +
      '- $D = 0$: 1 ratkaisu\n' +
      '- $D < 0$: ei reaaliratkaisuja',
  },
  {
    title: 'Soveltaminen',
    body: '- Esimerkiksi pinta-ala, hinta tai liike mallinnetaan yhtälöllä ja ratkaistaan',
  },
  {
    title: 'Tekijöihin jakaminen',
    body:
      '- Yhtälön ratkaiseminen helpottuu, kun lauseke jaetaan tekijöihin\n\n' +
      'Esimerkki: $x^2 - 4 = (x - 2)(x + 2)$',
  },
  {
    title: 'Funktion nollakohdat',
    body: '- Nollakohdat ratkaistaan yhtälöstä $f(x) = 0$',
  },
  {
    title: 'Juurifunktio ja -yhtälö',
    body:
      '- Esimerkki: $f(x) = \\sqrt{x}$\n' +
      '- Juuriyhtälö ratkaistaan neliöimällä: $\\sqrt{x+1} = 3 \\Rightarrow x + 1 = 9$',
  },
  {
    title: 'Rationaalifunktio ja -yhtälö',
    body: '- Murtolausekkeet, esimerkiksi $\\frac{1}{x+1}$\n- Nimittäjät poistetaan ristiinkertomalla',
  },
  {
    title: 'Tulon nollasääntö',
    body: '- Jos $ab = 0$, niin $a = 0$ tai $b = 0$',
  },
  {
    title: 'Korkeamman asteen yhtälöt',
    body: '- Pyritään jakamaan tekijöihin\n\nEsimerkki: $x^3 - x = x(x - 1)(x + 1)$',
  },
]

export default maa2Theory
