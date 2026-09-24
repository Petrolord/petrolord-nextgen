# What a prediction is

{{panel:ml-fit-explorer}}

A prediction is the fitted rule applied to one row's features. For the teaching fit, the predicted sonic of any row is the intercept -0.552686 us/ft, plus 0.288005 times its GR, plus 22.499915 times its RHOB, plus 138.783590 times its NPHI. The engine's `predict` does exactly that for every row it is handed and returns the list of predicted values. It needs no target, because a prediction is a number for a row where the target may never have been measured.

| step of the one-well workflow | call | what it returned |
| --- | --- | --- |
| choose the rows | `groupSplit`, nTestGroups 1, seed 5 | test well EKENE-8, 30 rows; 8 training wells, 240 rows |
| fit on the training rows | `ols` on GR, RHOB, NPHI | four coefficients |
| predict the held-out well | `predict` | 30 predicted DT values |
| score the held-out well | `regressionMetrics` | RMSE 3.765285 us/ft, MAE 2.958753 us/ft |

## A prediction is computed, never measured

The 30 values for EKENE-8 above are the plane's answer for each of its rows. Where EKENE-8's measured sonic exists, the difference between the two is the residual, y minus yhat, and a score is built from those residuals. Where no sonic was measured, there is no residual and no score for that row, only the prediction.

That is why a predicted log is kept apart from a measured one. Written into the same column, a prediction will later be read as a measurement by someone who never saw the fit.

## The rule carries its units

Each coefficient is the target's unit over its feature's unit, so the prediction trusts the units of the row it is handed. NPHI's coefficient is per whole v/v: 138.783590 per v/v, or 1.387836 per 0.01 v/v. A neutron porosity written in percent in one file would be a hundred times too large for this rule, and the rule would return a confident, wrong sonic without complaint. Checking units belongs before the fit, where the data quality course places it.

## A prediction outside the rows the rule saw

The plane does not stop at the edge of the training data. Hand it any row and it returns a number, however far the row lies from anything it was fitted on. The intercept is itself such a point: the fitted DT at zero gamma ray, zero density and zero porosity, a row no rock supplies.

The Ekene field has a real case. Min-max scaling fitted on the nine sonic wells maps EKENE-6's gamma ray above 1 on 4 of its 30 rows, the highest to 1.219324. On those rows EKENE-6 reads a gamma ray higher than any row the rule was fitted on, and a prediction there is an extrapolation of the plane. Module three shows how a scaler reveals such rows.

## A prediction is not a score

A prediction answers "what does the rule say for this row". A score answers "how far were the rule's answers from measured values, on rows it did not see". The first needs only features. The second needs features, measured targets and a clear record of which rows were held out, and the next module is about that record.

## Exercise

Open the fit explorer on the least squares view. Clear the test fraction box and set the test wells box to 1, leaving the seed at 5. Confirm the test well is EKENE-8, then check the Test RMSE and Test MAE tiles against the table above. Change the seed to 2 and write down which well is held out and its Test RMSE. Finally, say in one sentence why the Training R-squared tile cannot tell you how the rule will do on EKENE-6.
