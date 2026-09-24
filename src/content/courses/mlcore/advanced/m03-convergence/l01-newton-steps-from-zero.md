# Newton steps from zero

{{panel:ml-diagnose-explorer}}

Least squares has a closed form: one solve gives the coefficients. Logistic regression has none. The engine reaches its coefficients by Newton-Raphson steps, starting from every coefficient at zero, and this module reads those steps, the rule that stops them, and what happens when they are cut short. The fit to read is the Professional tier's pay model: RHOB, NPHI and RT with an intercept, on the 210 rows of the training wells, 10 iterations to converge.

| iteration | largest component of the full Newton step | log likelihood after the step | step halvings |
| --- | --- | --- | --- |
| 1 | 1.024456 | -46.305377 | 0 |
| 2 | 2.796103 | -30.214668 | 0 |
| 3 | 5.791631 | -25.899408 | 0 |
| 4 | 7.440994 | -24.740838 | 0 |
| 5 | 5.014085 | -24.519775 | 0 |
| 6 | 1.434323 | -24.507083 | 0 |
| 7 | 0.097613 | -24.507027 | 0 |
| 8 | 0.000448 | -24.507027 | 0 |
| 9 | 9.80e-9 | -24.507027 | 0 |
| 10 | 1.14e-13 | -24.507027 | 0 |

## What one step is

At the current coefficients the engine computes two things: the score, which is the slope of the log likelihood in each coefficient, and the information matrix, which is its curvature. The Newton step is the solution of the information matrix against the score, a symmetric positive definite system that the engine solves with `solveSPD`. For logistic regression this is also called IRLS, iteratively reweighted least squares, because each step is a weighted least squares solve with weights p(1 - p).

The start is beta = 0: every coefficient zero, every row's probability one half. From there the first step is modest, 1.024456 at its largest component, and the log likelihood rises to -46.305377.

## Reading the trace

The largest step component grows over the first four iterations, to 7.440994 at the fourth, as the coefficients travel from zero toward their values. The log likelihood rises at every step, from -46.305377 to -24.740838 over those four. After the fourth step the steps shrink: 5.014085, 1.434323, 0.097613, 0.000448. Then they collapse, to 9.80e-9 at the ninth and 1.14e-13 at the tenth.

Near the solution Newton's method roughly squares the error each step, and that is why the last few step sizes fall so fast. The log likelihood has printed -24.507027 since the seventh iteration: its changes no longer show at the six decimals the course prints. The coefficients are still moving at the seventh and eighth steps, by 0.097613 and 0.000448 at their largest component.

## Printed alike is not converged

The log likelihood reads -24.507027 at iterations 7, 8, 9 and 10. Printed alike is not equal, and a flat printed likelihood is no stopping rule. The engine judges convergence on the step, in coefficient units, and the next lesson reads that rule exactly. The step halvings column reads 0 on every row: no step on this fit lowered the penalised log likelihood by more than the halving rule allows, so none was cut back. The third lesson of this module reads that rule.

## The answer it reached

At the tenth iteration the fit stopped with RT at 0.241141 log odds per ohm.m and a log likelihood of -24.507027, the fit the Professional tier read. The engine returns the trace with the fit, so the working can be printed.

## Exercise

Open the panel on the convergence view. The default table holds the 210 training rows of the pay model, the teaching split with EKENE-3, EKENE-5 and EKENE-7 held out; keep the features RHOB, NPHI and RT and the default tol and maxIter, and run it. Confirm 10 iterations and the tenth step of 1.14e-13. Then write down the iteration at which the largest step component first falls below 1, and the iteration at which the log likelihood first prints -24.507027.
