# MAA2 source fixes

Problems in `src/data/problems/maa2.json` found while writing the rubrics. The rubrics already use the
correct mathematics; these are about the problems' own prompts and model answers (`answerBlocks`),
which the app shows elsewhere. See "Source fixes" in `docs/rubric-guidelines.md`.

## Applied (obvious)

- **OSAIII_T4 c)** prompt: ”3,1 metriä korkea ja 3,0 metriä korkea auto” → ”3,1 metriä leveä ja 3,0
  metriä korkea auto” (confirmed by the reviewer, 2026-11-01).
- **OSAIII_T10** prompt: ”Nollasta eroava uku” → ”luku”, double space removed.
- **OSAIII_T8** prompt: missing space in ”päteekö$\sqrt{…}”.
- **OSAIII_T3** prompt: double space in ”Millä  vakion”.

## Proposed (not applied)

| Problem | What is wrong | Proposed fix |
|---|---|---|
| OSAII_T4 | answerBlocks state the solution interval as $-2 < x \le 1$; the upper bound has no justification. The final answer is right. | Replace ”Näin ollen ratkaisuväli on $-2 < x \le 1$” with ”Näin ollen kelpaavat vain ratkaisut, joille $x > -2$”. |
| OSAII_T10 | answerBlocks set the outer rectangle $(25+2x)(50+2x) = 1500$ and get 1,60 m. The tiles cover the outer rectangle minus the pool. | Use $(25+2x)(50+2x)-1250 = 1500$, answer $\approx 8{,}21$ m (the rubric's solution). |
| OSAIII_T3 | answerBlocks miss $a = -\frac{9}{4}$, where the equation is linear with one solution. | Add the linear case; answer $a = -\frac{9}{4}$, $a = -2$ or $a = 4$. Or, if only the quadratic case is wanted, say so in the prompt. |
| OSAIII_T6 | answerBlocks solve a different problem (perimeter 240 m, sides differing by 20 m, 50 m × 70 m). | Solve $x \cdot 2x = 240$: sides $2\sqrt{30} \approx 11{,}0$ m and $4\sqrt{30} \approx 21{,}9$ m. Or reword the prompt if a perimeter was meant. |
| OSAIII_T7 | answerBlocks reject $y = -20$ with a condition $y > 0$ the problem doesn't have. | Give both triples, $19, 20, 21$ and $-21, -20, -19$; or ask for positive integers in the prompt. |
| OSAIII_T8 | The printed claim $\sqrt{4-\sqrt{17}} = 33-8\sqrt{17}$ fails trivially (left side undefined); answerBlocks hint that $\sqrt{33-8\sqrt{17}} = 4-\sqrt{17}$ was meant. | Decide which claim is intended; if the second, change the prompt and answer ”ei päde, koska $4-\sqrt{17} < 0$; oikea arvo on $\sqrt{17}-4$”. |
| OSAIV_T2 b) | answerBlocks give the domain as $x \le -1$ or $x > 0$ (it is $x \le -\frac{1}{2}$ or $x > 0$) and say $f$ increases on $x \le -1$, then call it strictly decreasing there. | Domain $x \le -\frac{1}{2}$ tai $x > 0$; decreasing on both intervals with values $[0, 1[$ and $]1, \infty[$, or the rubric's algebraic proof. |
| OSAIV_T4 | answerBlocks assert that one of five consecutive integers is divisible by 5 without proof. | Add the division-algorithm case analysis from the rubric's solution. |
