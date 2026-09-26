# The ideal ranking

{{panel:ae-scoring-explorer}}

DCG has no scale of its own, so the engine divides it by the best DCG the query allows. That best value is the ideal DCG, and the ratio is nDCG, normalised DCG, which runs from 0 to 1 on any query that has one.

## Every judged grade, retrieved or not

The ideal ranking sorts every judged grade for the query in descending order, whether or not any system retrieved the passage, and takes its DCG at the same cutoff. On the stated ranking, c, a, x, b, d with judgments a 3, b 2, c 0, d 1 and e 2, the judged grades sorted are 3, 2, 2, 1, 0. The second 2 is e's, and no list retrieved e.

| gain | DCG | ideal DCG | nDCG |
| --- | --- | --- | --- |
| linear | 3.140995 | 5.692536 | 0.551774 |

nDCG at 5, linear gain, is 3.140995 divided by 5.692536, which the engine returns as 0.551774.

The alternative in use builds the ideal from the retrieved grades only. On this list that would sort 3, 2, 1 and leave e out, and the ideal would shrink toward the list's own DCG. A system would then be rewarded for missing a good passage: the less it found, the lower the bar it was measured against. The engine counts e, so missing it costs nDCG, and the course names the reason in one line: missing a good passage is penalised.

## nDCG on the Ekene queries

At k 5 and linear gain, a few rows of the per-query table:

| query | A nDCG | B nDCG |
| --- | --- | --- |
| Q02 | 0.261097 | 0.733750 |
| Q09 | 1.000000 | 1.000000 |
| Q14 | 0.000000 | 0.310738 |
| Q15 | 0.515847 | 0.152733 |
| Q23 | 0.944848 | 1.000000 |

An nDCG of 1.000000 says the list matched the ideal order for its top 5, as both systems did on Q09. On Q02 the answering passage sits at rank 4 in system A's list, and A's nDCG at 5 is 0.261097. Over the 23 included queries the means at k 5, linear gain, are A 0.762753 and B 0.764137.

## When the ideal is 0

The ideal DCG is 0 in exactly two cases, and nDCG is then returned as null with a note naming the case. Either the query has no judged documents, or every judged document has grade 0. On Q24 it is the second:

> nDCG is undefined: the 8 judged documents all have grade 0, so the ideal DCG is 0

A null is a result with its reason; the call succeeds.

## nDCG and the threshold

The threshold that decides relevant for average precision does not touch nDCG. A stated query whose judged passages are graded 1, 1 and 0, ranked EKD-013, EKD-014, scored at relevantGrade 2: recall and average precision are returned as null, because nothing is relevant at grade 2 or more, and nDCG is 1.000000, because grade 1 still carries gain and the list holds both grade 1 passages at the top.

## Exercise

In the view for MAP and nDCG, enter the stated list and judgments, k 5 and linear gain, and read the ideal DCG and nDCG columns. Remove e from the judgments and run it again: say what happened to the ideal DCG and to nDCG, and why that would be the wrong way to score a system that missed e. Then switch to another view and back, which restores system A's runs and every judgment, and find Q02, Q09 and Q14 in the nDCG column.
