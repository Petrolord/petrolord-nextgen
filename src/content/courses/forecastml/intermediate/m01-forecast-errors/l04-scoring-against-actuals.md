# Scoring a forecast against actuals

{{panel:pf-backtest-explorer}}

The errors so far came from one engine call, `accuracy`. Every metric in this tier comes out of it, and every scoring mistake starts with feeding it the wrong series.

## What goes in

`accuracy` takes the actuals, the forecast, the training series as `insample`, and a lag `m`, 1 when left out. The actuals and the forecast line up month by month: the first forecast is scored against the first actual, and so on. The training series is used for one thing only, the scale of the scaled error, which a later module builds.

On the teaching hold-out the three inputs are: the actuals of EKENE-P1 months 36 to 47; holt's 12-step forecast made from a fit on months 0 to 35; and months 0 to 35 themselves as the training series.

## What comes out

One call returns every metric of this tier, for one forecast:

| metric | holt on the teaching hold-out |
| --- | --- |
| ME (bbl/d) | -4.573069 |
| MAE (bbl/d) | 6.783515 |
| RMSE (bbl/d) | 8.360530 |
| MAPE (percent) | 2.781120 |
| sMAPE (percent) | 2.735957 |
| MASE, m 1 | 0.241874 |

It also returns the scale MASE divided by, and a `notes` record holding, under each metric's name, the reason for any metric it could not give. The percentage errors and MASE are the next two modules.

## The forecast must be for the months scored

The call cannot know which months a forecast was made for, so the pairing is the analyst's job, and it has a trap.

A 12-step forecast is a forecast of months 36 to 47 only if it was made from month 35, by a fit that ended there. Fitted on all 48 months, holt's step 1 forecast is 204.197498, and that is a forecast of month 48, the month after the series ends. Pasting it against months 36 to 47 would score a forecast of the future against the past, and every metric would be a number with no meaning. The engine cannot catch this, because the arithmetic is valid.

## What the call refuses

It refuses inputs it cannot pair, each in the engine's own words. No actuals at all:

> actual has 0 values: at least 1 actual is needed

A forecast that does not match the actuals one for one:

> forecast must have 3 values, one per actual (it has 2)

A lag of 0, which would compare each month with itself:

> m must be a whole number, 1 or more (1 is the non-seasonal naive; 12 is a monthly seasonal naive)

An empty training series:

> insample has 0 values: at least 1 value is needed

## Leaving the training series out

Leaving `insample` out entirely is not refused. Every other metric still comes back as a number, and MASE is returned as null, with this reason in `notes`:

> MASE needs insample (the training series) to scale by its in-sample naive error

A metric returned as null with a reason is a result. Read `notes` every time a metric is missing.

## Exercise

In the backtest explorer's scoring view, enter EKENE-P1 months 36 to 47 as the actuals and holt's forecast from the hold-out view as the forecast, with months 0 to 35 as the training series. Check the six metrics against the table. Then clear the training series and run it again: say which metric changed and read its reason. Finally, set m to 0 and read the refusal.
