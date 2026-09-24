# Rows true, columns predicted

{{panel:ml-validate-explorer}}

The logistic model of the previous module called each of the 90 test rows pay or non-pay at the one half threshold. The confusion matrix counts how those calls line up with the labels.

## The layout

The engine states its layout in its own words: "matrix[i][j] counts rows whose TRUE label is labels[i] and PREDICTED label is labels[j] (scikit-learn layout)". Rows are the truth, columns are the model's call. On the pay test wells EKENE-3, EKENE-5 and EKENE-7:

|  | predicted 0 | predicted 1 |
| --- | --- | --- |
| true 0 | 62 | 4 |
| true 1 | 0 | 24 |

Read it cell by cell, with pay as the positive class:

* 62 non-pay rows were called non-pay. These are the true negatives.
* 4 non-pay rows were called pay. These are the false positives; row 61 of EKENE-3, with its probability of 0.817561, is one of them.
* 0 pay rows were called non-pay. There are no false negatives.
* 24 pay rows were called pay. These are the true positives.

The row sums are the true class sizes: 66 non-pay rows and 24 pay rows, 90 in all. The column sums are what the model called: 62 rows non-pay, and 24 + 4 rows pay.

## Why the layout must be stated

Some textbooks and tools put the prediction on the rows and the truth on the columns. The four numbers are the same, but the off-diagonal cells swap places, and a reader who assumes the wrong layout reads the 4 false positives as 4 missed pay rows. Say which layout you are printing every time, or print the axis names on the table as the engine's report does.

## Accuracy, and what it hides

Accuracy is the fraction of rows on the diagonal: (62 + 24) / 90 = 0.955556. Two things hide inside it.

First, it treats both kinds of error alike. Four false positives and no false negatives give the same accuracy as no false positives and four false negatives, and those are very different models for a completion decision.

Second, it depends on how common each class is. With 66 non-pay rows out of 90, a rule that called every row non-pay would already be right on 66 of them. Accuracy says nothing about which class the errors fell in. The ratios in the next lessons do.

## Counting classes that are not 0 and 1

The engine's `confusionMatrix` takes any labels, text included, and a `labels` list sets their order. With three facies the matrix is three by three, still rows true and columns predicted, and every off-diagonal cell names a specific confusion: sand called shale, shale called lime. The binary case is the smallest example of the same table.

## Exercise

Open the validate explorer's confusion matrix view. Type true labels and predicted labels for ten rows of your own, with two false positives and one false negative, and read the matrix and the accuracy. Swap your two lists and run it again. Write down which cells moved, and which of TP, FP and FN changed their meaning.
