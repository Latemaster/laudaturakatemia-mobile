import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA3_K.md in the laudaturakatemia repo).
// Closely related short sections are merged into fewer, richer boxes.
const maa3Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Yksikkömuutokset ja mittakaava',
    body:
      'Yksikkömuutokset tehdään kertomalla tai jakamalla muunnoskertoimella. Mittakaava kertoo, kuinka ' +
      'suuri jokin esitys (esim. kartta tai pienoismalli) on suhteessa todelliseen kohteeseen.\n\n' +
      '- Pituusyksiköt: $1\\,\\text{m} = 10\\,\\text{dm} = 100\\,\\text{cm} = 1000\\,\\text{mm}$, ja $1\\,\\text{km} = 1000\\,\\text{m}$\n' +
      '- Mittakaava 1:5000 tarkoittaa, että 1 cm kartalla vastaa 5000 cm eli 50 m todellisuudessa\n' +
      '- Pinta-ala muuttuu mittakaavan neliössä: $A_2 = A_1 \\cdot k^2$\n' +
      '- Tilavuus muuttuu mittakaavan kuutiossa: $V_2 = V_1 \\cdot k^3$\n\n' +
      'Esimerkki: Jos pienoismallin mittakaava on $k = \\frac{1}{20}$ ja mallin pinta-ala on $5\\,\\text{cm}^2$, ' +
      'todellinen pinta-ala on $5 \\cdot 20^2 = 2000\\,\\text{cm}^2$.',
  },
  {
    title: 'Kulmien tyypit ja ominaisuudet',
    body:
      'Kulmat luokitellaan suuruutensa mukaan, ja niiden väliset suhteet auttavat päättelemään ' +
      'tuntemattomia kulmia kuviosta.\n\n' +
      '- Terävä kulma: $0^\\circ < \\theta < 90^\\circ$\n' +
      '- Suora kulma: $\\theta = 90^\\circ$\n' +
      '- Tylppä kulma: $90^\\circ < \\theta < 180^\\circ$\n' +
      '- Oikokulma: $\\theta = 180^\\circ$, täysi kulma: $\\theta = 360^\\circ$\n' +
      '- Vieruskulmat jakavat yhteisen kyljen ja niiden summa on $180^\\circ$\n\n' +
      'Esimerkki: Jos kaksi vieruskulmaa ovat $\\alpha$ ja $65^\\circ$, niin $\\alpha = 180^\\circ - 65^\\circ = 115^\\circ$.',
  },
  {
    title: 'Yhdensuuntaisuus ja yhdenmuotoisuus',
    body:
      'Yhdensuuntaiset suorat eivät koskaan leikkaa toisiaan, ja niillä on sama kulmakerroin. ' +
      'Yhdenmuotoiset kuviot taas näyttävät samalta mutta ovat eri kokoisia.\n\n' +
      '- Kaksi suoraa ovat yhdensuuntaisia, jos niiden kulmakerroin on sama\n' +
      '- Kuviot ovat yhdenmuotoisia, jos vastaavat kulmat ovat yhtä suuret ja sivujen suhteet yhtäläiset\n' +
      '- Yhdenmuotoisuutta käytetään tuntemattomien sivujen laskemiseen verrannon avulla\n\n' +
      'Esimerkki: Jos kolmiot ovat yhdenmuotoiset suhteessa $2:3$ ja pienemmän kolmion sivu on $4$ cm, ' +
      'vastaava sivu suuremmassa kolmiossa on $4 \\cdot \\frac{3}{2} = 6$ cm.',
  },
  {
    title: 'Kolmion perusominaisuudet ja kulmanpuolittaja',
    body:
      'Kolmio määritellään kolmen kärkipisteen avulla, ja sen kulmien summa on aina vakio riippumatta ' +
      'kolmion muodosta.\n\n' +
      '- Kolmion kulmien summa on aina $180^\\circ$\n' +
      '- Kulmanpuolittaja jakaa kulman kahteen yhtä suureen osaan\n' +
      '- Kulmanpuolittajaa hyödynnetään usein yhdenmuotoisuuden ja mittasuhteiden määrittelyssä\n\n' +
      'Esimerkki: Jos kolmion kaksi kulmaa ovat $50^\\circ$ ja $70^\\circ$, kolmas kulma on ' +
      '$180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$.',
  },
  {
    title: 'Suorakulmainen kolmio, trigonometria ja Pythagoraan lause',
    body:
      'Suorakulmaisessa kolmiossa yksi kulma on $90^\\circ$. Tällaisessa kolmiossa sivujen ja kulmien ' +
      'väliset yhteydet tunnetaan tarkasti Pythagoraan lauseen ja trigonometristen funktioiden avulla.\n\n' +
      '- Pythagoraan lause: $a^2 + b^2 = c^2$, missä $c$ on hypotenuusa\n' +
      '- $\\sin\\theta = \\dfrac{\\text{vastainen kateetti}}{\\text{hypotenuusa}}$\n' +
      '- $\\cos\\theta = \\dfrac{\\text{viereinen kateetti}}{\\text{hypotenuusa}}$\n' +
      '- $\\tan\\theta = \\dfrac{\\text{vastainen kateetti}}{\\text{viereinen kateetti}}$\n\n' +
      'Esimerkki: Jos kateetit ovat $a = 3$ ja $b = 4$, hypotenuusa on $c = \\sqrt{3^2 + 4^2} = 5$.',
  },
  {
    title: '2D-kappaleiden pinta-alat ja lävistäjä',
    body:
      'Tasokuvioiden pinta-alat lasketaan kuvion omalla kaavalla. Lävistäjä yhdistää kaksi ei-vierekkäistä ' +
      'kärkeä ja sitä käytetään esimerkiksi neliön tai suorakulmion mittojen selvittämiseen.\n\n' +
      '- Neliö: $A = a^2$, suorakulmio: $A = l \\cdot w$\n' +
      '- Kolmio: $A = \\frac{1}{2} a h$, puolisuunnikas: $A = \\frac{1}{2}(a+b)h$\n' +
      '- Ympyrä: $A = \\pi r^2$\n' +
      '- Neliön lävistäjä: $d = \\sqrt{2} \\cdot a$\n\n' +
      'Esimerkki: Neliön, jonka sivu on $a = 5$, lävistäjä on $d = 5\\sqrt{2} \\approx 7{,}07$.',
  },
  {
    title: 'Sini- ja kosinilause',
    body:
      'Muissa kuin suorakulmaisissa kolmioissa sivuja ja kulmia lasketaan sini- ja kosinilauseilla.\n\n' +
      '- Sinilause: $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}$\n' +
      '- Kosinilause: $c^2 = a^2 + b^2 - 2ab\\cos C$\n\n' +
      'Esimerkki: Jos $a = 7$, $b = 9$ ja niiden välinen kulma $C = 60^\\circ$, niin ' +
      '$c^2 = 7^2 + 9^2 - 2\\cdot7\\cdot9\\cos 60^\\circ = 130 - 63 = 67$, joten $c \\approx 8{,}2$.',
  },
  {
    title: 'Ympyrä: määritelmä, sektori ja kaari',
    body:
      'Ympyrä on kaikkien niiden pisteiden joukko, jotka ovat yhtä kaukana keskipisteestä. Sektori ja ' +
      'kaari ovat ympyrän osia, joiden koko riippuu keskuskulmasta.\n\n' +
      '- Säde $r$: etäisyys keskipisteestä kehälle; kehä: $C = 2\\pi r$\n' +
      '- Sektorin pinta-ala: $A = \\dfrac{\\theta}{360^\\circ} \\cdot \\pi r^2$\n' +
      '- Kaaren pituus: $s = \\dfrac{\\theta}{360^\\circ} \\cdot 2\\pi r$\n\n' +
      'Esimerkki: Ympyrässä, jonka säde on $r = 6$, keskuskulman $90^\\circ$ sektorin pinta-ala on ' +
      '$\\frac{90}{360}\\cdot\\pi\\cdot 6^2 = 9\\pi \\approx 28{,}3$.',
  },
  {
    title: 'Avaruuskappaleiden pinta-alat ja tilavuudet',
    body:
      'Avaruuskappaleiden pinta-ala ja tilavuus lasketaan kappaleen muodolle ominaisella kaavalla.\n\n' +
      '- Pallo: $A = 4\\pi r^2$, $V = \\frac{4}{3}\\pi r^3$\n' +
      '- Kuutio: $A = 6a^2$, $V = a^3$\n' +
      '- Lieriö: $A = 2\\pi r^2 + 2\\pi rh$, $V = \\pi r^2 h$\n' +
      '- Kartio: $A = \\pi r^2 + \\pi r s$ ($s$ = vaipan pituus), $V = \\frac{1}{3}\\pi r^2 h$\n\n' +
      'Esimerkki: Pallon, jonka säde on $r = 3$, tilavuus on $V = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi \\approx 113{,}1$.',
  },
]

export default maa3Theory
