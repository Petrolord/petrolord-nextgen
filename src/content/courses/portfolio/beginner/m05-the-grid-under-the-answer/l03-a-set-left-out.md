# A set the fallback leaves out

Rounding every weight up keeps the fallback inside the limit, and the price is that a set which truly fits in money can fail to fit the grid. The fallback says so through optimalityGap. The published gridUndershoot cases show the exact answer and the fallback side by side.

{{panel:ec-capital-explorer}}

## The case

| project | capex | risked EMV |
| --- | --- | --- |
| W | 1499.0000 | 200.0000 |
| X | 1499.0000 | 210.0000 |
| Y | 1499.0000 | 220.0000 |
| Z | 1502.0000 | 230.0000 |

The limit is 6000.0000. All four together cost 1499.0000 three times plus 1502.0000, which is 5999.0000, and fit with 1.0000 to spare.

## The exact solve

| engine set | capex | EMV | solveMethod | optimalityGap |
| --- | --- | --- | --- | --- |
| W + X + Y + Z | 5999.0000 | 860.0000 | exact | 0.0000 |

On the exact solve the engine funds all four for 200.0000 plus 210.0000 plus 220.0000 plus 230.0000, which is 860.0000, the golden optimum.

## The fallback

The published gridUndershootFallback case states `exactStateLimit` 3 to force the grid. At 3.000000 per cell every capex rounds up: W, X and Y weigh 500 cells each and Z weighs 501, which is 2001 cells for all four, one more than the limit holds. Given room for three, the fallback drops the least valuable, W:

| engine set | capex | EMV | solveMethod | resolution | optimalityGap |
| --- | --- | --- | --- | --- | --- |
| X + Y + Z | 4500.0000 | 660.0000 | grid-feasible | 3.000000 | 200.0000 |

X, Y and Z cost 1499.0000 plus 1499.0000 plus 1502.0000, which is 4500.0000, and return 210.0000 plus 220.0000 plus 230.0000, which is 660.0000.

## The gap is stated

optimalityGap 200.0000 is the bound: the best value on the same grid with every weight rounded down, less the funded 660.0000. Here the bound is tight. The exact optimum is 860.0000, and 860.0000 less 660.0000 is 200.0000, W's own risked EMV. The whole cost of the fallback on this case is one project left out, and the result names the most it could be. On another inventory the bound can be loose, as it is on gridOvershootFallback, where it reads 20.0000 and nothing was lost at all.

overLimit reads false and overLimitBy 0.0000, because 4500.0000 is inside the limit. overLimit only watches the limit from one side; optimalityGap watches the other.

## The mistake

The mistake is to trust overLimit false as a clean bill. It says the set is not over the limit and nothing more. On a grid-feasible answer, read optimalityGap before quoting the value, and read the unspent capex: 1500.0000 left over against a project of 1499.0000 is a signal worth checking.

## What it refuses

The fallback does not search for the set it may have missed. On an inventory small enough to solve exactly the question never arises, since the default `exactStateLimit` of 200000 is never reached by sixteen projects or fewer.

## Exercise

Show that W, X, Y and Z fit 6000.0000 in money but need 2001 cells on the fallback grid. Then prove the fallback's capex and EMV, and explain why its optimalityGap of 200.0000 equals the shortfall to the exact optimum on this case.
