# The whole workflow in order

{{panel:ml-fit-explorer}}

Everything in this tier fits into five calls, made in a fixed order. Here they are on the Ekene sonic wells, holding out one well, with what the engine returned at each step. The order is the lesson: every later step depends on the first one having been done first.

| step | call | what it returned |
| --- | --- | --- |
| 1. choose the rows | `groupSplit` with nTestGroups 1 and seed 5 | test well EKENE-8, 30 rows; 8 training wells, 240 rows |
| 2. fit on the training rows only | `ols` on GR, RHOB, NPHI | coefficients 8.829369, 0.320501, 17.445328, 139.804854; R-squared 0.709438 |
| 3. predict the held-out well | `predict` | 30 predicted DT values |
| 4. score the held-out well | `regressionMetrics` | RMSE 3.765285 us/ft, MAE 2.958753 us/ft, R-squared about its own mean 0.832560 |
| 5. score the training rows, for comparison | `regressionMetrics` on the fitted values | RMSE 5.462405 us/ft, R-squared 0.709438 |

## Step one comes first

The split decides which rows are allowed to influence anything. Once it is made, every later step either fits on the training rows or is applied to the test rows, never both. If a scaler, a choice of features or any other fitted number is computed before the split, on every row, then the held-out well has had a hand in the model and its score no longer reports on an unseen well. So the split is made before anything is fitted, and its seed is written down.

Here `nTestGroups` 1 at the seed 5 holds out EKENE-8, all 30 of its rows, and leaves eight wells, 240 rows, to train.

## Step two, fit on the training rows

Least squares on the 240 training rows returns an intercept and three coefficients: 8.829369 us/ft, then 0.320501 per gAPI, 17.445328 per g/cm3 and 139.804854 per v/v. The training R-squared, about the training mean, is 0.709438. If the features were scaled first, the scaler is fitted in this step too, on these same 240 rows, and applied unchanged afterwards.

## Steps three and four, predict and score

`predict` applies the fitted rule to EKENE-8's 30 rows and returns 30 predicted DT values. `regressionMetrics` compares them with EKENE-8's measured DT: RMSE 3.765285 us/ft, MAE 2.958753 us/ft, and an R-squared of 0.832560 taken about EKENE-8's own mean, the engine's default for a test score.

## Step five, the training score beside it

The fitted values on the 240 training rows give RMSE 5.462405 us/ft. Here the held-out well scores better than the training rows, as the teaching split did. That is a fact about EKENE-8 and this draw.

## Scaling inside the workflow

Standardise the features on the training rows before step two, and the coefficients change units: they read 105.119167, 6.898926, 2.402069 and 4.610720, in us/ft per unit of the standardised feature. The predictions for EKENE-8 differ from the unscaled fit's by at most 1.42e-14 us/ft, which is rounding. Least squares with an intercept gives the same plane under any rescaling of a feature, so for this model scaling changes how the coefficients read and nothing else.

## Every step is a call you can repeat

Each row of the table is an engine call with stated inputs. Anyone with the same wells, the same seed and the same features gets the same five results. That repeatability is what lets a score be checked, argued with and trusted.

## Exercise

Open the fit explorer on the least squares view. Clear the test fraction, set the test wells box to 1 and leave the seed at 5. Check the coefficients, the Training R-squared, the Test RMSE, the Test MAE, the Test R-squared and the Training RMSE against the table above. Then switch to the scaling view with the same split, and write down which rows the centres and scales it shows were fitted on.
