# Bias and the mean error

{{panel:pf-backtest-explorer}}

Twelve errors are too many to read one by one. The first summary the engine prints is the mean of the errors, signs kept. It answers one question well: does a forecast lean high or low?

## The mean error is the bias

The basis names it plainly: "mean e (bias; positive means the forecast is low)". Because every error is actual minus forecast, a mean error (ME) below 0 says the forecast was high on average over the months scored, and an ME above 0 says it was low. The unit is the unit of the rate, bbl/d.

On the teaching hold-out, each method fitted on EKENE-P1 months 0 to 35 and scored on months 36 to 47:

| method | ME (bbl/d) |
| --- | --- |
| ses | -51.683333 |
| holt | -4.573069 |
| damped | -14.978829 |

All three are below 0, so each method forecast EKENE-P1 high over those twelve months. The sizes differ a great deal.

## Why simple smoothing leans so far

Simple exponential smoothing has no trend state, so its forecast is flat: the final level at every step. Fitted on months 0 to 35, it forecasts 290.700000 bbl/d for every one of months 36 to 47, while the well keeps declining underneath it. Every one of its twelve errors is negative. When every error has the same sign, the mean of the errors equals the mean of their sizes with a minus sign, and that is what the engine reports: ses has an ME of -51.683333 and a mean absolute error of 51.683333.

That equality is worth learning to spot: the forecast was on the same side of the actuals every month.

## Why a small mean error is not the whole story

Holt carries a trend state b, in bbl/d per month, and its forecast falls with the well. Its errors change sign: month 36 is -12.431964, month 38 is 3.128846, month 47 is 6.752492. Positive and negative errors cancel in a mean, so holt's ME of -4.573069 is small partly because it is good and partly because its misses point both ways.

A forecast that is badly wrong in both directions can have an ME near 0. So the mean error is read for its sign and treated as a statement about lean. How far the forecast missed, month by month, is a different number, and the next lesson gives it.

## Reading bias in a forecast note

A note that reports a mean error states the method, the well and the months fitted and scored: holt, EKENE-P1, fitted on months 0 to 35, scored on months 36 to 47, ME -4.573069 bbl/d. Anyone with the engine can check that. An ME with no months attached cannot be checked.

A persistent lean points at the form of the method: a flat method on a declining well leans one way whatever its parameters.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P1 and score ses, holt and damped in turn. For each, compare the ME with the MAE the view prints beside it. Name every method whose two figures are equal apart from the sign, and explain why from its forecasts. Then try the same on EKENE-P4, the noisy allocation, and say whether any method still leans the same way every month.
