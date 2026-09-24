# Scoring a mapped facies

{{panel:ef-judge-explorer}}

Once every cluster has a facies name, every cored row has a mapped facies and a core facies. The engine scores the mapped facies with the machine learning engine's own classification report. The ratios in that report belong to the machine learning course, which teaches them; here they are read.

## The report for the teaching clustering

k-means, k 4, seed 3, 10 starts, one-to-one matching, on the 180 cored rows. The engine's basis names its source, verbatim:

> ml.js classificationReport of the mapped predictions against the core facies

| facies | rows (support) | precision | recall | F1 |
| --- | --- | --- | --- | --- |
| limestone | 54 | 1.000000 | 1.000000 | 1.000000 |
| sandstone | 50 | 0.847458 | 1.000000 | 0.917431 |
| shale | 29 | 1.000000 | 1.000000 | 1.000000 |
| shaly-sand | 47 | 1.000000 | 0.808511 | 0.894118 |

Accuracy over the 180 cored rows is 0.950000, 171 / 180. The macro F1 is 0.952887.

## Reading it against the contingency table

Every imperfect figure in the report traces back to one cell of the contingency table: the 9 shaly-sand rows in cluster 1, which was matched to sandstone.

Those 9 rows are predicted sandstone. So sandstone's precision falls below 1: of the rows predicted sandstone, some are core shaly-sand. Sandstone's recall stays at 1.000000, because every core sandstone row is in cluster 1 and predicted sandstone.

The same 9 rows are core shaly-sand predicted as something else. So shaly-sand's recall falls, to 0.808511: of the core shaly-sand rows, 9 of 47 were missed. Its precision stays at 1.000000, because cluster 3, the only cluster named shaly-sand, holds nothing else.

Limestone and shale score 1.000000 throughout, since each sits alone in its own cluster.

## Accuracy names its rows

The accuracy here is over the 180 cored rows the clustering was made from. The clustering never saw the core, so this is an honest comparison, but it is a comparison on the rows clustered. It says nothing yet about a well the clustering has not seen.

## The zero-division setting

When a facies is never predicted, its precision divides zero by zero. The machine learning engine takes a setting for what that ratio reads, 0 or 1, and refuses anything else; a half is refused, verbatim:

> zeroDivision must be 0 or 1

At k 3 (k-means, seed 3, 10 starts, standard scaling) under one-to-one matching, shaly-sand gets no cluster at all, so it is never predicted and its recall is 0.000000. Its precision is exactly the case this setting decides. Whichever value is set, say which one, because it moves the macro average.

## Exercise

In the matching view, run the Ekene cored rows with k-means at k 4 and one-to-one matching. For each figure in the report below 1, point to the cell of the contingency table that causes it. Then switch to Ward linkage at k 4 and read its accuracy and macro F1. The view prints no per-facies report, so work out the recall of each facies by hand from the contingency table and the mapping, and name the lowest.
