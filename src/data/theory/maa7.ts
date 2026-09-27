import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä. Note: the
// laudaturakatemia repo's course numbering is shifted by one for MAA6-8 -
// this mobile course (MAA7: Integraalilaskenta) is authored from that
// repo's public/content/Tiivistelmä/MAA8_K.md, whose own heading confirms
// it is "Integraalilaskenta" content.
const maa7Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Integraalin määritelmä',
    body:
      'Integraali kuvaa funktion kuvaajan ja x-akselin väliin jäävää pinta-alaa, ja se lasketaan ' +
      'derivoinnin käänteisoperaationa.\n\n' +
      '- Määritelmä äärettömän monen suikaleen summan raja-arvona:\n\n' +
      '$$\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^n f(x_i^*)\\Delta x$$\n\n' +
      'Käytännössä integraali lasketaan etsimällä funktion integraalifunktio ja sijoittamalla rajat.',
  },
  {
    title: 'Perusintegraalit',
    body:
      'Integrointi on derivoinnin käänteisoperaatio, joten integraalifunktion oikeellisuuden voi aina ' +
      'tarkistaa derivoimalla se takaisin.\n\n' +
      '- Vakion integraali: $\\displaystyle\\int c\\,dx = cx + C$\n' +
      '- Potenssisääntö: $\\displaystyle\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C$, kun $n \\neq -1$\n\n' +
      'Esimerkki: $\\displaystyle\\int x^2\\,dx = \\dfrac{x^3}{3} + C$. Tarkistus: $\\dfrac{d}{dx}\\left[\\dfrac{x^3}{3}\\right] = x^2$.',
  },
  {
    title: 'Osittaisintegrointi',
    body:
      'Osittaisintegrointia käytetään, kun integroitava on kahden funktion tulo eikä perusintegraaleilla ' +
      'pärjätä suoraan.\n\n' +
      '- Kaava: $\\displaystyle\\int u\\,dv = uv - \\int v\\,du$\n\n' +
      'Menetelmässä valitaan $u$ ja $dv$ niin, että jäljelle jäävä integraali $\\int v\\,du$ on ' +
      'alkuperäistä helpompi ratkaista.',
  },
  {
    title: 'Käyrän pinta-ala',
    body:
      'Määrätty integraali antaa suoraan käyrän ja x-akselin väliin jäävän pinta-alan välillä $[a,b]$.\n\n' +
      '- Pinta-ala: $A = \\displaystyle\\int_a^b f(x)\\,dx$, kun $f(x) \\ge 0$ välillä $[a,b]$\n\n' +
      'Esimerkki: Käyrän $y = x^2$ ja x-akselin väliin jäävä pinta-ala välillä $[0,2]$ on ' +
      '$\\int_0^2 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{8}{3}$.',
  },
  {
    title: 'Tilavuus pyörähdyskappaleesta',
    body:
      'Kun käyrän ja x-akselin välinen alue pyörähtää x-akselin ympäri, syntyy pyörähdyskappale, jonka ' +
      'tilavuus lasketaan integroimalla.\n\n' +
      '- Tilavuus: $V = \\pi\\displaystyle\\int_a^b [f(x)]^2\\,dx$\n\n' +
      'Esimerkki: Käyrän $y=\\sqrt{x}$ pyörähtäessä x-akselin ympäri välillä $[0,4]$ syntyvän kappaleen ' +
      'tilavuus on $V = \\pi\\int_0^4 x\\,dx = \\pi\\left[\\frac{x^2}{2}\\right]_0^4 = 8\\pi$.',
  },
]

export default maa7Theory
