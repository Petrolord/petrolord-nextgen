# The scale the caller never sees

One well decides the convergence criterion for the whole system, and the caller is never told which well or what it decided.

{{panel:pd-fight-explorer}}

## How the scale is built

The solver evaluates every well inflow at the sink pressure, takes the largest of those, and calls it the scale. On the teaching network AGBADA WEST, with the separator at 265 psia, the four wells would make 7883.717950413, 3125.903030303, 5561.824807605 and 985.000000000 lb/d if each were opened straight onto the separator pressure. Together that is 17556.445788322 lb/d. The scale takes only the largest of them, 7883.717950413 lb/d, and the target Newton stops at is the tolerance times that.

## Why the largest and not the total is the wrong choice

A relative criterion exists so a bigger system is not held to a tighter absolute standard than a smaller one. This scale does the opposite. On the published `wells_fight` ladder, one header solved with one well, then two, then three:

| Wells | Scale, lb/d | Total inflow at the sink, lb/d | Ratio | Iterations |
| --- | --- | --- | --- | --- |
| 1 | 4125.742011834 | 4125.742011834 | 1.000000000 | 7 |
| 2 | 4125.742011834 | 6962.756887867 | 1.687637489 | 7 |
| 3 | 5024.112000000 | 11986.868887867 | 2.385868167 | 6 |

The second well arrives and the scale does not move, because the newcomer is smaller than the well already there, while the total moves by two thirds. Every well added after the biggest one tightens the effective criterion, so the standard a caller is held to depends on which well happens to be largest.

## The same criterion spelled two ways

The first convergence test, taken before the loop starts, is against the raw tolerance. Every test inside the loop is against the scaled target. Since the target is never smaller than the tolerance, the mismatch can only cost one wasted Newton step and can never declare a false convergence. It is worth naming anyway: only one of the two spellings decides, and reading the other one leaves you confident about the wrong number.

## What the return refuses to carry

`residualLbD` comes back absolute, in lb/d, on a criterion that was relative. Nothing in the returned object names the scale, the target, or which test stopped the iteration. A caller who wants the target has to evaluate every well inflow at the sink pressure again.

## The check that is a different question

At a tolerance of 1e-12 this network reports converged with a residual of 1.546141e-11 lb/d. `checkConservation` on that same answer reports a gap of 345 lb/d against 13300.677150912 lb/d produced, 2.593852900 percent. Meeting a scaled target says the iteration stopped moving. It does not say the mass balanced.

## Exercise

Take the four inflows this network evaluates at the separator pressure and write the scale, then the scale the total would have given. Say what the return would have to print for a reader to tell those two apart.
