# What a clean fit does not prove

A perfect fit proves the points lie on a line. It does not prove the window was the right window, and it does not prove which mechanism drew them, because two opposite verdicts in this module come off equally perfect lines.

{{panel:pd-diagnostic-explorer}}

## Two flawless fits, two answers

The published channelling history is a t^m with m = 1.600000000. Read over the window starting at t = 186.345364 days, 20 of its 40 samples and 1.206802663 log cycles, it returns a ratio slope of 1.600000000 and a derivative slope of 1.600000000, both at an r-squared of 1.000000000, and the mechanism comes back channelling and treatable.

The published displacement history is a t. Over that same window it returns a ratio slope of 1.000000000 and a derivative slope of 1.000000000, both at an r-squared of 1.000000000, and the mechanism comes back displacement and not treatable. One verdict sends a squeeze to the well and the other refuses it. Neither fit is better than the other.

## Why the fit cannot separate them

Differentiate a power law and the result is another power law with the same exponent, so the ratio and its derivative return one number twice, which is what both histories show. Nothing in the shape of the data separates displacement from channelling. A threshold does: channellingSlope sits at 1.3, and 1.600000000 is above it while 1.000000000 is below.

The engine concedes this in its own text. When a reading lands near that boundary it prints: "for any power-law history the ratio and its derivative have the SAME log-log slope, so nothing separates the two pictures except how steep the climb is. Take this one to the plot, or to a production log, before spending on it."

## The boundary is a band, and it is wide

`ambiguousBand` is 0.25, so the ambiguous band on the derivative slope runs from 1.050000 to 1.550000, a width of 0.500000. The published displacement slope of 1.000000000 falls below that band, so the reading is returned at high confidence with the ambiguous flag false, on the exact value the oracle's own docstring calls the case that genuinely needs the plot and a person.

## What nothing checks

The golden publishes each history and a late derivative slope for each, then stops: no expected mechanism, no expected confidence, no expected verdict and no expected refusal. Every label here is the classifier speaking with nothing asserted against it.

## The mistake

Offering an r-squared of 1.000000000 as support for a mechanism. It supports the line. The label came from comparing one number against 1.3, and the fit quality has no opinion about that comparison at all.

## Exercise

Write the ratio slope, derivative slope and r-squared of the published channelling and displacement histories, with the window named.

Then say what a reader would have to see, beyond the fit, before spending money on the difference between them.
