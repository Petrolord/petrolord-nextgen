# Re-cutting a tree without re-running it

{{panel:ef-judge-explorer}}

Because the linkage matrix keeps the whole history, a different k needs no new clustering. The engine's `cutTree` takes a returned matrix and a k and gives the labels of that cut, exactly the labels `agglomerative` gives with the same k.

## The Ward tree cut five ways

On the 180 cored rows, standard scaling, Ward linkage, re-cut at k 2 to 6 (checked equal to running `agglomerative` at each k):

| k | cluster sizes, in cluster order | height of the merge undone first |
| --- | --- | --- |
| 2 | 126, 54 | 30.809387 |
| 3 | 96, 54, 30 | 18.119587 |
| 4 | 52, 44, 54, 30 | 6.612020 |
| 5 | 52, 22, 22, 54, 30 | 3.659186 |
| 6 | 52, 22, 8, 14, 54, 30 | 2.814872 |

## The tree nests

Read the sizes down the table. Going from k 2 to k 3, the cluster of 126 rows splits into 96 and 30. From k 3 to k 4, the 96 splits into 52 and 44. From k 4 to k 5, the 44 splits into two of 22. Each step undoes one merge, so exactly one cluster splits in two and every other cluster is untouched. A cluster of the k cut is always the union of clusters of the k + 1 cut; this was checked on every pair of cuts above.

k-means has no such rule. Each k is a separate fit from its own starts, so a cluster at one k can take rows from several clusters at another. At seed 3, one of the 4 k-means clusters at k 4 has rows in more than one cluster at k 3. When a team wants clusters that stay consistent as k changes, a tree gives that by construction.

## Refusals of a matrix

`cutTree` checks the matrix it is given, since a matrix can be edited or built by hand. A k of 0 on the Ward tree, verbatim:

> k must be a whole number from 1 to 180 (the number of rows)

An empty matrix:

> linkageMatrix must be the non-empty linkageMatrix of agglomerative

A merge that names a cluster not yet made, in a small matrix over three rows (two merges):

> linkageMatrix[1] must be [id1, id2, height, size] with whole ids 0 <= id1 < id2 < 4

And a merge of an id already merged. Every row id and every cluster id may be merged once only, because once merged it no longer exists as a cluster of its own:

> linkageMatrix[1] merges id 0, which linkageMatrix[0] already merged: each row id (0 to 3) and each cluster id (4 to 5) may be merged once only

The last two name the matrix row at fault, counted from 0.

## Exercise

In the agglomerative view, run the Ekene cored rows with Ward linkage at k 4, then use the re-cut field to cut the same tree at k 2, 3, 5 and 6. For each re-cut, name the one cluster that split from the cut before and the sizes it split into. Then run complete linkage at k 4 and re-cut it at k 5 to find which of its clusters splits first.
