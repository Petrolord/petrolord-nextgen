# Refitting at every origin

{{panel:pf-backtest-explorer}}

At each origin the method needs parameters. The engine offers two ways to get them, set by `refit`. With `refit` true, the default, the free parameters are fitted again on each origin's own window. This lesson reads what that does on the teaching backtest.

## The procedure, run at every origin

The basis reads: "free parameters re-estimated at every origin". At origin 24, holt is fitted on months 0 to 23 by the same grid and compass search the Associate tier taught, and its 6-step forecast is scored on months 24 to 29. At origin 30 the fit starts again on months 0 to 29, and so on. Each window is a different series, so each fit can land on different parameters.

Holt on EKENE-P1, first origin 24, horizon 6, step 6, refitted:

| origin | alpha | beta | error step 1 | error step 3 | error step 6 |
| --- | --- | --- | --- | --- | --- |
| 24 | 0.684236 | 0.379743 | 11.627690 | 23.391678 | 31.937659 |
| 30 | 0.667926 | 0.392686 | 9.126974 | 6.259443 | 23.158147 |
| 36 | 0.663079 | 0.398667 | -12.431964 | 3.128846 | -5.029938 |
| 42 | 0.655079 | 0.393438 | 10.783063 | 3.396430 | 13.266479 |

alpha drifts down a little from origin to origin, and beta moves within a narrow band.

## Reading the errors by origin

The errors are not alike from origin to origin. At origin 24 every error is positive: holt forecast low, and the well stayed above the forecast over months 24 to 29. At origin 36 most errors are negative. That is what a single hold-out cannot show: one origin's errors lean one way, the next origin's another, and a method judged on one origin inherits that origin's lean.

## The pooled result

Over all four origins and six steps, 24 errors, refitted:

| metric | refit true |
| --- | --- |
| ME (bbl/d) | 6.558931 |
| MAE (bbl/d) | 11.785709 |
| RMSE (bbl/d) | 14.083697 |
| MASE, m 1 | 0.374515 |

The ME is positive: across the backtest, holt forecast EKENE-P1 slightly low on average, while on the single hold-out from origin 36 it forecast high. The MASE of 0.374515 is the figure the teaching backtest is known by. How these pooled figures are formed, and why each origin's errors are scaled by that origin's own Q, is the next module.

## What refitting tests

A refitted backtest tests the whole procedure: the method, the fitting rule and the parameter box, run exactly as an analyst would run them each time new months arrive. It answers the question: if this procedure had been used at each of these origins, how would its forecasts have done? That is often the question an operator is asking.

Refitting is honest because each fit sees only its own window. Months after an origin reach neither that origin's parameters nor its state. It costs one fit per origin, which on a monthly series is small.

## A parameter given is held at every origin

`refit` applies to the free parameters only. A parameter given to the backtest is held at that value at every origin, whatever `refit` says, exactly as a given parameter is held by a single fit. The method's own rules still apply: a beta passed to ses is refused, in the engine's words:

> beta applies to 'holt' and 'damped' only: 'ses' has no trend

## Exercise

In the backtest explorer's rolling-origin view, run the teaching backtest refitted and read alpha and beta at each origin. Check the pooled MASE of 0.374515. Then give alpha as 0.5 and beta as 0.2 and run it again: say which columns stopped changing from origin to origin and how the pooled MASE moved. Finally, switch to ses and pass a beta, and read the refusal.
