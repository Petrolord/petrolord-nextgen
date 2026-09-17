# The overshoot is always positive

A whole number of tubes cannot land exactly on a required area. So the surface you actually get is always at or above the surface you asked for, and the engine reports the difference as a percentage rather than leaving you to notice it. On the studio case the area asked for is 229.543151 ft2, the actual area is 232.477856 ft2, and the overshoot is 1.278498 percent.

{{panel:fc-exchanger-explorer}}

## Seven cases

| case | area asked for, ft2 | tubes | actual area, ft2 | overshoot, percent |
| --- | --- | --- | --- | --- |
| the studio case | 229.543151 | 74 | 232.477856 | 1.278498 |
| ORON | 330.327560 | 64 | 335.103216 | 1.445734 |
| published case 1 | 500.000000 | 160 | 502.654825 | 0.530965 |
| published case 2 | 2000.000000 | 638 | 2004.336113 | 0.216806 |
| published case 3 | 1200.000000 | 232 | 1214.749159 | 1.229097 |
| published case 4 | 860.000000 | 274 | 860.796387 | 0.092603 |
| published case 5 | 860.000000 | 274 | 860.796387 | 0.092603 |

Every figure in the last column is positive. That is not a property of these seven cases. It follows from both roundings going up.

## Why it cannot be negative

The actual area is the count multiplied by the surface of one tube. The count is the area over one tube, rounded up, and rounded up again. Rounding up can only increase a number or leave it alone, so the count sits at or above the unrounded figure and the actual area sits at or above the area asked for. An overshoot of zero needs the unrounded figure to be a whole number the pass count divides, which is rare.

## Why the margin carries the rounding

Here is the reason this lesson is about the percentage rather than about the count. A tube count is a whole number, so there is no such thing as a count being nearly right. Any check on it is either exact or wrong by at least one whole tube, and a check with no middle is a check that tells you almost nothing when it passes.

The margin is different. It is a continuous percentage and it moves the instant either rounding moves the count by one. So checking the margin checks four things at once: the area that went in, the per-tube surface, the first rounding and the second. A margin that comes out right cannot have been reached with a wrong count. The reverse does not hold: two different unrounded figures can round to the same count, so a matching count leaves you none the wiser.

That is why this course teaches the count and checks the rounding through the margin. The count is the thing to understand. The margin is the thing to compare.

## Do not read an ordering into it

It is tempting to look at that last column and conclude that a bigger bundle overshoots less. Do not. Published case 2 has 638 tubes at 0.216806 percent and published case 4 has 274 tubes at 0.092603 percent, so the smaller bundle overshot less. Published case 3 has 232 tubes and the third largest overshoot in the table, because its pass rounding moved the count.

Two roundings are at work and only the first has a ceiling. It adds one tube at most. The second, on to a whole multiple of the passes, can add up to one tube short of the pass count, so a four-pass row can overshoot further than a two-pass one. Read the column as seven separate answers and do not divide one by another.

## Exercise

For three rows, multiply the count by the per-tube surface from the previous lesson and check the actual area. Then compute the overshoot yourself as a percentage of the area asked for. Finish by saying why a margin is a better thing to check an answer against than a count.
