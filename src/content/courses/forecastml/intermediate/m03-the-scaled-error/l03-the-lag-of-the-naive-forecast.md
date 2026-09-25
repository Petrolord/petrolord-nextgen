# The lag of the naive forecast

{{panel:pf-backtest-explorer}}

The naive forecast so far used the month before: lag 1, the engine's default. The lag is a setting, `m`, and changing it changes the scale, and so the MASE, of the very same forecast.

## Lag 1 and lag 12

With m 1, each training month is compared with the month before it. With m 12, each is compared with the same month a year earlier: the seasonal naive forecast, which says this month will make what the same calendar month made last year. The engine's refusal of a bad lag spells out both meanings:

> m must be a whole number, 1 or more (1 is the non-seasonal naive; 12 is a monthly seasonal naive)

## The same forecast, two figures

On the teaching hold-out, holt fitted on EKENE-P1 months 0 to 35 and scored on months 36 to 47, with the training months 0 to 35 as the series Q is taken from:

| lag m | differences in the training months | Q (bbl/d) | holt MASE |
| --- | --- | --- | --- |
| 1 | 35 | 28.045714 | 0.241874 |
| 12 | 24 | 281.625000 | 0.024087 |

Holt's forecast and its MAE are identical in both rows; only the yardstick changed. With m 12 the 24 differences are months 12 to 35, each against the month a year before.

## Why the lag-12 scale is so large

EKENE-P1 is a declining well with no season. On a decline, the month a year back is far above this month, so the lag-12 differences are the whole year's decline, and their mean is large. A large Q makes any forecast look good. The seasonal naive forecast is a sensible yardstick for a series that repeats each year; for a decline it is a weak one, and a MASE against it flatters.

So the lag is part of the figure: 0.024087 and 0.241874 describe the same forecast of the same months. Quote MASE with its m.

## Too few training months for the lag

A lag-m naive forecast needs more than m training months to make even one difference. With 12 training months and m 12 there is no month a year before any of them, so there is no in-sample error to scale by. The engine returns MASE as null with its reason:

> MASE is undefined: insample has 12 values, so the lag-12 naive forecast has no in-sample error (it needs more than 12)

Inside a backtest the same rule is applied to each origin's training window. On EKENE-P1, ses, m 12, first origin 12, the first window holds months 0 to 11:

> MASE is undefined: at origin 12 the training window has 12 values, so the lag-12 naive forecast has no in-sample error (it needs more than 12)

Neither is a refusal: the other metrics come back as numbers, and MASE as null with its reason.

## Choosing m

Take m 1 on a production decline unless there is a stated reason for another lag, and check that two MASEs share m before comparing them.

## Exercise

In the backtest explorer, open the view of MASE across the lag m on EKENE-P1's teaching hold-out. Read holt's MASE at m 1 and at m 12 and check them against the table. Then set m to a lag between them and say which way you expect Q to move before you run it. Finally, run a backtest on EKENE-P1 with ses from first origin 12 at m 12 and read the reason.
