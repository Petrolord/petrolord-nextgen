# Two budgets on one frontier

Two budgets read off the same OKONO frontier share every point up to the smaller limit, yet their funded sets are not nested. OK-3 is funded at 450.0000 million USD and dropped at 600.0000.

{{panel:ec-capital-explorer}}

## The sets at four limits

| capex limit | funded set | total capex | total risked EMV |
| --- | --- | --- | --- |
| 300.0000 | OK-1 + OK-2 | 300.0000 | 204.7500 |
| 450.0000 | OK-1 + OK-3 + OK-4 | 450.0000 | 291.0000 |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 600.0000 | 402.7500 |
| 750.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 | 690.0000 | 444.0000 |

OK-2 is funded at 300.0000, out at 450.0000 and back at 600.0000. OK-3 is out at 300.0000, in at 450.0000, out at 600.0000 and back at 750.0000.
## Values nest, sets do not

The frontier run to 600.0000 repeats points 0 to 11 of the frontier run to 450.0000 exactly, ending that stretch at 450.0000 and 291.0000. The best value at each budget does not depend on how far past it the frontier is run. What changes is which set wins at the larger limit, and at 600.0000 the winner leaves out a project the smaller budget funded.

## The mistake of cutting a budget

A 600.0000 programme is cut to 450.0000, and the obvious move is to drop a project from the funded set until it fits. Dropping OK-2 frees 180.0000 and leaves OK-1, OK-4 and OK-5 at 420.0000: 402.7500 less 115.0000, which is 287.7500. That is the greedy set, frontier point 10, and it sits 3.2500 short of the 291.0000 the optimizer finds by bringing back OK-3, a project that was not in the larger set at all. No single drop from the 600.0000 set reaches the answer at 450.0000.

## The mistake of raising a budget

The same error runs the other way. A 450.0000 programme gets 600.0000, and the obvious move is to keep OK-1, OK-3 and OK-4 and add what fits. OK-5 fits, 291.0000 plus 38.0000, which is 329.0000 at 510.0000, and nothing else fits in what is left, since OK-2 costs 180.0000. Building up stops at 329.0000; solving again reaches 402.7500 by giving up OK-3.

Every budget change is a new optimisation. A funded set is the answer at one limit and a starting point for nothing.

## Success NPV moves the other way

The larger budget funds less success-case NPV. The 450.0000 set totals 725.0000 of it and the 600.0000 set 473.0000, because OK-3's 420.0000 success case leaves the set. Risked EMV rises from 291.0000 to 402.7500, and risked EMV is the value the optimizer maximises.

## What it refuses

The frontier treats each budget as a separate question. It holds no commitment from one budget to the next, so it cannot keep a project that has already started when the limit moves.

## Exercise

Write the funded sets at 450.0000 and 600.0000 and name the project in one and not the other. Then show the result of dropping OK-2 from the 600.0000 set and of adding OK-5 to the 450.0000 set, and say how far each falls short.
