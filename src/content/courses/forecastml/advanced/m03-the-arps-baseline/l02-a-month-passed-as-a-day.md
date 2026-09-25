# A month passed as a day

{{panel:pf-uncertainty-explorer}}

The decline curve engine was written for dated rates, and it measures time in days. The forecasting engine works in monthly steps. The engine states exactly how it connects the two.

## The rule, in the engine's words

On EKENE-P1 the time basis reads:

> step k is passed as day k, so qi is per step and Di per step; t = 0 at index 0, the first positive value

Month k of the series is handed to `fitArpsModel` as day k. The decline curve engine then fits as it always does, in its own unit of time, and never learns that a step was a month. Every figure that carries time comes back per step: qi is the rate at t = 0, and Di is the decline per step. In this course a step is a month, so Di is per month.

## What that makes EKENE-P1's Di

EKENE-P1's fitted Di is 0.060069 per month. The generator stated 0.06 per month, and the two agree because the well was built from an Arps curve with that decline. The rule is what makes the comparison fair: the generator worked in months, the fit was handed months as days, and both figures are per month.

Quoted per day, per year or as an effective decline, the same fit gives a different number. The course quotes it per month and says so every time. A Di copied from this engine into a tool that reads it per day, or per year, is wrong by the size of the unit change. When a Di leaves the course, carry its unit with it.

## The forecasts come back in steps too

`arpsForecast` returns its forecasts at steps past the last month, the way `fitSmoothing` does: step 1 is the month after the series. On EKENE-P1 the Arps forecast at step 12 is 156.514309 bbl/d. It can be compared step for step with any smoothing method's forecast.

The horizon follows the smoothing rule, from 0 up to the engine's cap, and anything else is refused, naming the field `h`:

> h must be a whole number from 0 to 10000

## The alternative

The common alternative is calendar days: pass each month at its true date, fit in days, and convert Di afterwards. The engine's stated reason for its own choice is short: `fitArpsModel` reads days, and a step is a month. Passing month k as day k keeps the Arps fit and the smoothing methods on one axis of steps.

## Where t = 0 sits

The last clause of the basis says where time starts: t = 0 at the first positive value. On EKENE-P1 that is index 0, the first month. The next lesson shows a series where it is not, and why.

## Exercise

Open the view "The Arps baseline" with EKENE-P1, Auto-Select, h 12. Read the declared block headed THE TIME BASE and copy it. Read Di from its tile and write it with its unit. Then start from EKENE-P5 and write its Di with its unit, and say in one sentence which of the two wells declines faster per month.
