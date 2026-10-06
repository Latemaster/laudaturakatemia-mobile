# Knowledge score model (osaaminen)

How the app estimates what a student knows, theme by theme, so that the
Osaaminen page can show "strong in polynomials, weak in word problems" instead
of one number per course, and so the Suositellut feed can later target the
weak themes.

Code: `src/data/themes.ts` (what the themes are), `src/data/knowledge.ts`
(state, scoring, persistence). The Osaaminen page shows the scores per
theme and hosts the pre-poll; quick-exercise answers are recorded from the
feed.

## What it replaces

Today `progress.ts` measures *engagement*: the share of a course's cards the
student has opened. The predicted grade on the Osaaminen page is built on
that, and the info panel admits it ("perustuu käytyihin tehtäviin, ei vielä
oikeisiin vastauksiin"). The knowledge model keeps engagement as a progress
measure and adds a separate *correctness* measure that the grade prediction
can switch to once the UI is built.

## Vocabulary

| Level | Example | Where it is defined |
| --- | --- | --- |
| Course (kurssi) | MAA2 | `courses.ts` |
| Theme (teema) | "Toisen asteen yhtälö ja nollakohdat" | `themes.ts`, 3–6 per course |
| Concept (käsite) | "Diskriminantti" theory box | `theory/maa2.ts`, index in file order |
| Card (kortti) | quick exercise, open-answer task | `exercises/*.ts`, `problems/*.json` |

A theme is a group of concepts. Every concept of a course belongs to exactly
one theme. Scores exist at the theme level; course and overall scores are
averages of theme scores.

Theme ids such as `maa2-polynomit` are stored in the student's data, so they
are stable keys. The display name can change freely; the id is a migration.

## Tagging cards with themes

**Quick exercises need no new data.** Each already follows a concept box
(`conceptIndex`, explicit or positional, resolved by
`groupExercisesByConcept`). The exercise's theme is the theme that owns that
concept. All 150 existing exercises resolve this way.

**Open-answer tasks carry an explicit `themes` list** in `problems/<course>.json`,
because one problem often spans several themes (a word problem that ends in
a quadratic is both "Soveltaminen" and "Toisen asteen yhtälö"). An attempt
counts as full evidence for every listed theme. MAA2 is fully tagged as the
worked example; the other nine courses still need tagging, and
`getThemeIssues()` lists them (logged to the console in dev).

An untagged task still counts towards engagement, just not towards any theme
score. A task tagged with an unknown theme or another course's theme is also
reported by `getThemeIssues()`.

## Pre-poll (esikysely)

Before the student has done any exercises on a theme, the only thing we can
know is what they tell us. The pre-poll asks, per theme, one question with
four answers:

| Level | Answer | Starting score |
| --- | --- | --- |
| 0 | En ole opiskellut | 15 % |
| 1 | Muistan jotain | 35 % |
| 2 | Osaan perusteet | 60 % |
| 3 | Osaan hyvin | 85 % |

The answer becomes the theme's *prior* with a weight of 2, that is, it counts
like two correct or two wrong quick exercises. That is enough that the score
starts where the student said, and little enough that a handful of real
answers takes over.

The questionnaire lives in the "Osaaminen esitiedot" section of the
Osaaminen page: under each course's grade picker there is a collapsible
"Esikysely teemoittain" row listing the course's themes, each with the four
answers as buttons (tapping the selected one again clears it). A short card
at the top of a course feed the first time it is opened would be a second
natural place to ask; the model only needs the answers to exist per theme.

**Fallbacks when the poll is unanswered**, in order:

1. The course grade (4–10) the student already reports in "Osaaminen
   esitiedot", mapped linearly so that 4 → 10 %, 7 → 50 %, 10 → 90 %, with
   weight 1. It is a coarser signal than a per-theme answer, so it counts
   half as much.
2. A neutral 50 % with weight 1. The theme is then flagged `hasData: false`
   and should be shown as "ei tietoa" rather than as a real 50 %.

## Evidence: attempts

Every answer to a tagged card is an *attempt* with a result in {0, ½, 1}.

- **Quick exercises** are checked by the app: correct = 1, wrong = 0.
- **Open-answer tasks** have no checker. After "Näytä ratkaisu" the student
  rates their own answer: "Oikein" = 1, "Osittain" = ½, "En osannut" = 0.
  This self-check does not exist in the UI yet; it is the one new control
  the model needs. Viewing the solution without rating still counts as
  engagement, but gives no evidence.
- **Only the first attempt at a card counts.** Once the solution has been
  shown, "Yritä uudelleen" tells us nothing new. `recordAttempt` ignores a
  second attempt at the same card.

Each attempt has a weight. A quick exercise always weighs 1. A task's
maximum weight depends on its difficulty (easy 1, mid 2, hard 3), but the
maximum is only reached by a correct answer:

    weight = 1 + (maxWeight − 1) × result

So a solved hard problem weighs 3, a partly solved one 2, a failed one 1.
Solving a hard problem is strong evidence of mastery; failing one says little
about the basics, and this keeps one failed Osa IV proof from wiping out a
run of correct easy work. Hard caps at 3 rather than the 5 exam points
`DIFFICULTY_POINTS` gives it for the same reason.

## The score

For each theme:

    score = (priorWeight × prior + Σ weightᵢ × resultᵢ) / (priorWeight + Σ weightᵢ)

in 0..1, shown as a percentage. It is a weighted mean of the prior and every
attempt, which keeps it explainable in an info panel: "your answer counts as
two exercises, each exercise counts once, a solved hard task counts three
times".

Alongside the score:

- **evidence** = Σ weightᵢ, and **confidence** = min(1, evidence / 6). Six is
  roughly three quick exercises plus an easy and a mid task. Confidence is
  what lets the UI say "arvio tarkentuu" and what the recommendation
  priority uses below.
- **level**: ≥ 70 % Vahva (green, the `high` tier), ≥ 40 % Kehittyvä (blue,
  `mid`), below that Heikko (red, `low`). Same tier names as the grade
  colours so the existing classes apply.
- **hasData**: a poll answer or at least one attempt exists.

### Worked example

MAA2, theme "Toisen asteen yhtälö ja nollakohdat", no course grade:

| Step | Score | Evidence | Confidence | Level |
| --- | --- | --- | --- | --- |
| Pre-poll "Osaan perusteet" | 60 % | 0 | 0.00 | Kehittyvä |
| Quick exercise on the discriminant, correct | 73 % | 1 | 0.17 | Vahva |
| Easy task (Osa I T7), self-rated "Osittain" | 68 % | 2 | 0.33 | Kehittyvä |
| Hard task (Osa III T3), "En osannut" | 54 % | 3 | 0.50 | Kehittyvä |
| Hard task (Osa III T1), "Oikein" | 71 % | 6 | 1.00 | Vahva |
| Retry of the same task, wrong | 71 % | 6 | 1.00 | ignored |

The last task is also tagged "Soveltaminen", so that theme moved too.

## Course and overall scores

- **Course score** = mean of its theme scores, weighted by each theme's
  `weight` (default 1; raise it for themes the exam asks about more). Course
  confidence is the plain mean of theme confidences.
- **Overall percentage** = mean of the course scores × 100, on the same
  0–100 scale as today's engagement percentage, so `predictGrade` can take
  it unchanged. Whether the overall should instead weight courses by the
  study plan (e.g. MAA2–MAA3 count more for a B target) is left open.

## Hook for the Suositellut feed

Not built yet, but the contract is in `getThemePriority`:

    priority = (1 − score) × (0.5 + 0.5 × (1 − confidence)) × relevance

The gap to full mastery, boosted while the score is unsettled so an untested
theme gets checked before a known-weak one is drilled to death, multiplied by
the study plan's relevance for the theme (0 = not in the plan, 1 = core).
The feed would sort themes by priority and pull cards from the top ones,
with the plan still deciding which difficulty tiers are in scope.

## Persistence

`laudatur.knowledge` in localStorage, versioned:

```json
{
  "version": 1,
  "polls": { "maa2-polynomit": 2 },
  "attempts": { "maa2-exercise-1": { "result": 1, "at": 1759740000000 } }
}
```

`loadKnowledge` drops anything that doesn't validate (unknown theme ids,
odd result values) and starts fresh on a version mismatch. The `at`
timestamp is stored but unused by the score, so a later version can decay
old evidence or draw a real history for the "Edistyminen ajan mittaan"
chart, which is example data today.

## Next steps

Done so far: theme scores under each course row on Osaaminen, quick-exercise
answers recorded as attempts, the pre-poll in "Osaaminen esitiedot".

1. Tag the tasks of MAA3–MAA12 with themes (data work, `getThemeIssues`
   tracks it).
2. Add the self-check ("Oikein / Osittain / En osannut") to task cards after
   the solution is shown.
3. Switch the predicted grade to `overallPct` from `computeKnowledge`.
4. Build the Suositellut ordering on `getThemePriority`.
