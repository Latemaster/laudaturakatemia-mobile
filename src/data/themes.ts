import type { TopicCode } from '../types'

// A theme (teema) is a sub-area of a course that gets its own knowledge
// score: "polynomit", "toisen asteen yhtälö", "soveltaminen" and so on.
// Scores live at this level rather than the course level because a student
// can be strong in one part of a course and weak in another, and the
// Suositellut feed should be able to target the weak part.
//
// Themes are defined on top of the theory files: every concept box of a
// course (an index into theory/<course>.ts) belongs to exactly one theme.
// Quick exercises are tagged through the concept they follow (their
// conceptIndex, explicit or positional), so they need no extra data; the
// open-answer task cards in problems/<course>.json carry an explicit
// `themes` list, since one problem often spans several.
//
// Theme ids are stable keys used in stored data (polls, attempts), so
// renaming one is a migration; renaming its `name` is free.
export type ThemeId = string

export interface Theme {
  id: ThemeId
  code: TopicCode
  name: string
  // Two or three sentences for the pre-poll card: what the theme is about
  // and what a student who knows it can do. Plain text, $...$ math allowed.
  summary: string
  // A key formula shown on the pre-poll card when none of the theme's
  // concepts has an interactive visual (KaTeX, display mode).
  formula?: string
  // Indices into the course's theory file (getConceptCards order).
  concepts: number[]
  // Relative weight of the theme inside the course score; defaults to 1.
  // Raise it for themes the exam asks about more often.
  weight?: number
}

type ThemeDef = Omit<Theme, 'code'>

