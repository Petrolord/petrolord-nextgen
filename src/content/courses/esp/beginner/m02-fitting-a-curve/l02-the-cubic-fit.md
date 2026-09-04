# The cubic fit

Four coefficients cannot pass through five points, so the fit misses every one. By how much, and in what pattern, is the diagnostic.

{{panel:pd-stage-explorer}}

## It misses all five

The published golden vendor curve carries five head points and a head fit of degree 3.

| Rate, bbl/d | Published head, ft | Fit reads, ft | Residual, ft |
| --- | --- | --- | --- |
| 1500 | 32.0000 | 31.98571429 | -0.01428571 |
| 2000 | 30.5000 | 30.55714286 | 0.05714286 |
| 2500 | 28.0000 | 27.91428571 | -0.08571429 |
| 3000 | 24.0000 | 24.05714286 | 0.05714286 |
| 3500 | 19.0000 | 18.98571429 | -0.01428571 |

The signs alternate and the magnitudes are symmetric about the middle point. That is what a least squares fit through evenly spaced points looks like when it is behaving, and it is worth recognising, because a pattern that is neither symmetric nor alternating usually means one point is wrong rather than that the fit is poor.

## The efficiency fit does the same thing

Efficiency residuals run -0.00057143, 0.00228571, -0.00342857, 0.00228571 and -0.00057143 fraction across the same five rates. Same alternation, same symmetry, largest miss at the middle point again, 0.73657143 fraction against a published 74.00 percent.

## The normalising scale

The fit is built in z, which is rate divided by a normalising scale of 3500 bbl/d, the top of the published range. Cubing raw rates in the thousands would put columns spanning many orders of magnitude into the same normal equations, and working in z keeps them all near one.

That matters when you read a coefficient. The head coefficient of -29.7499999999 ft on z squared is not a head per squared bbl/d, it is a head per squared fraction of 3500 bbl/d, and quoting it any other way is wrong by the square of the scale.

## The mistake

Assuming the fit reproduces the vendor's printed numbers. At 2500 bbl/d the vendor sheet says 28.0000 ft and the fit returns 27.914286 ft, a residual of -0.08571429 ft. Per stage that is nothing. Carried into a stack of a few hundred stages it is real head, and it goes the way that makes the stack look short.

The response is not to force the fit through the points. A quartic through five points would have no residual at all and would swing violently between them. The residual is the price of a smooth curve, and an alternating symmetric pattern says it is being paid evenly.

## What it refuses

Given fewer than three points, `fitStageCurve` returns ok false with the message "A stage curve needs at least three points from the vendor curve." and no head fit at all. Three points is the floor and not the recommendation, and nothing tells you that a fit with too few points has no residual left to warn you with.

## Exercise

Read the fit at 1500, 2500 and 3500 bbl/d at 60 Hz and write the three residuals against the published heads of 32.0000, 28.0000 and 19.0000 ft.

Then say which point the fit misses by most, and whether that is where you expected it.
