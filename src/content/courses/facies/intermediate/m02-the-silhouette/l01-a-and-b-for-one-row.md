# The two distances behind one row

{{panel:ef-judge-explorer}}

Inertia scores only how tight the clusters are. The silhouette asks of every row whether it is closer to its own cluster than to the next nearest one. It needs two distances per row, worked here by hand.

## a, b and s

For one row, a is its mean distance to the other rows of its own cluster, and b is its smallest mean distance to the rows of another cluster: the mean is taken for each other cluster in turn, and the smallest is kept. Its silhouette is

s = (b - a) / max(a, b)

which runs from -1 to 1. The engine's basis, verbatim:

> s = (b - a) / max(a, b): a the mean distance to the other rows of its cluster, b the smallest mean distance to another cluster; Euclidean

A row deep inside its own cluster has s near 1; a row on the edge between two clusters has a and b about equal, and s near 0; a row nearer on average to another cluster has b below a, and s below 0.

## Four points on a line

Four stated points, 0, 1, 4 and 6, labelled 0, 0, 1, 1, with no scaling. For the first point, at 0: its own cluster holds one other point, at 1, so a = 1.000000. The other cluster holds the points at 4 and 6, whose distances from it are 4 and 6, so b = 5.000000, the mean of the two. Then s = (5 - 1) / 5 = 0.800000.

The engine returns:

| point | label | silhouette |
| --- | --- | --- |
| 0 | 0 | 0.800000 |
| 1 | 0 | 0.750000 |
| 4 | 1 | 0.428571 |
| 6 | 1 | 0.636364 |

and a mean of 0.653734. The point at 4 scores lowest: it sits 2 from its partner at 6 and only 3 from the point at 1, so its own cluster is not far tighter than the other one. Work a and b for it yourself and check the engine's figure.

## The silhouette needs a second cluster

Because b is a distance to another cluster, the silhouette cannot be taken when every row sits in one cluster. The engine refuses and says why, verbatim:

> labels must hold from 2 to 179 distinct clusters (found 1): the silhouette compares each row with the next nearest cluster

The upper end, 179 on the 180 cored rows, is the number of rows less one: with every row alone there is no a for any row either.

## The distance it uses

The distance is Euclidean, measured by default on logs standardised with the population standard deviation, the space k-means clustered in. Raw logs give a different figure, so a silhouette is quoted with its scaling.

## Exercise

In the judge explorer, open the silhouette view and replace the table with the four points: one log column holding 0, 1, 4 and 6, and a FACIES column holding two labels of your choosing, the first two rows alike and the last two alike. Choose the FACIES column as the labels and no scaling. Check the four silhouettes against the table above. Then move the point at 4 to 3, predict whether its silhouette rises or falls, and run it.
