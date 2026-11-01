// Validates src/data/rubrics/<course>.json against the problems they score
// and the rules in docs/rubric-guidelines.md, then prints how far the
// rubric work has got per course and section.
//
//   npm run check:rubrics
//   npm run check:rubrics -- --audit MAA2   (also audits that course against
//                                           the scoring principles)
//
// Exits non-zero on any error. The last lines are machine-readable for the
// scheduled batch run:
//   PENDING_DRAFT_SECTIONS=<sections that still have unreviewed drafts>
//   NEXT_SECTION=<course> <section>   (or NEXT_SECTION=none when all are done)

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const COURSES = ['MAA2', 'MAA3', 'MAA4', 'MAA5', 'MAA6', 'MAA7', 'MAA9', 'MAA10', 'MAA11', 'MAA12']

const errors = []
const warnings = []
const auditIndex = process.argv.indexOf('--audit')
const auditCourse = auditIndex === -1 ? null : process.argv[auditIndex + 1]?.toUpperCase()
const auditRows = []

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

// Part labels ("a)", "b)" ...) found at the start of the problem's text
// blocks, in order and without repeats.
function promptLabels(problem) {
  const labels = []
  for (const block of problem.promptBlocks) {
    if (block.type !== 'text') continue
    const match = /^\s*([a-h])\)/.exec(block.content)
    if (match && !labels.includes(`${match[1]})`)) labels.push(`${match[1]})`)
  }
  return labels
}

// Unescaped $ signs must pair up, or MathText renders the rest of the text
// as math.
function dollarsBalanced(text) {
  const count = (text.replace(/\\\$/g, '').match(/\$/g) ?? []).length
  return count % 2 === 0
}

function checkRubric(where, problem, rubric) {
  if (rubric.status !== 'draft' && rubric.status !== 'reviewed') {
    errors.push(`${where}: status must be "draft" or "reviewed"`)
  }
  if (!Array.isArray(rubric.parts) || rubric.parts.length === 0) {
    errors.push(`${where}: no parts`)
    return
  }

  const labels = promptLabels(problem)
  const partLabels = rubric.parts.map((part) => part.label)
  if (labels.length === 0) {
    if (rubric.parts.length !== 1 || partLabels[0] !== undefined) {
      errors.push(`${where}: the problem has no a)/b) parts, so the rubric must have one part without a label`)
    }
  } else if (partLabels.join(' ') !== labels.join(' ')) {
    errors.push(`${where}: part labels [${partLabels.join(' ')}] do not match the problem's [${labels.join(' ')}]`)
  }

  const ids = new Set()
  let total = 0
  for (const part of rubric.parts) {
    const partWhere = `${where} ${part.label ?? ''}`.trim()
    if (typeof part.solution !== 'string' || part.solution.trim() === '') {
      errors.push(`${partWhere}: missing model solution`)
    } else if (!dollarsBalanced(part.solution)) {
      errors.push(`${partWhere}: unbalanced $ in solution`)
    } else if (/\*\*[^*\n]*\$[^*\n]*\*\*/.test(part.solution)) {
      // MathText only bolds plain text; the asterisks would show.
      errors.push(`${partWhere}: **bold** around a formula in the solution`)
    }
    if (!Array.isArray(part.criteria) || part.criteria.length === 0) {
      errors.push(`${partWhere}: no criteria`)
      continue
    }
    for (const criterion of part.criteria) {
      if (!criterion.id || ids.has(criterion.id)) errors.push(`${partWhere}: missing or repeated criterion id "${criterion.id}"`)
      ids.add(criterion.id)
      if (!Number.isInteger(criterion.points) || criterion.points < 1 || criterion.points > 3) {
        errors.push(`${partWhere} ${criterion.id}: points must be a whole number 1-3`)
      }
      if (typeof criterion.text !== 'string' || !dollarsBalanced(criterion.text)) {
        errors.push(`${partWhere} ${criterion.id}: missing text or unbalanced $`)
      }
      total += criterion.points ?? 0
    }
    const partIds = new Set(part.criteria.map((criterion) => criterion.id))
    for (const criterion of part.criteria) {
      if (criterion.impliedBy === undefined) continue
      if (criterion.impliedBy === criterion.id || !partIds.has(criterion.impliedBy)) {
        errors.push(`${partWhere} ${criterion.id}: impliedBy must name another criterion in the same part`)
      }
    }
    for (const note of part.notes ?? []) {
      if (!dollarsBalanced(note)) errors.push(`${partWhere}: unbalanced $ in a note`)
    }
  }

  if (rubric.maxPoints !== total) {
    errors.push(`${where}: maxPoints is ${rubric.maxPoints} but the criteria add up to ${total}`)
  }
  if (!((total >= 4 && total <= 8) || total === 12)) {
    errors.push(`${where}: total ${total} p is outside the scale (4-8 p, or 12 p for long problems)`)
  }
  if (labels.length >= 3 && total < 8) {
    warnings.push(`${where}: ${labels.length} parts but only ${total} p; check the problem is really a short one`)
  }
}

function promptText(problem) {
  return problem.promptBlocks.map((block) => (block.type === 'text' ? block.content : '')).join('\n')
}

