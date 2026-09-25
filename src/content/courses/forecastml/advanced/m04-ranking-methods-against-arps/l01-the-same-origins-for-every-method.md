# The same origins for every method

{{panel:pf-uncertainty-explorer}}

{{panel:pf-backtest-explorer}}

A ranking of methods is only fair when every method is tested on the same months. `compareWithArps` makes that the rule: it backtests ses, holt and damped and the Arps baseline from the same expanding-window origins, with the same horizon and the same metrics. This lesson reads how it does so, and checks one of its rows against a plain backtest.

## The origins, in the engine's words

For EKENE-P2 compared from first origin 28, horizon 6, step 3, the basis reads:

> the same expanding-window origins for every method: 28, 28 + 3, ... while o + 6 <= 48

The origins are 28, 31, 34, 37 and 40. At each one every method is fitted on months 0 to o - 1 only and forecasts months o to o + 5, which it is then scored on. The last origin is 40, the largest with o + 6 <= 48 on this step, so every origin has all 6 actuals. Every row of the comparison carries those same origins.

## One row checked against a backtest

The holt row of that comparison has MASE 0.571171. A plain `backtest` of holt on EKENE-P2 from the same first origin, horizon and step returns exactly the same MASE: the comparison's smoothing rows are backtests, run side by side. The Professional tier taught the backtest; the comparison adds the Arps row and the ranking.

## How Arps is fitted at each origin

The Arps row follows its own rule, stated in the basis:

> engines/dca/arps.js fitArpsModel refitted on each training window (step k as day k; zero and negative values dropped by fitArpsModel), forecasts by calculateArpsHyperbolic

Arps is refitted on every window whatever `refit` says. The smoothing methods can hold their first window's parameters when `refit` is false; the Arps baseline is always refitted. When you run a comparison with `refit` false, say so, and say that the baseline was refitted regardless.

## The comparison after the workover

| method | MAE | RMSE | MAPE | sMAPE | MASE |
| --- | --- | --- | --- | --- | --- |
| ses | 43.530000 | 51.812325 | 13.898626 | 12.619697 | 0.789324 |
| holt | 31.606865 | 37.929339 | 9.773629 | 10.338085 | 0.571171 |
| damped | 32.820015 | 40.387899 | 10.567776 | 9.770766 | 0.599131 |
| arps | 32.176780 | 39.058863 | 10.882779 | 10.094073 | 0.605968 |

All four rows are scored on every step of the same 5 origins, against the same actuals. The Arps fit is a least-squares fit on every positive month of each training window, the months before the uplift included, and its mean error after the workover is -23.147528 bbl/d against holt's 20.751043. Arps forecasts this well high after the workover, and holt forecasts it low.

## Why every method on the same origins

A method tested from other origins is tested on other months, and on a well with a shut-in and a workover the months decide the answer. On this same well the winner changes with the first origin, as the last lesson of this module shows. Only a comparison on shared origins can say one method did better than another on the same forecasting task.

## Exercise

Open "Methods ranked against Arps" in the uncertainty explorer, start from EKENE-P2, and set first origin 28, horizon 6, step 3, ranked by mase. Read each row's MASE and the declared blocks headed THE RANKING and ARPS. Then open "A rolling-origin backtest" in the backtest explorer with EKENE-P2, holt, first origin 28, horizon 6, step 3, refitted, and confirm the overall MASE matches the holt row.
