# A shut-in month in the actuals

{{panel:pf-backtest-explorer}}

EKENE-P2 was shut in for three months, months 22 to 24 counted from 0, at a rate of exactly 0. A hold-out whose actuals include those months puts MAPE's zero rule to work. This lesson scores one.

## The test

Holt is fitted on EKENE-P2 months 0 to 19 and forecasts 6 steps, months 20 to 25. The fit never saw the shut-in, so its forecast carries on declining through it:

| month | actual | holt forecast | error | sMAPE term |
| --- | --- | --- | --- | --- |
| 20 | 439.800000 | 405.328470 | 34.471530 | 8.157702 |
| 21 | 364.000000 | 388.778760 | -24.778760 | 6.583278 |
| 22 | 0.000000 | 372.229050 | -372.229050 | 200.000000 |
| 23 | 0.000000 | 355.679339 | -355.679339 | 200.000000 |
| 24 | 0.000000 | 339.129629 | -339.129629 | 200.000000 |
| 25 | 456.100000 | 322.579918 | 133.520082 | 34.293958 |

## MAPE is returned as null

Three actuals are 0, and MAPE divides by each actual. The engine returns MAPE as null and puts its reason in `notes`, verbatim:

> MAPE is undefined: actual[2] is 0 and MAPE divides by each actual

The index is into the actuals passed, counted from 0: actual[2] is the third of the six, month 22. Nothing was refused. Every other metric of the call is a number: MAE 209.968065, RMSE 258.102385 and MASE 5.427746.

Read those three with the table. The shut-in months carry errors from -339.129629 to -372.229050 bbl/d, and they dominate every mean. The forecast did what a forecast from months 0 to 19 could do; nothing in those months said the well would be shut in.

## sMAPE stays defined, at the top of its scale

The symmetric percentage error divides by the actual and the forecast together, so a zero actual beside a non-zero forecast still has a denominator. Each shut-in term scores 200.000000, the top of sMAPE's scale, whatever non-zero forecast is made. The call's sMAPE is 108.172490: three of the six terms sit at the top of the scale, and the other three are small.

That is the next lesson's measure, and it shows here why it exists: it stays a number through a shut-in month. It also shows its limit. A term at the top of the scale says only that the forecast was far from 0; any other non-zero forecast would have scored the same.

## In a backtest, the reason names the origin

The same zero rule applies inside a rolling-origin backtest, which this tier builds later. There the reason names the month by its index in the series, its origin and its step. EKENE-P2, ses, first origin 20:

> MAPE is undefined: the actual at index 22 (origin 20, step 3) is 0 and MAPE divides by each actual

An `accuracy` reason names the position in the actuals passed; a backtest reason names the origin it comes from.

## Where the shut-in belongs

Whether a zero month should be in the actuals at all is a data question. The data quality course deals with rates while shut in; this engine takes the series as given and reports what the arithmetic can and cannot give. Name the zero months in any note that reports metrics across them.

## Exercise

In the backtest explorer, choose EKENE-P2 and score holt fitted on months 0 to 19 against months 20 to 25. Check that MAPE is null and read its reason. Then move the hold-out so that it ends at month 21, before the shut-in, and say which metrics changed from null to a number. Finally, run a backtest on EKENE-P2 with ses from first origin 20 and compare its reason with the hold-out's.
