# The ROC curve and tied scores

{{panel:ml-validate-explorer}}

The confusion matrix scores a classifier at one threshold. The ROC curve scores it at every threshold at once. It lowers the threshold through the scores and, at each step, plots the true positive rate, the recall of the positive class, against the false positive rate, the fraction of negatives called positive.

## How the engine builds the curve

The engine places one point per DISTINCT score. It starts at (0, 0), where the threshold is above every score and nothing is called positive; the engine records that start with the threshold null. It then takes the distinct scores from highest to lowest, and at each one calls every row whose score is at or above it positive. The last point is (1, 1), where every row is called positive.

The start is a stated choice. scikit-learn prints the threshold of the first point as infinity; the engine prints null, because JSON has no infinity.

On the 90 pay test rows: 24 positives, 66 negatives, 90 distinct probabilities, so 91 points, the start included.

## Tied scores move together

The engine's own case has six rows:

* true labels: 0, 1, 0, 1, 1, 0
* scores: 0.1, 0.4, 0.4, 0.8, 0.8, 0.2

| point | threshold | FPR | TPR |
| --- | --- | --- | --- |
| 0 | null | 0.000000 | 0.000000 |
| 1 | 0.800000 | 0.000000 | 0.666667 |
| 2 | 0.400000 | 0.333333 | 1.000000 |
| 3 | 0.200000 | 0.666667 | 1.000000 |
| 4 | 0.100000 | 1.000000 | 1.000000 |

At 0.8 two rows share the score and both are positives, so the curve steps straight up by two of the three positives. At 0.4 two rows share the score, one positive and one negative, and they are called together: the curve moves up and right at once, a diagonal step. The basis says, in its own words: "equal scores are one threshold: their rows move together, a diagonal step when the classes are mixed". The area under this curve is 0.944444.

Why together? A threshold cannot separate two rows with the same score: any threshold calls both or neither. Splitting a tie and stepping up first, or right first, would invent an order the model never gave, and the area would depend on that invented order.

## Every score equal

The extreme case is a model that gives every row the same score. There is then one threshold, every row moves at once, and the curve is a single diagonal step from (0, 0) to (1, 1). The engine's case returns an AUC of 0.500000.

## When there is no curve

A ROC curve needs both classes. With no negatives the false positive rate divides by zero, and the engine refuses, naming the field and the counts it found:

> yTrue must contain both classes (found 2 positive and 0 negative), or the ROC curve is undefined

It comes up in practice when a test set happens to hold no pay at all.

## Two boundaries, stated separately

`rocCurve` calls a row positive at a score at or above the threshold. `predict` calls class 1 only above 0.5. Both are stated.

## Exercise

Open the validate explorer's ROC view. It loads the six-row tie case; confirm the five points and the AUC of 0.944444. Change the second score from 0.4 to 0.3 so that the tie at 0.4 is broken, and read the new points and the new AUC. Then set all six scores to 0.4 and confirm a single diagonal step and an AUC of 0.500000.
