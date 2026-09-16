# Two boundaries and the slack that holds them

The trim rule turns on two whole numbers, a percent where the shortfall begins and a percent where it stops growing. Neither of those percentages arrives as a whole number, and what the engine does about that is worth reading closely.

{{panel:fc-suction-explorer}}

## The four rows that show both boundaries

| trim ratio | trim percent | shortfall percent |
| --- | --- | --- |
| 0.950000 | 5.000000000000004 | 0 |
| 0.949900 | 5.010000000000003 | 0.006000000000002004 |
| 0.750000 | 25 | 12 |
| 0.550000 | 44.99999999999999 | 12 |

The first two straddle the point where the shortfall begins and the last two sit at and beyond the cap.

## The first row, read twice

A trim ratio of 0.950000 is meant to be exactly five percent, and the rule says five percent carries no shortfall. The subtraction that produces the trim percent puts it at 5.000000000000004, which is above five by 4.440892098500626e-15.

If the comparison were a bare test against five, that row would have fallen on the wrong side of it and a shortfall would have appeared where the rule says none belongs. The shortfall percent on that row is 0, so the comparison is carrying a slack.

## Measuring the slack

The slack is not read out of a constant either. Halve the trim ratio towards the boundary until the shortfall leaves zero. The last ratio with no shortfall gives a trim percent of 5.000000000999993, and the first with one gives 5.0000000010000045, so the boundary the engine really applies sits 1.0000045236324695e-9 above five percent.

The rule is written in whole percent and the value it is compared against is not one, and that gap is what the slack spans.

## The same slack on the warning boundary

The warning turns on at the same kind of comparison and carries the same treatment. At a trim ratio of 0.800000 the trim percent comes out at 19.999999999999996, and the warning is null.

Read that against the first row, because the hair went the other way there. A trim percent above five would have drawn a shortfall out of a comparison with no slack in it. A trim percent below twenty draws no warning however the comparison is written, so what the slack covers at this boundary is the other direction, a value a hair above twenty.

## Why this generalises

Any rule stated in decimal and applied to a value computed in binary floating point meets this problem. The rule's authors wrote five percent and twenty percent, and the arithmetic that reaches those thresholds cannot land on them exactly.

The engine's answer is to compare with a slack sized to the arithmetic rather than to rewrite the rule. A reader who sees 5.000000000000004 in a return and concludes the engine has a bug has misread which of the two is approximate.

## The mistake

The mistake is reproducing a boundary by hand with a bare comparison and disagreeing with the engine on exactly one row. The disagreement looks like a difference of opinion about the model and is a difference about arithmetic.

## Exercise

Give the trim percent and shortfall percent at trim ratios of 0.950000 and 0.949900, and say by how much the first exceeds five. Then give the two trim percents that bracket the boundary the engine really applies, the size of the slack, and the trim percent at which the warning is still null.
