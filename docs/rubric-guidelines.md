# Rubric guidelines

Every rubric batch follows these rules. **This file is yours to edit.** If a batch gets something
wrong, change a rule here or add a line to the Korjausloki at the end. Later batches read it before
writing anything, so a fix made once applies from then on.

Rubrics live in `src/data/rubrics/<course>.json` and score the problems in
`src/data/problems/<course>.json`. They render in the Arviointi tab through `RubricPanel`, the same
way as the hand-written examples in `src/data/evaluation.ts`. Those five examples are the reference
for tone and granularity.

## Point scale

- **Short, easy problems: 4–8 p.** One-step calculations, reading a value off a graph, basic
  simplification. Most of Osa I and many of Osa II.
- **Long problems: 12 p.** Problems with several substantial parts (a, b, c…), multi-step word
  problems, and anything that needs justification across several stages. Split the 12 points across
  the parts according to how much work each part takes.
- Points are whole numbers. Most criteria are **1 p**. Use **2 p** for a step that carries real
  weight (a correct sign analysis, setting up the integral). Use 3 p only in exceptional cases.
- A part's points should reflect the work it takes, not its letter. A trivial a) next to a long b)
  gets fewer points.

## Scoring principles

These decide how the points are split. The audit in `npm run check:rubrics` checks the first two.

- **Short problems (4–8 p): the correct answer outweighs the steps.** A correct final answer with
  reasonable work earns full points. Give the routine steps `impliedBy` the answer criterion, so the
  points a correct answer earns (the answer criterion plus every step it implies) are **at least half
  the total**, and usually all of it. The exception is an answer that can be guessed: yes/no,
  "which one is right", a small integer found by trying. There, the work that rules out guessing is
  crucial, and a note starting `Pelkkä vastaus` says what a bare answer earns.
- **Long problems (12 p): understanding earns points, slips cost only a little.** Every part has at
  least one criterion for understanding that is *not* implied by the answer: setting up the
  equation or model, choosing the method, interpreting the result. Computation results get their
  own criteria, so a calculation slip loses only those. Every long problem has a note on
  calculation errors, e.g. `Laskuvirhe, jonka jälkeen jatko on johdonmukainen: −1 p.` A wrong
  model or method with otherwise correct work keeps the computation points that still make sense.
- **Proofs** ("osoita", "todista") have no answer to imply anything. Score the steps of the
  argument and the conclusion, and say in a note what a proof that skips the key step earns.

## Writing criteria

- Write in **Finnish**, the same way as the YTL "hyvän vastauksen piirteet".
- Each criterion is **concrete and self-checkable**. A student who looks at their own answer must be
  able to say yes or no.
  - Good: `Derivaatta $f'(x) = 3x^2 - 6x - 9$`, `Nollakohdat $x = -1$ ja $x = 3$`
  - Bad: `Laskut oikein`, `Hyvä ratkaisu`
- **Decide for each intermediate step whether it is what the question is checking.**
  - **Routine step:** for example, the factorisation in a "sievennä" task, or rewriting $\sqrt{12} = 2\sqrt{3}$.
    Here the correct final answer already proves the step, so give the step
    `"impliedBy": "<id of the answer criterion>"`. Then:
    - right step, wrong answer: partial points;
    - right answer: full points, whether the step was written or not.

    Marking the answer at full points fills in the implied steps automatically in the app.
  - **Crucial step:** the work *is* the knowledge check. Examples: the sign analysis that justifies an
    inequality's solution set, the discriminant that justifies "no solutions", the algebra when the
    task says "ratkaise algebrallisesti", or deriving $f'(x)$ and solving $f'(x) = 0$ before stating
    extremum points. Leave out `impliedBy`, because a bare answer must not earn these points.
  - This depends on context, so judge it task by task. Ask: "could a student plausibly get this answer
    right without understanding the step?" If yes, the step is crucial.
- If a task is mostly crucial steps, say in a note what a bare answer earns.
- **Accept equivalent forms and other valid methods.** Add `(tai yhtäpitävä)` or name the alternative,
  e.g. `Ratkaisukaava sovellettu oikein (tai yhtälö jaettu tekijöihin)`.
- Exact values are expected unless the problem asks for a decimal. If a decimal answer is acceptable,
  say so.
- Criterion ids are short English or Finnish slugs, unique within the problem: `a-derivative`,
  `b-zeros`, or `formula` for a single-part problem.

## Notes ("Huom.")

Use `notes` for partial credit and deductions that the criteria alone can't express:
- **Follow-on errors:** "Jos kulmakerroin on laskettu väärin, mutta jatko on tehty johdonmukaisesti, enintään 3 p."
- **Missing justification:** "Merkkikaaviosta ilman testikohtia 1 p kohdasta …"
- **Bare answers:** "Pelkästä vastauksesta ilman välivaiheita 1 p."
- **Typical misconceptions specific to this problem**, e.g. forgetting the negative root, or not
  flipping the inequality sign.

Keep notes short. Only add one where a student would otherwise not know how to score.

## Model solution

- Each part has a `solution` in MathText format: `$…$` inline, `$$…$$` display, and `\n` between
  lines. JSON escapes backslashes, so write `\\frac`.
- The rubric panel is phone-width and **long display math gets cut off**. Keep each `$$…$$` to about
  one or two steps. Split long chains into several display lines, each continuing with `= …` or
  `\\iff …`.
- For quotes inside texts, use Finnish quotation marks `”…”`, not `\"`.
- `**bold**` works only around plain text. Bold around a formula shows the asterisks, so write
  `Tapaus 1, $a = 0$:` instead of `**Tapaus $a = 0$:**`. The checker rejects it.