const THEME_DEFS: Record<TopicCode, ThemeDef[]> = {
  MAA2: [
    {
      id: 'maa2-polynomit',
      name: 'Polynomit ja lausekkeet',
      summary:
        'Polynomien yhteen-, vähennys- ja kertolasku, funktion arvon laskeminen sijoittamalla sekä binomin neliön ' +
        'kaavat $(a \\pm b)^2 = a^2 \\pm 2ab + b^2$. Tämä on kaiken lausekkeiden käsittelyn perusta.',
      concepts: [0, 1, 2],
    },
    {
      id: 'maa2-juuret-ja-potenssit',
      name: 'Juuret ja potenssiyhtälöt',
      summary:
        'Neliöjuuren määritelmä ja laskusäännöt, juurilausekkeiden sieventäminen sekä potenssiyhtälön $x^n = b$ ' +
        'ratkaiseminen. Parillisella eksponentilla ratkaisuja on kaksi, $x = \\pm\\sqrt[n]{b}$.',
      formula: '\\begin{gathered} \\sqrt{a}\\,\\sqrt{b} = \\sqrt{ab} \\\\ x^2 = 9 \\Rightarrow x = \\pm 3 \\end{gathered}',
      concepts: [3, 4],
    },
    {
      id: 'maa2-toisen-asteen-yhtalo',
      name: 'Toisen asteen yhtälö ja nollakohdat',
      summary:
        'Ratkaisukaava, diskriminantti $D = b^2 - 4ac$ ja sen kertoma ratkaisujen lukumäärä sekä funktion ' +
        'nollakohtien löytäminen yhtälöstä $f(x) = 0$. Yo-kokeen yleisimpiä aiheita.',
      concepts: [5, 8],
    },
    {
      id: 'maa2-tekijat',
      name: 'Tekijöihin jako ja korkeamman asteen yhtälöt',
      summary:
        'Lausekkeen kirjoittaminen tulona, tulon nollasääntö ja niiden käyttö kolmannen ja korkeamman asteen ' +
        'yhtälöiden ratkaisemiseen. Tuttujen kaavojen, kuten neliöiden erotuksen, tunnistaminen.',
      formula:
        '\\begin{gathered} ab = 0 \\iff a = 0 \\;\\text{tai}\\; b = 0 \\\\ a^2 - b^2 = (a-b)(a+b) \\end{gathered}',
      concepts: [7, 11, 12],
    },
    {
      id: 'maa2-juuri-ja-rationaaliyhtalot',
      name: 'Juuri- ja rationaaliyhtälöt',
      summary:
        'Juuriyhtälön ratkaiseminen neliöimällä ja ratkaisujen tarkistaminen, sekä rationaaliyhtälöt, joissa ' +
        'nimittäjä ei saa olla nolla. Määrittelyehdot ja lausekkeen supistaminen kuuluvat tähän.',
      formula:
        '\\begin{gathered} \\sqrt{x+1} = 3 \\Rightarrow x + 1 = 9 \\\\ \\frac{1}{x+1} = \\frac{1}{3}, \\quad x \\neq -1 \\end{gathered}',
      concepts: [9, 10],
    },
    {
      id: 'maa2-soveltaminen',
      name: 'Soveltaminen',
      summary:
        'Sanallisen tilanteen, kuten pinta-alan, hinnan tai liikkeen, kääntäminen yhtälöksi ja tuloksen ' +
        'järkevyyden arviointi. Kokeessa nämä ovat usein tehtävän vaativin osa.',
      formula: 'A = x(x+3) = 40 \\;\\Rightarrow\\; x^2 + 3x - 40 = 0',
      concepts: [6],
    },
  ],
  MAA3: [
    {
      id: 'maa3-mittakaava-ja-kulmat',
      name: 'Mittakaava, kulmat ja yhdenmuotoisuus',
      summary:
        'Yksikkömuunnokset, mittakaavan vaikutus pituuteen, pinta-alaan ja tilavuuteen, kulmien tyypit sekä ' +
        'yhdensuuntaisten suorien ja yhdenmuotoisten kuvioiden ominaisuudet.',
      concepts: [0, 1, 2],
    },
    {
      id: 'maa3-kolmiot',
      name: 'Kolmiot ja trigonometria',
      summary:
        'Kolmion kulmasumma ja kulmanpuolittaja, suorakulmaisen kolmion Pythagoraan lause ja trigonometriset ' +
        'funktiot sekä sini- ja kosinilause muille kolmioille.',
      concepts: [3, 4, 6],
    },
    {
      id: 'maa3-tasokuviot',
      name: 'Tasokuviot ja ympyrä',
      summary:
        'Tasokuvioiden pinta-alat ja lävistäjät sekä ympyrän kehä, pinta-ala, sektori ja kaari.',
      concepts: [5, 7],
    },
    {
      id: 'maa3-avaruuskappaleet',
      name: 'Avaruuskappaleet',
      summary:
        'Lieriön, kartion, pallon ja särmiön pinta-alat ja tilavuudet sekä niiden yhdistelmät.',
      concepts: [8],
    },
  ],
  MAA4: [
    {
      id: 'maa4-itseisarvo',
      name: 'Itseisarvo',
      summary:
        'Itseisarvon merkitys etäisyytenä nollasta sekä itseisarvoyhtälöiden ja -epäyhtälöiden ratkaiseminen ' +
        'tapauksiin jakamalla.',
      concepts: [0],
    },
    {
      id: 'maa4-suora',
      name: 'Pisteet ja suorat',
      summary:
        'Pisteiden välinen etäisyys ja janan keskipiste, suoran yhtälö ja kulmakerroin sekä suorien ' +
        'yhdensuuntaisuus, kohtisuoruus ja leikkauspiste.',
      concepts: [1, 2, 3],
    },
    {
      id: 'maa4-ympyra-ja-paraabeli',
      name: 'Ympyrä, paraabeli ja etäisyydet',
      summary:
        'Ympyrän ja paraabelin yhtälöt sekä pisteen etäisyys suorasta ja ympyröiden keskinäinen asema.',
      concepts: [4, 5, 6],
    },
    {
      id: 'maa4-vektorit',
      name: 'Vektorit',
      summary:
        'Vektorin komponentit, yhteenlasku ja skalaarilla kertominen, pistetulo ja vektorien välinen kulma sekä ' +
        'yksikkövektorin muodostaminen.',
      concepts: [7, 8, 9],
    },
  ],
  MAA5: [
    {
      id: 'maa5-yksikkoympyra',
      name: 'Radiaanit ja yksikköympyrä',
      summary:
        'Asteiden ja radiaanien muunnokset, sinin ja kosinin lukeminen yksikköympyrältä, vasta- ja ' +
        'suplementtikulmat, jaksollisuus sekä tangentti.',
      concepts: [0, 1, 2],
    },
    {
      id: 'maa5-trigonometriset-yhtalot',
      name: 'Trigonometriset yhtälöt ja kuvaajat',
      summary:
        'Yhtälöiden $\\sin x = a$ ja $\\cos x = a$ kaikkien ratkaisujen löytäminen sekä sini- ja kosinifunktion ' +
        'kuvaajat ja niiden muunnokset.',
      concepts: [3, 4],
    },
    {
      id: 'maa5-logaritmi',
      name: 'Logaritmi ja laskusäännöt',
      summary:
        'Logaritmi eksponenttifunktion käänteisoperaationa, $\\log_a x = y \\iff a^y = x$, sekä logaritmin ja ' +
        'murtopotenssien laskusäännöt.',
      concepts: [5, 6],
    },
    {
      id: 'maa5-eksponentti-ja-logaritmiyhtalot',
      name: 'Eksponentti- ja logaritmiyhtälöt',
      summary:
        'Eksponentti- ja logaritmifunktion kuvaajat ja ominaisuudet sekä yhtälöiden ratkaiseminen ottamalla ' +
        'logaritmi tai käyttämällä käänteisfunktiota.',
      concepts: [7, 8],
    },
  ],
  MAA6: [
    {
      id: 'maa6-derivaatan-maaritelma',
      name: 'Derivaatan määritelmä',
      summary:
        'Erotusosamäärä, raja-arvo ja derivaatta muutosnopeutena: miten sekantin kulmakerroin lähestyy ' +
        'tangentin kulmakerrointa.',
      concepts: [0],
    },
    {
      id: 'maa6-derivointisaannot',
      name: 'Derivointisäännöt',
      summary:
        'Potenssi-, summa-, tulo- ja osamääräsäännöt sekä yhdistetyn funktion derivointi.',
      concepts: [1],
    },
    {
      id: 'maa6-tangentti',
      name: 'Käyrän tangentti',
      summary:
        'Tangentin yhtälön muodostaminen derivaatan avulla annetussa pisteessä sekä normaalin yhtälö.',
      concepts: [2],
    },
    {
      id: 'maa6-aariarvot',
      name: 'Ääriarvot ja funktion kulku',
      summary:
        'Derivaatan nollakohdat, kulkukaavio, suurin ja pienin arvo suljetulla välillä sekä ' +
        'ääriarvosovellukset.',
      concepts: [3],
    },
  ],
  MAA7: [
    {
      id: 'maa7-integraalifunktio',
      name: 'Integraalifunktio ja perusintegraalit',
      summary:
        'Integrointi derivoinnin käänteisoperaationa, integroimisvakio sekä potenssi-, eksponentti- ja ' +
        'trigonometristen funktioiden perusintegraalit.',
      concepts: [0, 1],
    },
    {
      id: 'maa7-integrointitekniikat',
      name: 'Integrointitekniikat',
      summary:
        'Osittaisintegrointi ja sijoitusmenetelmä, kun integroitava ei ole suoraan perusintegraali.',
      concepts: [2],
    },
    {
      id: 'maa7-pinta-ala-ja-tilavuus',
      name: 'Pinta-ala ja tilavuus',
      summary:
        'Määrätty integraali, käyrän ja x-akselin tai kahden käyrän välinen pinta-ala sekä pyörähdyskappaleen ' +
        'tilavuus.',
      concepts: [3, 4],
    },
  ],
  MAA9: [
    {
      id: 'maa9-lukujonot',
      name: 'Lukujonot ja summat',
      summary:
        'Rekursiivinen, aritmeettinen ja geometrinen lukujono, yleisen jäsenen kaava sekä aritmeettinen ja ' +
        'geometrinen summa.',
      concepts: [0, 1],
    },
    {
      id: 'maa9-korkoa-korolle',
      name: 'Korkoa korolle',
      summary:
        'Pääoman kasvu kaavalla $A = A_0(1+r)^t$, säästämisen ja inflaation laskut sekä korkokannan ja ajan ' +
        'ratkaiseminen.',
      concepts: [2],
    },
    {
      id: 'maa9-lainat',
      name: 'Lainat',
      summary:
        'Tasaerälainan ja tasalyhennyslainan erot, maksuerän laskeminen ja lainan kokonaiskustannus.',
      concepts: [3],
    },
  ],
  MAA10: [
    {
      id: 'maa10-avaruusvektorit',
      name: 'Avaruusvektorit ja pistetulo',
      summary:
        'Vektorit kolmessa ulottuvuudessa, kantavektorit, pituus sekä pistetulo ja vektorien välinen kulma.',
      concepts: [0, 3],
    },
    {
      id: 'maa10-suorat-ja-tasot',
      name: 'Suorat, tasot ja etäisyydet',
      summary:
        'Suoran parametriesitys, tason normaalimuoto, leikkauspisteet sekä pisteen etäisyys suorasta ja ' +
        'tasosta.',
      concepts: [1, 2, 6],
    },
    {
      id: 'maa10-ristitulo',
      name: 'Ristitulo ja skalaarikolmitulo',
      summary:
        'Ristitulo normaalivektorin ja pinta-alan laskemiseen sekä skalaarikolmitulo suuntaissärmiön ' +
        'tilavuuteen.',
      concepts: [4, 5],
    },
    {
      id: 'maa10-kahden-muuttujan-funktiot',
      name: 'Kahden muuttujan funktiot',
      summary:
        'Pinnat $z = f(x, y)$, tasa-arvokäyrät, osittaisderivaatat, gradientti ja kriittiset pisteet.',
      concepts: [7, 8],
    },
  ],
  MAA11: [
    {
      id: 'maa11-algoritmit-ja-logiikka',
      name: 'Algoritmit ja logiikka',
      summary:
        'Algoritmin vaiheet, silmukat ja vuokaaviot sekä logiikan konnektiivit ja totuustaulut.',
      concepts: [0, 1],
    },
    {
      id: 'maa11-lukuteoria',
      name: 'Lukuteoria',
      summary:
        'Jakoyhtälö ja kongruenssi, tekijät, suurin yhteinen tekijä ja pienin yhteinen monikerta, Eukleideen ' +
        'algoritmi sekä alkuluvut.',
      concepts: [2, 3, 4],
    },
    {
      id: 'maa11-ohjelmointi',
      name: 'Ohjelmointi',
      summary:
        'Pythonin perusteet: muuttujat, ehtolauseet, silmukat ja lyhyen ohjelman lukeminen ja kirjoittaminen.',
      concepts: [5],
    },
  ],
  MAA12: [
    {
      id: 'maa12-funktion-ominaisuudet',
      name: 'Määrittelyjoukko, jatkuvuus ja derivoituvuus',
      summary:
        'Funktion määrittely- ja arvojoukko, jatkuvuuden tutkiminen sekä derivoituvuus ja sen pettäminen ' +
        'esimerkiksi kärjessä.',
      concepts: [0, 1],
    },
    {
      id: 'maa12-kaanteisfunktio',
      name: 'Käänteisfunktio',
      summary:
        'Käänteisfunktion olemassaolo ja muodostaminen, kuvaajien peilautuminen suoran $y = x$ suhteen sekä ' +
        'käänteisfunktion derivaatta.',
      concepts: [2],
    },
    {
      id: 'maa12-raja-arvot',
      name: 'Raja-arvot ja äärettömyys',
      summary:
        'Raja-arvot äärettömyydessä, asymptootit sekä epäoleellisen integraalin suppeneminen.',
      concepts: [3],
    },
    {
      id: 'maa12-jakaumat',
      name: 'Jatkuvat jakaumat',
      summary:
        'Tiheys- ja kertymäfunktio, odotusarvo sekä normaalijakauma ja sen normittaminen.',
      concepts: [4],
    },
  ],
}

export const THEMES: Theme[] = (Object.keys(THEME_DEFS) as TopicCode[]).flatMap((code) =>
  THEME_DEFS[code].map((def) => ({ ...def, code })),
)

export const THEME_MAP: Record<ThemeId, Theme> = Object.fromEntries(THEMES.map((theme) => [theme.id, theme]))

export function getCourseThemes(code: TopicCode): Theme[] {
  return THEMES.filter((theme) => theme.code === code)
}

// The theme a concept box belongs to, or undefined when the theory file has
// a concept the theme table doesn't cover yet (see getThemeIssues).
export function getConceptTheme(code: TopicCode, conceptIndex: number): Theme | undefined {
  return THEMES.find((theme) => theme.code === code && theme.concepts.includes(conceptIndex))
}
