# RMSE and MAE

{{panel:ml-fit-explorer}}

Two scores measure how far predictions sit from measured values, and both read in the target's unit. RMSE = sqrt(sum (y - yhat)^2 / n): square every miss, average, take the root. MAE = sum |y - yhat| / n: average the size of every miss. For the teaching fit of DT on GR, RHOB and NPHI, both are in us/ft, and both are quoted with the rows they were measured on.

| scored on | rows | RMSE (us/ft) | MAE (us/ft) |
| --- | --- | --- | --- |
| training rows (fitted values) | 180 | 5.758010 | 4.810983 |
| test wells EKENE-4, EKENE-5, EKENE-8 | 90 | 4.282693 | 3.526103 |

## Why two scores

Both answer "how far off, typically". They weigh the misses differently. RMSE squares each miss before averaging, so one large miss counts for more in it than several small ones of the same total size. MAE takes every miss at face value. When a few rows are badly predicted, RMSE rises more than MAE does: move only the first test row's prediction 20 us/ft higher and the test RMSE rises by 0.695109 us/ft, MAE by 0.222222. When the misses are all of similar size, the two sit close together. Up to rounding, RMSE is never below MAE, and the two meet only when every miss has one size.

Quote both, and a reader can see at a glance whether the error is spread evenly or carried by a few rows.

## Scores in the target's unit

A test RMSE of 4.282693 us/ft means the plane's predictions on the three held-out wells miss the measured sonic by about that much, in the root-mean-square sense. That is a figure a petrophysicist can weigh directly against what the sonic is being used for. It needs no reference to be read, which sets it apart from R-squared in the next lesson.

## RMSE and the residual standard error

On the training rows, RMSE divides the residual sum of squares by n = 180 and gives 5.758010. The residual standard error of module four divides the same sum by n - p = 176 and gives 5.823075. Two different divisors on one sum, so two different numbers. The first describes the misses on those rows; the second estimates the typical miss of the model while allowing for the coefficients it spent. On test rows only RMSE applies, because no coefficient was fitted on them.

## Well by well

A score over three wells is an average over three wells. The engine scores each on its own just as readily:

| test well | rows | RMSE (us/ft) | MAE (us/ft) |
| --- | --- | --- | --- |
| EKENE-4 | 30 | 4.620664 | 3.820356 |
| EKENE-5 | 30 | 4.627312 | 3.978440 |
| EKENE-8 | 30 | 3.501687 | 2.779514 |

Each well's RMSE is a statement about that well. The combined test RMSE of 4.282693 pools all 90 rows, and a well with larger misses pulls it up.

## A small case to check by hand

The engine's own worked case sets true values 1, 2 and 3 against predictions 3, 2 and 1. The misses are two, zero and two, so the squared misses are four, zero and four, and RMSE is the root of eight thirds: 1.632993. Work the MAE the same way.

## Exercise

Open the fit explorer and choose the view for RMSE, MAE and R-squared on your own predictions. It opens on true values 1, 2, 3 and predicted values 3, 2, 1. Check the RMSE tile against 1.632993, then work the MAE by hand and check it against 1.333333. Then change one predicted value so that a single row carries a large miss, and write down how RMSE and MAE each moved.
