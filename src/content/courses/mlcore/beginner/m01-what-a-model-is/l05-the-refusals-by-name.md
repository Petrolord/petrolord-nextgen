# The refusals, each naming its field

{{panel:ml-fit-explorer}}

When the engine is handed something it cannot answer, it returns neither a number nor a guess. It returns an `error` and a `field`, the field names the exact input it refused, and the message starts with that name. Across the engine 32 refusals are tabled, across 18 functions. Each is a real call and each message is the engine's own words. A refusal carries no number of its own: any figure in it belongs to the message.

| function | what was passed | field named |
| --- | --- | --- |
| `fitStandardScaler` | the no-sonic well's DT as a feature | `X[150][1]` |
| `ols` | a null target | `y[20]` |
| `ols` | three rows for four coefficients | `X` |
| `ols` | a target that never varies | `y` |

## A missing value in the features

Hand the standard scaler all 300 Ekene rows with DT as the second feature column, and the first EKENE-6 row stops the call. EKENE-6 has no sonic, so its DT is null:

> X[150][1] must be a finite number: fill or drop missing values first

Read the field first. `X[150][1]` is row 150 of the 300 rows, counted from 0, and column 1, the second feature. The first EKENE-6 sample is dataset row 150. The message then says what to do, and it leaves the choice to you: fill the value, or drop the row.

## A null target

The same well refuses as a target. Pass the forty rows from 130 to 169, the last twenty of EKENE-5 and the first twenty of EKENE-6, and ask for a fit:

> y[20] must be a finite number

The index counts the rows passed, from 0, so `y[20]` is the twenty-first row passed, the first EKENE-6 sample. The engine stops at the first null it meets. Skipping rows silently would give a fit on a row count nobody chose.

## Too few rows for the coefficients

Least squares needs more rows than coefficients, and the intercept counts as one. Three logs and an intercept are four coefficients, so three rows cannot fit them:

> X must have more rows than coefficients (3 rows for 4 coefficients, the intercept included): the residual degrees of freedom n - p must be at least 1

The message states the rule it applies, n - p at least 1, which module four explains.

## A target that never varies

A target with one value on every row has nothing to explain, and the R-squared of a fit to it has a zero denominator:

> y has zero variance about its mean (every value is equal), so R-squared is undefined

## Why a refusal is useful

A default or a best guess would produce a number that looks like every other number in a report. The refusal puts the problem where it cannot be missed and names the input, so the fix is quick: fill or drop the missing value, pass more rows, or pick a target that varies. Read the field first: it tells you where to look, and the message tells you why.

## Exercise

Open the fit explorer on the least squares view. In the table, replace one DT value in a training well with null, and copy the refusal and its field; say which count its index uses. Restore the value. Next, keep the header and two rows from each of two wells, set the test wells box to 1 and clear the test fraction, and copy the refusal. Finally put null in one GR cell of a training well and copy the refusal and its field.
