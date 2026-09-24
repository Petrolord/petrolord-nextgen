# Least squares on several features

{{panel:ml-fit-explorer}}

Least squares finds the coefficients that make the sum of squared residuals, sum (y - yhat)^2, as small as it can be. With several features the fitted rule is a plane: the predicted target is the intercept plus each feature times its coefficient. Here the target is DT in us/ft and the features are GR, RHOB and NPHI, fitted with an intercept on the 180 training rows of the teaching split.

| quantity | value |
| --- | --- |
| rows n | 180 |
| coefficients p, the intercept included | 4 |
| residual degrees of freedom n - p | 176 |
| residual standard error s (us/ft) | 5.823075 |
| RSS | 5967.842781 |
| TSS about the training mean | 18853.190000 |
| R-squared | 0.683457 |
| adjusted R-squared | 0.678062 |

## What the fit minimises, and what it reports

The residual sum of squares, RSS, is the quantity least squares drives down: 5967.842781 on these rows. No other intercept and three coefficients could give a smaller sum on the same 180 rows. The total sum of squares, TSS, is the spread of DT about its own training mean, 18853.190000, before any feature is used.

The training R-squared is 1 - RSS / TSS: the fraction of the spread about the training mean that the plane accounts for on the rows it was fitted on. Here it is 0.683457. Named in full, that is the R-squared of the training fit, about the training mean. The adjusted R-squared, 0.678062, is the same idea corrected for the number of coefficients the fit spent.

## Several features at once

Each coefficient is fitted with the others present. The GR coefficient is the slope of DT against GR with RHOB and NPHI held fixed. Module one showed how far that can move a coefficient: NPHI alone reads 11.127468 us/ft per v/v on these rows, and beside GR and RHOB it reads 138.783590. The plane is one object, and its coefficients are read together.

## The four numbers the plane needs

Four coefficients from 180 rows leaves 176 residual degrees of freedom, n - p, with p counting the intercept. Those degrees of freedom are what the residual standard error is estimated from, and lesson four works through them. Lesson five asks what happens as n comes down towards p.

## What a training fit can and cannot say

Every figure in the table above is a training figure. RSS, TSS, both R-squared values and the residual standard error are all computed on the 180 rows that chose the plane. They describe the fit. The score on EKENE-4, EKENE-5 and EKENE-8, which the plane never saw, comes from module five's metrics, and it is a separate number with a separate meaning.

## A column that cannot be fitted

A feature that is zero on every row gives the plane nothing to lean on, and its coefficient could take any value without changing a single prediction. The engine refuses it and names it:

> X.CALI is zero in every row, so its coefficient is not identifiable

## Exercise

Open the fit explorer on the least squares view with its defaults: features GR, RHOB and NPHI, target DT, test fraction 0.3, seed 5. Check the Training rows, Residual degrees of freedom, Residual standard error, Training R-squared and Adjusted R-squared tiles against the table above. Then add CALI to the features and read the same five tiles. Write down which of them changed, and say whether the adjusted R-squared moved in the same direction as the plain one.
