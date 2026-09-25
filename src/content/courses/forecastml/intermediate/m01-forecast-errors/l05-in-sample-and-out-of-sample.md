# In-sample and out-of-sample errors

{{panel:pf-backtest-explorer}}

Every smoothing fit in the Associate tier came with an in-sample figure: residuals, their SSE and their MSE, on the months the fit was chosen on. The hold-out gives an out-of-sample figure on months the fit never saw. The two look alike and answer different questions, and this lesson puts them side by side.

## The same method, two mean absolute errors

The in-sample MAE is the mean absolute one-step residual over the fitted months, from `scoredFrom` on. The out-of-sample MAE is the hold-out's. For each method fitted on EKENE-P1 months 0 to 35:

| method | in-sample one-step MAE, months 0 to 35 | out-of-sample MAE, months 36 to 47, up to 12 steps ahead |
| --- | --- | --- |
| ses | 28.045714 | 51.683333 |
| holt | 19.755951 | 6.783515 |
| damped | 19.150711 | 14.978829 |

In-sample, damped looks best, holt close behind and ses last. Out-of-sample, holt is best by a wide margin and damped sits well behind it.

## Two different questions

The in-sample figure scores forecasts one month ahead, on months that helped choose the parameters and that fed the state. It says how well the method followed a history it was tuned to. The hold-out scores forecasts up to 12 months ahead, from one fixed month, on months that reached the fit in no way. It says how the method would have done had it been used.

Those can disagree, as they do here, for two reasons. The forecast horizon differs: one step ahead each time against up to twelve steps from one month. And the in-sample months were used to pick alpha and beta, so the in-sample figure can flatter a method; here it did so only for ses. A method is judged on the out-of-sample figure.

## Why damped fell behind on this hold-out

Damped's trend is multiplied by phi at every step, so its forecast flattens. EKENE-P1 kept declining through months 36 to 47, and damped's forecast stayed above the well in every one of them: its errors on this hold-out are all negative, and its ME equals minus its MAE. The damping that looked harmless one step at a time costs it several steps out. The in-sample figure could not show that, because it never looks more than one step ahead.

## Leakage is any route back into the fit

A hold-out is honest because the months scored never reach the fit. Scoring a method on its own residuals breaks that rule.

The course runs this through the engine on EKENE-P1, one step ahead over months 36 to 47 with holt. The honest route, a backtest refitted at each month on the months before it, gives an MAE of 8.096036. Fitting on all 48 months and scoring its own one-step residuals over months 36 to 47 gives 8.045544. The leaky figure differs by 0.050492 bbl/d, and on one well that size and sign are no test at all. The rule is procedural: a leaky number is wrong because of how it was made.

The backtest that gives the honest figure has its own module later in this tier.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P1 and score each method. Beside each out-of-sample MAE, write the in-sample figure from the table above, and label each with its months, its steps ahead and whether those months helped choose the parameters. Then hold out the last 12 months of EKENE-P4 and say whether the order of the three methods by out-of-sample MAE is the same as on EKENE-P1.
