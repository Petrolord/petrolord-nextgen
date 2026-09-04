# Where the window starts

`lateFromT` is the start of the late window in days, and it is the only dimensional number this module returns anywhere. Everything else it hands back is a slope, an intercept, a fit quality or a span.

{{panel:pd-channel-explorer}}

## One start time, four published histories

The golden publishes four labelled histories of 40 samples each, from 10.000000 to 3000.000000 days. They are different shapes, but the window is chosen by counting, so all four start together: the oracle window is series[20:], and the engine at its default `lateFraction` of 0.5 reads exactly that, from t = 186.345364 days.

| History | Published late derivative slope | Engine slope on that window | Fit quality, fraction | Reported span, log cycles |
| --- | --- | --- | --- | --- |
| channelling | 1.600000000000 | 1.600000000000 | 1.000000000000 | 1.206802663 |
| coning | -0.555098339661 | -0.539955222223 | 0.948751314445 | 1.206802663 |
| displacement | 1.000000000000 | 1.000000000000 | 1.000000000000 | 1.206802663 |
| flat | null | ok = false, n = 0 | n/a | n/a |

The published values come from a Theil-Sen fit, the median of every pairwise slope, which shares no mean, no square and no covariance with the engine's least squares. On the two power-law shapes the routes agree to machine precision. On the coning history they separate by 1.514312e-2 on data with no noise in it, because that shape is curved on a log-log plot over that window and the estimators weight curvature differently. Neither is a measurement of a slope that exists.

## The start is an index, not a time

Because the fraction applies to the sample count, the start jumps by sample. On teaching well ELELENWO-4, 38 samples geometrically spaced from 15.000 to 3600.000 days, moving the dial from 0.50 to 0.60 shifts the start from 250.242976 days to 138.369943 days and the count from 19 to 23. At 0.90 the window opens at 23.392754 days, which on that history is early life.

Two wells with the same producing life and different sampling schedules get different windows from one fraction, and nothing in the object says so.

## The field is returned even when nothing was measured

The published flat history comes back with lateFromT = 186.345364 days, worSlope = 0.000000000, derivativeSlope n/a and spanDecades n/a. A start time proves a window was selected, not that anything was read on it.

## The mistake

Reading lateFromT as a physical event, a breakthrough date or a flow regime boundary. It is the timestamp of one sample, picked by counting backwards. Quoting it as "water broke through at 186.345364 days" credits the reservoir with a number that came from the length of a spreadsheet.

## What it refuses

The window start is never refused and never checked. Nothing tests that the window sits in boundary-dominated flow, that the rate was steady across it, or that it starts late at all. The only span test is on the fit rather than the window: `minSpanDecades` is 0.4, and the published histories report 1.206802663 against it.

## Exercise

Read the published channelling and coning histories at the default window and record lateFromT for each.

Then say why two different shapes returned the same start time, and what would have to change for them to differ.
