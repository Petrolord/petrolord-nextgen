# A trend that runs below zero

{{panel:pf-smoothing-explorer}}

Holt's forecast is a straight line from the final state. On a steady decline that is a sensible shape for a few months. Carried far enough, a falling straight line crosses zero, and a well cannot produce a negative rate. The method has no way to know that, and this lesson shows where it bites.

## The straight line on EKENE-P1

Holt on EKENE-P1 at alpha 0.5 and beta 0.2 ends with final level l_n 207.198880 and final trend b_n -5.798385. The h-step forecast is l_n + h b_n:

| step h | Holt forecast |
| --- | --- |
| 1 | 201.400495 |
| 2 | 195.602110 |
| 3 | 189.803725 |
| 12 | 137.618258 |

Each step is b_n lower than the one before, the same fall every month. EKENE-P1 was drawn from a hyperbolic decline, which slows as the well ages, while the line falls by the same amount at every step. At step 12 the forecast is 137.618258, with the last month's rate at 211.400000.

## EKENE-P5 runs out of rate

EKENE-P5 declines steeply to a low tail, and its last month is 11.100000 bbl/d. Holt fitted on it, every parameter left free, takes alpha 0.704467 and beta 0.473028 and ends on a trend of -0.702187 bbl/d per month. Its straight-line forecast crosses zero:

| step h | Holt forecast on EKENE-P5 |
| --- | --- |
| 16 | 0.078646 |
| 17 | -0.623541 |

At step 17 the forecast rate is negative. The engine returns the line as computed; it does not clip or bend a forecast. A negative forecast rate is the method telling you plainly that its assumption, a constant trend for ever, has broken down.

## What to do with it

The number is right for the method and wrong for the well. There are three honest responses. Shorten h so the forecast stays inside the range where a straight line is believable. Report the step where the line reaches zero as a limit of the method. Or use a method whose trend fades, which is the damped trend of the next module. The damped trend fitted on EKENE-P5 forecasts 6.569332 bbl/d at step 24, still above zero at a step where Holt's line is already below it.

What is never honest is to quote a Holt forecast past its zero crossing as a rate, or to replace the negative steps with 0 and present the result as the method's.

## Why the straight line exists

A constant trend is a simple direction to carry, and Holt follows the history well with it: the trend adapts each month through beta. The trouble is only in extrapolation. Inside the series the trend is corrected every month by a new rate; past the last month nothing corrects it, and whatever slope the final month left is held for ever. The further the forecast reaches, the more the whole result rests on that one final number, b_n.

## Exercise

In the smoothing explorer choose "h-step forecasts", load EKENE-P5, pick holt, leave alpha and beta blank and set h to 24. Read the final level and trend, and find the step where the forecast first goes below zero. Then pick damped with every parameter blank and read step 24.
