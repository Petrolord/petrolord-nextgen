# What is not built

{{panel:pf-uncertainty-explorer}}

An honest reading of an engine includes what it does not do. The forecasting engine exports seven names in full: DEFAULTS, accuracy, arpsForecast, backtest, compareWithArps, fitSmoothing and forecastIntervals.

## The methods it does not have

The methods are simple exponential smoothing, Holt's linear trend and the damped trend, all additive. The engine builds no seasonal smoothing (Holt-Winters), no multiplicative error or trend forms, no ARIMA and no neural network. The Ekene wells decline with no season, so this course never needs them. A series with a strong season, or with errors that grow with the rate, is a case the engine cannot model, and a note on such a series says so.

It also runs no regression of rate on other variables, such as choke, pressure or water cut. Regression on well data belongs to the machine learning course.

## The uncertainty it does not give

There is no analytic prediction interval: intervals come from the residual bootstrap alone. And there is no parameter uncertainty in the bootstrap. The parameters are fitted once and held for every path, so the spread of the paths is the spread of the replayed residuals and nothing else. The residuals are drawn as fitted, without centring, and a method whose residuals lean one way drifts. Every interval this engine returns is a statement about one method with one parameter set, and a note quotes it that way.

## The data work it does not do

The engine does not fill a missing month. A null or non-finite value is refused by name, at the first index it meets, counting from 0:

> y[5] must be a finite number: fill or drop missing values first

Filling or dropping a month is the caller's decision, and the data quality course conditions rates before they reach a forecast. Shut-in months at rate 0 are real values and are passed as 0: the smoothing methods fit through them, and the Arps fit drops them.

## The decline work it leaves to its own engine

The engine fits no decline curve of its own. The Arps baseline is the platform's decline curve engine, imported, and the decline curve analysis course teaches Arps itself. The engine computes no EUR, no reserves and no cumulative production. It forecasts a rate at each future step, and that is all a forecast from it claims.

## Why the list matters

If a forecast note implies a seasonal model, a reserves figure or a confidence statement about the parameters, it claims work that was never done. Name the method, name what it leaves out when that matters to the well, and send the reader to the course or tool that does the rest.

## Exercise

Take one Ekene well and list, for a twelve-month forecast of it, every question from this lesson a manager might ask: a season, a pressure effect, a reserves figure, an interval on the parameters. For each, write one sentence saying whether this engine answers it, and if not, where the answer would come from. Then open "Methods ranked against Arps" from EKENE-P1, type null in place of month 5, counted from 0, and read the engine's words.
