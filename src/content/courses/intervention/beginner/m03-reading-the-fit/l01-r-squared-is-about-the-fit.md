# R squared is about the fit

The fit quality answers one question: how close are these points to this line. It is a statement about the line, not about the well, and every misreading in this module starts with forgetting that.

{{panel:pd-diagnostic-explorer}}

## What the number is

`logLogSlope` computes it as the square of the cross product of the two centred log columns divided by the product of their two sums of squares, r2 = (sxy*sxy)/(sxx*syy). It is returned as a fraction between zero and one, while the module's own refusal text speaks of the same quantity as a percentage, so say which you mean every time. Further down the module it becomes a gate: the diagnosis defaults set minR2 to 0.5, and a derivative fit below that is refused as noise.

## A perfect one, and a high one that is not a measurement

On the eleven published power-law points the engine returns 1.000000000000, a derived shortfall from a perfect fit of 0.0000e+0, over 2.000000000 log cycles. Those points lie on a line because they were generated on one.

The published coning history is a plateau form, not a power law. Read over the window starting at t = 186.345364 days, 20 of its 40 samples and 1.206802663 log cycles, its derivative fit returns an r-squared of 0.948751314445, which reads as a good fit. Over those same points the engine's least squares gives -0.539955222223 and the oracle's independent Theil-Sen route gives -0.555098339661, a derived difference of 1.514312e-2 and relative -2.728006e-2. There is no noise in that series at all. A curved trend in log space is fitted well by a line and still has no single slope for the line to find.

## A low one on data with no scatter

The published flat history is a constant: 40 samples with every ratio 1.200000000 and every derivative 0.000000000. Its ratio fit over the window starting at t = 186.345364 days comes back with a slope of 0.000000000 and an r-squared of 0.000000000. Nothing scattered. The fit explains none of a variation that does not exist, and prints the same number it would print for pure noise.

## What a high fit quality does not license

Teaching well ELELENWO-4 is a constructed history, not a real well and not a published one. Fitted whole, all 38 samples from t = 15.000 to 3600.000 days over 2.380211242 log cycles, its ratio returns a slope of 1.098217467822 at an r-squared of 0.989832434458. That well peaks at a water-oil ratio of 14.587294415 and then falls to 9.329979637 by its last sample, because it was beaned back on day 2200. The fit quality of 0.989832434458 knows nothing about the choke. It reports that the points sit near a line.

## The mistake

Reading the fit quality as confidence in the answer. It is confidence in the line: how well one straight edge describes the points that survived, in the window somebody chose, on the column somebody picked.

## Exercise

Write the r-squared the engine returns on the published power law and on the published coning history, and name the window each was taken over.

Then say which of the two supports a claim about a mechanism, and why the other does not.
