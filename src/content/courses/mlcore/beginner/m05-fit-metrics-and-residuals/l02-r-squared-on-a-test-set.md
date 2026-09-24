# R-squared on a test set

{{panel:ml-fit-explorer}}

R-squared = 1 - SSE / sum (y - reference)^2. It is the fraction of the variation about a reference mean that the predictions account for. Everything about the number depends on two choices: which rows it is measured on, and which mean it is measured about. In this course an R-squared is never quoted without both.

| scored on | rows | R-squared | reference mean (us/ft) |
| --- | --- | --- | --- |
| training rows (fitted values) | 180 | 0.683457 | 105.883333 |
| test wells, about the test mean (default) | 90 | 0.815322 | 105.214444 |
| test wells, about the training mean (referenceMean) | 90 | 0.816151 | 105.883333 |

## The engine's default for a test score

For a test R-squared the engine's default reference is the mean of the test targets themselves, as scikit-learn's r2_score does. Its basis says:

> 1 - SSE / sum (y - mean of these y)^2 (scikit-learn r2_score); negative when worse than that mean

On the three held-out wells of the teaching split, EKENE-4, EKENE-5 and EKENE-8, the test DT averages 105.214444 us/ft, and the R-squared about that mean is 0.815322.

## The out-of-sample alternative

Passing the training mean as `referenceMean` asks a different question: how much better does the model do than simply predicting the training average for a new well? That is the out-of-sample convention. About the training mean, 105.883333 us/ft, the same predictions give 0.816151.

The two differ because the denominators differ. The misses in the numerator are identical, and so are the RMSE and MAE, 4.282693 and 3.526103 on both rows of the table. Only the yardstick changed. Neither is wrong. They are two named measurements, and a reader handed an unnamed R-squared cannot tell which one they have.

## Rows and reference, every time

Three different R-squared values belong to one fitted plane in the table above: the training fit about the training mean, the test wells about their own mean, and the test wells about the training mean. Written in full, each names its rows and its reference. That is the vocabulary rule for this word, and it is not pedantry. Two teams comparing models on "R-squared" can differ in the third decimal for no reason but the reference.

Scored well by well, each held-out well can also be taken about its own mean: 0.735001 for EKENE-4, 0.774561 for EKENE-5 and 0.855184 for EKENE-8. Each is a statement about how the plane follows that well's variation around that well's own average.

## Below zero

R-squared is not bounded below. The engine's own case sets true values 1, 2 and 3 against predictions 3, 2 and 1, and gets R-squared -3.000000. A negative value means the predictions do worse than the reference mean would. It is a real result and the engine prints it as it is.

A test set whose target never varies has nothing to measure variation against, and the engine refuses:

> yTrue has zero variance (every value is equal), so R-squared about its mean is undefined

## Exercise

Open the fit explorer on the view for RMSE, MAE and R-squared on your own predictions. With true values 1, 2, 3 and predictions 3, 2, 1, check the R-squared tile against -3.000000 and read the Reference mean tile. Now type 3 into the referenceMean box and read R-squared again. Say in one sentence why it changed while RMSE did not. Finally make every true value equal and copy the refusal and its field.
