# Pooled over origins and steps

{{panel:pf-backtest-explorer}}

A backtest returns a table of errors, one row per origin and one column per step ahead. To compare methods, that table has to become a few numbers. This module shows how the engine pools the errors, and what each pooled number rests on.

## Every origin and every step, together

The basis reads: "overall metrics average over every origin and step; MASE scales each error by its own origin's lag-1 naive in-sample MAE". The teaching backtest, holt on EKENE-P1, first origin 24, horizon 6, step 6, refitted, has 4 origins and 6 steps, so 24 errors. The overall metrics treat those 24 as one set: each error counts once, whichever origin and step it came from.

| metric | overall |
| --- | --- |
| ME (bbl/d) | 6.558931 |
| MAE (bbl/d) | 11.785709 |
| RMSE (bbl/d) | 14.083697 |
| MAPE (percent) | 4.002905 |
| sMAPE (percent) | 4.065956 |
| MASE, m 1 | 0.374515 |

The overall RMSE is the root of the mean of all 24 squared errors, and the overall MAPE the mean of all 24 percentage terms. The one metric pooled with a twist is MASE, and the twist has a lesson of its own in this module.

## Reading the pooled row

The ME is positive: over the whole backtest, holt forecast EKENE-P1 low on average by 6.558931 bbl/d. The single hold-out from origin 36 said the opposite, that holt forecast high. Both are true of their own months. The pooled figure is the better guide to how the method behaves on this well, because it rests on four origins instead of one.

The two percentage errors sit close together, and sMAPE is a little above MAPE. A forecast that runs low on average pushes sMAPE terms above their MAPE terms, the asymmetry of the percentage-errors module, and the positive ME is consistent with that.

## Why pooling beats averaging by eye

It is tempting to run four hold-outs, write down four MAEs and average them. With equal horizons that gives the same MAE, but an average of four per-origin RMSEs is not the pooled RMSE, and an origin with a metric returned as null breaks the average. The engine pools the errors themselves and states how, so every method in a comparison is pooled the same way.

## What a pooled figure hides

Pooling throws away where the errors came from. A method that is excellent one step ahead and poor six steps ahead can pool to the same MAE as one that is middling at every step. So the engine returns two more views beside the pooled row: the errors of each origin, which the previous module read, and the errors by step ahead, which the next lesson reads.

## Quoting a pooled figure

A pooled figure is quoted with everything that made it: the well, the method, the first origin, the horizon and the step, refit or held, and for MASE its m. The teaching backtest's MASE is 0.374515 with holt refitted from first origin 24, horizon 6, step 6, m 1. Drop one and a reader cannot reproduce it.

## Exercise

In the backtest explorer's rolling-origin view, run the teaching backtest and read the pooled row. Check each figure against the table. Then run the same backtest with damped and with ses, and write the three pooled MASEs side by side, each with its full description. Say which method this backtest favours, and on how many errors that judgement rests.
