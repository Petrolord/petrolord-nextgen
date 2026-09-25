# One-step and h-step forecasts

{{panel:pf-smoothing-explorer}}

Every fit in this course produces two kinds of forecast, and they answer different questions. One kind lives inside the series and is how a method is scored. The other lies past the last month and is what a forecaster hands over. Mixing them up is an easy way to misread a result, so this lesson separates them carefully.

## The one-step forecast, inside the series

The one-step forecast f_t is made at month t - 1 for month t, using only the months up to t - 1. It exists for every month of the series after the first, and the engine returns the whole list as `fitted`. In this course a one-step forecast is called a fitted value. The gap y_t - f_t is the residual, the in-sample one-step error, and the engine returns that list as `residuals`.

Here is EKENE-P1 under simple exponential smoothing with alpha 0.3, given and held fixed:

| month t | rate y_t | fitted value f_t | residual y_t - f_t | level l_t |
| --- | --- | --- | --- | --- |
| 0 | 1176.100000 | null | null | 1176.100000 |
| 1 | 1153.400000 | 1176.100000 | -22.700000 | 1169.290000 |
| 2 | 1078.600000 | 1169.290000 | -90.690000 | 1142.083000 |
| 3 | 1005.200000 | 1142.083000 | -136.883000 | 1101.018100 |
| 4 | 954.800000 | 1101.018100 | -146.218100 | 1057.152670 |
| 5 | 934.200000 | 1057.152670 | -122.952670 | 1020.266869 |

Month 0 has no fitted value and no residual: nothing came before it, so both are null. From month 1 on each residual is the rate less the fitted value, exactly as returned. Every residual in these six months is negative, because the fitted values trail a falling well from above. The residual is written actual minus forecast, so a negative one means the forecast was high.

## The h-step forecast, past the last month

The h-step forecasts are made once, from the final state of the fit, for the months after the series ends. The engine returns them as `forecast`, and index 0 of that list is one step past the last month. On a 48-month series, step 1 forecasts month 48, step 2 month 49, and so on.

The same fit on EKENE-P1 gives 12 h-step forecasts from month 47, and every one of them is 221.171043. The last month's rate is 211.400000. Simple smoothing has no trend, so its h-step forecast is its final level at every step, which the next module explains.

## Setting h

`h` sets how many h-step forecasts come back. When it is left out it is 0, so a fit alone returns an empty `forecast` and still returns every fitted value and residual. The largest h accepted is 10000. More steps only extend the list read from the final state.

## Two lists, two uses

| list | where it lies | what it is used for |
| --- | --- | --- |
| `fitted` and `residuals` | months 1 to 47, inside the series | scoring and fitting the method |
| `forecast` | steps 1 to h, past month 47 | the forecast handed over |

The residuals are what the fit minimises when a parameter is left free, so a small in-sample sum of squares says the method followed months it had already seen. It does not by itself say how the h-step forecast will fare. That question belongs to the Professional tier.

When you name a forecast, name its method and its step: "ses at alpha 0.3, step 12, 221.171043 bbl/d". A figure with no method is not a forecast anyone can check.

## Exercise

In the smoothing explorer choose "The recursion, month by month", load EKENE-P1, pick ses and give alpha 0.3. Read months 0 to 5 and check each residual is the rate less the fitted value. Then switch to "h-step forecasts", set h to 12 and read the final level beside the forecasts. Change h to 24 and confirm the fitted values have not moved.
