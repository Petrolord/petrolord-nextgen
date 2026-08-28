# The J column

Lesson 1 built the factor and walked one row. This lesson walks all five, and puts the engine's full-precision column beside the book's printed one. The two columns describe the same curve, but they are not the same numbers, and the discipline of this lesson is learning to hold both without confusing them.

## The multiplication, five times

Every row of the lab table is multiplied by the same 0.0967993827459659 per psi. The engine's `computeJTable` returns, at full double precision:

| $S_w$ | $P_c$ (psi) | engine $J$ | book prints |
|---|---|---|---|
| 0.2 | 1.75 | 0.16939891980544033 | 0.169 |
| 0.4 | 1.05 | 0.1016393518832642 | 0.102 |
| 0.6 | 0.75 | 0.07259953705947443 | 0.073 |
| 0.8 | 0.60 | 0.058079629647579546 | 0.058 |
| 1.0 | 0.50 | 0.04839969137298295 | 0.048 |

Read the pairs across. At every saturation the book's entry is the engine's value rounded to three decimals: 0.16939891980544033 becomes 0.169, 0.07259953705947443 rounds up to 0.073, and so on. There is no disagreement anywhere. There is only precision.

The engine value at $S_w = 0.2$, all seventeen digits of it, is your second capstone value, graded at a tolerance of 0.0005. The printed 0.169 sits 0.0004 away from it, inside the tolerance, so a careful reader of the book passes that field too. That is deliberate: the tolerance was set so that BOTH legitimate versions of the number pass, and only actual errors fail.

## Worked example: the middle row

Do $S_w = 0.4$ end to end. The printed $P_c$ is 1.05 psi.

$$J(0.4) = 0.0967993827459659 \times 1.05 = 0.1016393518832642$$

Round to three decimals and you print 0.102, exactly as Ahmed does. Now notice what you cannot do: starting from the printed 0.102, no amount of care recovers 0.1016393518832642. Rounding is a one-way door. The full value can always produce the print; the print can never reproduce the full value.

## Why the column is the deliverable

The J column, not the Pc table, is what the example exists to produce. Pc in psi is stuck to one plug: it carries $k$, $\phi$ and the lab fluid system inside it. J has had all of that divided out. It is dimensionless, and if Leverett's claim holds for this rock family, it is the SAME column you would have measured on any other plug of the family, whatever its permeability and whatever fluid pair the lab happened to use. That is what "it travels" means, and it is why step 3 of the example can rebuild Pc on a rock nobody ever measured.

A practical habit follows: when you archive a capillary measurement, archive the J column and the sample properties together. The Pc table alone, without $k$, $\phi$, $\sigma$ and $\theta$, cannot be carried anywhere.

## The misconception to avoid

The mistake this lesson exists to prevent: treating the printed three-decimal values as THE J-function, and the engine's seventeen digits as some kind of excess. Both columns are legitimate. The book's column is the engine's column reported at the precision a printed page affords. What is not legitimate is mixing them silently: quoting 0.169 in one line of a report and 0.16939891980544033 in the next as if they were interchangeable inputs, because a downstream calculation started from one or the other, and (as lesson 4 measures) the two starts do not land in the same place.

Name which column you hold. Every number in this course that came from a printed page says so, and every number that came from the engine says so.

## At the panel, later

The panel for this module family works on the Ekene plugs rather than the Nameless Field, so there is no marker here; the Ahmed chain is deliberately a by-hand exercise. Working it with a calculator, not a slider, is what makes the rounding visible.

## Exercise

First, compute the engine-precision J at $S_w = 0.8$ from the printed $P_c$ of 0.60 psi, write down what it rounds to at three decimals, and confirm both against the table above.

Second, your colleague reports "J at 0.6 is 0.073" and asks you to recover the Pc that produced it. Compute $0.073 / 0.0967993827459659$, compare it with the true 0.75 psi, and state in one sentence why the recovered value misses, and by how much.
