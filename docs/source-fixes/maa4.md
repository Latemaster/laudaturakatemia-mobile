# MAA4 source fixes

Problems in `src/data/problems/maa4.json` found while writing the rubrics. The rubrics already use the
correct mathematics; these are about the problems' own prompts, figures and model answers
(`answerBlocks`). See "Source fixes" in `docs/rubric-guidelines.md`.

## Applied (obvious)

- **Broken `$$` delimiters** in the answerBlocks of OSAI_T7, OSAII_T2, OSAII_T10, OSAIII_T1, OSAIII_T2,
  OSAIII_T3, OSAIII_T4, OSAIII_T5, OSAIII_T7, OSAIII_T10 and OSAIV_T1 b). Chains like
  `$$A$$B$$C$$` showed every other formula as raw LaTeX; each formula is now its own `$$…$$`, and
  trailing punctuation (”, $t \in \mathbb{R}$”) stays with its formula. No content changed.
- **OSAIV_T3** answer: `\intertext{…}` inside `aligned` (not supported by KaTeX, so the whole proof
  showed as an error) split into the aligned block, a prose line and `$$ax + by + cz + d = 0$$`.
- **OSAII_T1** answer b): `$3x - 2 \le 4$` → `$\left|3x - 2\right| \le 4$` (missing absolute value bars).
- **OSAII_T1** answer c): ”yhtälöllä ei ole ratkaisua” → ”epäyhtälöllä ei ole ratkaisua”.
- **OSAIV_T1** prompt: removed a stray block containing only ”.”.
- **OSAIV_T4** prompt a): ”Muodosta summavektori Muodosta summavektori” → ”Muodosta summavektori”.
- **OSAIV_T5** answer: ”kulkeavan” → ”kulkevan”.

## Proposed (not applied)

| Problem | What is wrong | Proposed fix |
|---|---|---|
| OSAII_T9 | The answer ”ei voida” rests on $r = 0$. But $\overline{a}$, $\overline{b}$, $\overline{c}$ are linearly independent, so $\overline{d} = 0\cdot\overline{a}+2\overline{b}-2\overline{c}$ is a valid (unique) decomposition if a zero component is allowed. | Decide the convention. Either reword the prompt (”nollasta eroaviin komponentteihin”) or change the answer to ”voi: $\overline{d} = 2\overline{b}-2\overline{c}$, $\overline{a}$-komponentti on nollavektori”. |
| OSAIII_T2 | answerBlocks give the centre as $(2a, a)$. | Centre $(2a, -a)$. |
| OSAIII_T3 | answerBlocks evaluate $\sqrt{5^2+(-3)^2}$ as $5$; the lines $5x-3y-31 = 0$ and $5x-3y+39 = 0$ are only $\frac{35}{\sqrt{34}} \approx 6{,}0$ away. The figure Suorat_etaisyys.png shows the same wrong lines. | $\lvert 5x-3y+4\rvert = 7\sqrt{34}$, lines $5x-3y+4 \mp 7\sqrt{34} = 0$; redraw the figure. |
| OSAIII_T4 b) | answerBlocks get $83^\circ$, and the working ($\overline{v}\cdot\overline{a} = s$, $\lvert\overline{v}\rvert = \sqrt{41}\lvert s\rvert$) mixes the parameter into the vectors. | $\cos\alpha = \frac{\lvert\overline{v}\cdot\overline{j}\rvert}{\lvert\overline{v}\rvert} = \frac{1}{\sqrt{41}}$, $\alpha \approx 81{,}0^\circ$. |
| OSAIV_T2 | answerBlocks keep $c$ although the line passes through the origin ($c = 0$), then divide by $a+bk$, which is $0$ for a line $y = kx$ on $ax+by = 0$. The resulting equation is meaningless. | $c = 0$; for $b \ne 0$, $y = -\frac{a}{b}x$ and $(a^2+b^2)x^2 = b^2r^2$, so the points are $\pm\left(\frac{br}{\sqrt{a^2+b^2}}, -\frac{ar}{\sqrt{a^2+b^2}}\right)$; for $b = 0$, $(0, \pm r)$. |
| OSAIV_T4 b) | $10\cos 32^\circ = 8{,}48$ N is rounded to ”9 N” and $5{,}30$ N to ”5 N”; magnitudes are written with vector bars. a) only shows the figure, without saying the sum is $\overline{0}$. | $N \approx 8{,}5$ N, $F_\mu \approx 5{,}3$ N, without bars; a) add ”$\overline{G}+\overline{F}_\mu+\overline{N} = \overline{0}$, koska nopeus on vakio”. |
| OSAIV_T5 a) | The walk is taken as cabin → midpoint → meeting point ($10\sqrt{2}+44{,}2 \approx 58{,}3$ units, rounded to 600 m). Each walks straight to the meeting point, the hypotenuse $\approx 46{,}37$ units $\approx 464$ m. Departures 18.55 and 18.50 become 18.56 and 18.52. Also $d_1 \approx 51{,}2$, not 47. | Distance $\sqrt{200+44{,}16^2} \approx 46{,}37$ units $= 464$ m; Tupu $232$ s, leaves 18.56; Hupu $464$ s, leaves 18.52. |
