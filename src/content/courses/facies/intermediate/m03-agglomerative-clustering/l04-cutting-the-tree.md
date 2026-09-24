# Cutting the tree at k clusters

{{panel:ef-judge-explorer}}

A linkage matrix holds every merge from 180 single rows down to one cluster. A clustering at k clusters is read from it by a cut: keep the early merges, undo the late ones. This lesson shows which merges a cut keeps, how clusters are numbered, and what the heights either side of the cut say.

## The rule

A cut at k keeps the first n - k merges and undoes the rest. With 180 rows, a cut at k 4 keeps 176 merges and leaves 4 clusters. The clusters are then numbered 0 to k - 1 in the order of their first row: the cluster holding row 0 is cluster 0, the cluster holding the lowest row not in cluster 0 is cluster 1, and so on. The engine's basis, verbatim:

> k clusters after the first n - k merges; clusters numbered 0 to k - 1 in the order of their first row

So a cluster number is a name here, as in k-means: cluster 0 is whatever cluster holds the first row.

## The heights either side

The engine reports two heights with every cut, `cutHeights`: the height of the last merge made, below the cut, and the height of the next merge, above it. On the 180 cored rows with standard scaling, cut at k 4:

| linkage | last merge made | next merge |
| --- | --- | --- |
| ward | 3.659186 | 6.612020 |
| complete | 2.205317 | 2.970753 |
| average | 1.273129 | 1.346979 |

For Ward, the last merge kept has height 3.659186 and the first merge undone has height 6.612020. Any cutting height between the two gives the same 4 clusters. Drawn as a tree, a horizontal line anywhere in that range crosses exactly four branches.

The width of that range is worth reading. For Ward it runs from 3.659186 to 6.612020. For average linkage it runs only from 1.273129 to 1.346979, so a slightly different height would give a different count of clusters. Each range is read against its own tree, since Ward heights are on a different scale from the other two.

## Sizes of the Ward cut

The Ward cut at k 4 gives clusters of 52, 44, 54 and 30 rows. The cluster of 44 rows is the one made at merge 175 of the linkage matrix, at height 3.659186; the cluster of 96 rows made at merge 176 is split back into two, of 52 and 44 rows, by undoing that merge.

## A k the engine refuses

A cut needs at least one cluster and at most one per row. On six rows, seven clusters are refused, verbatim:

> k must be a whole number from 1 to 6 (the number of rows)

At k 1 nothing is undone and every row is in cluster 0. At k equal to the number of rows every merge is undone and every row is its own cluster.

## Exercise

In the agglomerative view, run the Ekene cored rows with Ward linkage at k 4 and read the two cut heights. Change the cut to k 3 and then k 5, and for each write down the two heights and the cluster sizes. Check that the merge undone first at one k is the last merge made at the next k down. Then do the same for complete linkage and compare the widths of the ranges at k 4.
