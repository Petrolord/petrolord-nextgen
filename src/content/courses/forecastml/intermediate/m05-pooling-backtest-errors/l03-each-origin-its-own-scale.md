# Each origin scaled by its own training window

{{panel:pf-backtest-explorer}}

MASE divides errors by Q, the naive forecast's in-sample error on the training months. In a backtest, every origin has its own training months, so every origin has its own Q. The engine divides each error by the Q of the origin that made it. This lesson shows why that rule, and what a shortcut does to the figure.

## Four origins, four scales

On the teaching backtest, holt on EKENE-P1, first origin 24, horizon 6, step 6, refitted, each origin's scale is the mean size of the month-to-month changes over its own window:

| origin | training months | Q (bbl/d) |
| --- | --- | --- |
| 24 | 0 to 23 | 36.956522 |
| 30 | 0 to 29 | 32.003448 |
| 36 | 0 to 35 | 28.045714 |
| 42 | 0 to 41 | 25.682927 |

The scales fall from origin to origin. Each error at origin 24 is divided by 36.956522, each error at origin 42 by 25.682927, and so on. The pooled MASE is the mean of all 24 scaled errors: 0.374515.

## Why each origin keeps its own

A scale is part of the forecast's test, and the test at each origin may use only what a forecaster standing at that origin had. At origin 24 that is months 0 to 23, so origin 24's Q comes from months 0 to 23. It is fixed before origin 24's forecast is scored, which is the same rule that made MASE honest on a single hold-out.

A scale taken from any later window would reach into months after the origin. That breaks the rule the whole backtest is built on, in a quiet place where it is easy to miss.

## The shortcut and what it gives

Dividing every error by the last origin's scale, 25.682927, a wrong method, gives a pooled figure of 0.458893. The engine's figure, each origin its own scale, is 0.374515.

The shortcut reads higher here because the last origin's scale is the smallest of the four, and a smaller denominator makes every early error look larger. On a well whose scales rose, the same shortcut would flatter. Either way, 0.458893 is not the MASE of this backtest, and it mixes a yardstick from months 0 to 41 into forecasts made from month 23.

## What the per-origin rule buys

Because each origin is measured against the history it had, errors from different parts of the well's life are put on comparable footing before they are pooled. The same rule holds step by step: each by-horizon MASE also divides every error by its own origin's Q.

The rule has one cost. If any origin's Q cannot be formed, its errors cannot be scaled, and the pooled MASE cannot be formed either. That is the subject of the next lesson.

## Quote the scale with the figure

The engine returns each origin's `maseScale`, and a reader who wants to check a pooled MASE needs them. A backtest note that reports MASE says that each origin was scaled by its own training window, with m, so no reader mistakes it for a figure scaled some other way.

## Exercise

In the backtest explorer's rolling-origin view, run the teaching backtest and read `maseScale` at each origin. Check them against the table. Then take origin 42's six errors, divide their mean size by origin 42's scale yourself, and say whether that origin's forecasts beat its naive yardstick. Say in one sentence why the pooled MASE is not simply the pooled MAE divided by one scale.
