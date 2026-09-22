# Working the capstone

Six numbers from three fixtures, and the order to take them in.

{{panel:wd-survey-explorer}}

## What is asked

1. The minimum-curvature true vertical depth on the Applied Drilling Engineering chapter 8 survey.
2. The tangential method's TVD error against the published minimum-curvature value on that same survey.
3. The true vertical depth at total depth of the FEET golden well.
4. The vertical section at total depth of that same well.
5. The north displacement at total depth of the METRIC golden well.
6. The true vertical depth at the end of the compiled build-and-hold design.

Three fixtures, six answers, and every one of them is a survey calculation.

## The settings

**The ADE survey** is 21 stations in feet, from the golden. Compute the full survey table and read the deepest row.

**The tangential error** is that method's TVD minus the PUBLISHED minimum-curvature TVD of 1653.99 ft. Not minus the engine's own answer: the published value is the reference, and the difference between them is the third decimal.

**The feet well** uses its own vertical section azimuth of 75 degrees, which the fixture states. The metric well uses 200 degrees.

**The build and hold** is the first published case: kick off vertical, build at the stated rate to the stated inclination, hold for the stated length, all on the stated azimuth. Compile it and read the last row of the resulting table.

## The order

Do the two golden wells first, fields 3, 4 and 5. They are one function call each and they establish that you have the survey table right before anything else depends on it.

Then the ADE case, fields 1 and 2. Field 1 is the same call on a different station list. Field 2 needs the tangential sum, which is one loop over the stations:

    tangential TVD = sum over intervals of (interval length) x cos(inclination at the LOWER station)

Note which station's inclination. Using the upper one gives a different and also wrong number.

Then the compiled design, field 6, which is the only one that needs the segment compiler.

## The traps

**The tangential error is against the published value, not the engine's.** They differ by about three thousandths of a foot, which is larger than the tolerance.

**The vertical section azimuth is not the default.** Both golden wells state one. Letting the engine choose its own default gives a different vertical section, and for the feet well the difference is small enough to look right.

**The metric well's north is negative.** It heads roughly south-southwest. A sign dropped here passes casual inspection.

**The build and hold is a compilation, not a solve.** The design is given; you are not solving for it. Compiling it and reading the end is the whole task.

## The precision

Full precision, tight tolerances, for the same reason as every capstone in this series: the grader is checking that the calculation was run rather than estimated. The ADE TVD tolerance in particular is tighter than the gap between the engine's answer and the textbook's printed one, so quoting 1653.99 will not pass.

That is deliberate and it is the point of the field: the published value is what the textbook could print, and the engine's value is what the method actually gives.

## Exercise

Work fields 1, 2 and 6 by hand from the definitions before opening the panel, taking only the station lists and the design parameters from it.

Then compare. Any disagreement is in the survey calculation itself, and it is worth finding, because every number in the next two tiers is built on it.
