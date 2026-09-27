# When one value describes the range

{{panel:prms-classification-calculator}}

Sometimes the range of uncertainty closes up. A small, well-understood project, or one near the end of its life, may leave the low, the best and the high at the same figure. The framework allows a single value to describe the result in that case (PRMS 2.2.1.3), and the engine says so in its own words.

## The course's small case

| label | case | probability label | value (engine) |
| --- | --- | --- | --- |
| 1P | low | P90 | 2.000000 |
| 2P | best | P50 | 2.000000 |
| 3P | high | P10 | 2.000000 |

The case "One value for the range" states a low, a best and a high of 2.000000 each. The engine accepts it, because the ordering rule allows equal estimates, and returns the three categories with the tile "One value for the range" reading true. It adds this reason:

> the low, best and high estimates are equal: a single value may describe the expected result (PRMS 2.2.1.3)

## What the increments show

With equal estimates, the Proved (P1) slice is the whole 2.000000 and the Probable (P2) and Possible (P3) slices are zero. Nothing is lost: 2P and 3P still equal 1P. A report that shows the slices makes the closed range visible at a glance.

## One value is a finding

A single value is a statement about the estimate: the estimator judges that the range has no spread worth reporting. It is not a shortcut for leaving the range out. The engine will only print the reason when all three stated figures are equal. If you state three figures that differ by a small amount, it treats them as a range like any other, and the tile reads false.

## Where this shows up again

At the Expert tier, a project stated as a single value appears as a constant in an aggregation, adding the same figure to every draw. The Nigerian figures of the last module of this tier are handled in a similar way: a published national figure is one number, with no low or high beside it.

## Reading the tile

The calculator prints four tiles below its tables: the class, the method, the unit and "One value for the range". Check that last tile whenever the three cumulative figures look alike. The flag is true only when they are exactly equal, and the tables at six decimals show whether they are.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "One value for the range". Read the cumulative table, the increments table and the tile "One value for the range", and find the reason line that cites PRMS 2.2.1.3. Then raise the "high estimate (stated)" control by a small amount of your choice and run it. Write down what changes in the tile, the reasons and the increments. Restore 2 before you move on.
