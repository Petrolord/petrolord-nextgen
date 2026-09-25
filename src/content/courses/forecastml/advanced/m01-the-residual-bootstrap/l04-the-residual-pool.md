# The residual pool

{{panel:pf-uncertainty-explorer}}

A bootstrap can only replay the errors it has. The engine draws from one pool, the scored in-sample residuals of the fit, and reports its size as `poolSize`. This lesson says which residuals enter the pool, which do not, and what happens on a series too short to fill it.

## Which residuals enter

A residual is an in-sample one-step error: the month's rate less the one-step forecast made from the months before it. The fit scores residuals from `scoredFrom` on, and the pool is exactly those scored residuals. For the teaching run, damped on EKENE-P1, `poolSize` is 46: the 48 months less the 2 before `scoredFrom`.

The two months left out are left out for a stated reason. Month 0 has no one-step forecast, because nothing came before it. For holt and damped, month 1 is spent on the start: the engine sets the level to y_1 and the trend to y_2 - y_1, so month 1 is forecast exactly and its residual of 0 says nothing about the method. ses spends only month 0, so on the same 48 months it scores 47 errors, and its pool is those 47.

## The pool is the method's own

The pool belongs to the fitted method on the fitted series. Change the method and the pool changes, because each method makes different one-step forecasts. Give parameters other than the fitted ones and the pool changes, because the one-step forecasts change with them. An interval is therefore a statement about one method with one set of parameters, and it is quoted with both.

The residuals go into the pool as fitted, with no adjustment. The next lesson shows what that means when their mean is not 0.

## Too few to resample

The engine needs at least 2 scored residuals to resample. A pool of one would give every path the same draw at every step. EKENE-P6, the new well, has 3 months. `fitSmoothing` fits holt on them with 1 scored error, and `forecastIntervals` refuses the same call, naming the field `y`:

> y has 3 values, which leave 1 scored residual: the bootstrap resamples at least 2, so 'holt' needs at least 4 values here

ses spends one month fewer, so its limit is one value lower:

> y has 2 values, which leave 1 scored residual: the bootstrap resamples at least 2, so 'ses' needs at least 3 values here

| function | method | fewest values accepted |
| --- | --- | --- |
| `forecastIntervals` | ses | 3 (2 scored residuals) |
| `forecastIntervals` | holt, damped | 4 (3 with an initialTrend) |

An `initialTrend` given for holt or damped leaves month 1 free of the start, so it is scored, and one value fewer fills the same pool. The boundary sits at 2 scored residuals. A pool of 2 gives a legal interval, and every path then chooses between two numbers, so read such an interval as a very rough one.

## Exercise

Open the view "A boundary, either side" and choose the rule "bootstrap pool, holt". Try 4 values and then 3, and read which is accepted and the engine's words for the refusal. Then open "Bootstrap intervals", start from EKENE-P1 with damped, and read the residual pool tile. Switch to ses and read it again, and write down why the two pool sizes differ.
