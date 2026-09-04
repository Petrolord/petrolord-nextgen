# The split is a decision

Nobody types the split at a loop. It is an output of the solve, arrived at when the two routes cost the same, and it moves when anything anywhere on the network moves.

{{panel:pd-network-explorer}}

## What the solve returned

On the golden case `looped`, two Vogel wells against a separator at 200 psia, the answer is one set of pressures and one set of flows that only make sense together.

| Quantity | Value |
| --- | --- |
| Header h | 621.148550879 psia |
| Midpoint m | 473.868277305 psia |
| Direct leg b4 | 3693.942751108 lb/d |
| Midpoint leg b5 | 3640.772530876 lb/d |
| Feed to the midpoint b3 | 3640.772530877 lb/d |
| Direct leg share | 50.362456 percent |

`solveLinearNetwork` cannot help here. A closed form exists only for linear branches quoted in lb/d per psi, and every branch on this case is turbulent, quoted in lb/d per root psi.

## The condition the split satisfies

The direct leg spends 621.148550879 psia down to 200.000000000 psia in one drop. The other route spends the same header pressure down to 473.868277305 psia across b3 and then down to the separator across b5. Both routes start at the same node and end at the same node, so both must spend the same total. That equality is one more equation, and the split is what it buys.

Notice b3 and b5 carry 3640.772530877 and 3640.772530876 lb/d. Nothing joins between them, so they are in series, and the midpoint route is two resistances rather than the one that its b5 conductance of 220 lb/d per root psi suggests on its own.

## Why the drawn sizes mislead

The direct leg is quoted at 180 lb/d per root psi and takes the larger share, 50.362456 percent against 49.637544 percent. Anyone allocating a loop by comparing 180 with 220, or by comparing pipe sizes, gets the ranking backwards on this case. There is no equivalent single conductance to compare against: the reciprocal rule that gives a single 120.000000000 lb/d per psi branch for a 200 and a 300 in series is a fact about LINEAR resistances, and it does not survive a square root law.

## How far the split can be pushed

Derived sweep points on the published inputs, not published cases. Set the midpoint leg to 60 lb/d per root psi and its share is 24.634111 percent. Set it to 800 and its share is 60.945870 percent. Raising the leg well past the published 220 never lets it carry the loop, because the b3 feed at 300 lb/d per root psi is still in the way and never changed.

## What the flag says and what it does not

The engine reports converged = true in 6 iterations at a reported residual of 3.6364e-7 lb/d, with nothing pinned. `solveNetwork` never calls `checkConservation`, so nothing in that return is a check on the answer that was not computed by the same iteration. The independent referee sweeps the same case 42 times and reports a gap of 2.5057e-9 lb/d on its own solve.

## Exercise

Solve `looped` and write down the direct leg share. Then change only the well qmax values, leave every conductance alone, solve again, and record how far the share moved.
