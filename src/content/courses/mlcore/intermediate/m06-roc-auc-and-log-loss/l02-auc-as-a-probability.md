# AUC as a probability

{{panel:ml-validate-explorer}}

The area under the ROC curve, AUC, is a single number between 0 and 1 for a classifier across every threshold. It reads as the probability that the model gives a randomly chosen pay row a higher score than a randomly chosen non-pay row.

## The pay test wells, pair by pair

The 90 test rows of the pay split hold 24 pay rows and 66 non-pay rows. That makes 1584 (pay, non-pay) pairs. In 1580 of them the pay row has the higher probability, a tie counting one half. So the fraction of pairs ranked correctly is 0.997475.

The engine computes AUC by the trapezoid rule over the ROC points, and on these rows it reads 0.997475 as well; the two differ by 1.11e-16, which is rounding. The basis says the agreement is no accident, in its own words: "trapezoid rule over the curve points (equals the Mann-Whitney probability with ties counted one half)".

| quantity | value |
| --- | --- |
| pairs of one pay and one non-pay row | 1584 |
| pairs where the pay row scores higher, a tie counting one half | 1580 |
| AUC, trapezoid rule over the points | 0.997475 |

## Ties count one half

The six-row tie case of the previous lesson shows the half at work. It has three positives and three negatives, so nine pairs. The two positives at 0.8 beat all three negatives: six pairs won. The positive at 0.4 beats the negatives at 0.2 and 0.1, and ties the negative at 0.4, which counts one half. Eight pairs won and one tied, over nine pairs, give 0.944444, the area the curve's diagonal step produced. The diagonal step is where the half comes from.

When every score is equal, every pair is a tie, each counts one half, and the AUC is 0.500000: the model cannot rank at all.

## What AUC reads, and what it does not

AUC reads only the ORDER of the scores. Any change to the probabilities that keeps their order leaves it unchanged: square every probability, or divide every one by ten, and the AUC is the same.

The strength is that it judges ranking without choosing a threshold. On the pay test wells, 0.997475 says the model almost always ranks a pay row above a non-pay row, whatever threshold is later chosen.

The limit is that it says nothing about whether the probabilities themselves are right. A model whose pay rows all score just above one half and whose non-pay rows all score just below it ranks perfectly and has an AUC of 1, yet its probabilities claim almost no confidence. Whether a probability of 0.817561 deserves the number is a question for log loss, in the next lesson.

AUC is also a statement about pairs across wells. The 1584 pairs mix rows from all three test wells, so a model that ranked well within each well but put one well's rows systematically higher than another's could still lose pairs across wells.

## Exercise

Open the ROC view with true labels 0, 1, 0, 1 and scores 0.1, 0.4, 0.3, 0.8. Count the four (positive, negative) pairs by hand, decide which the positive wins, and compare your fraction with the AUC the view prints. Then replace each score with its square and confirm the AUC does not change. Finally make the 0.4 and 0.3 equal and check that the AUC falls by one half of a pair, over the four pairs.
