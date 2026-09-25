# A flat forecast at every step

{{panel:pf-smoothing-explorer}}

Simple exponential smoothing tracks a level and nothing else. It has no idea of direction, so when it looks past the last month it has only one number to offer: the final level, repeated at every step. On a declining well that is a real limitation, and this lesson reads it directly.

## The forecast is the final level

The basis ends with the rule "forecast l_n at every step". After the last month, n, there are no new rates to update the level, so every h-step forecast is l_n. On EKENE-P1 at alpha 0.3, the 12 h-step forecasts are all 221.171043, while the last month's rate is 211.400000.

The final level sits above the last rate because the level trails a falling well from above. The flat forecast then carries that level forward unchanged. On a declining well a flat forecast sits above the decline to come.

## Alpha from 0 to 1 on EKENE-P1

Each row below is a fit with alpha given and held fixed:

| alpha | SSE | MSE | forecast at every step |
| --- | --- | --- | --- |
| 0 | 25246877.490000 | 537167.606170 | 1176.100000 |
| 0.1 | 1954345.253138 | 41581.813897 | 282.956937 |
| 0.3 | 312538.074209 | 6649.746260 | 221.171043 |
| 0.5 | 130321.602967 | 2772.800063 | 213.980072 |
| 0.9 | 55041.409583 | 1171.093821 | 211.447679 |
| 1 | 49562.030000 | 1054.511277 | 211.400000 |

Read down the last column. At alpha 0.1 the level lags so far behind that the forecast is 282.956937, well above the last month's rate. As alpha rises the final level closes on the last rate, and at alpha 1 it is the last rate. The SSE falls all the way down the table: on a steady decline, the more weight the newest month gets, the less the fitted values lag.

Every forecast in this table is flat. Raising alpha moves the height of the line; it never tilts it. A method that can tilt the line is the subject of the next module.

## Parameters simple smoothing does not have

Because simple smoothing carries no trend, the engine refuses anything that would set one. A beta on ses returns:

> beta applies to 'holt' and 'damped' only: 'ses' has no trend

An initial trend returns:

> initialTrend applies to 'holt' and 'damped' only: 'ses' has no trend

And a phi, which damps a trend, returns:

> phi applies to 'damped' only: 'ses' has no trend to damp

## How many steps

`h` sets how many steps come back. The rule on h is the same for every method. A whole number from 0 to 10000 is accepted; -1, 1.5 and 10001 are each refused with:

> h must be a whole number from 0 to 10000

## Reading a flat forecast honestly

A flat forecast is a statement that the method sees no direction. On a well that is plainly declining, that statement is wrong, and every step of the forecast inherits the error. Simple smoothing earns its place on a series with no persistent direction, such as a well held on a plateau or one with heavy noise around a steady rate. On a decline, treat its h-step forecast as a level to start from.

## Exercise

In the smoothing explorer choose "Simple smoothing across alpha", load EKENE-P1 and try the alphas 0, 0.1, 0.3, 0.5, 0.9 and 1. Check each forecast against the table. Then choose "h-step forecasts", pick ses with alpha 0.3 and h 12, and compare the final level with the last month's rate. Try h 10001 and read the refusal.
