# Leakage from the future

{{panel:pf-backtest-explorer}}

Leakage is any route by which the months being scored reach the fit. A backtest has none by construction: at every origin only months 0 to o - 1 are fitted. The routes around it are easy to take by accident. This lesson runs two through the engine and names two more.

## Three routes to the same months

The months scored are EKENE-P1 months 36 to 47, one step ahead, with holt. The honest route is a backtest from origin 36 with horizon 1 and step 1, refitted, so every month is forecast from a fit on the months before it only.

| route | MAE on months 36 to 47, one step ahead | what leaked |
| --- | --- | --- |
| honest: backtest, one step ahead, refitted at each origin | 8.096036 | none |
| fitted on all 48 months, scored on its own one-step residuals for months 36 to 47 | 8.045544 | the months scored chose the parameters and fed the state |
| parameters fitted on all 48 months, then held in a backtest from origin 36 | 8.045544 | the months scored chose the parameters |

## Why the two leaky routes agree

The two leaky routes print the same figure, and they are the same numbers error for error. Holding parameters fitted on the whole series and stepping forward one month at a time replays the full fit's own one-step forecasts exactly. A backtest wrapped around parameters chosen on the future is still a leaky backtest; the wrapper protects the state and leaves the parameters exposed.

## Why the size of the gap proves nothing

Here the leaky MAE is below the honest one by 0.050492 bbl/d. On one well, the size and even the sign of that gap are no test.

So the rule is procedural: the months scored must never reach the fit, whatever the number looks like. Check how a figure was made before reading what it says.

## Random months

One route is to choose test months at random and fit on the rest. For a time series this leaks the future into the past: the months either side of a test month, after it as well as before, are in the fit. The engine offers no random split. A smoothing method needs an unbroken series, and its only honest test is an origin with everything after it held back.

For rows that are not a time series, the machine learning course's split by whole wells is the answer.

## Fitting on the test window

A 12-step forecast is a forecast of months 36 to 47 only if it was made from month 35. Fitting holt on all 48 months and asking for 12 steps forecasts months 48 to 59: its step 1 forecast is 204.197498, a forecast of month 48, which has no actual in the series. Pasted against months 36 to 47, they would be scored against the past, and nothing in the arithmetic would object.

## A checklist for any backtest figure

Before quoting a backtest figure, ask: were the parameters chosen on months before each origin only? Was the state built from months before each origin only? Was each forecast made from the month before the first month it is scored on? Three yeses and the figure is honest.

## Exercise

In the backtest explorer's rolling-origin view, run holt on EKENE-P1 from first origin 36 with horizon 1 and step 1, refitted, and check the honest MAE. Then hold out the last 12 months, read holt's step 1 forecast, and set it beside the step 1 forecast of a fit on all 48 months, 204.197498: say which month each one forecasts. Finally, write two sentences explaining to a colleague why the leaky figure being close to the honest one does not make it acceptable.
