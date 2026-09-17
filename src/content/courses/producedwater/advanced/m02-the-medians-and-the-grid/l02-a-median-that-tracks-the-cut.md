# A median that tracks the cut

A median read straight off a bin set is quantised to that bin set. It can only take as many values as there are bins, and on a grid built to span six orders of magnitude of droplet volume that is a coarse instrument for a quantity a reader is about to compare.

{{panel:pw-train-explorer}}

## Interpolation, and what it buys

One step of this grid is a few percent of a diameter. Read a median as a bare bin midpoint and the answer is pinned to the nearest step, so a bin wide enough to hold six orders of magnitude of outlet concentration reports one value for all of them. Two trains with genuinely different outlets come back with the same droplet median.

Interpolating in log diameter across the bin the median falls in removes that. The median then moves continuously with the distribution it measures.

## The property

Tighten the cut size on one device and the outlet median must fall. Every time. Here it is on the OGBOTOBO inlet water.

| cut micron | outlet ppm | outlet median micron |
| --- | --- | --- |
| 20 | 1125.805910 | 9.006299 |
| 12 | 801.033554 | 7.097314 |
| 8 | 554.375735 | 5.720019 |
| 5 | 321.286806 | 4.371791 |
| 3 | 152.620204 | 3.237392 |
| 1.5 | 43.150877 | 2.179329 |

The medians fall monotonically as the cut tightens, which is the property a quantised median cannot have. A jest test asserts it, so the behaviour is pinned rather than observed once.

## Why monotonicity is the right test

Notice what is being checked here. It is not the VALUE of any median against a published figure. It is the SHAPE of the whole column, and shape is a much harder thing to get right by accident.

A median that is correct at one condition and quantised everywhere else passes a spot check. It fails this one, because a quantised median shows up as a flat run in a column that should be strictly falling. A monotonicity assertion over a sweep is worth more than an equality assertion at a point.

## The bin set is still the instrument

Interpolation does not free the median from the grid. It reads ACROSS one bin rather than snapping to it, so the grid still decides where the bin edges fall and therefore what is being interpolated between. The module reports the bin count and the span back to the caller for exactly that reason, which the next lesson takes up.

What interpolation removes is the step. What it cannot remove is the fact that a distribution described on 60 bins is a description rather than the distribution itself.

## Reading the two columns together

The outlet concentration column falls from 1125.805910 ppm to 43.150877 ppm across that sweep. The median column falls from 9.006299 micron to 2.179329 micron. Both are consequences of the same tightening, and neither is a substitute for the other.

The concentration says how much oil is left. The median says how hard that remaining oil will be to remove next. A designer sizing a downstream polishing stage needs the second number more than the first.

## Exercise

Sweep the cut size in the panel from coarse to fine and record the outlet median at each step. Confirm the column never flattens.

Then work out what a flat run of three identical medians in that column would tell you about how the median was computed.
