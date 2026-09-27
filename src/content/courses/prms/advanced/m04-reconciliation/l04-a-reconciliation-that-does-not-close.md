# A reconciliation that does not close

{{panel:prms-aggregation-calculator}}

A reconciliation that does not close is a result. The engine returns every figure, names each category that misses and by how much, and sets the Closes tile to false. It refuses nothing, because nothing in the input is malformed: the movements simply do not account for the change the estimator stated.

## The Ekene field that misses

The golden case "rec-ekene-not-closing" carries the same opening and movements as the Ekene field Reserves, and a stated 2P closing that differs from the computed one. The computed closing is 18.300000, 25.600000 and 33.900000; the difference at 2P is 0.200000 against a tolerance of 0.001000, and the reconciliation does not close. The engine's line, verbatim:

> the reconciliation does not close: 2P differs by 0.2 (tolerance 0.001)

The line tells the estimator where to look: a 2P movement is missing or misstated, or the stated closing is wrong. The engine cannot say which.

## The tolerance is stated

The tolerance is an input with no default. It exists because sums of decimals rarely come out exact in floating point: on the Ekene field Reserves the difference at 2P prints as 0.000000 at six decimals and is not exactly 0, and the reconciliation closes because that residue is within the stated 0.001000.

## At the boundary

A difference equal to the tolerance closes. That is a reading the engine states, verbatim:

> the reconciliation closes: every category within the stated tolerance 0.25

| golden case | computed closing 1P, 2P, 3P | difference at 2P | tolerance (stated) | closes |
| --- | --- | --- | --- | --- |
| rec-difference-exactly-tolerance | 10.000000, 15.500000, 20.000000 | -0.250000 | 0.250000 | true |
| rec-difference-above-tolerance | 10.000000, 15.500000, 20.000000 | -0.312500 | 0.250000 | false |

The alternative the engine names reads a difference equal to the tolerance as not closing. No graded figure in this course rests on that boundary, and a report that relies on it says which reading it took.

## A closing out of order

A computed closing can also break the order of the categories. If the computed 1P exceeds the 2P, the categories stop describing a range. The golden case "rec-order-breaks" computes a closing of 13.000000, 12.000000 and 14.000000, and the engine reports it, verbatim:

> the computed closing is out of order (1P <= 2P <= 3P fails)

The Order breaks tile reads true. Like a difference, this is a result: the engine prints the figures so the estimator can find the movement that crossed the categories.

## What to do with a miss

Read the difference by category, and read the movements in that category. A difference in one category only points at a movement stated by category, such as a revision or a transfer. A difference in all three by the same amount points at production, which comes out of every category alike. The engine checks arithmetic: whether the new estimate is right is a question for the estimate.

## Exercise

Open the aggregation calculator on the view "Reconciliation" and start from "A reconciliation that does not close". Read the difference column and the reasons, and find the category that misses. Change the Stated closing best (stated) control until the Closes tile reads true. Then switch to "A difference equal to the tolerance" and "A difference above the tolerance" and read both Closes tiles. Finally open "A computed closing out of order" and find the movement that breaks the order.