- Base it on the problem's existing `answerBlocks`, but **check the mathematics independently**.
  The rubric's solution must be correct and readable even if the source has mistakes.
- If the source solution is wrong, unclear or incomplete, or answers something the problem doesn't
  ask, write a correct solution in the rubric and **describe the problem in `reviewNote`**. Never
  edit `problems/*.json` silently. The reviewer decides whether the source gets fixed.

## Source fixes

The rubric's solution is always correct, but the problems' own prompts and model answers
(`problems/<course>.json`) are only changed when the fix is **obvious**: a typo, a missing space, or a
wording the reviewer has confirmed. Everything else (a wrong answer, a missing case, an ambiguous
prompt) is **stored, not applied**, in `docs/source-fixes/<course>.md`: the "Applied" list for what
was changed and a "Proposed" table with the problem, what is wrong and the proposed fix. The
reviewer decides; approved proposals are applied in a later pass. The rubric's `reviewNote` still
says `SOURCE ERROR:` for each proposal, and `FIXED:` once the source has been corrected.

## Data format

```json
{
  "OSAI_T1": {
    "status": "draft",
    "maxPoints": 4,
    "parts": [
      {
        "label": "a)",
        "solution": "…",
        "criteria": [{ "id": "a-degree", "text": "Asteluku 2", "points": 1 }],
        "notes": ["…"]
      }
    ],
    "reviewNote": "For the reviewer only: doubts and judgment calls."
  }
}
```

- `parts` follow the problem's a)/b)/c) labels exactly. A problem without labels has one part without
  `label`.
- `maxPoints` is the sum of all criteria points.
- New rubrics are always `"status": "draft"`. A rubric becomes `"reviewed"` only when the reviewer
  approves it.
- Keys are in the problem order of `problems/<course>.json`.

`npm run check:rubrics` enforces the format and prints progress.

## Batch protocol

One batch is **one section of one course**, e.g. MAA3 Osa II (10 problems, or 5 for Osa IV).

1. Run `npm run check:rubrics`. The `NEXT_SECTION` line says which section is next.
2. Read this whole file, especially the Korjausloki. Read the section's problems in
   `problems/<course>.json`, and look at any images (`public/utils/<COURSE>/…`).
3. For each problem: solve it yourself, compare with the source solution, and write the rubric as a
   draft. Note any doubts in `reviewNote`.
4. **Check the mathematics independently.** Add every final answer and key intermediate result to
   `scripts/verify/<course>.py` and run `python scripts/verify/<course>.py` (needs sympy). The script
   recomputes them from the problem statements, not from the source solutions, so it catches source
   errors as well as your own.
5. **Self-review** every rubric against this checklist, and fix what fails:
   - The model solution answers exactly what the problem asks, every case included (special values
     of a parameter, negative solutions, rejected roots).
   - The solution's numbers agree with the verify script.
   - The scoring principles hold: answer share for short problems, understanding criteria and a
     calculation-error note for long ones, a `Pelkkä vastaus` note where the answer is guessable.
   - A student could score their own answer with each criterion: concrete, one thing each.
   - Display math fits a phone (the audit warns on long `$$…$$`).
   - Anything you corrected in the source, or couldn't resolve, is in `reviewNote`, starting with
     `SOURCE ERROR:` or `UNRESOLVED:` so the report can list them.
   - Every `SOURCE ERROR:` has a row in `docs/source-fixes/<course>.md`, and only obvious fixes were
     applied to `problems/<course>.json`.
6. Run `npm run check:rubrics -- --audit <course>`, `npm run lint` and `npm run build`, then fix what
   they report. Audit warnings are allowed only when a `reviewNote` explains why.
7. Commit the rubric file, the verify script and the source-fixes file (plus any obvious prompt fixes), as `Rubrics: <course> <section> (draft)`, and push
   to `rubrics/drafts`.
8. Report briefly:
   - Points per problem.
   - Every `reviewNote`.
   - Judgment calls the reviewer is most likely to want changed.
   - Every `SOURCE ERROR:` and `UNRESOLVED:` note, so the reviewer sees them without opening each rubric.

A batch may also be a whole course when the reviewer asks for one; the steps are the same.

When the reviewer sends feedback:
- It usually arrives as a pasted message from the app's review mode. Open the site with `?drafts`, go to
  Arviointi, then Luonnokset, and use "Kopioi palaute". The message lists approved rubrics, rubrics that
  need fixing with a comment for each, and general rules.
- **Problem-specific fixes** go into that rubric.
- **General rules** ("always…", "never…", "in MAA5…") go into the Korjausloki as a new dated line.
  If needed, also fix the rubrics already written that break the new rule.
- **Approved rubrics** get `"status": "reviewed"`.

## Korjausloki

Corrections from review, oldest first. Each line is a rule that applies to all later batches.
Add a date and the course where it came from.

- 2026-10-14 (MAA2): Don't reserve points for routine intermediate steps that a correct final
  answer already proves. A student who gets the right answer to a "sievennä" or "laske" task without
  writing down every step gets full points. Mark such steps `impliedBy` the answer criterion.
  Reserve points without `impliedBy` only for steps the question is really checking: justifications,
  sign charts, derivations asked for explicitly, and reasoning that leads to "no solution". See
  "Writing criteria".
- 2026-10-31 (MAA2): Short problems: a correct answer outweighs the steps. Long problems: understanding
  earns points of its own and a calculation slip costs only 1–2 p. See "Scoring principles". Every
  batch now verifies its answers with `scripts/verify/<course>.py` and self-reviews with the checklist
  in the batch protocol.
