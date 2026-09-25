# The naive forecast as a yardstick

{{panel:pf-backtest-explorer}}

An MAE of 6.783515 bbl/d is good or bad only beside something. A percentage compares it with the rate, and on a low tail that comparison runs away. This module compares it with a forecast that needs no fitting at all: the naive forecast.

## The naive forecast

The lag-1 naive forecast says next month will make what this month made. Each month is forecast by the month before it. It has no parameters, it takes no fitting, and anyone can compute it from the series by hand.

The Associate tier met it already. Simple exponential smoothing with alpha 1 puts all the weight on the newest month, so each one-step forecast is the month before, and every h-step forecast is the last month's rate. On EKENE-P1 that is 211.400000 bbl/d at every step. When ses was fitted with alpha left free, alpha stopped on its upper bound 1 on four of the five long wells: the fit found nothing better than the naive forecast on those series.

## The naive forecast's own error, in-sample

The yardstick this module uses is the error the naive forecast makes on the training months. On a training series y, it is the mean of the sizes of the month-to-month changes, |y_t - y_(t-1)|, over every month that has a month before it. That is the MAE the naive forecast would have scored, one step at a time, on months the analyst already had.

On the teaching hold-out the training months are EKENE-P1 months 0 to 35. There are 35 month-to-month differences, months 1 to 35, and the mean of their sizes is 28.045714 bbl/d. The engine returns it as `maseScale`, and this course calls it Q.

## Why this yardstick

It is known before the forecast is scored, because it comes from the training months only. It is in bbl/d, the unit of the errors it will divide. And it measures how much this well moves from month to month, which is how hard the well is to forecast one step at a time. A noisy well tends to have a large Q and a smooth one a small Q.

It is a demanding yardstick in one way and a lenient one in another. Demanding, because on a steady series the naive forecast is hard to beat one step ahead. Lenient, because Q is a one-step figure while a hold-out forecast runs up to 12 steps from one month, and errors tend to grow with the steps.

## Comparing against it

Divide a forecast's MAE by Q and the answer has no unit. Below 1, the forecast missed by less than the naive forecast's in-sample miss; above 1, by more. On the teaching hold-out, holt's MAE of 6.783515 is well under Q, and ses's 51.683333 is well over it. The next lesson makes that division the scaled error and reads the three methods with it.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P1 and read `maseScale` for the hold-out. Then enter EKENE-P1 months 0 to 35 as the training series in the scoring view with m 1, and confirm the same scale. Finally, find a well among the Ekene five where you expect Q to be larger than EKENE-P1's, say why, and check your guess.
