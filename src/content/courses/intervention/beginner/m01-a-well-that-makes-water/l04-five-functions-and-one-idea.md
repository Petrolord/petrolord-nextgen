# Five functions and one idea

Channelling is plumbing and can be sealed. Coning is not and cannot. Everything the module computes exists to separate those two, and it separates them with one comparison against one number.

{{panel:pd-diagnostic-explorer}}

## The numbers that do the separating

| Threshold | Value |
| --- | --- |
| coningSlope | -0.1 |
| channellingSlope | 1.3 |
| ambiguousBand | 0.25 |
| minR2 | 0.5 |
| minSpanDecades | 0.4 |
| minWor | 0.1 |

Those are derived from the shipped defaults. Every one is overridable and round on purpose: they are boundaries drawn between pictures, not measurements. The ambiguous band puts a derivative slope between 1.050000 and 1.550000 into doubt, a width of 0.500000.

## Why one comparison has to carry it

For any power-law history the ratio and its derivative have the same log-log slope, and the engine's own comment concedes it. The published channelling history is a t^m with m = 1.600000000, and its published lateDerivativeSlope over the oracle's late window, series[20:], starting at t = 186.345364 days and holding 20 samples, is 1.600000000000. The published displacement history is a t with m = 1.000000000, and over that same window it publishes 1.000000000000. The exponent of the ratio and the slope of the derivative are one number twice.

So nothing in the shape separates displacement from channelling. Only steepness does, and 1.3 is where somebody drew the line.

## The four labels and what they authorise

Channelling is treatable = true: the water arrives through a path of its own, so a squeeze has something to seal. Coning is treatable = false, because the cone re-forms above whatever is shut off. Displacement is treatable = false and its note says no intervention on this well will change it. Not determined is treatable = false, and its note is an answer rather than a failure: do not spend money on a treatment chosen by guesswork.

## What the fit contributes

`logLogSlope` supplies the slope that meets 1.3, the r-squared that meets 0.5 and the span that meets 0.4. It supplies no mechanism, and it does not know the window it was handed was late rather than early. Mechanism, confidence and the treatable flag are all downstream of one number crossing another.

## The mistake

Reading the thresholds as physics. A derivative slope over the late window of a published history is a measurement of that window; 1.3 is a convention. Move the convention and the same well changes mechanism with no datum touched.

## Exercise

Copy the six thresholds and write beside each what it gates: the mechanism, the fit quality, the span or the ratio level.

Then write the published channelling exponent beside its published late-window derivative slope, name the window, and say what that equality costs the classifier.
