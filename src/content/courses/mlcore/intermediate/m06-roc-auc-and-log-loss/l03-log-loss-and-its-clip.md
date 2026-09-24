# Log loss and its clip

{{panel:ml-validate-explorer}}

AUC reads the order of the scores. Log loss reads the probabilities themselves. It charges each row for the probability the model put on the label that occurred.

## The formula

Log loss = -(1/n) sum [y ln p + (1 - y) ln(1 - p)]

For a pay row (y = 1) the charge is -ln p; for a non-pay row (y = 0) it is -ln(1 - p). The log is natural, and the charges are averaged over the n rows scored. A perfect, certain model scores 0. A model that says one half for every row scores ln 2: the engine's own case returns 0.693147. Lower is better, and anything above ln 2 is worse than refusing to commit.

The charge grows without limit as the probability of the true label goes to zero. A pay row given a probability of 0.1 costs ln 10; given 1.00e-15 it costs -ln(1.00e-15); given exactly 0 it costs infinity, and one such row would make the mean infinite.

## The clip

So the engine clips every probability to [eps, 1 - eps] before taking logs, with eps = 1.00e-15, and counts the rows it clipped. The boundary is stated: a probability equal to eps is kept, so p = 1.00e-15 clips 0 rows, and p = 1.00e-16 clips 1.

The engine's own case shows the clip at work: true labels 1, 0, 1, 0 against probabilities 1, 0, 0 and 0.3.

| quantity | value |
| --- | --- |
| log loss | 8.723863 |
| rows clipped | 3 |

The first two rows are certain and right; clipped to within eps of their labels, they cost almost nothing. The fourth row, a non-pay row given 0.3, costs a modest amount. The third row is a pay row given a probability of exactly 0, certain and wrong. Clipped to eps it is charged -ln(1.00e-15) = 34.538776, by far the largest charge of the four. Without the clip the answer would be infinite.

The clip is a stated constant. Other tools clip at other values: scikit-learn 1.9 clips at 2.22e-16 and would charge that row 36.043653, and a clipped row's charge depends directly on eps, so compare log losses from two tools only when both the clip and the count of clipped rows are known.

## Refusals

A probability outside [0, 1] is refused by name:

> probabilities[0] must be a number from 0 to 1

## The pay test wells

On the 90 test rows of the pay split, with the probabilities from the logistic fit on the seven training wells:

| quantity | value |
| --- | --- |
| log loss, natural log | 0.115676 |
| rows clipped | 0 |
| AUC | 0.997475 |
| accuracy at the 0.5 threshold | 0.955556 |

No probability was clipped. The log loss of 0.115676 averages the charge of every row: row 61 of EKENE-3, a non-pay row given 0.817561, is charged -ln(1 - 0.817561).

## Three numbers, three questions

Accuracy asks how many calls were right at one threshold. AUC asks how well the model ranks, at any threshold. Log loss asks whether the probabilities can be taken at face value. Report the ones your decision needs, with their rows and their settings.

## Exercise

Open the ROC view, which also prints the log loss. Enter the true labels 1, 0, 1, 0 and the probabilities 1, 0, 0, 0.3, and confirm 8.723863 with 3 rows clipped. Change the third probability from 0 to 0.1 and read the new log loss and clip count. Then set every probability to 0.5 and confirm 0.693147.
