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
// `themes` list, since one problem often spans several themes.
//
// Theme ids are stable keys used in stored data (polls, attempts), so
// renaming one is a migration; renaming its `name` is free.
export type ThemeId = string

export interface Theme {
  id: ThemeId
  code: TopicCode
  name: string
  // Indices into the course's theory file (getConceptCards order).
  concepts: number[]
  // Relative weight of the theme inside the course score; defaults to 1.
  // Raise it for themes the exam asks about more often.
  weight?: number
}

type ThemeDef = Omit<Theme, 'code'>

const THEME_DEFS: Record<TopicCode, ThemeDef[]> = {
  MAA2: [
    { id: 'maa2-polynomit', name: 'Polynomit ja lausekkeet', concepts: [0, 1, 2] },
    { id: 'maa2-juuret-ja-potenssit', name: 'Juuret ja potenssiyhtälöt', concepts: [3, 4] },
    { id: 'maa2-toisen-asteen-yhtalo', name: 'Toisen asteen yhtälö ja nollakohdat', concepts: [5, 8] },
    { id: 'maa2-tekijat', name: 'Tekijöihin jako ja korkeamman asteen yhtälöt', concepts: [7, 11, 12] },
    { id: 'maa2-juuri-ja-rationaaliyhtalot', name: 'Juuri- ja rationaaliyhtälöt', concepts: [9, 10] },
    { id: 'maa2-soveltaminen', name: 'Soveltaminen', concepts: [6] },
  ],
  MAA3: [
    { id: 'maa3-mittakaava-ja-kulmat', name: 'Mittakaava, kulmat ja yhdenmuotoisuus', concepts: [0, 1, 2] },
    { id: 'maa3-kolmiot', name: 'Kolmiot ja trigonometria', concepts: [3, 4, 6] },
    { id: 'maa3-tasokuviot', name: 'Tasokuviot ja ympyrä', concepts: [5, 7] },
    { id: 'maa3-avaruuskappaleet', name: 'Avaruuskappaleet', concepts: [8] },
  ],
  MAA4: [
    { id: 'maa4-itseisarvo', name: 'Itseisarvo', concepts: [0] },
    { id: 'maa4-suora', name: 'Pisteet ja suorat', concepts: [1, 2, 3] },
    { id: 'maa4-ympyra-ja-paraabeli', name: 'Ympyrä, paraabeli ja etäisyydet', concepts: [4, 5, 6] },
    { id: 'maa4-vektorit', name: 'Vektorit', concepts: [7, 8, 9] },
  ],
  MAA5: [
    { id: 'maa5-yksikkoympyra', name: 'Radiaanit ja yksikköympyrä', concepts: [0, 1, 2] },
    { id: 'maa5-trigonometriset-yhtalot', name: 'Trigonometriset yhtälöt ja kuvaajat', concepts: [3, 4] },
    { id: 'maa5-logaritmi', name: 'Logaritmi ja laskusäännöt', concepts: [5, 6] },
    { id: 'maa5-eksponentti-ja-logaritmiyhtalot', name: 'Eksponentti- ja logaritmiyhtälöt', concepts: [7, 8] },
  ],
  MAA6: [
    { id: 'maa6-derivaatan-maaritelma', name: 'Derivaatan määritelmä', concepts: [0] },
    { id: 'maa6-derivointisaannot', name: 'Derivointisäännöt', concepts: [1] },
    { id: 'maa6-tangentti', name: 'Käyrän tangentti', concepts: [2] },
    { id: 'maa6-aariarvot', name: 'Ääriarvot ja funktion kulku', concepts: [3] },
  ],
  MAA7: [
    { id: 'maa7-integraalifunktio', name: 'Integraalifunktio ja perusintegraalit', concepts: [0, 1] },
    { id: 'maa7-integrointitekniikat', name: 'Integrointitekniikat', concepts: [2] },
    { id: 'maa7-pinta-ala-ja-tilavuus', name: 'Pinta-ala ja tilavuus', concepts: [3, 4] },
  ],
  MAA9: [
    { id: 'maa9-lukujonot', name: 'Lukujonot ja summat', concepts: [0, 1] },
    { id: 'maa9-korkoa-korolle', name: 'Korkoa korolle', concepts: [2] },
    { id: 'maa9-lainat', name: 'Lainat', concepts: [3] },
  ],
  MAA10: [
    { id: 'maa10-avaruusvektorit', name: 'Avaruusvektorit ja pistetulo', concepts: [0, 3] },
    { id: 'maa10-suorat-ja-tasot', name: 'Suorat, tasot ja etäisyydet', concepts: [1, 2, 6] },
    { id: 'maa10-ristitulo', name: 'Ristitulo ja skalaarikolmitulo', concepts: [4, 5] },
    { id: 'maa10-kahden-muuttujan-funktiot', name: 'Kahden muuttujan funktiot', concepts: [7, 8] },
  ],
  MAA11: [
    { id: 'maa11-algoritmit-ja-logiikka', name: 'Algoritmit ja logiikka', concepts: [0, 1] },
    { id: 'maa11-lukuteoria', name: 'Lukuteoria', concepts: [2, 3, 4] },
    { id: 'maa11-ohjelmointi', name: 'Ohjelmointi', concepts: [5] },
  ],
  MAA12: [
    { id: 'maa12-funktion-ominaisuudet', name: 'Määrittelyjoukko, jatkuvuus ja derivoituvuus', concepts: [0, 1] },
    { id: 'maa12-kaanteisfunktio', name: 'Käänteisfunktio', concepts: [2] },
    { id: 'maa12-raja-arvot', name: 'Raja-arvot ja äärettömyys', concepts: [3] },
    { id: 'maa12-jakaumat', name: 'Jatkuvat jakaumat', concepts: [4] },
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
