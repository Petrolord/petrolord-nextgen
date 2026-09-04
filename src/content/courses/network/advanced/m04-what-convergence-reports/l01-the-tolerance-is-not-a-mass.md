# The tolerance is not a mass

A constant named for a unit is not evidence that it carries that unit. This one does not carry it.

{{panel:pd-fight-explorer}}

## What the name promises

`DEFAULT_TOLERANCE_LB_D` is 0.000001, and the comment sitting directly above it says Newton stops when the worst nodal imbalance is below this, lb/d. A caller who reads the constant, the comment and the returned `residualLbD` has been told three times that the criterion is an absolute mass rate. All three are absolute and the criterion is not.

## What the solver actually stops at

The number Newton tests against is the tolerance multiplied by a scale, and the scale is the largest single well inflow evaluated at the sink pressure. On the teaching network AGBADA WEST, four wells against a separator held at 265 psia, that scale is 7883.717950413 lb/d. The documented default of 0.000001 is therefore in force as a target of 7.883718e-3 lb/d, looser than the name promises by a factor of 7883.717950. Ask for 1e-12, which is the tolerance this network is solved with, and the target is 7.883718e-9 lb/d.

## What loosening it buys and what it costs

| Tolerance asked | Target, lb/d | Iterations | Reported residual, lb/d | Crosslink moved, lb/d |
| --- | --- | --- | --- | --- |
| 1.0e-12 | 7.8837e-9 | 11 | 1.5461e-11 | 0.0000e+0 |
| 1.0e-10 | 7.8837e-7 | 10 | 3.2147e-8 | 3.1164e-8 |
| 1.0e-8 | 7.8837e-5 | 10 | 3.2147e-8 | 3.1164e-8 |
| 1.0e-6 | 7.8837e-3 | 9 | 3.8768e-3 | 3.7601e-3 |
| 1.0e-4 | 7.8837e-1 | 9 | 3.8768e-3 | 3.7601e-3 |
| 1.0e-3 | 7.8837e+0 | 8 | 2.2013e+0 | 2.1352e+0 |
| 1.0e-2 | 7.8837e+1 | 7 | 5.2700e+1 | 5.0843e+1 |
| 1.0e-1 | 7.8837e+2 | 6 | 4.6571e+2 | 2.4182e+2 |

Two pairs of rows repeat their answer exactly, because the target loosened past a step the solver had already taken. That is the shape of a criterion that decides when to stop and never what the answer is.

## The mistake a careful reader makes

Asking for 1.0e-3 looks like asking for a thousandth of a pound a day. It buys a target of 7.8837e+0 lb/d, a reported residual of 2.2013e+0 lb/d, a crosslink flow moved by 2.1352e+0 lb/d and a junction pressure moved by 6.2665e-3 psi, and the return says converged. Ask for 1.0e-1 and the trunk moves by 2.1126e+2 lb/d and a junction pressure by 1.7153e+1 psi, still under converged. The whole error lives in the scale, and the return never names the scale.

## And a converged flag is not a result

At 1e-12 the engine returns converged with `residualLbD` of 1.546141e-11 lb/d. `checkConservation`, run separately on that same answer, reports 13300.677150912 lb/d produced against 12955.677150912 lb/d delivered, a gap of 345 lb/d, 2.593852900 percent. The tolerance question and the conservation question are different questions asked of the same object, and the solve answers only the first of them.

## Exercise

Take the default tolerance and the scale on this network and write the target it is really enforcing. Then say what a caller would have to compute for themselves to know which of the two criteria decided their solve, and what the returned object gives them toward it.
