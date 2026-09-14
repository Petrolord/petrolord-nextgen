# A set left out

Rounding to cells cuts both ways. A project rounded up weighs more in cells than it costs in money, and a set that truly fits can fail to fit the grid. The published gridUndershoot case leaves out a project worth 200.0000 million USD of risked EMV, and no flag says so.

{{panel:ec-capital-explorer}}

## The case

| project | capex | risked EMV |
| --- | --- | --- |
| W | 1499.0000 | 200.0000 |
| X | 1499.0000 | 210.0000 |
| Y | 1499.0000 | 220.0000 |
| Z | 1502.0000 | 230.0000 |

The limit is 6000.0000, over 5000, so the grid is coarse at 3.000000 per cell. Neither 1499.0000 nor 1502.0000 divides evenly by 3.000000, and both round up. In money all four projects fit inside 6000.0000, which is why the golden exact optimum funds W, X, Y and Z. In cells, four rounded-up weights come to more than the 2000 cells the limit holds, so the knapsack can only fund three.

## What the engine reports

| engine set | capex | EMV | overLimit | overLimitBy | exact optimum (golden) | gap (golden) |
| --- | --- | --- | --- | --- | --- | --- |
| X + Y + Z | 4500.0000 | 660.0000 | false | 0.0000 | 860.0000 on W + X + Y + Z | -200.0000 |

Given room for three, the knapsack drops the least valuable, W. X, Y and Z cost 1499.0000 plus 1499.0000 plus 1502.0000, which is 4500.0000, and return 210.0000 plus 220.0000 plus 230.0000, which is 660.0000. The exact optimum adds W's 200.0000 to reach 860.0000. The golden gap of -200.0000 is exactly W's risked EMV: the whole cost of the grid is one project left out. Set changed by the grid: true.

## No flag for an undershoot

The overshoot flag only watches the limit from one side. A set that costs less than the limit is always within it, so overLimit reads false and overLimitBy 0.0000 here, and the screen shows a clean answer. This is finding D4, and EC5-0 did not repair it. It is a property of the engine as published: an undershoot on a coarse grid is silent.

## The mistake

The mistake is to trust overLimit false as a clean bill for the grid. It only says the set is not over the limit. It cannot say that a better set was squeezed out.

The warning sign is in the answer itself: a funded capex of 4500.0000 against a limit of 6000.0000 leaves room for a whole further project of this size unspent. Money left unspent is sometimes genuine, as it is on OKONO at 750.0000, where the optimizer leaves 60.0000 because OK-6 alone costs 310.0000 and nothing else remains. On OKONO the grid is exact at 1.0000, so that gap is real. On a coarse grid the reader has to check whether any left-out project would actually fit in money.

## What it refuses

The engine does not test its answer against the unrounded capexes, and it reports no gap to the exact optimum. The golden records 860.0000 because the test suite solved it separately; a user running their own inventory gets no such number.

## Exercise

Explain why W, X, Y and Z fit the limit in money but not on the grid. Then prove the engine's capex and EMV, give the gap to the exact optimum, and say which reading on the answer should prompt a check even though overLimit is false.
