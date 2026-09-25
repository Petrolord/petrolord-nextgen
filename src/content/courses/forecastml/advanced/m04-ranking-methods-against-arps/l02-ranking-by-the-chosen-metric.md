# Ranking by the chosen metric

{{panel:pf-uncertainty-explorer}}

A comparison returns every method's metrics, and then a ranking: the methods ordered lowest first by one metric. MASE is the default, and `rankBy` can name another. The metric chosen can change the order, so a ranking is always quoted with the metric it is by.

## The rule, in the engine's words

For the EKENE-P2 comparison from first origin 28, horizon 6, step 3, the basis reads:

> lowest mase first; values within 1e-12 (relative) keep the listed order (methods as given, arps last); a method whose mase is null is left unranked

Three rules sit in that sentence. Lowest first, because every metric the engine offers is an error, and a smaller error is better. A tie band, which the next lesson takes apart. And a method whose metric is null leaves the ranking, which the lesson after that reads.

## Four metrics, three orders

The same comparison, ranked by each metric the engine offers except MAPE:

| rankBy | ranking | best |
| --- | --- | --- |
| mae | holt, arps, damped, ses | holt |
| rmse | holt, arps, damped, ses | holt |
| smape | damped, arps, holt, ses | damped |
| mase | holt, damped, arps, ses | holt |

By MAE and RMSE, errors in bbl/d, holt ranks first and arps second. By sMAPE, a percentage, damped ranks first. By MASE, the default, holt is first and arps third. On every metric ses is last. The methods are the same, the origins are the same, the forecasts are the same; only the yardstick moves, and it moves the order.

## Why MASE by default

The engine states its reason for the default: MASE compares wells of any size and stays defined through a shut-in. MAE and RMSE are in bbl/d, so a large well's errors outweigh a small well's. MAPE is returned as null whenever an actual is 0, so a shut-in month in the actuals leaves nothing to rank by it. MASE divides each error by an in-sample naive error from the training months, so a zero actual leaves it defined. Ranking by RMSE or by MAPE is the alternative in common use, and the engine offers both.

## A metric the engine does not offer

`rankBy` takes five names. Anything else is refused, naming the field:

> rankBy must be 'mae', 'rmse', 'mape', 'smape' or 'mase'

## What to report

A ranking travels with its metric, its origins, horizon and step, and whether the smoothing parameters were refitted. "holt ranks first" says little; "holt ranks first by MASE on EKENE-P2 from first origin 28, horizon 6, step 3" says what was tested.

## Exercise

Open "Methods ranked against Arps", start from EKENE-P2 with first origin 28, horizon 6 and step 3, and run it ranked by mase, then mae, then smape. Write down the ranking and best for each. Then rank by mape from first origin 28, and again from first origin 12, and read the ranking and the unranked list each time. Explain the difference from the months this well was shut in.
