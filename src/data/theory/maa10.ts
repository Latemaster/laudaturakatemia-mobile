import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA10_K.md in the laudaturakatemia repo).
// Closely related short sections are merged into fewer, richer boxes.
const maa10Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Avaruusvektori ja kantavektorit',
    body:
      'Avaruusvektori yleistää tason vektorit kolmeen ulottuvuuteen lisäämällä $z$-komponentin. ' +
      'Kantavektorit ovat lyhyt tapa kirjoittaa mikä tahansa avaruusvektori.\n\n' +
      '- Avaruusvektori: $\\vec{v} = (x, y, z)$, paikkavektori $\\vec{OP} = (x,y,z)$\n' +
      '- Pituus: $\\|\\vec{v}\\| = \\sqrt{x^2+y^2+z^2}$\n' +
      '- Kantavektorit: $\\vec{i}=(1,0,0)$, $\\vec{j}=(0,1,0)$, $\\vec{k}=(0,0,1)$\n\n' +
      'Esimerkki: Vektorin $\\vec{v}=(2,-1,2)$ pituus on $\\|\\vec{v}\\| = \\sqrt{4+1+4} = 3$.',
  },
  {
    title: 'Suoran parametrimuotoinen esitys ja leikkauspiste',
    body:
      'Avaruudessa suora esitetään lähtöpisteen ja suuntavektorin avulla, koska pelkkä yhtälö ei ' +
      'enää riitä (kuten tasossa).\n\n' +
      '- Suora: $\\vec{r}(t) = \\vec{a} + t\\vec{v}$, missä $\\vec{a}$ on pisteen paikkavektori ja $\\vec{v}$ suuntavektori\n' +
      '- Kahden suoran leikkauspiste: ratkaistaan $t$ ja $s$ yhtälöstä $\\vec{a}+t\\vec{v} = \\vec{b}+s\\vec{w}$\n\n' +
      'Jos yhtälöllä ei ole ratkaisua, suorat eivät leikkaa (ne ovat joko yhdensuuntaiset tai ristikkäiset).',
  },
  {
    title: 'Taso ja sen normaalimuoto',
    body:
      'Taso voidaan määritellä joko kahdella suuntavektorilla tai yhdellä tasoa vastaan kohtisuoralla ' +
      'normaalivektorilla - jälkimmäinen johtaa käytännöllisempään yhtälöön.\n\n' +
      '- Vektorimuoto: $\\vec{r} = \\vec{a} + s\\vec{u} + t\\vec{v}$\n' +
      '- Normaalimuoto: $\\vec{n}\\cdot(\\vec{r}-\\vec{a}) = 0$, missä $\\vec{n}$ on tasoa vastaan kohtisuora vektori\n\n' +
      'Normaalimuodosta on helppo tarkistaa, onko jokin piste tasolla: sijoita piste $\\vec{r}$:n paikalle.',
  },
  {
    title: 'Pistetulo ja vektorien välinen kulma',
    body:
      'Pistetulo yhdistää kahden vektorin pituudet ja niiden välisen kulman yhdeksi luvuksi.\n\n' +
      '- $\\vec{a}\\cdot\\vec{b} = \\|\\vec{a}\\|\\|\\vec{b}\\|\\cos\\theta$\n' +
      '- Kommutatiivinen: $\\vec{a}\\cdot\\vec{b} = \\vec{b}\\cdot\\vec{a}$, ja $\\vec{a}\\cdot\\vec{a} = \\|\\vec{a}\\|^2$\n\n' +
      'Esimerkki: Jos $\\vec{a}\\cdot\\vec{b}=0$ ja kumpikaan vektori ei ole nollavektori, vektorit ovat kohtisuorassa.',
  },
  {
    title: 'Ristitulo ja normaalivektori',
    body:
      'Ristitulo tuottaa kahdesta vektorista kolmannen vektorin, joka on kohtisuorassa molempia ' +
      'alkuperäisiä vastaan - juuri sitä tarvitaan tason normaalivektoriksi.\n\n' +
      '- $\\vec{a}\\times\\vec{b} = (a_2b_3-a_3b_2,\\ a_3b_1-a_1b_3,\\ a_1b_2-a_2b_1)$\n' +
      '- Tulos on kohtisuorassa sekä $\\vec{a}$:ta että $\\vec{b}$:tä vastaan\n\n' +
      'Ristituloa käytetään usein juuri tason normaalivektorin määrittämiseen kahdesta tason suuntavektorista.',
  },
  {
    title: 'Skalaarikolmitulo',
    body:
      'Skalaarikolmitulo yhdistää kolme vektoria yhdeksi luvuksi, joka kertoo niiden määräämän ' +
      'suuntaissärmiön tilavuuden.\n\n' +
      '- $\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})$\n\n' +
      'Jos skalaarikolmitulo on $0$, vektorit ovat samassa tasossa (komplanaarisia) eivätkä muodosta ' +
      'kolmiulotteista kappaletta.',
  },
  {
    title: 'Etäisyys pisteestä suoralle tai tasolle',
    body:
      'Pisteen etäisyys suorasta tai tasosta lasketaan ristitulon tai normaalivektorin avulla, samaan ' +
      'tapaan kuin tasogeometriassa pisteen etäisyys suorasta.\n\n' +
      '- Suora: $d = \\dfrac{\\|(\\vec{p}-\\vec{a})\\times\\vec{v}\\|}{\\|\\vec{v}\\|}$\n' +
      '- Taso: $d = \\dfrac{|\\vec{n}\\cdot(\\vec{p}-\\vec{a})|}{\\|\\vec{n}\\|}$\n\n' +
      'Molemmissa kaavoissa $\\vec{a}$ on tunnettu piste suoralla/tasolla ja $\\vec{p}$ piste, jonka etäisyyttä lasketaan.',
  },
  {
    title: 'Kahden muuttujan funktio, nollakohdat ja tasa-arvokäyrä',
    body:
      'Kahden muuttujan funktio antaa arvon jokaiselle tason pisteelle $(x,y)$, joten sen kuvaaja on ' +
      'pinta kolmiulotteisessa avaruudessa.\n\n' +
      '- Esimerkki funktiosta: $f(x,y) = x^2+y^2$\n' +
      '- Nollakohdat: ratkaise $f(x,y)=0$\n' +
      '- Tasa-arvokäyrä: kaikki pisteet, joissa $f(x,y)=c$ jollekin vakiolle $c$\n\n' +
      'Esimerkki: Funktion $f(x,y)=x^2+y^2$ tasa-arvokäyrät ovat origokeskisiä ympyröitä.',
  },
  {
    title: 'Osittaisderivaatta, kriittiset pisteet ja gradientti',
    body:
      'Kahden muuttujan funktiota derivoidaan yhden muuttujan suhteen kerrallaan pitäen toista vakiona. ' +
      'Näin löydetään funktion kasvusuunta ja mahdolliset ääriarvokohdat.\n\n' +
      '- Osittaisderivaatat: $\\partial f/\\partial x$, $\\partial f/\\partial y$\n' +
      '- Kriittiset pisteet: kohdat, joissa $\\partial f/\\partial x = 0$ ja $\\partial f/\\partial y = 0$\n' +
      '- Gradientti $\\nabla f = (\\partial f/\\partial x,\\ \\partial f/\\partial y)$ osoittaa funktion suurimman kasvun suuntaan\n\n' +
      'Kriittiset pisteet ovat mahdollisia ääriarvokohtia, aivan kuten yhden muuttujan funktioilla ' +
      'derivaatan nollakohdat.',
  },
]

export default maa10Theory
