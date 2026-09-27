import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä. Note: the
// laudaturakatemia repo's course numbering is shifted by one for MAA6-8 -
// this mobile course (MAA6: Derivaatta) is authored from that repo's
// public/content/Tiivistelmä/MAA7_K.md, whose own heading confirms it is
// "Derivaatta ja sen sovellukset" content.
const maa6Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Derivaatan määritelmä',
    visual: 'secant-to-tangent',
    body:
      'Derivaatta kuvaa funktion muutosnopeutta tietyssä pisteessä - kuinka nopeasti funktion arvo ' +
      'muuttuu, kun $x$ muuttuu hieman.\n\n' +
      '- Määritelmä: $f\'(x) = \\displaystyle\\lim_{h \\to 0} \\dfrac{f(x+h) - f(x)}{h}$\n' +
      '- Geometrisesti $f\'(x)$ on käyrän tangentin kulmakerroin pisteessä $x$\n\n' +
      'Esimerkki: Jos $f(x) = x^2$, derivaatan määritelmä antaa $f\'(x) = 2x$, joten $f\'(3) = 6$.',
  },
  {
    title: 'Derivointisäännöt',
    visual: 'power-rule-graph',
    body:
      'Käytännössä derivaattaa ei lasketa raja-arvon määritelmästä joka kerta, vaan valmiilla säännöillä.\n\n' +
      '- Vakion derivaatta: $\\dfrac{d}{dx}[c] = 0$\n' +
      '- Potenssisääntö: $\\dfrac{d}{dx}[x^n] = nx^{n-1}$\n' +
      '- Summa- ja erotussääntö: $\\dfrac{d}{dx}[f \\pm g] = f\' \\pm g\'$\n' +
      '- Tulon derivaatta: $\\dfrac{d}{dx}[fg] = f\'g + fg\'$\n' +
      '- Osamäärän derivaatta: $\\dfrac{d}{dx}\\left[\\dfrac{f}{g}\\right] = \\dfrac{f\'g - fg\'}{g^2}$\n\n' +
      'Esimerkki: $f(x) = x^3 + 2x$, jolloin $f\'(x) = 3x^2 + 2$.',
  },
  {
    title: 'Käyrän tangentti',
    visual: 'tangent-line',
    body:
      'Tangentti on suora, joka koskettaa käyrää yhdessä pisteessä ja jolla on sama kulmakerroin kuin ' +
      'funktiolla siinä pisteessä.\n\n' +
      '- Tangentin kulmakerroin pisteessä $x=a$ on $f\'(a)$\n' +
      '- Tangentin yhtälö: $y - f(a) = f\'(a)(x-a)$\n\n' +
      'Esimerkki: $f(x)=x^2$ pisteessä $x=2$: $f(2)=4$, $f\'(2)=4$, joten tangentti on ' +
      '$y - 4 = 4(x-2) \\Rightarrow y = 4x - 4$.',
  },
  {
    title: 'Ääriarvot',
    visual: 'extrema-graph',
    body:
      'Funktion suurin ja pienin arvo (huippukohdat) löytyvät kohdista, joissa käyrän kulkusuunta ' +
      'vaihtuu - eli derivaatta on nolla.\n\n' +
      '- Ääriarvot löytyvät derivaatan nollakohdista: $f\'(x) = 0$\n' +
      '- Tutki derivaatan etumerkin vaihtelua: $+ \\to -$ tarkoittaa maksimia, $- \\to +$ tarkoittaa minimiä\n\n' +
      'Esimerkki: $f(x) = x^2 - 4x$: $f\'(x) = 2x-4 = 0 \\Rightarrow x=2$. Koska $f\'$ vaihtuu negatiivisesta ' +
      'positiiviseksi kohdassa $x=2$, kyseessä on minimi.',
  },
]

export default maa6Theory
