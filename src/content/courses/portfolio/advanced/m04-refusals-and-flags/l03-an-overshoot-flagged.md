# A limit the answer always fits

A refusal stops the engine and returns nothing. A flag returns the answer and marks what is wrong with it. The optimizer carries an overshoot flag, overLimit with overLimitBy, and it reads false and 0.0000 on every result, because the funded set always fits the limit. The readings that say how good the answer is are solveMethod and optimalityGap.

{{panel:ec-governance-explorer}}

## The published overshoot case

| project | capex | EMV |
| --- | --- | --- |
| A | 4000.0000 | 500.0000 |
| B | 2002.0000 | 300.0000 |
| C | 1995.0000 | 280.0000 |

The limit is 6000.0000. A + B would cost 6002.0000 and return 800.0000, and it does not fit. The engine solves the knapsack exactly on the capex as typed and funds A + C at capex 5995.0000 for 780.0000, leaving 5.0000 unspent. The result reads solveMethod exact, optimalityGap 0.0000, resolution null, overLimit false and overLimitBy 0.0000. The case is named for the set a rounded grid would push over the limit, and the exact solve never builds that set.

## The stated fallback

A call may state a small exactStateLimit, and above it the solve falls back to a grid of 2000 cells. gridOvershootFallback runs the same three projects with exactStateLimit 2.

| weights in cells | A | B | C |
| --- | --- | --- | --- |
| rounded up at resolution 3.000000 | 1334 | 668 | 665 |

| result | set | capex | EMV | solveMethod | overLimit | optimalityGap |
| --- | --- | --- | --- | --- | --- | --- |
| fallback | A + C | 5995.0000 | 780.0000 | grid-feasible | false | 20.0000 |

Every weight is rounded UP, so A + B needs 2002 cells and cannot fit the 2000 the grid holds, while A + C needs 1999 and does. Any set that fits the rounded-up grid fits the limit in money, which is why overLimit stays false on the fallback too. The optimalityGap of 20.0000 is an upper bound on the EMV the fallback may leave out: the best set on the same grid with every weight rounded down, less the funded EMV. Here the fallback found the exact optimum and the bound is still 20.0000, so a positive gap says a better set may exist. It does not say that one does.

The other published fallback shows a gap that is real. gridUndershootFallback, with exactStateLimit 3, funds X + Y + Z at capex 4500.0000 for 660.0000 with optimalityGap 200.0000, where the exact optimum is all four projects at 860.0000.

## The flags that do fire

The live flags sit on the AFE side. A partner with a negative working interest returns valid false and the engine note, and the allocation is still shown: interests of 30 and -20 on a cost of 1000.00 leave the operator 90.0000 percent, an amount of 900.00. An entered forecast below the money spent and committed is kept and flagged with the amount it falls short. The AFE summary PDF prints the split note beside the amounts.

## The mistake

The mistake is reading overLimit false as a certificate of optimality. It says the set fits, which it always does. Whether the set is the best that fits is said by solveMethod: exact means optimalityGap is 0.0000, and grid-feasible means optimalityGap has to be quoted beside the EMV.

## Exercise

For the published overshoot case, give the exact solve's set, capex, EMV, solveMethod and overLimit. Then for gridOvershootFallback give the rounded-up cell weights, explain in one sentence why A + B cannot fit the grid, and say what its optimalityGap of 20.0000 bounds.
