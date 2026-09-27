# An exact solve in any unit

The optimizer answers the knapsack exactly on the capex figures as typed. The unit you type them in, whole or decimal, millions or single dollars, does not change the funded set, and the result says how it was solved.

{{panel:ec-capital-explorer}}

## What the result reports

Every run carries three fields about the solve itself. `solveMethod` reads "exact" when the knapsack was solved on the capex as entered. `optimalityGap` is 0.0000 on an exact solve, because nothing can have been left out. `resolution` is null, because there is no grid. On OKONO all five limits from 300.0000 to 1000.0000 report solveMethod "exact" and optimalityGap 0.0000, so the 450.0000 answer of OK-1, OK-3 and OK-4 at 291.0000 is the true optimum.

## Two awkward inventories

Two published cases type the same four projects in a way a grid would find awkward:

| case | limit | engine set | capex | EMV | unspent | solveMethod |
| --- | --- | --- | --- | --- | --- | --- |
| rawDollars | 450000000.0000 | A + B + D | 450000000.0000 | 250.0000 | 0.0000 | exact |
| nonIntegerLimit | 450.5000 | A + B + D | 450.0000 | 250.0000 | 0.5000 | exact |

In rawDollars every capex is typed in whole USD, A at 100000000.0000 and B at 200000000.0000. In nonIntegerLimit the money is in million USD but the limit carries a half. Both land on A, B and D at 250.0000, which is the golden exact optimum, with resolution null and optimalityGap 0.0000. The half million of headroom in nonIntegerLimit is simply left unspent, because no project costs that little.

## Decimals read as typed

The engine reads decimal capex at their typed precision. It looks for one power of ten, up to a million, that makes the limit and every capex whole numbers, and adds the capex as whole numbers at that scale. The published decimalCapexExactSum case shows why this matters. At a limit of 0.3000, projects costing 0.1000 and 0.2000 add in binary arithmetic to 0.30000000000000004, a hair above the limit. Read as typed they sum to exactly 0.3000, and the engine funds both, a + b, for an EMV of 2.0000.

## When a grid does appear

A grid appears only as a stated fallback. If the exact solve would have to hold more than `exactStateLimit` partial portfolios, 200000 by default, the engine divides the limit into 2000 cells and rounds every capex up to whole cells. The result then says solveMethod "grid-feasible" and prints the resolution and an optimalityGap. An inventory of sixteen projects or fewer has at most 65536 subsets and can never reach the default, so an Associate inventory is always solved exactly.

## The mistake

The mistake is to fear the unit and miss the real risk. Consistent scaling is harmless: the rawDollars answer is the million USD answer. What the engine cannot catch is a mixed inventory, with some capex in USD and some in million USD, which it will solve exactly and wrongly.

## What it refuses

The Capital Portfolio Studio offers no choice of method; only a call that states a small `exactStateLimit` forces the fallback grid. The Studio prints "Solved exactly on the capital figures you entered" on an exact solve, and names the resolution and the bound only when the fallback ran.

## Exercise

For rawDollars and nonIntegerLimit, give the funded set, its capex, its EMV, the unspent capex and the solveMethod. Then explain why 0.1000 and 0.2000 fit a limit of 0.3000, and say when a grid would appear at all.
