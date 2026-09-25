# Actual minus forecast

{{panel:pf-backtest-explorer}}

The Associate tier fitted smoothing methods and read their parameters and in-sample mean squared error. That tier stopped at a question it could not answer from the fit alone: does the method forecast months it has never seen? This tier answers it, and it starts with the smallest piece of the answer, one error.

## The sign is fixed

The engine defines an error one way and prints the rule in its basis: "e = actual - forecast". The actual is the rate the well made; the forecast is the point forecast of one named method for that month. A positive error says the forecast was low, because the well made more than was forecast. A negative error says the forecast was high.

The sign is a choice, and some texts subtract the other way. This course keeps the engine's order everywhere, so when a figure below is negative, read it as a forecast that sat above the well.

## The teaching hold-out

Every figure in this module comes from one test on EKENE-P1, the clean hyperbolic decline. Each method is fitted on months 0 to 35, counted from 0, and forecasts 12 steps. Step 1 is month 36 and step 12 is month 47. Those twelve months were never shown to the fit, so the forecast is scored against rates it could not have used.

Holt's linear trend on that hold-out, the first four and the last two months:

| month | actual | holt forecast | error |
| --- | --- | --- | --- |
| 36 | 270.100000 | 282.531964 | -12.431964 |
| 37 | 261.900000 | 275.451559 | -13.551559 |
| 38 | 271.500000 | 268.371154 | 3.128846 |
| 39 | 248.600000 | 261.290748 | -12.690748 |
| 46 | 211.700000 | 211.727913 | -0.027913 |
| 47 | 211.400000 | 204.647508 | 6.752492 |

Month 36 came in at 270.100000 bbl/d against a forecast of 282.531964, so the error is -12.431964: the forecast was high by that much. Month 38 is positive, 3.128846, because the well made a little more than holt expected. The last month, 47, is positive too.

## An error is also a residual, somewhere else

The course keeps two words apart. A residual is an in-sample one-step error: the gap between a month and its fitted value, inside the months the fit used. An error, in this tier, is the same subtraction on months the fit never saw. The arithmetic is identical; what differs is what the months were allowed to do to the parameters. A residual has already helped choose alpha and beta. A hold-out error has not.

## One forecast per actual

The `accuracy` function scores a forecast against its actuals month by month, so it needs exactly one forecast for each actual. Three actuals and two forecasts are refused, in the engine's own words:

> forecast must have 3 values, one per actual (it has 2)

A gap in the forecast is refused by name, at the index it meets first, counting from 0:

> forecast[1] must be a finite number: fill or drop missing values first

Nothing is filled or dropped for you, and the refusal names the field and the index to fix.

## Exercise

Open the backtest explorer on the hold-out view with EKENE-P1, holt, and the last 12 months held out. Find the month with the largest negative error and the month with the largest positive one, and say in words whether holt was high or low in each. Then type three actuals of your own and only two forecasts into the scoring view, run it, and read the refusal.
