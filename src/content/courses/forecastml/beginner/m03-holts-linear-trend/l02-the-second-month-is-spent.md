# The second month is spent on the start

{{panel:pf-smoothing-explorer}}

Holt's method needs two starting values, a level and a trend, before it can forecast anything. A single month gives a level but no direction. This engine takes the direction from the first two months, and that choice costs one month of scoring. This lesson shows exactly where the cost falls.

## The start, in the engine's words

The engine starts at l_1 = y_1 and b_1 = y_2 - y_1. The formulas count from 1, so y_1 and y_2 are the rates at months 0 and 1. On EKENE-P1 the result carries `initial.level` 1176.100000 and `initial.trend` -22.700000, which is 1153.400000 less 1176.100000.

The basis of a Holt fit on EKENE-P1 states the start and its consequence:

    l_1 = y_1, b_1 = y_2 - y_1; errors scored from index 2 (0-based), 46 of them

## Why month 1 is not scored

The first fitted value is f_2 = l_1 + b_1. The trend b_1 was built from month 1's rate, so the level plus that trend lands exactly on month 1's rate: 1153.400000. The residual there is 0 by construction. It says nothing about the method, because the answer was used to set the question.

The engine does not score it. `residuals` is null at index 1, and `scoredFrom` is 2. The SSE of a Holt fit sums the residuals from index 2 on, and EKENE-P1's 48 months give 46 scored errors. Simple smoothing, which spends only month 0, scores 47.

| method | start | scoredFrom | scored errors on 48 months |
| --- | --- | --- | --- |
| ses | l_1 = y_1 | 1 | 47 |
| holt | l_1 = y_1, b_1 = y_2 - y_1 | 2 | 46 |

## Giving the trend instead

An `initialTrend` replaces y_2 - y_1. Then month 1's rate is not needed for the start and is scored like any other month. With an `initialTrend` of -25.000000 given, the rule reads "l_1 = y_1, b_1 = initialTrend", `scoredFrom` is 1, and 47 errors are scored. Month 1 is forecast at 1151.100000, with a residual of 2.300000.

An initial trend must be a number, or it is refused:

> initialTrend must be a finite number when given

Giving a trend also lowers the fewest months the method needs. The damped trend with an initial trend needs two months; with one it is refused:

> y has 1 value: 'damped' with an initialTrend needs at least 2 (the first sets the level, the second is the first scored forecast)

## Why this start

Other tools estimate the starting level and trend as parameters, or average several early differences. Taking them from the first two months lets anyone run the recursion by hand and reproduce every fitted value. The price is one month of scoring and a trend set by a single month-to-month change, noise and all. On EKENE-P1 the trend starts at -22.700000 bbl/d per month and steepens to -40.772440 by month 5 at alpha 0.5 and beta 0.2, as the next months fall faster than that first change.

## Exercise

In the smoothing explorer choose "Fit a method", load EKENE-P1, pick holt and give alpha 0.5 and beta 0.2. Read the start in the engine's words and the index scoring starts from. Then choose "The recursion, month by month" with the same settings and confirm month 1's fitted value equals its rate and carries no residual. Repeat with ses and compare where scoring starts.
