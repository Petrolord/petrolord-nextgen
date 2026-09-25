# Length rules for every function

{{panel:pf-uncertainty-explorer}}

Every function needs a certain number of values before it can do its job, and each one counts differently, because each spends values on different things. The engine probes each rule itself: the fewest values a call accepts, with one fewer refused. This lesson reads the table and traces each number back to what the function spends.

## The table

| function | method | fewest values accepted |
| --- | --- | --- |
| `fitSmoothing` | ses | 2 |
| `fitSmoothing` | holt, damped | 3 (2 with an initialTrend) |
| `forecastIntervals` | ses | 3 (2 scored residuals) |
| `forecastIntervals` | holt, damped | 4 (3 with an initialTrend) |
| `backtest` | ses | 2 training values plus the horizon |
| `backtest` | holt, damped | 3 training values plus the horizon |
| `compareWithArps` | any list | 3 training values plus the horizon |
| `arpsForecast` | none | 3 positive values |
| `accuracy` | none | 1 actual and 1 forecast |

## Fitting: the start and one scored error

A fit must start and then score at least one error. ses starts from the first value and scores the second, so 2 is its least. holt and damped spend two values on the start, the level from the first and the trend from the first change, and score the third. The engine's words, for one value too few each:

> y has 1 value: 'ses' needs at least 2 (the first sets the level, the second is the first scored forecast)

> y has 2 values: 'holt' needs at least 3 (the first two set the initial level and trend, the third is the first scored forecast)

Give an `initialTrend` and the second value is not spent on the start, so holt and damped need 2.

## Intervals: a pool of at least two

The bootstrap resamples the scored residuals and needs at least 2 of them. Each method therefore needs one value more than its fit: 3 for ses and 4 for holt and damped. EKENE-P6, the new well, has 3 months. `fitSmoothing` fits holt on them with 1 scored error; `forecastIntervals` refuses it.

## Backtests: training plus the horizon

A backtest needs a first window the method can fit and a full horizon of actuals after it. EKENE-P6 with holt and horizon 1 has 3 values, one short:

> y has 3 values: a backtest with horizon 1 needs at least 4 ('holt' needs 3 training values, then 1 actual)

A comparison fits every listed method and the Arps baseline on each window, and asks for 3 training values whatever the list.

## Arps and accuracy

The Arps fit needs 3 positive values; zeros and negatives are dropped first and do not count. `accuracy` needs only one actual and one forecast, because a single error can be scored; with no actuals at all it is refused:

> actual has 0 values: at least 1 actual is needed

## Why this matters on a new well

A new well is where the length rules bite. EKENE-P6 can be fitted with holt, and the fit returns a forecast, but that forecast rests on 1 scored error. The engine will not put an interval around it, and will not backtest it with holt at any horizon. The refusals are the engine saying how little the series can support. Report the fit with its scored error count, and say which tests could not be run and why.

## Exercise

Open the view "A boundary, either side" and choose "ses length", then "holt length", then "Arps positive values". For each, read the answer at the starting value and at one less, and copy the engine's words for the refusal. Then open "Bootstrap intervals", type EKENE-P6's three months, choose holt, and read the refusal. Switch the method to ses and say whether the call is accepted, and why.
