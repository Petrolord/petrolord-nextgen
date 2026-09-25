# The mean absolute error and the root mean squared error

{{panel:pf-backtest-explorer}}

The mean error keeps the signs, so misses cancel. To say how far a forecast missed, the signs have to go, and the engine offers two ways that weigh misses differently.

## Two definitions from the basis

The mean absolute error is "mean |e|": take the size of each error and average. The root mean squared error is "sqrt(mean e^2)": square each error, average the squares, and take the square root. Both come back in bbl/d, the unit of the rate, so both can be read against the rates themselves. The divisor of each is n, the number of errors scored.

On the teaching hold-out, each method fitted on EKENE-P1 months 0 to 35 and scored on months 36 to 47:

| method | ME | MAE | RMSE |
| --- | --- | --- | --- |
| ses | -51.683333 | 51.683333 | 55.720702 |
| holt | -4.573069 | 6.783515 | 8.360530 |
| damped | -14.978829 | 14.978829 | 16.204238 |

Holt misses by 6.783515 bbl/d in a typical month here; ses by 51.683333. Holt's ME is smaller in size than its MAE because its errors change sign; damped and ses have ME equal to minus their MAE, so all their errors were negative.

## Squaring weights the large misses

RMSE is at least MAE on every row of that table, and that is always so. Squaring makes a large error count for more than its share: an error twice as big adds four times as much to the mean of the squares. So RMSE rises above MAE when the misses are uneven, a few large ones among many small ones, and sits close to MAE when the misses are all about the same size.

Holt's errors on this hold-out are uneven: from almost nothing in month 46 (-0.027913) to -13.551559 in month 37 and -13.910343 in month 40. The four misses above 12 bbl/d in size, in months 36, 37, 39 and 40, pull its RMSE, 8.360530, above its MAE of 6.783515. The ses misses are all negative and unequal in size, so its RMSE of 55.720702 also sits above its MAE of 51.683333.

## Which one to report

MAE is the easier to explain, a typical miss in bbl/d. RMSE is the one to watch when a single large miss is costly, because one bad month cannot hide among good ones. Reporting both with the ME shows the lean, the typical miss and the spread at once.

Both depend on the size of the well. A miss of 6.783515 bbl/d on a well making a couple of hundred bbl/d is a different story from the same miss on a well making twenty. The next module puts errors on a percentage scale, and the one after that on a scale with no unit at all, so wells of any size can be compared.

## Comparing methods on the same months

These rows compare because each method was trained on the same months and scored on the same months, 36 to 47. Change either and the comparison breaks.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P1 and score holt. Write down its MAE and RMSE. Then type a forecast of your own into the scoring view against the same twelve actuals: holt's forecast with one month changed to be 50 bbl/d too high. Run it and compare how far the MAE moved with how far the RMSE moved, and explain the difference from the two definitions.
