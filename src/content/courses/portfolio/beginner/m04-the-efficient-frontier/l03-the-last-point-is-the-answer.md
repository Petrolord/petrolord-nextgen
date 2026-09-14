# The last point is the answer

The last point of the efficient frontier is the best risked EMV reachable inside the whole limit, and it must match the optimizer's funded set. On OKONO at 450.0000 million USD it is capex 450.0000 and EMV 291.0000: OK-1, OK-3 and OK-4.

{{panel:ec-capital-explorer}}

## The last point against the funded set

| limit | last point capex | last point EMV | funded set | total success NPV |
| --- | --- | --- | --- | --- |
| 450.0000 | 450.0000 | 291.0000 | OK-1 + OK-3 + OK-4 | 725.0000 |
| 600.0000 | 600.0000 | 402.7500 | OK-1 + OK-2 + OK-4 + OK-5 | 473.0000 |

Prove it from the inventory. OK-1, OK-3 and OK-4 cost 120.0000 plus 90.0000 plus 240.0000, which is 450.0000, and return 89.7500 plus 41.2500 plus 160.0000, which is 291.0000. The funded set spends the whole limit, with 0.0000 unspent, on a grid of 1.0000 million USD per cell, and overLimit reads false.

If the last point and the funded set ever disagree, the two were not run on the same inventory and limit. Find out which input changed before quoting either.

## The last point is not always the limit

The last point is printed at what its set costs, which need not be the limit. At 750.0000 the optimizer funds OK-1, OK-2, OK-3, OK-4 and OK-5 at 690.0000 and leaves 60.0000 unspent, because no remaining project fits: OK-6 alone costs 310.0000.

## The mistake

The first mistake is to take the steepest step as the answer. Point 3 buys 1.616667 per extra million USD, the best ratio anywhere on this frontier, and it funds OK-1 alone at 120.0000 for 89.7500. The question was what to fund with 450.0000, and the answer to that question is the value at the limit, 291.0000. A steep step is a good trade at that budget, not a recommendation to stop spending.

The second mistake is to stop at a point that looks nearly as good. Point 10 is 420.0000 and 287.7500, and it is exactly the set a greedy ranking by EMV per million USD produces: OK-1, OK-4 and OK-5. Greedy did find a frontier point, just one budget step short. The last step swaps OK-5 for OK-3 and adds 3.2500 for 30.0000, which is why the optimum reads 291.0000.

The third mistake is to read total success NPV as the answer's worth. The 450.0000 set sums to 725.0000 of success-case NPV and is worth 291.0000 risked; the 600.0000 set sums to 473.0000 and is worth 402.7500.

## What it refuses

The last point is the best value, not the safest. It is solved on risked EMV alone, so it carries no spread: by the seeded Monte Carlo at seed 20260829 and 10000 iterations the 450.0000 set shows P(loss) 0.123600 and the 600.0000 set 0.001800, and the frontier shows neither.

## Exercise

Prove the last point at 450.0000 from the inventory, capex and EMV. Then say which frontier point the greedy set sits on, and what the single step from it to the answer swaps.
