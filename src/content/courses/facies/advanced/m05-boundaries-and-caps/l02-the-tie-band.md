# The tie band on distances and heights

{{panel:ef-classify-explorer}}

{{panel:ef-cluster-explorer}}

Decimal logs are not exact in binary. Two distances that are equal on paper can differ in their last bits once computed, and if the engine ordered them by those bits, rounding would decide which centre a row joins, which row becomes a neighbour, or which merge happens first. So the engine judges every distance tie inside a band: squared distances, in k-means and kNN, or merge heights, in agglomerative clustering, within 1.00e-12 of the smallest, relative, are tied. The band is inclusive. Beyond it, values are ordered by size. Within it, each function breaks the tie by its own stated rule.

## Three goldens, each built so a tie is certain

| function | golden | the tie | who wins |
| --- | --- | --- | --- |
| k-means | `kmeans-assignment-tie-lower-centre` | row 4, (5, 0), equally far from centres (0, 0) and (10, 0) | the lower centre, centre 0 |
| agglomerative | `agglomerative-grid-ties-ward` | the first three merges, all at height 1.000000 | the tied pair with the lowest cluster ids |
| kNN | `knn-equidistant-lower-row` | rows 0 and 2 both 2.000000 from the new row | the lower row, row 0 |

The k-means golden runs one pass with no scaling on five rows, (0, 0), (0, 1), (10, 0), (10, 1) and (5, 0), from starting centres (0, 0) and (10, 0). Row 4 sits exactly halfway, goes to centre 0, and the labels read 0, 0, 1, 1, 0.

The agglomerative golden takes the four corners of a unit square and two more points, (5, 0) and (6, 0), with Ward linkage and no scaling. 2 of its 5 merges met a tie. The basis states the rule in the engine's words:

> merges whose heights are within 1e-12 (relative) of the smallest are tied; the tied pair with the lowest cluster ids wins (the smaller id first, then the other)

Its first three merges, all at height 1.000000, are [0, 1], [2, 3] and [4, 5].

## Tied starts in k-means

The band also decides which of several k-means starts wins. On the 180 cored rows at k 4, seed 3 and 10 starts, three starts print the winning inertia 58.289042. The largest difference between any of them and the winner is 0, inside the band, so they are tied, and the earliest of them, start 3, keeps the win. The basis states that rule too:

> lowest inertia over the runs; a run within 1e-12 (relative) of the best so far does not replace it

Without the band, a difference in the last bits could hand the win to either start.

## Printed alike is not the same as tied

Two figures that agree at six decimals are equal only where the engine says so. The course prints distances, heights and inertias to six decimals, which hide differences far larger than a band of 1.00e-12 relative, so a pair can agree at that precision and still fall outside the band. When a lesson or a report says two values tie, the evidence is the engine's own comparison: a tied-vote count, a count of tied steps in the merge history, or a win kept by the earlier start.

## Exercise

Open the cluster explorer on "k-means, start by start" with the cored rows, k 4 and seed 3, and read the inertia of every start. Find the starts that print 58.289042 and confirm which one the engine keeps. Then open the classify explorer on "Ties: a tied vote, equidistant rows, a tied root" and read the equidistant row. For each of the two, write the tie rule that applied in one line.