// The "Scoring principles" in docs/rubric-guidelines.md, as far as they can
// be checked mechanically. Findings are warnings: a reviewNote may explain
// an exception.
function auditRubric(where, problem, rubric) {
  const criteria = rubric.parts.flatMap((part) => part.criteria ?? [])
  const notes = rubric.parts.flatMap((part) => part.notes ?? [])
  const total = rubric.maxPoints
  const long = total === 12
  const proof = /\b(osoita|todista)/i.test(promptText(problem))
  const targets = new Set(criteria.map((c) => c.impliedBy).filter(Boolean))
  // What a correct final answer earns: the criteria something is implied by
  // (the answers), every step they imply, and parts that are a single
  // answer criterion with no steps.
  const answerBacked = rubric.parts
    .flatMap((part) => {
      const own = part.criteria ?? []
      return own.length === 1 && own[0].impliedBy === undefined ? own : own.filter((c) => c.impliedBy !== undefined || targets.has(c.id))
    })
    .reduce((sum, c) => sum + c.points, 0)
  const share = total > 0 ? answerBacked / total : 0
  const flags = []

  if (!long && !proof && share < 0.5 && !notes.some((note) => /^Pelkkä vastaus/.test(note))) {
    flags.push(`short problem: a correct answer earns ${Math.round(share * 100)} %; imply routine steps or add a "Pelkkä vastaus" note`)
  }
  if (long) {
    for (const part of rubric.parts) {
      const independent = (part.criteria ?? []).filter((c) => c.impliedBy === undefined && !targets.has(c.id))
      if (independent.length === 0) flags.push(`long problem ${part.label ?? ''}: no understanding criterion outside the answer`.replace('  ', ' '))
    }
    if (!notes.some((note) => /laskuvirhe/i.test(note))) flags.push('long problem: no note on calculation errors')
  }
  for (const part of rubric.parts) {
    for (const display of part.solution?.match(/\$\$[^$]+\$\$/g) ?? []) {
      if (display.length > 90) flags.push(`${part.label ?? 'solution'}: display math may not fit a phone (${display.length} chars)`)
    }
  }
  const sourceErrors = (rubric.reviewNote?.match(/SOURCE ERROR:/g) ?? []).length
  const unresolved = (rubric.reviewNote?.match(/UNRESOLVED:/g) ?? []).length

  for (const flag of flags) warnings.push(`${where}: ${flag}`)
  auditRows.push({
    where,
    total,
    kind: proof ? 'proof' : long ? 'long' : 'short',
    share,
    flags: flags.length,
    sourceErrors,
    unresolved,
  })
}

const progress = []
for (const code of COURSES) {
  const slug = code.toLowerCase()
  const problems = readJson(join(root, 'src/data/problems', `${slug}.json`))
  const rubricPath = join(root, 'src/data/rubrics', `${slug}.json`)
  const rubrics = existsSync(rubricPath) ? readJson(rubricPath) : {}
  const byId = new Map(problems.map((problem) => [problem.id, problem]))

  for (const id of Object.keys(rubrics)) {
    if (!byId.has(id)) errors.push(`${code} ${id}: no such problem in problems/${slug}.json`)
  }

  const sections = new Map()
  for (const problem of problems) {
    const counts = sections.get(problem.section) ?? { total: 0, draft: 0, reviewed: 0 }
    counts.total += 1
    const rubric = rubrics[problem.id]
    if (rubric) {
      checkRubric(`${code} ${problem.id}`, problem, rubric)
      if (auditCourse === code) auditRubric(`${code} ${problem.id}`, problem, rubric)
      if (rubric.status === 'reviewed') counts.reviewed += 1
      else counts.draft += 1
    }
    sections.set(problem.section, counts)
  }
  for (const [section, counts] of sections) progress.push({ code, section, ...counts })
}

console.log('Course  Section    Missing  Draft  Reviewed')
for (const row of progress) {
  const missing = row.total - row.draft - row.reviewed
  console.log(
    `${row.code.padEnd(8)}${row.section.padEnd(11)}${String(missing).padStart(7)}${String(row.draft).padStart(7)}${String(row.reviewed).padStart(10)}`,
  )
}
const totals = progress.reduce(
  (sum, row) => ({ total: sum.total + row.total, draft: sum.draft + row.draft, reviewed: sum.reviewed + row.reviewed }),
  { total: 0, draft: 0, reviewed: 0 },
)
console.log(`\nAll: ${totals.reviewed} reviewed, ${totals.draft} draft, ${totals.total - totals.draft - totals.reviewed} missing of ${totals.total}`)

if (auditCourse) {
  console.log(`
Audit ${auditCourse}: points, kind, share of points a correct answer earns, findings`)
  console.log('Problem              Pts  Kind    Answer  Flags  Source errors  Unresolved')
  for (const row of auditRows) {
    console.log(
      `${row.where.padEnd(20)}${String(row.total).padStart(4)}  ${row.kind.padEnd(6)}${`${Math.round(row.share * 100)} %`.padStart(8)}${String(row.flags).padStart(7)}${String(row.sourceErrors).padStart(15)}${String(row.unresolved).padStart(12)}`,
    )
  }
  if (auditRows.length === 0) console.log('(no rubrics yet)')
}

for (const warning of warnings) console.log(`warning: ${warning}`)
for (const error of errors) console.error(`error: ${error}`)

const pending = progress.filter((row) => row.draft > 0).length
const next = progress.find((row) => row.draft + row.reviewed < row.total)
console.log(`PENDING_DRAFT_SECTIONS=${pending}`)
console.log(`NEXT_SECTION=${next ? `${next.code} ${next.section}` : 'none'}`)

process.exit(errors.length > 0 ? 1 : 0)
