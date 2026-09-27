import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA5_K.md in the laudaturakatemia repo).
// Closely related short sections are merged into fewer, richer boxes.
const maa5Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Radiaanit ja yksikköympyrä',
    visual: 'unit-circle',
    body:
      'Radiaani on kulman mittayksikkö, jossa koko ympyrän kierros vastaa $2\\pi$ radiaania. ' +
      'Yksikköympyrän (säde 1, keskipiste origossa) avulla sini ja kosini voidaan lukea suoraan pisteen ' +
      'koordinaateista.\n\n' +
      '- Muunnos: $180^\\circ = \\pi$ rad, eli $1^\\circ = \\dfrac{\\pi}{180}$ rad ja $1$ rad $= \\dfrac{180^\\circ}{\\pi}$\n' +
      '- Yksikköympyrän pisteessä kulman $\\theta$ kohdalla: $x = \\cos\\theta$, $y = \\sin\\theta$\n\n' +
      'Esimerkki: $90^\\circ$ vastaa $\\dfrac{\\pi}{2}$ rad, ja tässä kulmassa piste on $(\\cos 90^\\circ, \\sin 90^\\circ) = (0, 1)$.',
  },
  {
    title: 'Vastakulmat, suplementtikulmat ja jaksollisuus',
    visual: 'angle-symmetry',
    body:
      'Tietyt kulmaparit tuottavat suoraan toisiinsa liittyviä sini- ja kosiniarvoja, ja koko funktio ' +
      'toistuu säännöllisin väliajoin.\n\n' +
      '- Vastakulmat (summa $180^\\circ$): $\\sin(180^\\circ - x) = \\sin x$, $\\cos(180^\\circ - x) = -\\cos x$\n' +
      '- Suplementtikulmat (summa $360^\\circ$): $\\sin(360^\\circ - x) = -\\sin x$, $\\cos(360^\\circ - x) = \\cos x$\n' +
      '- Jaksollisuus: $\\sin(x+2\\pi) = \\sin x$ ja $\\cos(x+2\\pi) = \\cos x$\n\n' +
      'Esimerkki: $\\sin(150^\\circ) = \\sin(180^\\circ - 150^\\circ) = \\sin 30^\\circ = \\frac12$.',
  },
  {
    title: 'Tangentti',
    visual: 'tangent-graph',
    body:
      'Tangentti kertoo sinin ja kosinin suhteen, ja se ei ole määritelty niissä kulmissa, joissa kosini on nolla.\n\n' +
      '- $\\tan x = \\dfrac{\\sin x}{\\cos x}$\n' +
      '- Ei määritelty, kun $\\cos x = 0$, esim. $x = 90^\\circ, 270^\\circ, \\dots$\n\n' +
      'Esimerkki: $\\tan 45^\\circ = \\dfrac{\\sin 45^\\circ}{\\cos 45^\\circ} = \\dfrac{\\frac{\\sqrt2}{2}}{\\frac{\\sqrt2}{2}} = 1$.',
  },
  {
    title: 'Trigonometriset yhtälöt',
    visual: 'sine-equation-graph',
    body:
      'Trigonometrinen yhtälö ratkeaa yleensä useaan ratkaisuun funktion jaksollisuuden takia, joten ' +
      'vastaukseen lisätään kokonaislukukerrannainen jaksosta.\n\n' +
      '- Esimerkki yhtälöstä: $\\sin x = \\frac12$\n' +
      '- Ratkaisut: $x = \\dfrac{\\pi}{6} + 2k\\pi$ tai $x = \\dfrac{5\\pi}{6} + 2k\\pi$, missä $k \\in \\mathbb{Z}$\n\n' +
      'Tarkista aina ratkaisut sijoittamalla ne takaisin alkuperäiseen yhtälöön, ja rajaa vastaukset ' +
      'annetulle välille, jos tehtävä sitä pyytää.',
  },
  {
    title: 'Trigonometristen funktioiden kuvaajat',
    visual: 'sine-wave-params',
    body:
      'Sini, kosini ja tangentti tunnistaa kuvaajistaan, ja kertoimet muuttavat kuvaajan muotoa ' +
      'ennustettavalla tavalla.\n\n' +
      '- $\\sin$ ja $\\cos$ ovat aaltomaisia; $\\tan$ on jaksollinen mutta sisältää pystysuoria asymptootteja\n' +
      '- Muodossa $A\\sin(Bx)$: $A$ vaikuttaa amplitudiin (aallon korkeuteen)\n' +
      '- $B$ vaikuttaa jakson pituuteen: pienempi $B$ venyttää kuvaajaa, suurempi tiivistää sitä\n\n' +
      'Esimerkki: $2\\sin(x)$ heilahtelee välillä $[-2, 2]$ tavallisen $[-1,1]$ sijaan, koska amplitudi on $2$.',
  },
  {
    title: 'Logaritmin määritelmä ja merkinnät',
    visual: 'log-point-graph',
    body:
      'Logaritmi on eksponenttifunktion käänteisfunktio: se vastaa kysymykseen, mihin potenssiin kanta ' +
      'pitää korottaa, jotta saadaan haluttu luku.\n\n' +
      '- Määritelmä: $\\log_a(x) = y \\iff a^y = x$\n' +
      '- $\\lg(x)$: kymmenkantainen logaritmi ($a=10$)\n' +
      '- $\\ln(x)$: luonnollinen logaritmi ($a=e$)\n\n' +
      'Esimerkki: $\\log_2(8) = 3$, koska $2^3 = 8$.',
  },
  {
    title: 'Logaritmin ja murtopotenssien laskusäännöt',
    visual: 'log-rule-check',
    body:
      'Logaritmin laskusäännöt vastaavat potenssien laskusääntöjä, ja murtopotenssit yhdistävät juuret ja potenssit.\n\n' +
      '- $\\log_a(xy) = \\log_a x + \\log_a y$\n' +
      '- $\\log_a\\left(\\dfrac{x}{y}\\right) = \\log_a x - \\log_a y$\n' +
      '- $\\log_a(x^b) = b\\log_a x$\n' +
      '- Murtopotenssit: $x^{1/2} = \\sqrt{x}$, $x^{m/n} = \\sqrt[n]{x^m}$\n\n' +
      'Esimerkki: $\\log_{10}(200) = \\log_{10}(2) + \\log_{10}(100) = \\log_{10}(2) + 2$.',
  },
  {
    title: 'Eksponentti- ja logaritmifunktio',
    visual: 'exp-log-mirror',
    body:
      'Eksponenttifunktio ja logaritmifunktio ovat toistensa käänteisfunktioita, ja niiden kuvaajat ' +
      'peilautuvat suoran $y=x$ suhteen.\n\n' +
      '- Eksponenttifunktio: $f(x) = a^x$, $a > 0$: kasvava, jos $a>1$, laskeva, jos $0<a<1$\n' +
      '- Logaritmifunktio on eksponenttifunktion käänteisfunktio: kasvava kuvaaja, joka leikkaa x-akselin kohdassa $x=1$\n\n' +
      'Esimerkki: $f(x)=2^x$ ja $g(x)=\\log_2 x$ ovat toistensa käänteisfunktioita: $f(3)=8$ ja $g(8)=3$.',
  },
  {
    title: 'Eksponentti- ja logaritmiyhtälöt',
    visual: 'exp-equation-graph',
    body:
      'Eksponenttiyhtälössä tuntematon on eksponentissa ja se ratkaistaan logaritmin avulla; ' +
      'logaritmiyhtälö taas puretaan kääntämällä se eksponenttimuotoon.\n\n' +
      '- Eksponenttiyhtälö $a^x = b$ ratkeaa: $x = \\log_a b = \\dfrac{\\ln b}{\\ln a}$\n' +
      '- Logaritmiyhtälö $\\log_a x = b$ ratkeaa: $x = a^b$\n\n' +
      'Esimerkki: $3^x = 20 \\Rightarrow x = \\dfrac{\\ln 20}{\\ln 3} \\approx 2{,}73$.',
  },
]

export default maa5Theory
