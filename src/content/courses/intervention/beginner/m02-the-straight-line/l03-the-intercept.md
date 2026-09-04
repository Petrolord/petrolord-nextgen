# The intercept

`logLogSlope` hands back an intercept beside every slope. It is the height of the fitted line where ln x is zero, which is x = 1, and it is the one member of the return that moves when the unit on the x column changes.

{{panel:pd-diagnostic-explorer}}

## Where the line is pinned

The published power law puts a point exactly there. Its first golden pair is x = 1.000000 with y = 3.700000000, so ln x = 0.000000000 and ln y = 1.308332820, and the intercept fitted over all eleven golden points is 1.308332819650. The case publishes a true intercept of 1.308332819650, and the oracle reaches the same value by Theil-Sen, the median of every pairwise slope, which shares no mean, no square and no covariance with the engine's ordinary least squares. The engine's derived difference from the published value is 0.0000e+0, over eleven points spanning 2.000000000 log cycles. Two genuinely independent routes onto one number, and no well anywhere in the case.

## What the intercept means back in the data

A straight line in logs is y = a x^m, so the intercept is ln a and its exponential is the coefficient. Teaching well ELELENWO-4 is a constructed history, not a real well and not a published one. Fitted as one piece, over all 38 samples from t = 15.000 to 3600.000 days and 2.380211242 log cycles, its ratio fit returns a slope of 1.098217467822 and an intercept of -6.052413433629, whose exponential is 2.352178324e-3. The line says: a water-oil ratio of 2.352178324e-3 at one day, climbing as t to the power 1.098217467822.

## Why that coefficient is not the well's coefficient

ELELENWO-4 was built as WOR(t) = c1 t + c2 t^p with c1 = 0.0032 per day and p = 1.9, then a falling form after the well was beaned back on day 2200. The fit returns 2.352178324e-3, not 0.0032, and it was never going to. A sum of two power terms followed by a decline is not one power law, and a straight line has one coefficient to offer.

## What the intercept refuses to travel with

Its unit. A log-log slope carries no unit at all, so it survives a change of time base untouched; the intercept is the log of a value at one day and does not. It also does not survive the rest of the module: the diagnosis return carries a ratio slope, a ratio fit quality, a derivative slope, a derivative fit quality, a span and the day its late window starts, and no intercept anywhere.

## The mistake

Reading the intercept as the well's first water-oil ratio. On the teaching well the first sample is 0.048760749 at t = 15.000000 days, and the coefficient is 2.352178324e-3. The line's value at one day is a property of the line, quoted before this well had made a measurement.

## Exercise

Write the published intercept for the power law, the engine's intercept, and the difference between them.

Then take the teaching well's full-history fit, write its intercept and the coefficient that intercept implies, and say why that coefficient is not the 0.0032 per day the history was built from.
