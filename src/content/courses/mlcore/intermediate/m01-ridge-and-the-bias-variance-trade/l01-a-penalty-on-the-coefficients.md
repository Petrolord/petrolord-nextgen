# A penalty on the coefficients

{{panel:ml-validate-explorer}}

The Associate tier fitted least squares on the training wells and scored it on wells the model had never seen. This tier asks the next question: how do you know the score will hold, and what do you change when it does not? The first tool is a penalty. Ridge regression is least squares with one extra term that charges the fit for the size of its coefficients.

## The objective

Ridge minimises

sum (y - b0 - z'b)^2 + lambda x sum b_j^2

where z holds the features standardised with the population standard deviation (dividing by n) of the rows passed, b holds one coefficient per feature, and b0 is the intercept. The first term is the least squares sum of squared residuals. The second adds lambda times the sum of the squared coefficients. With lambda at 0 the second term vanishes and ridge is least squares. As lambda grows, a large coefficient costs more, and the fit accepts larger residuals in exchange for smaller coefficients.

## The Ekene fit

The engine fits ridge on the 180 training rows of the teaching split (test fraction 0.3, seed 5), with DT as the target and seven features: GR, RHOB and NPHI, plus the four well-level attributes easting, northing, kb and mudWeight. The test wells are EKENE-4, EKENE-5 and EKENE-8, 90 rows. Six lambdas, each stated:

| lambda | effective degrees of freedom | training R-squared, about the training mean | test RMSE (us/ft) |
| --- | --- | --- | --- |
| 0 | 7.000000 | 0.861914 | 16.999672 |
| 0.1 | 6.969214 | 0.861901 | 16.831728 |
| 1 | 6.724037 | 0.860878 | 15.485689 |
| 10 | 5.568235 | 0.833394 | 9.418023 |
| 100 | 3.458214 | 0.688743 | 5.759287 |
| 1000 | 0.965695 | 0.265317 | 8.607538 |

Read the two columns on the right against each other. The training R-squared falls at every step. The test RMSE falls from 16.999672 us/ft at lambda 0 to 5.759287 at lambda 100, then rises to 8.607538 at lambda 1000. The rest of this module explains each column.

## What lambda is measured against

The engine puts lambda on the sum of squares, and its basis says so in its own words: "on the sum of squares: equals scikit-learn Ridge(alpha = lambda, fit_intercept = True) on the same standardised features". Lambda is not divided by the number of rows. The residual term grows with every row added and the penalty term does not, so the same lambda is a stronger penalty on fewer rows. A lambda chosen on one dataset is a number about that dataset.

## A lambda the engine refuses

Lambda must be zero or more. A negative value would reward large coefficients, and the engine refuses it by name:

> lambda must be a finite number, zero or more

## Exercise

Open the explorer's ridge view on the teaching split with the seven default features. Set lambda to 0 and read the test RMSE, then set it to 0.1, 1, 10, 100 and 1000 in turn and confirm each figure in the table. Then remove the four attributes, keep GR, RHOB and NPHI, and run lambda 0 again. Write down, for your own seven runs, which lambda gave the lowest test RMSE on these three wells, and say in one sentence why that lambda is a fact about this split.
