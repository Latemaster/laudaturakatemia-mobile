# Knowledge score model (osaaminen)

How cards are tagged with courses and themes. What is computed from them (the
knowledge formula and levels, certainty, the predicted grade, the target ring
and the feed) is in
[plans/knowledge-driven-progress.md](plans/knowledge-driven-progress.md),
which replaced this document's first version of the score.

Code: `src/data/themes.ts` (what the themes are), `src/data/knowledge.ts`
(state, scoring, persistence).

## Vocabulary

| Level | Example | Where it is defined |
| --- | --- | --- |
| Course (kurssi) | MAA2 | `courses.ts` |
| Theme (teema) | "Toisen asteen yhtälö ja nollakohdat" | `themes.ts`, 3–6 per course |
| Concept (käsite) | "Diskriminantti" theory box | `theory/maa2.ts`, index in file order |
| Card (kortti) | quick exercise, open-answer task | `exercises/*.ts`, `problems/*.json` |

A theme is a group of concepts. Every concept of a course belongs to exactly
one theme. A course and its themes are scored separately, with the same
formula: a course's score is not an average of its themes.

Theme ids such as `maa2-polynomit` are stable keys. The display name can
change freely.

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

An untagged task still counts towards its course's knowledge, just not towards
any theme score. A task tagged with an unknown theme or another course's theme is also
reported by `getThemeIssues()`.

## Next steps

1. Tag the tasks of MAA3–MAA12 with themes (data work, `getThemeIssues`
   tracks it), so the feed can order their long tasks by theme too.
2. Review the rubrics: a task without a reviewed rubric gives no points and
   no evidence in the published app.
