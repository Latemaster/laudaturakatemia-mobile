# MAA5 source fixes

Problems in `src/data/problems/maa5.json` found while writing the rubrics. The rubrics already use the
correct mathematics; these are about the problems' own prompts, figures and model answers
(`answerBlocks`). See "Source fixes" in `docs/rubric-guidelines.md`.

## Applied (obvious)

- **OSAI_T4** answers: a single `$` spanning several lines showed as raw LaTeX; now `$$…$$`.
- **OSAII_T3** answer b): `$$…$$\begin{aligned}…` chains split so every formula is its own `$$…$$`.
- **OSAII_T5** answers a), b), d): words inside `aligned` (”tai”, ”Olkoon”) wrapped in `\text{…}`.
- **OSAIII_T10** prompt: the two conditions were labelled a) and b), which the app reads as answer parts;
  they are now a bulleted list. Wording unchanged.
- **OSAI_T10** answer: ”kolminkertaistuu tunnissa” → ”kolminkertaistuu puolessa tunnissa” (the factor
  $3^2 = 9$ was already right).
- **OSAIII_T2** answer a): ”$h(2)$” → ”$h(11)$”.
- **OSAIII_T3** prompt: ”hinta on ostohetkellä on 77000” → ”hinta on ostohetkellä 77000”.
- **OSAIV_T4** answer: ”ampilitudia” → ”amplitudia”.

## Proposed (not applied)

| Problem | What is wrong | Proposed fix |
|---|---|---|
| OSAI_T5 a) | The prompt asks for exact values where possible; answerBlocks give only $\sqrt[3]{81} \approx 4{,}33$. e) The reason given for excluding $a < 0$ (”määrittelyehto riippuisi eksponentin etumerkistä”) is not the real one. | a) $\sqrt[3]{81} = 3\sqrt[3]{3}$. e) Negative bases: no even roots, and $(-8)^{\frac{1}{3}} = -2$ but $(-8)^{\frac{2}{6}} = 2$. |
| OSAI_T10 a) | answerBlocks drop the initial amount: $f(t) = 9^t$; the graph virus_kuvaaja.png shows $9^x$. | $f(t) = 3000\cdot 9^t$; redraw the graph. |
| OSAII_T1 | answerBlocks write $\cos\left(\frac{1}{4}\sqrt{5}+1\right) = \frac{\pi}{5}$ (cosine of the coordinate). | $\cos\alpha = \frac{1}{4}(\sqrt{5}+1)$ and $\sin\alpha = \frac{1}{4}\sqrt{10-2\sqrt{5}}$, so $\alpha = 36^\circ = \frac{\pi}{5}$. |
| OSAII_T7 | answerBlocks start from $-2 \le 2-2\cos 5x \le 2$ and get the range $[-4, 0]$. | $-1 \le \cos 5x \le 1$ gives the range $[0, 4]$. |
| OSAIII_T4 a) | answerBlocks compute $t \approx 74{,}3$ but end with ”Alueella voi liikkua turvallisesti 75 vuoden kuluttua” (a sentence from b). | ”Aineesta on jäljellä viidesosa noin 74 vuoden kuluttua.” |
| OSAIII_T5 | Prompt: with an 11-hour period the minimum comes 5,5 h after the maximum (13.35), but the prompt says 15.50. answerBlocks round $c = \frac{16}{3}$ to $5{,}33$, which moves c) from 16:35 to 16:34. | Change the minimum time to 13.35 (or the period); keep $c = \frac{16}{3}$. |
| OSAIII_T6 | answerBlocks get $t > 9{,}49$; the crossing is at $t \approx 9{,}1$. | $t \approx 9{,}1$, i.e. during the 10th year. |
| OSAIII_T8 | The expression is $\frac{0}{0}$ at $x = 1$; answerBlocks claim $-\frac{22}{9}$ for all $x > 0$ and hide the division by $\log_3 x$. | Add $x \ne 1$ (prompt and answer), and divide by $\log_3 x$ explicitly. |
| OSAIII_T9 | The prompt has $\ln(2x+2)-\ln x$; answerBlocks solve it with $\ln(2x)$. | $\ln\frac{2x+2}{x} = \ln\left(2+\frac{2}{x}\right) > \ln\left(1+\frac{1}{2x}\right)$. |
| OSAIII_T10 | answerBlocks accept $x = -\frac{1}{\sqrt{17}}$ and give $76{,}0^\circ$ or $104{,}0^\circ$; at $104{,}0^\circ$ the point is on $y = -4x$. | Only $\theta \approx 76{,}0^\circ$ (on $[0, \pi]$, $\sin\theta \ge 0$ forces $x > 0$). |
| OSAIV_T1 | The prompt says the maximum is reached at $\theta_{\max} = 60^\circ$, but $P = P_{\max}\sin\theta$ peaks at $90^\circ$; the $60^\circ$ is never used. | Drop the sentence about $60^\circ$ (or change the model). |
| OSAIV_T5 b) | answerBlocks restart the model in 2063 with $T_0 = 17{,}2$ ($t \approx 46{,}1$). | $14{,}98+0{,}3e^{0{,}05t} = 20{,}2$, $t \approx 57{,}1$, i.e. $\approx 17{,}1$ years after 2063. |
| OSAIV_T5 c) | answerBlocks say the temperature would not fall when $r < 0$. | $e^{rt}$ decreases to $0$, so $T(t)$ decreases towards $T_0$ but never below it. |
