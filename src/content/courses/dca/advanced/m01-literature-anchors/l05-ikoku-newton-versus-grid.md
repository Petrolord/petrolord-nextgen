# Ikoku: Newton versus the grid

The eighth armed case is the one our engine cannot reproduce, and that is exactly why it is the most instructive.

Case `ahmed-reh-16-3-ikoku-hyperbolic-forecast`, Ahmed REH 4th ed., Example 16-3, pp. 1253 to 1256, on Ikoku's 1984 gas well. The book fits it with a Newton iteration that converges to $b = 0.519514$, prints $b = 0.5195$, derives $D_i = 0.3668$ per year from Eq. 16-21 with $q_i = 10$ MMscf/d, and prints a 25-row forecast out to 20 years.

Our engine finds $b$ by scanning a grid in steps of 0.05. It cannot land on 0.5195. Not approximately, not with tighter convergence, not ever. So what does it mean to say the engine is validated against this case?

## First, the case's own rounding trap

The book shows a daily decline "rounded to 0.001", but the printed cumulative table was computed with the unrounded $0.3668/365 = 0.00100493150684932$ per day. The fixture note records what was found while typing: the rounded 0.001 is half a percent off every row, and the unrounded value reproduces the table to about $3 \times 10^{-5}$.

Confirm it. Holding $q_i = 10$ MMscf/d, $b = 0.5195$ and $D_i = 0.00100493150684932$ per day, the worst relative error across all 25 published rate rows is $4.97309481548787 \times 10^{-5}$, against the case's `rate_rel` tolerance of 0.0002. There was never anything wrong with the book; there was something wrong with reading four significant figures off a page and using three.

The fixture note carries a second correction of the same kind: the cumulative column header says MMscf but the values are MMMscf, because the Step-7 formula yields scf. Both were caught by typing the numbers in carefully, not by any test.

## What the grid can and cannot do

Build the grid by repeated addition, as the engine does, and the rungs on either side of 0.5195 are `0.49999999999999994` and `0.5499999999999999`. Hold the book's $q_i$ and $D_i$ fixed and evaluate the 20-year endpoint at all three exponents:

| $b$ | $q$ at 20 yr (MMscf/d) | $G_p$ at 20 yr (MMMscf) |
|---|---|---|
| 0.5195 (Newton) | 0.4861129035 | 15.86615873 |
| 0.49999999999999994 (rung below) | 0.4589213952 | 15.63838903 |
| 0.5499999999999999 (rung above) | 0.5292595272 | 16.22063921 |

Published: $q = 0.486091$ and $G_p = 15.86563$ MMMscf.

Now fit quality. RMSE of each exponent against the full published rate table, in MMscf/d:

| $b$ | RMSE |
|---|---|
| 0.5195 | 0.0000909716241457340 |
| rung below | 0.0303304648613343 |
| rung above | 0.0473456858025517 |

The Newton value is better by a factor of 333. On any RMSE-based selection the grid picks the lower rung, and picks it decisively; the objective is not flat here, it is simply not sampled where the minimum is. Yet the cumulative that lower rung produces is 15.63838903 against a published 15.86563, low by about 1.4 percent. A parameter 333 times worse in RMSE is 1.4 percent wrong in the number the parameter exists to produce.

## The honest experiment: hand the table to the engine

The comparison above froze $q_i$ and $D_i$ at the book's values, which is generous. Do the real thing instead: feed the 25 published rate rows to `fitArpsModel` as dated data and let the engine fit all three parameters its own way.

| quantity | engine | book |
|---|---|---|
| $q_i$ (MMscf/d) | 9.713071524956366 | 10 |
| $D_i$ (per day) | 0.0009546080744789834 | 0.00100493150684932 |
| $D_i$ (per year) | 0.34843194718482895 | 0.3668 |
| $b$ (raw) | 0.49999999999999994 | 0.5195 |
| $R^2$ | 0.999271996249394 | n/a |
| RMSE | 0.07146043481429387 | n/a |

Look at what the fit did. Denied the exponent it wanted, it did not take the nearest rung and keep everything else. It lowered $q_i$ by nearly three percent and $D_i$ by five percent to buy back some of what the wrong $b$ cost it. **Arps parameters trade against each other.** You cannot read a single fitted parameter as an estimate of a physical quantity; you read the triple, and the triple describes a curve.

And then the payoff. Push that fitted triple out to 20 years:

$$q(20\text{ yr}) = 0.48301820175483423 \text{ MMscf/d}, \qquad G_p(20\text{ yr}) = 15.811857869920358 \text{ MMMscf}$$

against published values of 0.486091 and 15.86563. The cumulative is low by 0.33892212335496076 percent. The engine could not reproduce the book's parameter and reproduced the book's answer to a third of one percent.

## What "reproducing a published result" means

That is the sentence to take out of this module. A reproduction is a claim about a **deliverable at a stated tolerance**, not about a parameter. Notice what the fixture asserts on this case: `rate_rel` 0.0002 and `gp_rel` 0.0005, on rates and cumulatives. It never asserts the fitted $b$ against 0.5195, because that would test the search algorithm rather than the physics, and it would fail by design.

So when is a grid good enough?

**A grid is good enough when the parameter is an intermediate.** If $b$ exists in your workflow only to produce a rate forecast and a cumulative, and the deliverable reconciles within your stated tolerance, the quantisation is absorbed by the other two parameters and you have lost nothing that matters.

**A grid is not good enough when the parameter is the deliverable.** Three cases: when the $b$ itself is reported, carried to an analog well, or compared against a play-level governance rule, because then a 0.05 bin is being read as a number; when the fit sits near the top of the search range, where the answer is a boundary rather than a minimum; and when small changes in $b$ move the booking a lot, which at high $b$ they do violently, as module 2 measures.

The misconception this retires is worth naming: **precision is not accuracy**. The book prints six digits of $b$ because Newton's method converged to six digits, not because the data supports six digits. Ikoku's well constrains $b$ to a range, and the honest report of this fit is a bin with a stated width, whichever method drew it.

## Worked example

Reproduce the $t = 4$ year row by hand at the book's parameters. With $q_i = 10$, $b = 0.5195$, $D_i = 0.00100493150684932$ per day and $t = 1460$ days,

$$q = \frac{10}{(1 + 0.5195 \times 0.00100493150684932 \times 1460)^{1/0.5195}}$$

The published value is 3.36 MMscf/d with a published cumulative of 8.44669 MMMscf. Then repeat with $D_i$ rounded to 0.001 per day and confirm the half-percent offset the fixture warns about. Two evaluations, one calculator, and you have verified both the anchor and the trap yourself.

## Exercise

The engine's fit of the Ikoku table returned $q_i = 9.713071524956366$ MMscf/d and $D_i = 0.0009546080744789834$ per day at $b = 0.49999999999999994$, with a 20-year cumulative 0.33892212335496076 percent below the published figure. Write the three-sentence reconciliation note for a validation report: what was compared and at what tolerance; why the fitted exponent differs from the published one and why that is expected rather than a defect; and the single condition under which you would refuse the reconciliation. Keep the third sentence specific. "If the error were larger" is not an answer; name the quantity and the situation.
