# Renamed clusters score the same

{{panel:ef-judge-explorer}}

A cluster number is a name. Two k-means runs can find the same grouping and number it differently. A good agreement score must see through the renaming, and the adjusted Rand index does, because it counts pairs of rows and a pair is together or apart whatever the groups are called.

## The same partition, numbered two ways

With ten starts, seed 1 reaches the same inertia as seed 3 on the 180 cored rows, and the two runs make the same grouping with other numbers. Each row's cluster under the two seeds:

| cluster, seed 3 | cluster, seed 1 | rows |
| --- | --- | --- |
| 0 | 2 | 29 |
| 1 | 0 | 59 |
| 2 | 3 | 54 |
| 3 | 1 | 38 |

Every cluster of one run is exactly one cluster of the other. Compared name by name, the two labellings would look entirely different: no row keeps its number, and the rows labelled 0 at seed 3 are labelled 2 at seed 1. A score that compared names directly would call the two runs strangers, when they are the same answer twice.

## What the index says

| labellings compared | ARI |
| --- | --- |
| seed 3 against the core facies | 0.872413 |
| seed 1 against the core facies | 0.872413 |
| seed 1 against seed 3 | 1.000000 |

Against each other, the two runs score 1.000000: the same grouping. Against the core, both score 0.872413. The two core figures are equal because the groupings are the same partition, which the index of 1.000000 between them shows; they do not merely print alike.

## Independent of the mapping

The one-to-one matching of the teaching clustering returns an ARI beside its mapped scores, and it is the same 0.872413. The engine's basis says why, verbatim:

> adjusted Rand index of the clusters against the facies (independent of the mapping)

The mapped accuracy depends on the mapping chosen; the ARI does not use one. That makes it the right figure to quote when two clusterings are compared with each other, where no mapping exists, and a useful second figure against core, where the mapping is a choice.

## What it does not see through

Renaming leaves the ARI unchanged. A different grouping does not. The teaching k-means and the Ward cut at k 4 are two different groupings of the same rows; against each other, neither of them the core, they score 0.863179. Close, and still below 1, because some pairs one joins the other splits. So an index of 1.000000 between two runs is the test for the same grouping, and anything below it means some rows moved.

## Exercise

In the adjusted Rand index view, type a short labelling of your own, then type the same labelling with every label replaced by a new name, and confirm the index reads 1.000000. Then move one row to another group in the second labelling and read how far the index falls. Finally, in the matching view, confirm that the k-means clustering at k 4 reports the same index against core as the table above.
