# Ward, complete and average linkage

{{panel:ef-judge-explorer}}

Between two single rows, "closest" is simply the distance between them. Between two clusters of many rows it has to be defined, and the definition is the linkage. The engine offers three, and on the Ekene rows they give visibly different clusters.

## Three definitions

* WARD merges the pair whose union raises the within-cluster sum of squares least. It is the agglomerative relative of k-means, which also minimises a sum of squares. The engine's height for a Ward merge is the square root of twice the rise in the within-cluster sum of squares.
* COMPLETE linkage judges a pair of clusters by their two farthest rows: the largest distance between a row of one and a row of the other.
* AVERAGE linkage, also called UPGMA, judges a pair by the mean distance over all cross pairs.

Each result's basis prints the update the engine uses for that linkage, from Euclidean distances; the Ward update follows scipy.

## Cut at four clusters

On the 180 cored rows with standard scaling, each tree cut at k 4:

| linkage | cluster sizes | last merge made | next merge |
| --- | --- | --- | --- |
| ward | 52, 44, 54, 30 | 3.659186 | 6.612020 |
| complete | 51, 46, 54, 29 | 2.205317 | 2.970753 |
| average | 96, 54, 29, 1 | 1.273129 | 1.346979 |

The cored rows hold 54 limestone, 50 sandstone, 29 shale and 47 shaly-sand. Ward and complete linkage give four clusters of broadly comparable size. Average linkage puts 96 rows in one cluster, more than any core facies holds, and leaves one row alone. That lone row is the one the silhouette module scored at 0.

## Why they differ

Complete linkage is cautious about spread: one far row is enough to keep two clusters apart, so it tends to make compact clusters of similar diameter. Average linkage is more tolerant: a cluster can grow long as long as the mean distance to the cluster it joins stays small, so it can chain two touching groups into one, and a single odd row can stay unmerged until late. Ward, like k-means, favours compact clusters with a small sum of squares.

None of these is right in general. Which one suits a field is judged against core, and later modules of this tier score all three that way.

## Heights belong to their linkage

The heights in the table are in standard units, but they measure different things. A complete height is a largest distance; an average height is a mean distance; a Ward height is the square root of twice a rise in the sum of squares. Ward's heights are on a different scale from the other two and are never compared with them. A height is read against the other heights of its own tree.

## A linkage the engine does not build

The engine builds these three and refuses the others by name. Single linkage, verbatim:

> linkage must be 'ward', 'complete' or 'average'

## Exercise

In the agglomerative view, run the Ekene cored rows at k 4 with each of the three linkages in turn. For each, write down the cluster sizes and the two heights either side of the cut. Then switch to the matching view with the same linkage and k, and read the contingency table for average linkage: find which facies share the cluster of 96 rows.
