# The threshold at one half

{{panel:ml-validate-explorer}}

A logistic model returns a probability. A decision needs a class. The engine's `predict` turns one into the other with a threshold, and it states exactly where the boundary falls.

## The rule, in the engine's words

The basis of a logistic prediction reads: "probability 1 / (1 + exp(-eta)); class 1 when the probability is above 0.5, class 0 at exactly 0.5". Above one half is pay. Exactly one half is not.

The engine's own case shows the edge: a row whose log odds are exactly zero gets the probability 0.500000 and the class 0. A probability of exactly one half is rare in real data, but a rule has to say what happens there, and this one does. A report that says "the model calls pay at 0.5" leaves the reader guessing which side the boundary is on; "above 0.5" does not.

## The threshold on the Ekene rows

On the first five rows of the test well EKENE-3, rows 60 to 64 of the 300 rows, counted from 0:

| row | probability | class | PAY |
| --- | --- | --- | --- |
| 60 | 0.068312 | 0 | 0 |
| 61 | 0.817561 | 1 | 0 |
| 62 | 0.026632 | 0 | 0 |
| 63 | 0.063221 | 0 | 0 |
| 64 | 0.004802 | 0 | 0 |

Row 61 sits above one half and is called pay; its label is 0. That is a false positive, and the next module counts every one of them on the 90 test rows.

## Every rule draws its own boundary

It would be easy to assume that "at the threshold" means the same thing everywhere in the engine. It does not, and the engine lists each boundary rule by rule:

| function | a row is called positive | at the boundary |
| --- | --- | --- |
| `predict` (logistic) | a probability above 0.5 | exactly 0.5 is class 0 |
| `rocCurve` | a score at or above the threshold | equal scores move together |

`predict` uses a strict inequality at one fixed threshold. `rocCurve`, in the last module, sweeps the threshold down through every distinct score and calls a row positive when its score is at or above the current threshold. Both are stated, and neither is wrong. They answer different questions: `predict` makes one decision per row, and the ROC curve asks what every possible threshold would do.

## Why one half, and when to move it

At one half the model calls pay whenever it thinks pay more likely than not. That is a natural default when a missed pay row and a false pay call cost about the same. They often do not. Missing a pay zone in a completion decision can cost more than testing a wet one, or the reverse. Moving the threshold trades one kind of error for the other, and the confusion matrix in the next module is where that trade is counted. The engine's `predict` fixes the threshold at one half; to decide at another threshold, compare the probabilities it returns against the threshold you have stated.

## Exercise

Open the validate explorer's confusion matrix view. Type the true labels 0, 1, 1. For the predicted labels, apply the engine's rule yourself to the probabilities 0.4, 0.5 and 0.8, and type the classes you get. Read the matrix and the precision and recall of label 1. Then open the ROC view, enter the same three labels with those three probabilities as scores, and read the threshold of each point.
