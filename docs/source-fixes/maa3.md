# MAA3 source fixes

Problems in `src/data/problems/maa3.json` found while writing the rubrics. The rubrics already use the
correct mathematics; these are about the problems' own prompts, figures and model answers
(`answerBlocks`). See "Source fixes" in `docs/rubric-guidelines.md`.

## Applied (obvious)

- **OSAIII_T9** prompt: ”Tasakylkisen kolmion kanta on kylki on 5 ja kanta 8” → ”Tasakylkisen kolmion
  kylki on 5 ja kanta 8”.

## Proposed (not applied)

| Problem | What is wrong | Proposed fix |
|---|---|---|
| OSAI_T4 | answerBlocks compute 0,75 km correctly but answer ”1 km”. | Answer $750$ m (or $0{,}75$ km). |
| OSAI_T5 | In the figure the side 5 is adjacent to $\theta$, so $\cos\theta = \frac{5}{7}$; answerBlocks use $\sin\theta = \frac{5}{7}$ and conclude $\theta > \alpha$. | $\theta = \cos^{-1}\frac{5}{7} \approx 44{,}4^\circ$, $\alpha \approx 45{,}6^\circ$, so $\theta < \alpha$. |
| OSAII_T1 | answerBlocks get $\beta = 100^\circ$ but then $\alpha = \frac{130^\circ}{2} = 65^\circ$. | $\alpha = \frac{\beta}{2} = 50^\circ$ (inscribed angle on $\beta$'s arc; also $180^\circ-130^\circ$ in the cyclic quadrilateral). |
| OSAII_T3 | answerBlocks use $78^\circ$ as the angle between the two sides of length 7 and get $\lvert AC\rvert \approx 9$. With $\lvert AB\rvert = \lvert BC\rvert = 7$, $78^\circ$ is a base angle. The prompt also gives only $DE \parallel FG$, but the solution needs $DE \parallel AB$. | $\lvert AC\rvert = 2 \cdot 7\cos 78^\circ \approx 2{,}9$. Prompt: ”$DE \parallel AB$” (or $DE \parallel FG \parallel AB$). |
| OSAII_T5 | answerBlocks compute $h = x\tan 4{,}0^\circ \approx 0{,}063$ km but write $0{,}63$ km $= 630$ m. | $h \approx 63$ m. (The real tower is 330 m; if a realistic answer is wanted, the angles need changing.) |
| OSAII_T8 | The figure puts the semicircle's diameter on the square's side, which contradicts $r = 1$ with diagonal $2\sqrt{3}$. | Decide: keep $r = 1$ and redraw the figure (answer $\frac{\pi}{12}$), or drop $r = 1$ (then $r = \frac{\sqrt{6}}{2}$ and the answer is $\frac{\pi}{8}$). |
| OSAII_T10 | With legs 6 and 5 the angle would be $\tan^{-1}\frac{5}{6} \approx 39{,}8^\circ$, not $28^\circ$; trigonometry gives a different area than similarity. | Change the figure's angle to match the sides (or the sides to match $28^\circ$). |
| OSAIII_T1 | answerBlocks answer $0 < a < 4$ or $a > 4$; the sides form a triangle only when $a > 2$. | Add the triangle inequality: $2 < a < 4$ or $a > 4$. |
| OSAIII_T2 b) | answerBlocks take the central angle as $\sin^{-1}\frac{R}{R+h}$ and get a 174 km swim. | Angle $\cos^{-1}\frac{R}{R+h} \approx 0{,}217^\circ$; swim $\approx 24{,}2$ km. |
| OSAIII_T3 | The solution figure (Aitsaari.png) uses $75^\circ$ (prompt: $78^\circ$) as the interior angle; answer 2,8 km. | Interior angle $180^\circ-78^\circ = 102^\circ$, island angle $33^\circ$, distance $\approx 4{,}5$ km; redraw the figure. |
| OSAIV_T2 | answerBlocks conclude the inner quadrilateral is a square from equal sides only (a rhombus has those too). | Add: each inner angle is $180^\circ-(\alpha+\beta) = 90^\circ$. |
