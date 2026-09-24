# A row alone in its cluster

{{panel:ef-judge-explorer}}

The silhouette formula needs a, the mean distance to the other rows of the row's own cluster. A row alone in its cluster has no other rows, so it has no a. The engine gives such a row a stated score, and this lesson shows where that happens on the Ekene rows and what it does to the mean.

## The rule

A row alone in its cluster scores 0. The engine's basis, verbatim:

> a row alone in its cluster scores 0, and a = b = 0 scores 0 (scikit-learn)

The second half covers a rarer case: a row whose own cluster and nearest other cluster are both at distance 0 from it, where the formula would divide 0 by 0. Both follow scikit-learn.

The choice of 0 is neutral: a lone row is neither well inside a cluster nor inside the wrong one. It does pull a mean toward 0.

## A lone row in the Ekene cut

Average linkage, one of the three agglomerative methods of the next module, cut at k 4 on the 180 cored rows with standard scaling, gives clusters of 96, 54, 29 and 1 rows. The lone row is row 56 of the cored rows, counted from 0: a shaly-sand sample of EKENE-2 at 6306 ft. It is cluster 3 of that cut, and its silhouette is 0.000000.

| labelling at k 4 | cluster sizes | mean silhouette |
| --- | --- | --- |
| k-means, seed 3, 10 starts | 29, 59, 54, 38 | 0.545063 |
| average linkage | 96, 54, 29, 1 | 0.514177 |

The average-linkage cut has one cluster of 96 rows, more than any core facies holds, and one cluster of a single row. Its mean silhouette, 0.514177, is not far below the k-means figure. A mean silhouette on its own does not reveal a cluster of one row or a cluster that swallowed two facies; the cluster sizes do. Read the sizes beside the mean every time.

## Too many clusters for a silhouette

If every row is alone, no row has an a, and the silhouette has nothing to measure. The engine refuses a labelling with as many clusters as rows. Four rows in four clusters, verbatim:

> labels must hold from 2 to 3 distinct clusters (found 4): the silhouette compares each row with the next nearest cluster

The accepted range runs from 2 to the number of rows less one. At 2 there is always another cluster for b; below the number of rows at least one cluster holds two rows.

## Why the zero is stated

Without a stated rule, two tools could score the same labelling differently. The engine states its rule in the basis and follows scikit-learn, so its mean silhouette can be compared with one computed there on the same rows and scaling.

## Exercise

In the silhouette view, build a small table of your own: five rows of one log, four close together and one far away, with a FACIES column that gives the far row a label of its own. Score it with no scaling and confirm the lone row reads 0.000000. Then give the far row the same label as its nearest neighbour and see how the mean moves. Finally give each of the five rows its own label and read the refusal.
