import type { LessonCard } from '../../types'

// Restructured and expanded from the course site's Tiivistelmä
// (public/content/Tiivistelmä/MAA4_K.md in the laudaturakatemia repo).
// Closely related short sections are merged into fewer, richer boxes.
const maa4Theory: Array<Omit<LessonCard, 'id' | 'type' | 'topic'>> = [
  {
    title: 'Itseisarvoyhtälöt ja -epäyhtälöt',
    visual: 'absolute-value-line',
    body:
      'Itseisarvo $|x|$ kertoo luvun etäisyyden nollasta, joten itseisarvoyhtälöllä on yleensä kaksi ' +
      'ratkaisua.\n\n' +
      '- $|x| = a$ ⇒ $x = a$ tai $x = -a$\n' +
      '- $|x| < a$ ⇒ $-a < x < a$\n' +
      '- $|x| > a$ ⇒ $x < -a$ tai $x > a$\n\n' +
      'Esimerkki: $|x| = 3 \\Rightarrow x = 3$ tai $x = -3$. Vastaavasti $|x| < 3$ tarkoittaa väliä $-3 < x < 3$.',
  },
  {
    title: 'Pisteiden välinen etäisyys ja janan keskipiste',
    visual: 'distance-midpoint',
    body:
      'Kahden pisteen välinen etäisyys ja niiden yhdistävän janan keskipiste lasketaan suoraan pisteiden ' +
      'koordinaateista.\n\n' +
      '- Etäisyys: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$\n' +
      '- Keskipiste: $M = \\left(\\dfrac{x_1+x_2}{2}, \\dfrac{y_1+y_2}{2}\\right)$\n\n' +
      'Esimerkki: Pisteille $A(1, 2)$ ja $B(5, 6)$ etäisyys on $d = \\sqrt{4^2+4^2} = \\sqrt{32} \\approx 5{,}66$ ' +
      'ja keskipiste on $M(3, 4)$.',
  },
  {
    title: 'Suoran yhtälö ja kulmakerroin',
    visual: 'line-slope',
    body:
      'Suoran yhtälö kertoo, miten $y$ riippuu $x$:stä. Kulmakerroin kuvaa suoran jyrkkyyttä ja suuntaa.\n\n' +
      '- Ratkaistu muoto: $y = kx + b$, missä $k$ on kulmakerroin ja $b$ on $y$-akselin leikkauspiste\n' +
      '- Kulmakerroin kahdesta pisteestä: $k = \\dfrac{y_2-y_1}{x_2-x_1}$\n' +
      '- Normaalimuoto: $Ax + By + C = 0$\n\n' +
      'Esimerkki: Pisteiden $(0,1)$ ja $(2,5)$ kautta kulkevan suoran kulmakerroin on $k = \\frac{5-1}{2-0} = 2$, ' +
      'joten suoran yhtälö on $y = 2x + 1$.',
  },
  {
    title: 'Suorien keskinäinen asema',
    visual: 'perpendicular-lines',
    body:
      'Kahden suoran leikkauspiste, kohtisuoruus ja niiden välinen kulma kaikki selviävät kulmakertoimista.\n\n' +
      '- Leikkauspiste saadaan ratkaisemalla suorien yhtälöt yhtälöparina\n' +
      '- Suorat ovat kohtisuorassa, jos $k_1 \\cdot k_2 = -1$\n' +
      '- Suorien välinen kulma: $\\tan\\theta = \\left|\\dfrac{k_2-k_1}{1+k_1k_2}\\right|$\n\n' +
      'Esimerkki: Suorat $y = 2x+1$ ja $y = -\\frac12 x+3$ ovat kohtisuorassa, koska $2 \\cdot (-\\frac12) = -1$.',
  },
  {
    title: 'Ympyrän yhtälö',
    visual: 'circle-equation',
    body:
      'Ympyrän yhtälö on esimerkki pistejoukon yhtälöstä: se kuvaa kaikkia pisteitä, jotka toteuttavat ' +
      'ehdon "etäisyys keskipisteestä on $r$".\n\n' +
      '- Keskipistemuoto: $(x-h)^2 + (y-k)^2 = r^2$, kun keskipiste on $(h,k)$ ja säde $r$\n' +
      '- Normaalimuoto: $x^2 + y^2 + Dx + Ey + F = 0$\n\n' +
      'Esimerkki: Ympyrä, jonka keskipiste on $(2, -1)$ ja säde $3$, on $(x-2)^2 + (y+1)^2 = 9$.',
  },
  {
    title: 'Pisteen ja suoran sekä ympyröiden etäisyydet',
    visual: 'point-line-distance',
    body:
      'Etäisyyksien laskeminen pisteestä suoraan tai kahden ympyrän välillä auttaa selvittämään, ' +
      'sivuavatko tai leikkaavatko kuviot toisiaan.\n\n' +
      '- Pisteen $P(x_1,y_1)$ etäisyys suorasta $Ax+By+C=0$: $d = \\dfrac{|Ax_1+By_1+C|}{\\sqrt{A^2+B^2}}$\n' +
      '- Ympyröiden välinen etäisyys saadaan vertaamalla keskipisteiden etäisyyttä säteiden summaan tai erotukseen\n\n' +
      'Esimerkki: Pisteen $(0,0)$ etäisyys suorasta $3x+4y-10=0$ on $\\dfrac{|{-10}|}{\\sqrt{3^2+4^2}} = \\dfrac{10}{5} = 2$.',
  },
  {
    title: 'Paraabelin yhtälö',
    visual: 'parabola-shape',
    body:
      'Paraabeli on toisen asteen funktion kuvaaja, ja sen muoto riippuu kertoimista $a$, $b$ ja $c$.\n\n' +
      '- Yhtälö: $y = ax^2 + bx + c$\n' +
      '- $a$ määrää aukeamissuunnan (ylös/alas) ja kuinka jyrkkä paraabeli on\n\n' +
      'Esimerkki: $y = x^2 - 4x + 3$ on ylöspäin aukeava paraabeli, jonka nollakohdat ovat $x=1$ ja $x=3$.',
  },
  {
    title: 'Vektorin perusominaisuudet ja laskutoimitukset',
    visual: 'vector-addition',
    body:
      'Vektorilla on sekä suunta että suuruus, ja sitä voidaan siirtää tasossa paikkaa muuttamatta sen ' +
      'ominaisuuksia. Vektoreita lasketaan komponenteittain.\n\n' +
      '- Merkinnät: $\\vec{v}$, pituus $|\\vec{v}|$, yksikkövektori $\\hat{v}$\n' +
      '- Summa: $\\vec{u}+\\vec{v} = (u_1+v_1,\\, u_2+v_2)$\n' +
      '- Erotus: $\\vec{u}-\\vec{v} = (u_1-v_1,\\, u_2-v_2)$\n' +
      '- Skalaarilla kertominen: $k\\vec{v} = (kv_1,\\, kv_2)$\n\n' +
      'Esimerkki: Kun $\\vec{u}=(2,3)$ ja $\\vec{v}=(1,-1)$, niin $\\vec{u}+\\vec{v} = (3,2)$ ja $2\\vec{u} = (4,6)$.',
  },
  {
    title: 'Pistetulo ja vektorien välinen kulma',
    visual: 'dot-product-angle',
    body:
      'Pistetulo kertoo, kuinka "samansuuntaisia" kaksi vektoria ovat, ja sen avulla lasketaan niiden ' +
      'välinen kulma.\n\n' +
      '- Pistetulo: $\\vec{u}\\cdot\\vec{v} = u_1v_1+u_2v_2$\n' +
      '- Pistetulo on $0$, jos vektorit ovat kohtisuorassa\n' +
      '- Välinen kulma: $\\cos\\theta = \\dfrac{\\vec{u}\\cdot\\vec{v}}{|\\vec{u}||\\vec{v}|}$\n\n' +
      'Esimerkki: $\\vec{u}=(1,0)$ ja $\\vec{v}=(0,1)$: $\\vec{u}\\cdot\\vec{v}=0$, joten vektorit ovat kohtisuorassa.',
  },
  {
    title: 'Yksikkövektori',
    visual: 'unit-vector',
    body:
      'Yksikkövektori osoittaa saman suunnan kuin alkuperäinen vektori, mutta sen pituus on tasan $1$.\n\n' +
      '- $\\hat{v} = \\dfrac{\\vec{v}}{|\\vec{v}|}$\n\n' +
      'Esimerkki: Jos $\\vec{v} = (3, 4)$, niin $|\\vec{v}| = 5$ ja yksikkövektori on $\\hat{v} = (\\frac{3}{5}, \\frac{4}{5})$.',
  },
]

export default maa4Theory
