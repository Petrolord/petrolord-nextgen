# A loss probability counted

The repaired P(loss) is a count. The engine sums each iteration's portfolio value, counts the values below zero and divides by the iterations, so the figure carries a sampling error and says nothing about the size of the loss.

{{panel:ec-governance-explorer}}

## How it is counted

probLoss is the number of iterations whose portfolio value is below zero, divided by the iterations. The test is strict: an iteration that nets exactly zero is not a loss. Because it is a proportion, its standard error is sqrt(p(1 - p) / n). For the single wildcat at 10000 iterations the engine counts 0.696100 against an exact 0.700000, with a standard error of 0.004583 and a z of 0.8510: the count sits less than one standard error from the truth.

| case | exact P(loss) | engine P(loss) | standard error | z |
| --- | --- | --- | --- | --- |
| singleWildcat | 0.700000 | 0.696100 | 0.004583 | 0.8510 |
| identical3 | 0.343000 | 0.343100 | 0.004747 | 0.0211 |
| identical6 | 0.117649 | 0.118100 | 0.003222 | 0.1400 |
| comonotoneMixed | 0.600000 | 0.607000 | 0.004899 | 1.4289 |
| mixtureWithSpread | 0.079328 | 0.079800 | 0.002702 | 0.1748 |

The largest z among these published cases is 1.4289, on comonotoneMixed. Every count lands where a sample of 10000 should, and the cases were chosen so that an engine drawing the wrong thing would miss badly: the old approximation's 0.365832 for the wildcat sits dozens of standard errors from 0.700000, and no seed could close that gap.

## OKONO's funded sets

| limit | set | emv | engine P(loss) | normal approximation P(loss) |
| --- | --- | --- | --- | --- |
| 300.0000 | OK-1 + OK-2 | 204.7500 | 0.007900 | 0.003231 |
| 450.0000 | OK-1 + OK-3 + OK-4 | 291.0000 | 0.123600 | 0.142035 |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 402.7500 | 0.001800 | 0.002555 |
| 750.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 | 444.0000 | 0.012800 | 0.055533 |
| 1000.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 + OK-6 | 588.0000 | 0.035800 | 0.062001 |

The normal column is what the engine would have reported before EC5-0. It understated the 300.0000 set and overstated the other four, most at 750.0000, where 0.055533 stands against a simulated 0.012800. The sets that carry OK-3 are the lumpy ones, and the 450.0000 set, where OK-3 is one of only three projects, has the highest simulated loss chance at 0.123600.

## What the count refuses to say

P(loss) says how often, never how much. identical6 loses with chance 0.117649, and every one of those losses is -300.0000, all six wells failing. OKONO's 450.0000 set loses with a similar chance, 0.123600, but its P90 is -18.3574. Two portfolios with nearly the same P(loss) can hold very different downsides, so the figure must be read beside the low case.

It also refuses to report its own precision, and a small P(loss) is the least precise relative to its size, because few iterations fall below zero at all. The engine prints 0.001800 for the 600.0000 set to six decimals and gives no standard error beside it; you compute sqrt(p(1 - p) / n) yourself.

## The mistake

The mistake is comparing six decimals across budgets as if they were a choice. The 600.0000 set has a lower P(loss) than the 450.0000 set, but it is funded by a larger budget and neither figure changes which set the optimizer picks. The optimizer maximises risked EMV and never reads P(loss). A committee that wants less loss chance has to say so as a separate constraint and test sets by hand, because the engine will not trade a unit of EMV for a safer set.

## Exercise

State the rule the engine uses to count P(loss), including what happens to an iteration that nets exactly zero. Then, for OKONO's 450.0000 and 750.0000 sets, give the engine P(loss) beside the normal approximation's, and say whether the approximation overstated or understated each.
