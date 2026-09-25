# The mean absolute scaled error and its scale

{{panel:pf-backtest-explorer}}

The mean absolute scaled error, MASE, divides a forecast's mean absolute error by the naive forecast's in-sample error on the training months. It has no unit, it stays defined through a shut-in month, and it compares wells of any size. It is the metric this tier leans on most.

## The definition

The basis reads: "mean |e| / Q, Q = mean |y_t - y_{t-m}| over the in-sample (training) series (Hyndman and Koehler 2006); null when Q = 0". The numerator is the forecast's MAE on the months scored. The denominator Q is the MAE of the lag-m naive forecast on the training series, m 1 by default. The previous lesson built Q for m 1; the next one changes m.

On the teaching hold-out, each method fitted on EKENE-P1 months 0 to 35 and scored on months 36 to 47, Q is 28.045714 bbl/d:

| method | MAE (bbl/d) | MASE, m 1 |
| --- | --- | --- |
| ses | 51.683333 | 1.842825 |
| holt | 6.783515 | 0.241874 |
| damped | 14.978829 | 0.534086 |

Holt's MASE of 0.241874 says its hold-out MAE is under a quarter of the naive forecast's in-sample one-step MAE. The ses MASE is above 1: its flat forecast missed months 36 to 47 by more than the well moved from month to month in its training months.

## The scale comes from the training series

Q is taken from the months the fit used, and only from them. It is fixed before any forecast is scored, so the yardstick cannot move with the months being forecast.

Scale holt's hold-out MAE by the naive error of the hold-out months themselves, a wrong method, and it reads 0.902281. That figure depends on the months being forecast: an erratic hold-out would inflate its own denominator and flatter the forecast. It is not MASE, and a note should never report it as MASE.

This is a declared choice. The common alternatives are the out-of-sample naive error, as above, or a seasonal lag. The engine takes the in-sample lag-m naive MAE of the training series, because the scale is then fixed before the forecast is scored.

## Why MASE travels

Because Q is in bbl/d like the MAE, the units cancel. A MASE from a well making a thousand bbl/d stands beside one from a well making twenty. On EKENE-P5's low tail, holt's MAPE was 24.095758 percent while its MASE was 0.144157: the percentage ran away as the rates shrank, and the scaled error did not, because its denominator was set by the well's own movement in the training months.

MASE also survives a shut-in month in the actuals. On EKENE-P2, holt fitted on months 0 to 19 and scored on months 20 to 25, MAPE is returned as null and MASE is 5.427746. The three shut-in months were large misses, and it is still a number.

## What MASE does not tell you

Two MASEs compare only when their months, their training windows and their lag m are named. Quote MASE with its m, every time.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P1 and read each method's MAE, `maseScale` and MASE. Divide each MAE by the scale yourself and check the MASE the view prints. Then hold out the last 12 months of EKENE-P5 and compare holt's MASE there with its MASE on EKENE-P1, and say why the comparison is fair when the MAPE comparison was not.
