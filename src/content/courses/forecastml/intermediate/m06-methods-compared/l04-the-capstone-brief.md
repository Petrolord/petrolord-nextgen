# The capstone brief

{{panel:pf-backtest-explorer}}

The capstone for this tier grades six figures, and every one answers the Professional question: how well does a forecast do on months it never saw, tested honestly?

| graded quantity | the module it rests on |
| --- | --- |
| the sMAPE of a hold-out forecast | percentage errors |
| the MASE of the same hold-out forecast | the scaled error |
| the mean error of the same hold-out forecast | forecast errors |
| the pooled RMSE of a rolling-origin backtest, refitted | rolling-origin backtests, and pooling |
| the pooled MASE of the same backtest with parameters held | parameters held from the first window, and pooling |
| the MAE at a stated step ahead of the refitted backtest | errors by horizon |

## What it grades and why

It grades testing quantities only. It grades no fitted smoothing parameter and no in-sample MSE on its own, because those are the Associate question and the Associate capstone asks them. It grades no interval, no percentile and no comparison against the Arps baseline, because those are the Expert question.

## The data are new

The capstone runs its own field, its own wells and its own stated settings. None of its values appears in any lesson, and none of the figures in this tier's lessons is a capstone answer. The Ekene wells are worked examples. Use them to check that you drive the explorer correctly.

## How to work it

Take each field in turn, decide which view it needs, and set that view exactly as the brief states before reading anything: the well, the method, the months fitted and scored, and for a backtest the first origin, horizon, step and refit.

For the three hold-out figures, fit on the months the brief names and score the months after them. Check the sign of the mean error before you submit: it is actual minus forecast, so a forecast that ran high gives a negative figure. Read sMAPE in percent, on 0 to 200. Read MASE with m 1 unless the brief states another lag, and make sure the training months, and only they, set its scale.

For the refitted backtest, confirm the origins the view lists before reading the pooled RMSE, which is in bbl/d.

For the held MASE, run the same backtest with refit off. The first origin's errors should match the refitted run's; the later ones should not.

For the MAE at a step ahead, read the by-step row the brief names from the refitted run. Count its errors: one per origin.

## Before you submit

Keep every figure at full precision until the end, and quote the numeric field the engine returns. A figure inside a message is text to read. If a metric comes back as null, read its reason in `notes`: it names what could not be computed and why. If a call is refused, the refusal names the field it could not use, and the fix is in the input.

## Exercise

Before you open the capstone, rerun the worked examples on EKENE-P1 and confirm each figure. On the teaching hold-out, holt fitted on months 0 to 35 and scored on months 36 to 47: sMAPE 2.735957, MASE 0.241874 at m 1, ME -4.573069. On the teaching backtest, holt from first origin 24, horizon 6, step 6: pooled RMSE 14.083697 refitted, pooled MASE 0.368974 held, and MAE 18.348056 at step 6 refitted. For each of the six graded fields, write down which view and which setting you will check first.
