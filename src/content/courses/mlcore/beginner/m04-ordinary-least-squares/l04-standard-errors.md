# Standard errors and residual degrees of freedom

{{panel:ml-fit-explorer}}

Every coefficient the engine returns comes with a standard error. It measures how far the coefficient would move between samples like this one. The t value beside it is the coefficient divided by its standard error. For the teaching fit of DT on GR, RHOB and NPHI over the 180 training rows:

| term | coefficient | standard error | t value |
| --- | --- | --- | --- |
| intercept | -0.552686 | 30.261214 | -0.018264 |
| GR | 0.288005 | 0.066103 | 4.356927 |
| RHOB | 22.499915 | 12.289493 | 1.830825 |
| NPHI | 138.783590 | 21.960664 | 6.319645 |

## Where the standard error comes from

Two pieces go into it. The first is s, the residual standard error, the typical size of a miss on the training rows. The engine estimates it as s^2 = RSS / (n - p). With RSS 5967.842781, n 180 and p 4, n - p is 176 and s is 5.823075 us/ft. The second piece is how the features are arranged, through the matrix (X'X)^-1. The basis states the whole formula:

> s x sqrt(diag((X'X)^-1)), s^2 = RSS / (n - p), p counting the intercept

## Why n - p, and what it is called

n - p is the residual degrees of freedom. Each coefficient the fit estimates uses up one row's worth of freedom to fit the plane; what is left over is what the misses can be measured from. Dividing by n would understate the typical miss, because the plane was fitted to make those very misses small. Dividing by n - p corrects for that. With 180 rows and 4 coefficients the correction is small; with few rows it is large, and at n = p there is nothing left, which the next lesson takes up.

This is why the residual standard error, 5.823075, is a little larger than the training RMSE of 5.758010 on the same rows. RMSE divides the RSS by n; s divides it by n - p.

## Reading the table

GR's t value of 4.356927 says its coefficient is several standard errors from zero. RHOB's 1.830825 is closer. The intercept's -0.018264 says the data barely pin it down at all, which fits a point far outside every row. A t value is a reading of the coefficient against its own uncertainty, under the formula's assumptions.

## The assumption that does not hold here

The formula assumes the residuals are independent from row to row. Rows from one Ekene well share that well's sonic offset, so a well's residuals sit above or below the plane together, as module five shows. The assumption fails row by row, and the standard errors are exact only under it. The printed figures are the engine's correct arithmetic on an assumption these data do not meet, and a report says so beside them.

The honest way to learn how a coefficient moves between samples of wells is to fit it on different wells and watch. Module six does that, one held-out well at a time.

## Exercise

Open the fit explorer on the least squares view with its defaults. Check the standard error and t value of each coefficient against the table above, and check the Residual standard error and Residual degrees of freedom tiles. Then change the seed to 2 and read the coefficient table again. For GR, write the coefficient at each seed beside its standard error at seed 5, and say whether the move between seeds is large or small against that standard error.
