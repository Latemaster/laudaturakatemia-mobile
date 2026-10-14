import type { ProblemBlock, RubricPart, Topic } from '../types'
import { RUBRIC_EXERCISES } from './rubrics'

export type { RubricCriterion, RubricPart } from '../types'

// Self-evaluation test set: open-answer exercises with a point breakdown in
// the style of the Ylioppilastutkintolautakunta's "hyvän vastauksen
// piirteet". Each part has a model solution and the scoring criteria it is
// marked against; the student goes through the criteria and gives
// themselves the points their own answer earns.

export interface EvaluationExercise {
  id: string
  topic: Topic
  title: string
  length: 'short' | 'long'
  promptBlocks: ProblemBlock[]
  parts: RubricPart[]
}

export const EVALUATION_EXERCISES: EvaluationExercise[] = [
  {
    id: 'eval-quadratic',
    topic: { code: 'MAA2', name: 'Funktiot ja yhtälöt' },
    title: 'Toisen asteen yhtälö',
    length: 'short',
    promptBlocks: [{ type: 'text', content: 'Ratkaise yhtälö $2x^2 - 3x - 2 = 0$.' }],
    parts: [
      {
        solution:
          'Ratkaisukaavalla:\n$$x = \\frac{3 \\pm \\sqrt{(-3)^2 - 4 \\cdot 2 \\cdot (-2)}}{2 \\cdot 2} = \\frac{3 \\pm \\sqrt{25}}{4} = \\frac{3 \\pm 5}{4}$$\nSiis $x = 2$ tai $x = -\\frac{1}{2}$.',
        criteria: [
          {
            id: 'formula',
            text: 'Ratkaisukaava sovellettu oikein (tai yhtälö jaettu tekijöihin $(x - 2)(2x + 1) = 0$)',
            points: 1,
          },
          { id: 'root1', text: 'Ratkaisu $x = 2$', points: 1 },
          { id: 'root2', text: 'Ratkaisu $x = -\\frac{1}{2}$', points: 1 },
        ],
        notes: ['Pelkistä vastauksista ilman välivaiheita enintään 1 p.'],
      },
    ],
  },
  {
    id: 'eval-line',
    topic: { code: 'MAA4', name: 'Analyyttinen geometria ja vektorit' },
    title: 'Kahden pisteen kautta kulkeva suora',
    length: 'short',
    promptBlocks: [
      {
        type: 'text',
        content:
          'Määritä pisteiden $A = (1, 2)$ ja $B = (5, -4)$ kautta kulkevan suoran yhtälö. Kulkeeko suora pisteen $C = (3, -1)$ kautta?',
      },
    ],
    parts: [
      {
        solution:
          'Kulmakerroin on\n$$k = \\frac{-4 - 2}{5 - 1} = -\\frac{3}{2}.$$\nSuoran yhtälö pisteen $A$ kautta: $y - 2 = -\\frac{3}{2}(x - 1)$ eli $y = -\\frac{3}{2}x + \\frac{7}{2}$.\nKun $x = 3$, saadaan $y = -\\frac{9}{2} + \\frac{7}{2} = -1$, joten suora kulkee pisteen $C$ kautta.',
        criteria: [
          { id: 'slope', text: 'Kulmakerroin $k = -\\frac{3}{2}$', points: 1 },
          {
            id: 'equation',
            text: 'Suoran yhtälö $y = -\\frac{3}{2}x + \\frac{7}{2}$ (tai sen kanssa yhtäpitävä muoto, esim. $3x + 2y - 7 = 0$)',
            points: 1,
          },
          { id: 'substitute', text: 'Pisteen $C$ koordinaatit sijoitettu suoran yhtälöön', points: 1 },
          { id: 'conclusion', text: 'Johtopäätös: suora kulkee pisteen $C$ kautta', points: 1 },
        ],
        notes: [
          'Jos kulmakerroin on laskettu väärin, mutta jatko on tehty johdonmukaisesti virheellisellä kulmakertoimella, enintään 3 p.',
        ],
      },
    ],
  },
  {
    id: 'eval-product-rule',
    topic: { code: 'MAA6', name: 'Derivaatta' },
    title: 'Tulon derivaatta',
    length: 'short',
    promptBlocks: [
      { type: 'text', content: 'Derivoi funktio $f(x) = x e^{2x}$ ja laske derivaatan arvo kohdassa $x = 0$.' },
    ],
    parts: [
      {
        solution:
          'Tulon derivoimissäännöllä ja ketjusäännöllä:\n$$f\'(x) = 1 \\cdot e^{2x} + x \\cdot 2e^{2x} = e^{2x}(1 + 2x).$$\nKohdassa $x = 0$: $f\'(0) = e^0 \\cdot 1 = 1$.',
        criteria: [
          { id: 'product', text: 'Tulon derivoimissääntö käytetty oikein', points: 1 },
          { id: 'chain', text: 'Yhdistetyn funktion derivaatta $D\\,e^{2x} = 2e^{2x}$', points: 1 },
          { id: 'derivative', text: "Derivaatta $f'(x) = e^{2x}(1 + 2x)$ (sievennettynä tai sievistämättä)", points: 1 },
          { id: 'value', text: "Arvo $f'(0) = 1$", points: 1 },
        ],
        notes: ['Jos ketjusääntö puuttuu ($D\\,e^{2x} = e^{2x}$), mutta jatko on johdonmukainen, enintään 2 p.'],
      },
    ],
  },
  {
    id: 'eval-extrema',
    topic: { code: 'MAA6', name: 'Derivaatta' },
    title: 'Funktion kulku ja ääriarvot',
    length: 'long',
    promptBlocks: [
      { type: 'text', content: 'Tarkastellaan funktiota $f(x) = x^3 - 3x^2 - 9x + 5$.' },
      { type: 'text', content: 'a) Määritä funktion $f$ kasvu- ja vähenemisvälit.' },
      { type: 'text', content: 'b) Määritä funktion $f$ suurin ja pienin arvo välillä $[-2, 4]$.' },
    ],
    parts: [
      {
        label: 'a)',
        solution:
          "Derivaatta on $f'(x) = 3x^2 - 6x - 9 = 3(x^2 - 2x - 3) = 3(x + 1)(x - 3)$.\nDerivaatan nollakohdat: $x = -1$ ja $x = 3$.\nDerivaatta on ylöspäin aukeava paraabeli, joten $f'(x) > 0$, kun $x < -1$ tai $x > 3$, ja $f'(x) < 0$, kun $-1 < x < 3$.\nFunktio on siis kasvava väleillä $\\mathopen{]}-\\infty, -1]$ ja $[3, \\infty\\mathclose{[}$ sekä vähenevä välillä $[-1, 3]$.",
        criteria: [
          { id: 'a-derivative', text: "Derivaatta $f'(x) = 3x^2 - 6x - 9$", points: 1 },
          { id: 'a-zeros-method', text: "Derivaatan nollakohdat ratkaistu yhtälöstä $f'(x) = 0$", points: 1 },
          { id: 'a-zeros', text: 'Nollakohdat $x = -1$ ja $x = 3$', points: 1 },
          {
            id: 'a-sign',
            text: 'Derivaatan merkki perusteltu (merkkikaavio, testikohdat tai paraabelin aukeamissuunta)',
            points: 2,
          },
          { id: 'a-intervals', text: 'Kasvu- ja vähenemisvälit ilmoitettu oikein', points: 1 },
        ],
        notes: [
          'Merkkikaaviosta, josta puuttuu perustelu (esim. testikohdat), 1 p kohdasta "derivaatan merkki".',
          'Välien päätepisteet voivat olla avoimia tai suljettuja.',
        ],
      },
      {
        label: 'b)',
        solution:
          'Suljetulla välillä jatkuva funktio saa suurimman ja pienimmän arvonsa joko derivaatan nollakohdassa tai välin päätepisteessä. Molemmat nollakohdat $x = -1$ ja $x = 3$ ovat välillä $[-2, 4]$.\n$f(-1) = -1 - 3 + 9 + 5 = 10$\n$f(3) = 27 - 27 - 27 + 5 = -22$\n$f(-2) = -8 - 12 + 18 + 5 = 3$\n$f(4) = 64 - 48 - 36 + 5 = -15$\nSuurin arvo on $10$ (kohdassa $x = -1$) ja pienin arvo $-22$ (kohdassa $x = 3$).',
        criteria: [
          {
            id: 'b-method',
            text: 'Periaate: tutkitaan derivaatan nollakohdat välillä ja välin päätepisteet',
            points: 1,
          },
          { id: 'b-critical', text: 'Arvot $f(-1) = 10$ ja $f(3) = -22$', points: 2 },
          { id: 'b-endpoints', text: 'Päätepistearvot $f(-2) = 3$ ja $f(4) = -15$', points: 2 },
          { id: 'b-conclusion', text: 'Johtopäätös: suurin arvo $10$ ja pienin arvo $-22$', points: 1 },
        ],
        notes: [
          'Yhdestä laskuvirheestä funktion arvoissa −1 p kyseisestä kohdasta.',
          'Jos päätepisteet on jätetty tutkimatta, b-kohdasta enintään 3 p.',
        ],
      },
    ],
  },
  {
    id: 'eval-area',
    topic: { code: 'MAA7', name: 'Integraalilaskenta' },
    title: 'Käyrien rajaama alue',
    length: 'long',
    promptBlocks: [
      { type: 'text', content: 'Paraabeli $y = -x^2 + 4x$ ja suora $y = x$ rajaavat alueen.' },
      { type: 'text', content: 'a) Määritä paraabelin ja suoran leikkauspisteet.' },
      { type: 'text', content: 'b) Laske alueen pinta-ala.' },
      {
        type: 'text',
        content: 'c) Pystysuora suora $x = a$ jakaa alueen kahteen yhtä suureen osaan. Määritä $a$.',
      },
    ],
    parts: [
      {
        label: 'a)',
        solution:
          'Leikkauskohdissa $-x^2 + 4x = x$ eli $x^2 - 3x = 0$ eli $x(x - 3) = 0$. Siis $x = 0$ tai $x = 3$.\nLeikkauspisteet ovat $(0, 0)$ ja $(3, 3)$.',
        criteria: [
          { id: 'a-equation', text: 'Leikkausehto $-x^2 + 4x = x$ muodostettu', points: 1 },
          { id: 'a-solve', text: 'Ratkaisut $x = 0$ ja $x = 3$', points: 1 },
          { id: 'a-points', text: 'Leikkauspisteet $(0, 0)$ ja $(3, 3)$ koordinaatteineen', points: 1 },
        ],
      },
      {
        label: 'b)',
        solution:
          'Välillä $[0, 3]$ paraabeli on suoran yläpuolella, joten\n$$A = \\int_0^3 \\big((-x^2 + 4x) - x\\big)\\,dx = \\int_0^3 (-x^2 + 3x)\\,dx = \\Big[-\\frac{x^3}{3} + \\frac{3x^2}{2}\\Big]_0^3 = -9 + \\frac{27}{2} = \\frac{9}{2}.$$',
        criteria: [
          { id: 'b-order', text: 'Erotusfunktio oikein päin (ylempi − alempi) tai perusteltu itseisarvolla', points: 1 },
          { id: 'b-integral', text: 'Integraali $\\int_0^3 (-x^2 + 3x)\\,dx$ muodostettu oikein rajoin', points: 1 },
          { id: 'b-antiderivative', text: 'Integraalifunktio $-\\frac{x^3}{3} + \\frac{3x^2}{2}$', points: 1 },
          { id: 'b-substitute', text: 'Rajat sijoitettu oikein', points: 1 },
          { id: 'b-answer', text: 'Pinta-ala $A = \\frac{9}{2}$', points: 1 },
        ],
        notes: ['Pelkästä laskimella lasketusta vastauksesta ilman integraalin muodostamista enintään 2 p.'],
      },
      {
        label: 'c)',
        solution:
          'Vaaditaan $\\int_0^a (-x^2 + 3x)\\,dx = \\frac{9}{4}$ eli\n$$-\\frac{a^3}{3} + \\frac{3a^2}{2} = \\frac{9}{4} \\iff 4a^3 - 18a^2 + 27 = 0 \\iff (2a - 3)(2a^2 - 6a - 9) = 0.$$\nRatkaisut ovat $a = \\frac{3}{2}$ ja $a = \\frac{3 \\pm 3\\sqrt{3}}{2}$, joista välillä $\\mathopen{]}0, 3\\mathclose{[}$ on vain $a = \\frac{3}{2}$.\n(Vaihtoehtoisesti: erotusfunktio $-x^2 + 3x$ on symmetrinen suoran $x = \\frac{3}{2}$ suhteen, joten alue jakautuu tasan kohdassa $a = \\frac{3}{2}$.)',
        criteria: [
          {
            id: 'c-setup',
            text: 'Ehto muodostettu: osa-alueen integraali on puolet pinta-alasta ($\\frac{9}{4}$), tai symmetriaperiaate todettu',
            points: 1,
          },
          { id: 'c-equation', text: 'Yhtälö $4a^3 - 18a^2 + 27 = 0$ (tai yhtäpitävä) tai symmetria perusteltu', points: 1 },
          { id: 'c-solve', text: 'Ratkaisu $a = \\frac{3}{2}$', points: 1 },
          { id: 'c-reject', text: 'Perusteltu, että muut ratkaisut eivät ole välillä $\\mathopen{]}0, 3\\mathclose{[}$', points: 1 },
        ],
        notes: ['Pelkästä arvauksesta $a = \\frac{3}{2}$ ilman perustelua 1 p.'],
      },
    ],
  },
]

