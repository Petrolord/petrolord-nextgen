# Alpha at one is the naive forecast

{{panel:pf-smoothing-explorer}}

Each end of alpha's range turns simple smoothing into something plainer. At one end the method never learns. At the other it forgets everything but the last month. The fit on real declines often lands on the second, and knowing why keeps you from reading too much into a fitted alpha.

## Alpha 0: the level never moves

At alpha 0 each new level is all old forecast and none of the new rate. The level stays at y_1 for ever, so on EKENE-P1 every fitted value and every h-step forecast is month 0's 1176.100000. The SSE is 25246877.490000, the largest in the alpha table, because a well that has fallen to 211.400000 is still being forecast at its first month's rate.

## Alpha 1: the naive forecast

At alpha 1 the level is always the newest rate. Each fitted value is then the month before, and the h-step forecast is the last month's rate, 211.400000 on EKENE-P1. That is the naive forecast: next month will be what this month was. On EKENE-P1 it scores SSE 49562.030000 and MSE 1054.511277, the lowest of every alpha the previous lesson tried.

## Alpha fitted, every long well

Leave alpha blank and the engine fits it. On every 48-month well:

| well | fitted alpha | atBounds | SSE | MSE |
| --- | --- | --- | --- | --- |
| EKENE-P1 | 1.000000 | alpha = 1 | 49562.030000 | 1054.511277 |
| EKENE-P2 | 1.000000 | alpha = 1 | 397910.120000 | 8466.172766 |
| EKENE-P3 | 1.000000 | alpha = 1 | 92030.720000 | 1958.100426 |
| EKENE-P4 | 0.528376 | none | 215501.852140 | 4585.145790 |
| EKENE-P5 | 1.000000 | alpha = 1 | 52451.580000 | 1115.991064 |

On four of the five wells the fitted alpha stops on its upper bound 1, so the fit becomes the naive forecast. The engine lists that in `atBounds` as "alpha = 1". Only the noisy allocation, EKENE-P4, fits alpha inside the box, at 0.528376.

## Why a decline pulls alpha to one

Simple smoothing's fitted value is a weighted average of past rates. On a well that falls every month, every past rate is higher than the next one, so any weight on older months pulls the fitted value up and away from the next rate. The fitted values lag least when all the weight sits on the newest month. The fit finds that, and alpha runs into its bound.

Noise pulls the other way. On EKENE-P4, with noise of 12 percent, a single month is an unreliable guide to the next, and averaging several months reduces the error more than it adds lag. The fit settles in between.

## What a bound tells you

An alpha on its bound is a fitted value like any other, and it says that the SSE was still falling at the edge of the box. That is useful information: the naive forecast needs no method at all, and when a smoothing fit collapses onto it on a steady decline, the series is asking for a trend. The next module adds one.

All of this is in-sample. The fitted alpha minimises one-step errors over months the method has already seen. Whether the naive forecast or any other forecasts future months well is a separate test.

## Exercise

In the smoothing explorer choose "Fit a method", pick ses and leave alpha blank. Fit EKENE-P1, then each other 48-month well, and read the fitted alpha and `atBounds` for each. Then choose "The recursion, month by month" on EKENE-P1 with alpha 1 and check that every fitted value equals the month before.
