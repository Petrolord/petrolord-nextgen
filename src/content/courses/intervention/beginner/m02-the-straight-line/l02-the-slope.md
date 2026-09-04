# The slope

A log-log slope is d ln y / d ln x. It is the exponent the data would have if the data were a power law, and it carries no unit at all.

{{panel:pd-diagnostic-explorer}}

## One history, one number

Teaching well ELELENWO-4 is a constructed case, not a real well and not a published one. Its water-oil ratio history holds 38 samples from t = 15.000 to 3600.000 days, spanning 2.380211242 log cycles, and the ratio climbs from 0.048760749 to a peak of 14.587294415 before falling back to 9.329979637 at the last sample.

Fitted as one piece, over all 38 samples and the whole 2.380211242 log cycles, the ratio returns a slope of 1.098217467822. That is the Associate measurement: a raw history, no window chosen, no classifier anywhere near it.

## The same series, nine windows

Read the same 38 samples through a late window instead and the slope is a different number every time. Nothing in the data changes down these rows.

| lateFraction | Samples in the window | Ratio slope |
| --- | --- | --- |
| 0.20 | 8 | 0.143809349 |
| 0.30 | 12 | 0.734484318 |
| 0.40 | 16 | 0.963127975 |
| 0.50 | 19 | 1.040602176 |
| 0.60 | 23 | 1.088100432 |
| 0.70 | 27 | 1.104746497 |
| 0.80 | 31 | 1.107183344 |
| 0.90 | 35 | 1.103149966 |
| 1.00 | 38 | 1.098217468 |

That is a teaching sweep, not a published case. The bottom row is the whole history, which is why it returns the full-history number again. The top row is the eight most recent samples, and half of those sit after the well was beaned back on day 2200, so the ratio there is falling as often as it climbs and the fitted slope collapses to 0.143809349.

## Why the window has to be stated

A slope of 1.104746497 and a slope of 0.143809349 come off the same column of numbers. Neither is wrong. They answer different questions, and the return carries no field that says which question was asked. Writing "the slope is 1.040602176" is not a measurement until "fitted over the late 19 samples, 1.157940604 log cycles" is attached to it.

## What a published slope looks like when it is stated properly

The golden channelling history publishes a lateDerivativeSlope of 1.600000000000, and the window is named: series[20:], starting at t = 186.345364 days, 20 of the 40 samples, 1.206802663 log cycles. The displacement history publishes 1.000000000000 over that same window. Both are quotable because the window travels with them.

## The mistake

Quoting a slope from a screen. The dial that chose the window has a default and no guidance beside it, and the number moves under it silently.

## Exercise

Record the ratio slope on ELELENWO-4 at three window fractions of your choosing and write the sample count beside each.

Then write the full-history slope and say which row of the sweep reproduces it, and why.
