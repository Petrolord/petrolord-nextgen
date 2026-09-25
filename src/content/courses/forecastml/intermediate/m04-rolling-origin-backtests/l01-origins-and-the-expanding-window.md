# Origins and the expanding window

{{panel:pf-backtest-explorer}}

The teaching hold-out scored one forecast, made from one month. One forecast is one draw: a method can be lucky or unlucky from a single month. A rolling-origin backtest repeats the hold-out from several months, so a method is judged on many forecasts, each made honestly.

## What an origin is

An origin is the month a forecast is made from. At origin o the method is fitted on months 0 to o - 1 only, and it forecasts months o onwards, which it is then scored on. Nothing from month o or later reaches the fit. The basis of the teaching backtest reads:

> expanding window: origin o trains on y[0..o-1] and forecasts y[o..o+5]; origins 24, 24 + 6, ... while o + 6 <= 48

The teaching backtest is holt on EKENE-P1, first origin 24, horizon 6, step 6. Its origins are 24, 30, 36 and 42:

| origin | training months | months forecast and scored | scale Q of the training months |
| --- | --- | --- | --- |
| 24 | 0 to 23 | 24 to 29 | 36.956522 |
| 30 | 0 to 29 | 30 to 35 | 32.003448 |
| 36 | 0 to 35 | 36 to 41 | 28.045714 |
| 42 | 0 to 41 | 42 to 47 | 25.682927 |

Four origins, six steps each: 24 forecasts, every one of them scored on months its fit never saw.

## The window expands

Every window starts at month 0 and ends the month before its origin, so each origin's window holds every month of the one before plus the months since. The window grows from 24 months at the first origin to 42 at the last. This is the expanding window, and it is a declared choice. The common alternative is a sliding window of fixed length, which drops the oldest months as it moves. The engine expands from month 0 because every month before the origin is information a forecaster standing at that origin would have had.

Each origin also carries its own scale Q, taken from its own training months, and the scales fall from origin to origin. The module on pooling backtest errors uses them.

## The hold-out is one origin

Origin 36 fits on months 0 to 35 and forecasts months 36 onwards: it is the teaching hold-out's forecast, cut to six steps. Its errors are the hold-out's first six holt errors, from -12.431964 at month 36 to -5.029938 at month 41. The backtest does not replace the hold-out. It surrounds it with other origins, so that one origin's luck is visible for what it is.

## What the backtest returns

For every origin, the engine returns the parameters it fitted, the forecasts, the actuals and the errors, with that origin's scale. It then returns pooled metrics over every origin and step, and metrics by step ahead. Those two summaries are the next module. This module stays with how the origins are laid out, fitted and kept honest.

## Exercise

In the backtest explorer, open the rolling-origin view and run holt on EKENE-P1 from first origin 24, horizon 6, step 6. Check the four origins and their training months against the table. Compare the origin 36 errors with the teaching hold-out's holt errors. Then change the first origin to 18 and predict, before you run it, how many origins you will get and which months the first one trains on.