export function partMaxPoints(part: RubricPart): number {
  return part.criteria.reduce((sum, c) => sum + c.points, 0)
}

export function exerciseMaxPoints(exercise: EvaluationExercise): number {
  return exercise.parts.reduce((sum, part) => sum + partMaxPoints(part), 0)
}

// Criterion ids are only unique within an exercise; scores are keyed by
// them under the exercise id.
export type CriterionScores = Record<string, number>

export interface EvaluationAttempt {
  answer: string
  scores: CriterionScores
}

export type EvaluationState = Record<string, EvaluationAttempt>

// Points awarded for a part, or null while any of its criteria is still
// unmarked.
export function partScore(part: RubricPart, scores: CriterionScores): number | null {
  let total = 0
  for (const criterion of part.criteria) {
    const value = scores[criterion.id]
    if (value === undefined) return null
    total += value
  }
  return total
}

export function scoredPoints(exercise: EvaluationExercise, scores: CriterionScores): number {
  return exercise.parts.reduce(
    (sum, part) => sum + part.criteria.reduce((s, c) => s + (scores[c.id] ?? 0), 0),
    0,
  )
}

export function markedCount(exercise: EvaluationExercise, scores: CriterionScores): { marked: number; total: number } {
  const criteria = exercise.parts.flatMap((part) => part.criteria)
  return { marked: criteria.filter((c) => scores[c.id] !== undefined).length, total: criteria.length }
}

const STORAGE_KEY = 'laudatur.evaluation'

export function loadEvaluation(): EvaluationState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const result: EvaluationState = {}
    for (const exercise of [...EVALUATION_EXERCISES, ...RUBRIC_EXERCISES]) {
      const raw = (parsed as Record<string, unknown>)[exercise.id] as Partial<EvaluationAttempt> | undefined
      if (!raw || typeof raw.answer !== 'string') continue
      const scores: CriterionScores = {}
      for (const criterion of exercise.parts.flatMap((part) => part.criteria)) {
        const value = raw.scores?.[criterion.id]
        if (typeof value === 'number' && value >= 0 && value <= criterion.points) scores[criterion.id] = value
      }
      result[exercise.id] = { answer: raw.answer, scores }
    }
    return result
  } catch {
    return {}
  }
}

export function saveEvaluation(state: EvaluationState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the
    // in-memory state still works for the session.
  }
}
