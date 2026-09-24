# More rows than coefficients

{{panel:ml-fit-explorer}}

Least squares needs more rows than coefficients: n > p, with p counting the intercept. With n = p the plane passes through every row exactly, every residual is zero, and there is no residual degree of freedom left to estimate s from. The fit would look perfect and say nothing. The engine refuses n <= p.

| function | what was passed | field named |
| --- | --- | --- |
| `ols` | three rows for four coefficients | `X` |
| `ols` | a column of zeros | `X.CALI` |
| `ols` | a target that never varies | `y` |

## The refusal, in the engine's words

> X must have more rows than coefficients (3 rows for 4 coefficients, the intercept included): the residual degrees of freedom n - p must be at least 1

The message carries its own arithmetic. Three features and an intercept are four coefficients; three rows cannot fit them. It also names the rule it applies: the residual degrees of freedom must be at least 1. The field is `X`, because the whole design is too small, and no single entry is to blame.

## Why a perfect fit is useless

A plane with four coefficients can pass through four rows exactly. Fitted on exactly four rows, it would reproduce each measured sonic to the last digit, its RSS would be zero and its training R-squared would be one. None of that would say anything about a fifth row, because the fit had no spare rows to be wrong on. The residual degrees of freedom count those spare rows. The teaching fit has 176 of them, from 180 rows and 4 coefficients.

## Enough rows is not the same as enough wells

The teaching split trains on 180 rows, far more than 4. But those rows come from six wells, and rows inside a well share its offset. A model can clear the row rule easily and still have seen very few independent wells. The engine checks rows, because rows are what least squares counts. Counting wells is your job, and it is why this course always says how many wells a model was trained on beside how many rows.

## Two more ways a fit can have nothing to work with

A feature that is zero on every row adds a coefficient the data cannot determine:

> X.CALI is zero in every row, so its coefficient is not identifiable

A target that never varies leaves the plane nothing to explain, and its R-squared would divide by zero:

> y has zero variance about its mean (every value is equal), so R-squared is undefined

All three refusals share one idea: a fit needs the data to pin down every number it returns, with rows left over to measure the misses.

## Exercise

Open the fit explorer on the least squares view. Replace the table with its header line and two rows from each of two wells, clear the test fraction and set the test wells box to 1, so that two rows train. Copy the refusal and name its field. Then add rows from a third well and read the Residual degrees of freedom tile once the fit runs. Write down how many training rows and coefficients it counted, and check that n - p matches the tile.
