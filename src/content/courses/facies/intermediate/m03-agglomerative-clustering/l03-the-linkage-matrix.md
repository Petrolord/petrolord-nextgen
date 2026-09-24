# The linkage matrix

{{panel:ef-judge-explorer}}

An agglomerative result keeps the whole history of merges. The engine returns it as a linkage matrix in the layout scipy uses, one row per merge, so any cut can be read from it later and the tree can be drawn.

## The layout

Each row of the matrix is one merge, in the order the merges were made:

[smaller id, larger id, height, size]

The ids name what was merged. The rows of the data are ids 0 to 179, and the cluster made at merge s gets id 180 + s, so the first merge makes id 180, the second id 181, and so on. The height is the linkage distance at which the two joined, and the size is the number of data rows in the new cluster. With 180 rows the matrix has 179 rows. The engine's basis, verbatim:

> scipy linkage matrix: rows 0 to n - 1, the cluster made at step s is n + s; each row [smaller id, larger id, height, size]

## The Ward tree of the cored rows

The first five and the last five merges on the 180 cored rows, standard scaling, Ward linkage:

| merge s | id 1 | id 2 | height | size | new id |
| --- | --- | --- | --- | --- | --- |
| 0 | 24 | 63 | 0.069063 | 2 | 180 |
| 1 | 13 | 102 | 0.111522 | 2 | 181 |
| 2 | 69 | 140 | 0.111770 | 2 | 182 |
| 3 | 54 | 96 | 0.117222 | 2 | 183 |
| 4 | 20 | 127 | 0.117328 | 2 | 184 |
| 174 | 335 | 346 | 2.814872 | 22 | 354 |
| 175 | 351 | 354 | 3.659186 | 44 | 355 |
| 176 | 352 | 355 | 6.612020 | 96 | 356 |
| 177 | 353 | 356 | 18.119587 | 126 | 357 |
| 178 | 348 | 357 | 30.809387 | 180 | 358 |

## Reading it

The first five merges each join two data rows: every id is below 180, and every size is 2. Late in the tree the ids are all 180 or above, clusters built earlier. Merge 175 joins cluster 351 with cluster 354, the one made at merge 174 of 22 rows, into a cluster of 44 rows at height 3.659186. Merge 176 joins that cluster, id 355, with cluster 352 into one of 96 rows at height 6.612020. The last merge, 178, joins the final two clusters into all 180 rows at 30.809387.

The heights of the last merges climb steeply: 3.659186, 6.612020, 18.119587, 30.809387. A large step between successive heights means two well separated groups were forced together. That is the tree's own version of the elbow, and like the elbow it is read, with the reading written down.

The column "tied steps" in the agglomerative view counts merges that met a tie between candidate pairs. On the Ekene rows it reads 0 for all three linkages. How the engine orders a tie is taught in the Expert tier.

## Why this layout

The layout is the one scipy returns, so a tree from this engine can be drawn or checked there, and it holds the heights that scikit-learn's own agglomerative output leaves out. With the heights kept, the tree can be re-cut at any k without running the clustering again, which the last lesson of this module does.

## Exercise

In the agglomerative view, run the Ekene cored rows with Ward linkage and read the linkage matrix. Starting from the last row, follow the ids down: find which merge made each of the two clusters the last merge joins, and write down their sizes. Check that the two sizes add to 180. Then find the first merge whose two ids are both 180 or above.
