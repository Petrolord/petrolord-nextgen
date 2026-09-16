# The efficiency the trim implies

A trim de-rates two of the three legs and leaves the third alone. That is a deliberate choice, and it has a consequence the engine computes and hands back rather than leaving a reader to find by division.

{{panel:fc-suction-explorer}}

## Three legs, two of them de-rated

The flow leg and the head leg of a trim are both reduced by the shortfall model. The power leg is the ideal cube, untouched. Less flow and less head for the same power is an efficiency statement, and the return carries it as a field of its own.

| trim ratio | trim percent | implied efficiency ratio |
| --- | --- | --- |
| 1.000000 | 0.000000 | 1.000000000 |
| 0.980000 | 2.000000 | 1.000000000 |
| 0.950000 | 5.000000 | 1.000000000 |
| 0.920000 | 8.000000 | 0.973162000 |
| 0.880000 | 12.000000 | 0.937882000 |
| 0.840000 | 16.000000 | 0.903178000 |
| 0.800000 | 20.000000 | 0.869050000 |
| 0.760000 | 24.000000 | 0.835498000 |
| 0.700000 | 30.000000 | 0.827200000 |

The first three rows sit at 1.000000000 because the shortfall is zero there, so nothing was de-rated and there is nothing for the ratio to report.

## Computed and reported, rather than left to division

At a trim ratio of 0.750000 the flow comes out at 0.940000000 of ideal and the head at 0.880000000 of ideal, so the product of the two is 0.827200000, while the brake power is 1.000000000 of the ideal cube.

The engine reports impliedEfficiencyRatio = 0.827200000 on that row, against the 0.827200000 the two legs give, a difference of -1.1102230246251565e-16.

That agreement is worth having on the page. The field is not an extra model bolted on. It is the arithmetic the return already contains, stated as a number so that a reader does not have to reconstruct it and does not have to trust a reconstruction.

## Why the power leg is left alone

De-rating the power would mean applying a correction to it, and the only correction available is the shortfall model, which has no publication in this repository. Applying it to a third leg would be inventing a second unsourced model on top of the first.

What the engine owes a reader is the arithmetic it actually did, and the implied efficiency ratio is how it says so. The number is honest about being an implication of the return shape.

## Being exact about what the ratio is

It is what the returned figures imply if the power really is the ideal cube and the flow and head really are de-rated as stated. It is no kind of measured efficiency. It is not a vendor figure, and it does not predict what a trimmed impeller will draw on test.

Since it falls out of a held model, it is held with it. No graded value in this course is an implied efficiency ratio.

## The mistake

The mistake is quoting 0.827200000 as the efficiency of a trimmed pump. It is a ratio between two efficiencies under one set of modelling choices, and it would move if any of those choices moved.

The second mistake is dividing the columns by hand and reporting a slightly different figure. The engine returns the ratio. A hand division at fewer decimals disagrees with it for no reason anybody can defend.

## Exercise

At a trim ratio of 0.750000, give the flow and head as fractions of ideal, the product of the two, the brake power as a fraction of the ideal cube, and the implied efficiency ratio the engine returns. Then say why the power leg is not de-rated and what the ratio would need before it could be called an efficiency.
