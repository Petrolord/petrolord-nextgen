# The limit of a damped forecast

{{panel:pf-smoothing-explorer}}

A damped forecast adds smaller and smaller changes, and a sum of shrinking changes can settle on a finite value. With phi below 1 it does. The damped forecast has a limit, a rate it approaches however far ahead you look, and that limit is a useful check on whether a forecast makes sense for the well.

## Where the forecast is heading

The damped forecast is l_n + (phi + phi^2 + ... + phi^h) b_n. For phi below 1 the bracket approaches phi / (1 - phi) as h grows, so the forecast approaches l_n + b_n phi / (1 - phi).

On EKENE-P1 at alpha 0.5, beta 0.2 and phi 0.9, with final level 209.755413 and final trend -3.843497, that limit is 175.163940, derived from the final state. The engine's own forecast confirms it:

| step h | damped forecast |
| --- | --- |
| 12 | 184.933594 |
| 400 | 175.163940 |

At step 400, h 400 given, the forecast matches the limit to 1.00e-9. The damped forecast levels off at a rate. A Holt forecast on the same parameters falls by its final trend every step without end.

## Why the limit matters on a well

A rate forecast that levels off is saying the well will produce at a steady rate for ever, which is not how wells behave either. Read the limit as a measure of how much decline the damped method is willing to extrapolate, in one number. If the limit is far below the last month's rate, the method expects a lot more decline; if it is close, the method has already stopped extrapolating.

The limit also explains how the damped trend stays above zero where Holt's does not. On EKENE-P5 Holt's line crosses zero between step 16 and step 17, while the damped trend fitted on the same well forecasts 6.569332 bbl/d at step 24. With a negative trend the limit sits below the final level by b_n phi / (1 - phi), a finite amount, so a damped forecast only crosses zero if that finite drop is larger than the final level.

## Phi sets the distance

The factor phi / (1 - phi) counts how many final trends the forecast will eventually fall below the final level, and it grows quickly as phi approaches 1. Work it out yourself for phi 0.8 and 0.98, the bottom and top of what the fit may choose, and for 0.9 between them, and the spread is wide. The fitted range keeps a fitted damped forecast from behaving like Holt's line for ever, while still letting it run a long way.

## Exercise

In the smoothing explorer choose "h-step forecasts", load EKENE-P1 and pick damped with alpha 0.5, beta 0.2 and phi 0.9. Set h to 12 and read step 12. Set h to 400 and read the last step, then compute l_n + b_n phi / (1 - phi) from the final level and trend the panel shows, and compare.
