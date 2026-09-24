# The harmonic mean, macro and weighted

{{panel:ml-validate-explorer}}

Precision and recall are two numbers, and comparing models on two numbers is awkward. F1 combines them into one for each label. Macro and weighted averages then combine the labels into one for the whole report. Each step is a choice, and the engine states each.

## F1, as the engine computes it

The engine computes F1 from the counts directly: F1 = 2TP / (2TP + FP + FN). Its basis says, in its own words: "2TP / (2TP + FP + FN), the harmonic mean of precision and recall where both are defined". Wherever precision and recall both exist, the count formula and the harmonic mean give the same number. The count formula is also defined in cases where one of the ratios is 0 / 0, which the next lesson meets.

The harmonic mean punishes imbalance. A model with precision 1 and recall near 0 has an arithmetic mean near one half and an F1 near 0. F1 is high only when both ratios are.

On the pay test wells:

| label | TP | FP | FN | support | precision | recall | F1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 62 | 0 | 4 | 66 | 1.000000 | 0.939394 | 0.968750 |
| 1 | 24 | 4 | 0 | 24 | 0.857143 | 1.000000 | 0.923077 |

For pay, 2 x 24 over (2 x 24 + 4 + 0) is 0.923077. For non-pay, 2 x 62 over (2 x 62 + 0 + 4) is 0.968750.

## Two ways to average over labels

| average | precision | recall | F1 |
| --- | --- | --- | --- |
| macro (unweighted mean over labels) | 0.928571 | 0.969697 | 0.945913 |
| weighted (by support) | 0.961905 | 0.955556 | 0.956571 |

The macro average gives every label one vote: the macro F1 is the plain mean of 0.968750 and 0.923077, which is 0.945913. The weighted average gives each label a vote in proportion to its support, 66 for non-pay and 24 for pay out of 90, so non-pay counts for more: the weighted F1 is 0.956571.

The weighted recall, 0.955556, prints the same figure as the accuracy, and here that is algebra: each label's recall is its TP over its support, weighting by support cancels the denominators, and what is left is the total TP over all rows, which is the accuracy.

## Which average to quote

The two answer different questions. The weighted average reflects the rows as they occur, so a common class dominates it. The macro average asks how the model does on each class, however rare, and a poor score on a small class pulls it down in full. Pay is often the minority class, and a model that neglects it can hide behind a weighted figure.

For a pay model the most useful single figure is usually none of the averages: it is the F1 of pay, the label the decision is about, 0.923077 here. Whichever you quote, name it completely, and give the counts beside it so a reader can rebuild it: "F1 of pay", "macro F1" or "weighted F1". Three different numbers carry the same two letters in this report.

## Exercise

Open the confusion matrix view with true labels 0, 0, 0, 0, 0, 0, 1, 1 and predicted labels 0, 0, 0, 0, 0, 0, 0, 1. Read the F1 of label 1, the macro F1 and the weighted F1. Compute the F1 of label 1 by hand from the counts. Then say in one sentence which of the three figures best describes how the model does on the rare class, and why the weighted one reads higher.
