# What a slope does not carry

A fitted slope is one number, and four things a reader needs before quoting it are not inside it: the unit, the window, the column, and the points the fit threw away.

{{panel:pd-diagnostic-explorer}}

## No unit

A log-log slope is d ln y / d ln x, a ratio of two logs, so it carries no unit at all. The published power law returns 1.350000000000 while its y column runs from 3.700000000 to 1854.392764421 and its x column from 1.000000 to 100.000000. Change what those columns are counted in and the slope does not move, which is why a slope can be compared against a threshold and an intercept cannot.

## Not the window it was taken over

Teaching well ELELENWO-4 is a constructed history, not a real well and not a published one. All 38 of its samples read as one, from t = 15.000 days, give a derivative slope of 1.229355999 over 2.122891107 log cycles. The eight most recent samples alone, from t = 1276.416078 days, give 1.600276347. Across the whole range of the window dial that slope moves by 0.370920348, with not one datum changed. The return has no field naming the window, so a slope written down without it is not a measurement.

## Not which column it fitted

At the engine's default window the same teaching well returns two slopes side by side: 1.040602176 on the ratio, fitted over 19 late samples and 1.157940604 log cycles, and 1.442132492 on the derivative, fitted over the 15 of those samples whose derivative is positive and 0.900620470 log cycles. The gap is 0.401530316. Nothing in the object says the two numbers were measured on different data.

## Not what it dropped

`logLogSlope` removes every point whose y is not strictly positive and then fits what is left, without saying so. Handed six points of which two are negative, the derived demonstration returns n = 4, a slope of 1.000000000, an r-squared of 1.000000000 and a span of 0.903089987. The six points it was handed cover 1.505149978 log cycles, so the reported span is 0.602059991 of a cycle short of the data, and the fit reads as flawless.

## The mistake

Copying a slope out of a result and into a report. The number is true of some window, of one of two columns, and of the points that survived a filter, and the result names none of the three. A slope quoted as "1.442132492" is a fragment. Quoted as "1.442132492, derivative, 15 samples from t = 250.242976 days, 0.900620470 log cycles", it is a measurement.

## Exercise

Write the derivative slope of the teaching well read whole, the slope of its eight most recent samples, and the movement across the dial between them.

Then take the six-point demonstration and write the span it reports beside the span it was handed, and say which member of the return would have warned you.
