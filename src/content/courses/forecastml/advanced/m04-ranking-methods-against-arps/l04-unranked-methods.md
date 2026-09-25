# Unranked methods

{{panel:pf-uncertainty-explorer}}

A ranking orders numbers, and some methods have no number to order. The engine never forces them into a place. A method whose metric is null is left out of the ranking and listed in `unranked`, and the ranking basis says so in its last clause:

> a method whose mase is null is left unranked

This lesson reads the two ways a method reaches that list, and what a ranking with nothing in it means.

## A metric returned as null

A null metric is a result. The engine returns it when the arithmetic cannot give a number, puts the reason in `notes`, and returns every other metric as a number. MAPE divides by each actual, so a backtest whose actuals include a shut-in month returns MAPE as null. On EKENE-P2, ses from first origin 20, the reason names the month and the origin:

> MAPE is undefined: the actual at index 22 (origin 20, step 3) is 0 and MAPE divides by each actual

The overall metrics of a backtest pool every origin and step, so one origin with a zero actual leaves the overall MAPE null. The same pooling makes one origin whose training window has a naive scale of 0 leave the overall MASE null, with its own reason.

## Everything unranked

EKENE-P2 compared from first origin 12, horizon 6, step 3, ranked by MAPE. The shut-in months 22 to 24 fall in the actuals of some origins, and every method's pooled MAPE is null. The result has an empty `ranking`, `best` null, and `unranked` ses, holt, damped, arps. Nothing is ranked.

Ranked by MASE instead, the same call ranks all four. The months, the forecasts and the errors are the same in both calls; only the metric changed, and with it whether any number existed to order. This is the practical reason the engine ranks by MASE unless told otherwise: MAPE ranks nothing once a shut-in month is in the actuals of every method's origins.

## An arps row with no fit

The Arps baseline can leave the ranking a second way. When a training window gives `fitArpsModel` too few positive months, the arps row carries an error and no metrics at all. It is unranked for every metric, and the smoothing methods are ranked without it. The unranked list then holds arps alone.

## Reading an unranked list

An unranked method has not lost. It has no figure on that metric, for a reason the engine states. Report it as unranked, give the reason from `notes` or the row's error, and never place it last by hand. A ranking with an empty `best` is a finding about the metric and the months, and the remedy is a metric that is defined on them, or origins whose actuals and training windows it can score.

## Exercise

Open "Methods ranked against Arps", start from EKENE-P2, and set first origin 12, horizon 6 and step 3. Rank by mape and read the ranking, best and unranked tiles and the declared reason. Rank the same call by mase and read them again. Then set first origin 28 and rank by mape once more, and write one sentence on why this ranking has numbers to order.
