# A set over the limit

On a coarse grid a project's capex is rounded to the nearest cell, and a project rounded down can squeeze a set into the cells that costs more than the limit in money. The published gridOvershoot case funds capex 6002.0000 against a limit of 6000.0000, and the engine now says so with overLimit true and overLimitBy 2.0000.

{{panel:ec-capital-explorer}}

## The case

| project | capex | risked EMV |
| --- | --- | --- |
| A | 4000.0000 | 500.0000 |
| B | 2002.0000 | 300.0000 |
| C | 1995.0000 | 280.0000 |

The limit of 6000.0000 is whole but over 5000, so the grid is coarse: 6000.0000 over 2000 gives a resolution of 3.000000 million USD per cell. Each capex is divided by 3.000000 and rounded to whole cells. B's 2002.0000 does not divide evenly and rounds down, so B weighs slightly less in cells than it costs in money. A and B together fit inside the 2000 cells, and the knapsack funds them.

## What the engine reports

| engine set | capex | EMV | overLimit | overLimitBy | exact optimum (golden) | gap (golden) |
| --- | --- | --- | --- | --- | --- | --- |
| A + B | 6002.0000 | 800.0000 | true | 2.0000 | 780.0000 on A + C | 20.0000 |

A plus B costs 4000.0000 plus 2002.0000, which is 6002.0000, and returns 500.0000 plus 300.0000, which is 800.0000. That is 2.0000 over the limit. The best set that truly fits is A and C at 780.0000, since C's 1995.0000 keeps A inside the limit. The golden gap of 20.0000 is the engine's EMV less the exact optimum, and it is positive because the engine broke the limit to reach it. Set changed by the grid: true.

## Flagged, and still happening

Before EC5-0 the engine returned A and B with nothing to mark the breach, and a total capex of 6002.0000 sat beside a limit of 6000.0000 for the reader to notice or miss. The repair added the flag. It did not remove the cause: the grid still rounds, the set is still A and B, and the EMV is still 800.0000. overLimit and overLimitBy report the overshoot; they do not correct it.

On OKONO the grid is exact at 1.0000 per cell and overLimit reads false at every limit, so this case can only arise on a coarse grid.

## The mistake

The mistake is to quote 800.0000 as the best value under the limit. It is the value of a set the budget cannot pay for. The reader who sees overLimit true and reports the funded set anyway has approved 2.0000 million USD of spend that was never authorised, and has overstated the programme by 20.0000 against the best set that fits.

The smaller mistake is to treat 2.0000 as rounding noise. The limit is a hard number, and the whole point of a constrained optimum is that it respects it. A breach of any size means the answer belongs to a different problem.

## What it refuses

The engine does not re-solve when it detects an overshoot, and it does not offer the best set inside the limit. It gives the flag and the amount. Finding A and C at 780.0000 is the reader's job, by checking which set actually fits in money.

## Exercise

Show why the limit of 6000.0000 uses a coarse grid and give its resolution. Then prove the engine's capex and EMV for A and B, state overLimit and overLimitBy, and name the best set that truly fits with its EMV.
