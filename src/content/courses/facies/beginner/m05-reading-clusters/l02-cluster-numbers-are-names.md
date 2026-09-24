# Cluster numbers are names

{{panel:ef-cluster-explorer}}

k-means numbers its clusters from 0, and the number tells you nothing. It is a label attached to a group of rows, in the order the starting rows happened to be drawn. Run the same rows again with another seed and the same groups can come back under different numbers. Two runs agree when they group the same rows together, whatever they call the groups.

| cluster, seed 3 | cluster, seed 1 | rows |
| --- | --- | --- |
| 0 | 2 | 29 |
| 1 | 0 | 59 |
| 2 | 3 | 54 |
| 3 | 1 | 38 |

## Seed 3 against seed 1

Both runs are k-means with k 4 and 10 starts, standard scaling, on the 180 cored rows. With ten starts seed 1 reaches the same inertia as seed 3, 58.289042. The table pairs the clusters by counting, for every row, its cluster under seed 3 and its cluster under seed 1.

Every cluster of one run is exactly one cluster of the other. The 29 rows of cluster 0 under seed 3 are the 29 rows of cluster 2 under seed 1. The 59 rows of cluster 1 are the 59 rows of cluster 0. No row changes company. The grouping is the same; only the numbers differ.

## Why the numbers move

Cluster numbers are assigned by where the starting rows fell, and each number stays with its centre through the Lloyd passes. Another seed draws other starting rows in another order, so the group that ends with the high gamma ray centre can end up under any of the four numbers. Nothing about the rock enters the numbering.

## What this means for your work

Never compare cluster numbers between runs. "Cluster 0 has 29 rows under seed 3 and 59 under seed 1" compares two different groups under one name. To compare two runs, pair their clusters row by row, as the table does, or compare their centres in log units, which do not depend on the numbering.

Never let a number stand for a rock. "Cluster 0 is the shale" is wrong twice over: the number is arbitrary, and no cluster takes a facies name until it has been matched against core. A sentence that names a cluster must carry its seed, its number of starts and, in a later tier, the matching that gave it a name.

Always record the full labelling with the clustering. A cluster number written into a well file or a report without the run that produced it cannot be read back by anyone, including you.

## Same inertia, same grouping?

Here the two runs reach the same inertia and the same grouping. Equal inertias at six decimals are a strong hint of the same partition, and the row by row pairing is what shows it. The course relies on the pairing, because a figure printed alike is no proof that two results are equal.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows, the four logs, k 4 and ten starts. Run seed 3 and write down the size and GR centre of each cluster. Then run seed 1 and do the same. Pair each seed 1 cluster with the seed 3 cluster whose centres match in log units, and check your pairs against the table above. Then try seed 2 and pair its clusters the same way.
