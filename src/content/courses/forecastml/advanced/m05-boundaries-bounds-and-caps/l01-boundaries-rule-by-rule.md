# Boundaries, rule by rule

{{panel:pf-uncertainty-explorer}}

A boundary is the value where a rule changes its answer. It is tempting to carry one habit for all of them, that a limit is always inclusive, or always exclusive. The engine gives no such licence: every rule has its own boundary, and the only way to know one is to read it. The course probes each rule with a pair of real calls, one on the boundary and one across it.

## A selection, both sides

"Accepted" means a result came back; "refused" means an error naming the field.

| function | rule | at the boundary | across it |
| --- | --- | --- | --- |
| `fitSmoothing` | alpha and beta given | 0 and 1 accepted (inclusive) | -0.1, 1.2 refused |
| `fitSmoothing` | phi given | any value above 0 and at most 1 (0.01, 1 accepted) | 0, 1.05 refused |
| `fitSmoothing, arpsForecast` | h | 0 and 10000 accepted | -1, 1.5, 10001 refused |
| `forecastIntervals` | h | 1 accepted | 0 refused |
| `forecastIntervals` | seed | 0 and 4294967295 accepted | -1, 2.5 refused |
| `backtest, compareWithArps` | the last origin | o + horizon = n accepted | o + horizon > n refused |
| `compareWithArps` | the first origin | 3 accepted for every method list | 2 refused, even for ses alone |
| `forecastIntervals` | nonNegative | a percentile at or above 0 reported as simulated | below 0 reported as 0 and counted in clippedToZero |

Read the rows for their differences. alpha is inclusive at both ends. phi, when given, is exclusive at 0 and inclusive at 1. h is 0 or more for a fit and 1 or more for an interval. The clipping rule leaves a percentile of exactly 0 alone. No single habit gets all of these right.

## The last origin

A backtest origin o trains on months 0 to o - 1 and is scored on months o to o + horizon - 1. The last origin must leave every one of its actuals inside the series, so o + horizon = n is accepted and o + horizon > n refused. On 48 months with horizon 6, origin 42 is accepted and origin 43 refused. Ask for origin 45 with ses and the refusal names the range:

> firstOrigin must be a whole number from 2 to 42 ('ses' needs 2 training values; an origin above 42 leaves fewer than 6 actuals)

The range is built from the method and the horizon together, and the message gives both reasons.

## The first origin

The first origin must leave the method enough training values to fit. For a backtest that is the method's own fitting length, 2 for ses and 3 for holt and damped, so holt from origin 2 is refused:

> firstOrigin must be a whole number from 3 to 42 ('holt' needs 3 training values; an origin above 42 leaves fewer than 6 actuals)

A comparison fits every listed method, and the Arps baseline, on the same windows. It takes 3 as the first origin whatever the list, and refuses 2 even when ses is the only method listed:

> firstOrigin must be a whole number from 3 to 42 (the comparison needs 3 training values; an origin above 42 leaves fewer than 6 actuals)

The comparison's rule is its own, and stricter than the ses rule.

## Results that are null

Two boundaries decide a metric, and neither refuses. MAPE is a number when every actual is non-zero and null with its reason when any actual is 0. MASE is a number when the training scale Q is above 0 and there are more than m training values, and null with its reason otherwise. A boundary between a number and a null is still a boundary.

## Exercise

Open the view "A boundary, either side" and work through each rule it offers. For each, keep the value it starts with, read the answer at that value and at one less, and write down which side is accepted and the engine's words for the refusal. For the rule "backtest first origin, holt", say which training length the boundary comes from.
