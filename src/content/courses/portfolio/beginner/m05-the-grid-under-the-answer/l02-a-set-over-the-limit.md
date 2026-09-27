# A set that fits the limit

A rounded grid can squeeze a set into its cells that costs more than the limit in money. The exact solve never does that, and the stated fallback is built so it cannot either. The published gridOvershoot case shows both.

{{panel:ec-capital-explorer}}

## The case

| project | capex | risked EMV |
| --- | --- | --- |
| A | 4000.0000 | 500.0000 |
| B | 2002.0000 | 300.0000 |
| C | 1995.0000 | 280.0000 |

The limit is 6000.0000. A plus B would cost 4000.0000 plus 2002.0000, which is 6002.0000, two million over. A plus C costs 5995.0000 and fits.

## The exact solve

| engine set | capex | EMV | unspent | solveMethod | optimalityGap | overLimit |
| --- | --- | --- | --- | --- | --- | --- |
| A + C | 5995.0000 | 780.0000 | 5.0000 | exact | 0.0000 | false |

The engine funds A and C for 500.0000 plus 280.0000, which is 780.0000, the golden exact optimum. overLimit and overLimitBy stay in every result and read false and 0.0000, as they do on every exact solve. A set worth 800.0000 exists on paper, but the budget cannot pay for it, so it was never a candidate.

## The fallback on the same projects

The published gridOvershootFallback case runs the same three projects with `exactStateLimit` stated as 2, small enough to force the fallback. The grid divides 6000.0000 into 2000 cells of 3.000000 each and rounds every capex up to whole cells: A weighs 1334 cells, B 668 and C 665. A and B together now need 2002 cells, more than the 2000 the limit holds, so the rounding up keeps them out. The fallback funds A + C at capex 5995.0000 for 780.0000, with solveMethod "grid-feasible" and overLimit false.

A grid that rounded to the nearest cell would have weighed B at 667 cells and let A and B fit in 2000 cells while costing 6002.0000 in money. Rounding every weight up is what guarantees that any set fitting the grid also fits the limit.

## A bound on what was left out

The fallback reports optimalityGap 20.0000 here. It is an upper bound on the risked EMV the fallback may have left out, worked from the same grid with every weight rounded down, which is generous enough to admit A and B. The true shortfall is 0.0000, since A + C at 780.0000 is the exact optimum. The gap says how far the answer could be from the best; it does not say that it is.

## The mistake

The mistake is to read optimalityGap 20.0000 as 20.0000 lost. On this case nothing was lost. The opposite mistake is to ignore the gap: on another inventory it may be exactly what the fallback left out.

## What it refuses

The fallback does not re-solve exactly to close its own gap. It states the method, the resolution and the bound, and leaves the reader to judge whether a bound of that size matters for the decision.

## Exercise

Prove that A + B does not fit 6000.0000 and that A + C does. Then give the cell weights of A, B and C in the fallback, show why A and B cannot both fit 2000 cells, and explain what the optimalityGap of 20.0000 does and does not tell you.
