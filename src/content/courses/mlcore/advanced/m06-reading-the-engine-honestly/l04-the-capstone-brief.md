# The capstone brief

{{panel:ml-diagnose-explorer}}

The Expert capstone grades 6 fields, and every one answers the Expert question: when does the engine refuse, stop or extrapolate, and what does it return when it does? Each field is a figure the engine returns, graded against the engine's own result on a field of wells you have not seen in this course.

| graded field | where it comes from |
| --- | --- |
| a scaled condition number | least squares on the logs and the four well-level attributes |
| a penalised coefficient on separated rows | logistic regression with a stated l2, on rows a stated rule separates |
| a coefficient after a stated number of updates | logistic regression stopped by maxIter before it converges |
| a mean permutation drop | permutation importance, with a stated split, metric, repeats and seed |
| a learning curve test score | the learning curve at a stated count of training wells |
| a predicted log value | ridge at a stated lambda, applied to the well with no log |

## What you are given

You are given a field of wells in the same layout as the Ekene field: a well column, the logs, the well-level attributes, a pay label from a stated rule, and one well without a sonic. The brief states every setting a field depends on: the l2, the cutoff that picks the separated rows, maxIter, the test fraction and seed, the repeats, the counts of training wells and the lambda. None of the capstone's values appear anywhere in this course, and every figure in these lessons belongs to the Ekene wells.

## How to work it

Work each field in the panel view that teaches it. For the condition number, fit least squares on the rows the brief names and read the scaled number, with no centring. For the separated rows, confirm that the engine refuses at l2 0, then fit at the stated l2 and read the coefficient the brief asks for. For the stopped fit, set maxIter as stated, confirm converged false and read the iterate. For importance, set the split seed, the permutation seed and the repeats exactly as stated. For the learning curve, read the test score at the stated count, in the split's own training order. For the prediction, fit ridge on every well that has the log and read the row the brief names, counting rows from 0.

## What catches people

Reading the raw condition number, or the one after centring, for the scaled one. Quoting a converged coefficient where the brief asks for the iterate after a stated number of updates. Using the next seed, or a different number of repeats, for importance. Reading the training score of the learning curve, or the wrong point on it. Fitting the prediction by least squares, or on the training wells of a split, when the brief asks for ridge on every well that has the log.

## A rehearsal on the Ekene wells

Every step can be rehearsed on the Ekene wells in the panel. The attribute design on the teaching split's training rows has a scaled condition number of 7608.495043. PHIC on the high-RT rows at l2 1 reads 0.817700. The pay fit stopped at 3 updates gives an RT coefficient of 0.196989. NPHI's mean drop at seed 5 with 5 repeats is 3.786311. The learning curve's test RMSE at three training wells is 4.385966. The prediction for EKENE-6 runs from 100.024605 to 136.515569 us/ft. If your panel work reproduces those, your method is the engine's.

## Exercise

Before you open the capstone, run all six steps on the Ekene wells in the panel and write each result beside the field it rehearses. Then mark which of the six depend on a seed, and which one would change if you raised maxIter.
