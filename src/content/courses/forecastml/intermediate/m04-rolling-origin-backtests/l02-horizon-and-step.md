# Horizon and step

{{panel:pf-backtest-explorer}}

Three numbers lay out every backtest: the first origin; the horizon, how many months each origin forecasts; and the step, how far the origin moves between forecasts. The engine checks each and says, in its own words, what it cannot use.

## The layout of the teaching backtest

Holt on EKENE-P1, first origin 24, horizon 6, step 6. The first origin forecasts months 24 to 29, and the origin then moves to 30, 36 and 42. The last origin is the largest o with o + 6 <= 48, so that every origin has all 6 of its actuals: origin 42 forecasts months 42 to 47, the end of the series; origin 43 is refused.

When the step equals the horizon, as here, each month is forecast by exactly one origin. A step shorter than the horizon makes the forecast windows overlap: the EKENE-P2 comparisons after the workover, at the end of this tier, use horizon 6 and step 3.

## The first origin

The first origin must leave enough training months for the method and enough months after it for a full horizon. Holt from origin 2 on EKENE-P1, horizon 6:

> firstOrigin must be a whole number from 3 to 42 ('holt' needs 3 training values; an origin above 42 leaves fewer than 6 actuals)

Ses from origin 45 with horizon 6 on 48 months:

> firstOrigin must be a whole number from 2 to 42 ('ses' needs 2 training values; an origin above 42 leaves fewer than 6 actuals)

The lower limit follows the method, 2 for ses and 3 for holt and damped, because holt and damped spend their second month on the start. The upper limit follows the horizon and the length of the series.

## A series too short for any backtest

EKENE-P6, the new well, has 3 months. Holt can be fitted on them, but a backtest needs 3 training months and then at least one actual:

> y has 3 values: a backtest with horizon 1 needs at least 4 ('holt' needs 3 training values, then 1 actual)

A new well cannot be backtested until it has produced a little longer.

## Horizon, step and the number of origins

A horizon or a step of 0 is refused:

> horizon must be a whole number, 1 or more

> step must be a whole number, 1 or more

A step of 1 on a very long series makes an origin of every month, and the engine limits how many one call may take. On 5005 values of EKENE-P1 repeated, step 1:

> step gives 5003 origins, above the 5000 a backtest accepts: raise step or firstOrigin

## Choosing them

The horizon should match the question: a forecast used six months ahead is tested six months ahead. Whatever is chosen is stated, because the origins are part of the result.

## Exercise

In the backtest explorer's rolling-origin view on EKENE-P1 with holt, set horizon 6 and step 6, and find the largest first origin the engine accepts. Then set the first origin to 2 and read the refusal. Next, set step 3 with horizon 6 from first origin 24 and count the origins. Finally, choose EKENE-P6 and read what a backtest says about it.
