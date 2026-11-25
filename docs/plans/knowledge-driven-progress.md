# Knowledge levels, points and predicted grade

Three things that used to share one number are separate:

| | What it answers | Where it shows | Comes from |
| --- | --- | --- | --- |
| Points | What have I done? | plus animation, checkpoints, course progress bars | best points per exercise |
| Target grade | How far is my goal? | the rings on Osaaminen and in the top bar | points, capped per course |
| Predicted grade | What would I get now? | its own card on Osaaminen | course knowledge |

Course knowledge also steers the Suositellut feed.

Code: `src/data/knowledge.ts`, `coursePoints.ts`, `foundGap.ts`, `feed.ts`, `points.ts`, `studyPlans.ts` (`getCourseRelevance`). Checked by `npm run check:knowledge`.

## Course knowledge

    knowledge = (priorWeight x prior + earned) / (priorWeight + attempted)

- **earned / attempted** are points: what the student got, out of what was on offer in the tasks they tried. A quick exercise is 1 point. An open task counts its Pisteytys once every criterion is marked and saved. Tasks without a rubric give no evidence.
- **Only the first attempt at a card counts.** Points keep the best score, so a retry can still earn points; it just says nothing about knowledge once the solution has been shown.
- **prior** is the course grade: 4 is 10 %, 7 is 50 %, 10 is 90 %, linear. `priorWeight` is 2 points (two quick exercises). Without a grade it is 0, so one right answer is 100 %.
- Without a grade and without attempts there is no level: "ei tietoa".

The same formula runs per theme, with the course's grade as the prior.

| Level | Percentage |
| --- | --- |
| Heikko | under 25 |
| Kehittyvä | 25-45 |
| Kohtalainen | 45-65 |
| Vahva | 65-85 |
| Erinomainen | 85 and over |

A level from the grade alone is outlined instead of filled and stops at Vahva. Only the label is capped; the percentage (90 for a 10) is used as it is.

**Certainty** = attempted / (2 + attempted): the share of the estimate that rests on answers. It is the certainty bar and the feed's uncertainty boost.

## Course progress bar

Points earned out of the points the course offers (quick exercises plus rubric maximums). It survives a reload. It says nothing about knowledge.

## Target ring

- The target needs `WEEKLY_POINTS_GOAL` x 8 weeks, the same figure as in Edistyminen ajan mittaan: B 80, C 112, M 160, E 224, L 280.
- Each plan course has a **quota** of that, in proportion to its **relevance**: 1 in the plan's first tier, then evenly less (M: 1, 2/3, 1/3).
- A quota never exceeds what the course offers; the rest is shared among the other courses the same way.
- Points from a course count up to **1.5 x its quota**. Courses outside the plan don't count.
- Course grades don't count. Every point still counts in the raw total and the checkpoints.

While all rubrics are drafts, the published app offers 150 points, so M, E and L need 150. The limit lifts as rubrics are reviewed. With the draft rubrics the quotas add up to the full goal.

## Predicted grade

Mean of the ten courses' percentages, equally weighted, through `predictGrade`. A course with nothing known counts as 0, so four strong courses predict C, not L. With nothing known at all the prediction is "–".

The certainty bar is the mean of the courses' certainties, from epävarma to varma.

**Found gap.** When an answer lowers the shown percentage and its course is below Vahva, Osaaminen says "Löytyi aukko: MAA6 Derivaatta" and the course leads the feed. It ends when the course is back at its earlier percentage. Stored in `laudatur.foundGap`.

## Suositellut feed

    priority = (1 - knowledge) x (0.5 + 0.5 x (1 - certainty)) x relevance

- The plan's courses fall into three groups: below Vahva, no data, strong. Each is ranked by priority (`getThemePriority`), ties in plan order; an unknown course counts as knowledge 0. A found gap goes first. Syötteen asetukset lists the groups in that order, so the list matches what the feed gives.
- Inside a course the weakest theme's quick exercises come first. Long tasks run from easy to hard (only MAA2's are tagged with themes).
- Every ten tasks: 7 from courses below Vahva, 2 from strong courses, 1 from a course with no data. The three highest-ranked courses of each group take turns.
- At most 3 of ten from one course. When a group has nothing left, its turns go to the next group; the cap gives way only when too few courses have tasks left.
- A student's own order in Syötteen asetukset turns all this off and rotates the list as before.
- Answered cards come last. The order is set when the feed opens, never under the student's thumb.

## Examples (target M, published content)

| Student | Levels | Prediction | Certainty | Ring | First ten tasks |
| --- | --- | --- | --- | --- | --- |
| 11/12 right in each of MAA2-5, rest empty | MAA2-5 Erinomainen, rest ei tietoa | C (37 %) | 34 % | 44 / 150 p | MAA 6 7 2 9 6 7 9 6 3 7 |
| Grades only (10 9 8 7 5 4 6 7 8 5) | Vahva to Heikko, all outlined | M (49 %) | 0 % | 0 / 150 p | MAA 7 6 3 5 7 6 5 7 2 6 |
| New student | all ei tietoa | – | 0 % | 0 / 150 p | MAA 2 3 6 2 3 6 2 3 6 7 |

MAA8 is not in the app, so "MAA6-8" is MAA6 and MAA7.

## Stored data

- `laudatur.knowledge` stays at version 1. An attempt may have `max` (points, 1 when absent) and `result` is any number from 0 to 1. Old attempts load as they are; the removed pre-poll's `polls` are ignored, as before.
- `tasksBackfilled`: open tasks scored in full before this change are copied in once.
- `laudatur.points`, `laudatur.courseGrades`, `laudatur.feedPrefs` and `laudatur.targetGrade` are unchanged.
