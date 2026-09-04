# An answer with no tolerance in it

Give the solver linear branch resistances and the network collapses to a weighted graph Laplacian, whose solution is a matrix inverse. That is the one answer in this course that is not an iterate.

{{panel:pd-fight-explorer}}

## The case

The published golden `linear_star`: linear conductances b1 = 80, b2 = 120 and b3 = 400 lb/d per psi, linear wells w1 at 60000 lb/d and 900 psia and w2 at 40000 lb/d and 700 psia, separator at 150 psia. `solveLinearNetwork` assembles and eliminates. `solveNetwork` runs Newton with a numerically differenced Jacobian and a backtracking line search. The two share no code and no reasoning.

## What they agree to

| Node | Closed form, psia | Newton, psia | Difference, psia | Relative |
| --- | --- | --- | --- | --- |
| w1 | 546.666666667 | 546.666666667 | 0.0000e+0 | 0.0000e+0 |
| w2 | 396.666666667 | 396.666666667 | -5.6843e-14 | 1.4330e-16 |
| h | 252.222222222 | 252.222222222 | -2.8422e-14 | 1.1269e-16 |
| s | 150.000000000 | 150.000000000 | 0.0000e+0 | 0.0000e+0 |

Two nodes agree exactly and two agree to the last bits of a double. Nobody chose a tolerance to make that true. The gate holds the pair to a relative 1e-12, which is loose against what they actually deliver.

## Why two iterations is the number that matters

Newton reports `converged` true in 2 iterations, `residualLbD` 7.2760e-12 lb/d, `pinned` none, warnings none. Newton is exact on a linear system, so its step lands on the answer and the second pass confirms it. Needing many steps here would not mean the problem was hard, it would mean the Jacobian was wrong, which is why an iteration count is the thing worth reading on this case rather than a residual.

## What agreement here is evidence about

Not about Newton and not about elimination. Both were going to produce a number regardless. What agreement tests is the shared work: the assembly, the sign each incidence carried, and how the fixed sink pressure was held out of the unknowns. A sign error there would have to appear identically in two separately written routines for these to match, and it does not. The independent bisection oracle, on the same case, lands within 1.8679e-10, 8.7311e-11 and 4.7777e-11 psia at w1, w2 and h, taking 19 sweeps.

## The check, on the one case where it agrees

`checkConservation` reports produced 40888.888888889 lb/d, delivered 40888.888888889 lb/d, gap 7.275958e-12 lb/d, relative 1.779446e-16. The reported residual and the conservation gap are the same number here because nothing was pinned and the filter removed nothing from the measurement.

## The mistake

Carrying the confidence forward. Turbulent branches have no closed form, and no rule for linear resistors survives them. Every network answer after this is a last iterate, and where a node gets pinned the entry returned for it is not even that.

## Exercise

Write the four closed form pressures, the four Newton pressures, and the difference at each. Then say what a nonzero difference at one node would have told you, and what one at all four would have said instead.
