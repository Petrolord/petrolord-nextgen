# The capstone walkthrough

The capstone asks for six numbers. This lesson walks the exercise in the order that produces the fewest mistakes and names the errors that lose fields.

{{panel:mp-isochore-explorer}}

## What is being asked

Grid both SAND surfaces at the capstone settings and subtract them into an isochore. Read the panel: the thickness extremes and mean, the thickness at prospect P-1, the live node count, and the plain mean of the six well thicknesses for comparison.

| Field | Unit | Tolerance |
| --- | --- | --- |
| Isochore minimum thickness | m | 0.1 |
| Isochore maximum thickness | m | 0.1 |
| Isochore mean thickness | m | 0.1 |
| Thickness at prospect P-1 | m | 0.1 |
| Live isochore nodes | count | 0, exact |
| Mean of the six well thicknesses | m | 0.05 |

The settings are fixed: a 100 m cell, two pad cells and an 800 m extrapolation limit, exactly as the Associate tier used.

## The order to run it in

**Set the cell size to 100 m first and leave it alone.** Four of the six fields move if you change it. Confirm the tile reads 100 before recording anything.

**Read the well mean without the panel.** It is $(32 + 36 + 29 + 25 + 31 + 34)/6 = 187/6 = 31.166666666666668$ m, and it needs no map at all. Doing it by hand first means the panel is checking you rather than the other way round.

**Switch the surface to the isochore and read four fields in one panel state.** Minimum 25, maximum 35.897705078125, mean 32.25429068038713 and the value at P-1, 34.050048828125. Taking them together prevents the commonest failure, which is reading one of them from a different cell size.

**Read the live node count last.** It is 201, and it is graded exactly.

## The self-consistency checks

Four relationships hold across the six fields and each takes seconds.

$$25 \le 32.2543 \le 35.8977$$

The mean must lie between the extremes. If it does not, two fields came from different settings.

$$32.2543 - 31.1667 = +1.0876$$

The map mean should exceed the well mean by about a metre on this field. A gap of zero or a negative gap means the two means have been crossed.

$$201 \times 10{,}000 = 2.01\ \mathrm{km^2}$$

The live count times the cell area should be about two square kilometres, which is a plausible area for a six-well pattern with wells about a kilometre apart.

$$1576.6699 - 1542.6199 = 34.0500$$

The thickness at P-1 should equal the base surface minus the top surface there, which is a route to the same field through two different tiles.

## The four ways fields are lost

**Reading the maximum at a 50 m cell.** It is exactly 36 there and 35.8977 at the capstone's 100 m. Both are correct readings of different settings and only one is the graded field. The 0.1 m tolerance does not cover the difference.

**Reporting the well mean where the map mean is asked, or the reverse.** They are 31.17 and 32.25, and the gap of 1.09 m is more than ten times the 0.1 m tolerance. The ratio check above catches this.

**Reporting the isochore minimum as the difference of the two surface minima.** That is $1570 - 1539.7181 = 30.28$ m, which is wrong by more than 5 m, because the two surfaces reach their extremes at different nodes.

**Rounding the live node count.** It is a count with a tolerance of zero. Two hundred is not 201.

## Reading the panel honestly

Every field on this capstone is a reading, and none of them is a calculation you can do without the model except the well mean. That makes the panel state the thing to be careful about rather than the arithmetic.

The habit that prevents most losses is to record the conditions with the numbers: *isochore, 100 m cell, 800 m limit, 201 live nodes*, written down once at the top of the answer, and then six values underneath it.

## Worked example

A learner submits 25, 36, 32.25, 34.05, 201 and 31.17. Which field is wrong and how would the checks find it?

The maximum. Thirty six is the 50 m cell reading; the capstone's 100 m cell gives 35.8977, and the difference of 0.102 m is just outside the 0.1 m tolerance.

The consistency checks do not catch it, because 36 sits perfectly well above the mean and below nothing. What catches it is the discipline of reading all four isochore fields in one panel state: a 36 could only have come from a different cell size, and the cell size tile would have said so.

## Exercise

Write out the six capstone fields with their units, then state which one requires no gridding at all and which one has a tolerance of zero.

As a self-check: minimum 25 m, maximum 35.897705078125 m, mean 32.25429068038713 m, thickness at P-1 34.050048828125 m, live nodes 201, and mean well thickness 31.166666666666668 m. The mean of the six well thicknesses requires no gridding, since it is the average of six subtractions done at the wells, and the live node count is the field graded exactly, because it is a count of nodes rather than a measurement of anything.
