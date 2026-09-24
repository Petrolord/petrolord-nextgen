# The mean and each cluster

{{panel:ef-judge-explorer}}

The engine returns the silhouette of every row, and two summaries of them: the mean over each cluster and the mean over every row. The overall mean is the figure most often quoted. The cluster means say where it came from.

## The teaching clusters

The teaching clustering is k-means with k 4, seed 3, 10 starts, standard scaling, on the 180 cored rows. Its silhouettes, scored with standard scaling (the space k-means clustered in):

| group | rows | mean silhouette |
| --- | --- | --- |
| cluster 0 | 29 | 0.599453 |
| cluster 1 | 59 | 0.438615 |
| cluster 2 | 54 | 0.842778 |
| cluster 3 | 38 | 0.245762 |
| all rows | 180 | 0.545063 |

The overall mean, 0.545063, blends a very clean cluster, cluster 2 at 0.842778, with a weak one, cluster 3 at 0.245762. The cluster numbers are names given by seed 3; another seed can number the same groups differently.

3 rows of this clustering score below 0: each sits nearer, on average, to another cluster than to its own.

| row | well | depth (ft) | core facies | cluster | silhouette |
| --- | --- | --- | --- | --- | --- |
| 12 | EKENE-1 | 6228 | shaly-sand | 3 | -0.045137 |
| 135 | EKENE-5 | 6462 | shaly-sand | 3 | -0.002304 |
| 169 | EKENE-6 | 6526 | shaly-sand | 3 | -0.021661 |

All three are cored shaly-sand in cluster 3, the weakest cluster, and each comes from a different well.

## The core facies as labels

The silhouette takes any labelling, so the core facies themselves can be scored as if they were clusters, in the same scaled space:

| group | rows | mean silhouette |
| --- | --- | --- |
| limestone | 54 | 0.842345 |
| sandstone | 50 | 0.489765 |
| shale | 29 | 0.621976 |
| shaly-sand | 47 | 0.152252 |
| all rows | 180 | 0.528711 |

The core facies score 0.528711, a little below the k-means clusters at 0.545063. The silhouette scores how compact and apart the groups are, and says nothing of whether they are the rock types. k-means is built to make compact groups; the rock has no such obligation. Shaly-sand, at 0.152252, is the facies the logs barely separate, and the last module of this tier returns to it.

## Measured in a space

The same k-means labels scored on the raw logs read 0.443238. On raw logs gamma ray mostly dominates the distance, so the figure measures a different geometry. A silhouette is quoted with its scaling, and the engine's default scores the standardised logs.

## A seeded sample

The silhouette compares every pair of rows, which grows fast with the number of rows, so the engine can score a seeded sample instead. Its basis reads "the first 60 rows of a mulberry32(3) Fisher-Yates shuffle, scored among themselves (scikit-learn sample_size)". On the teaching clusters:

| rows scored | seed | mean silhouette |
| --- | --- | --- |
| 60 | 3 | 0.521590 |
| 60 | 4 | 0.525011 |
| 180 | none | 0.545063 |

A sampled silhouette is quoted with its size and its seed.

## Two labellings the engine cannot score

The labels must be one per row and of one type. A list one short, and a list mixing a number with a name, are refused, verbatim:

> labels must be an array of 180 labels, one per row

> labels[2] must be the same type as labels[0]: all strings or all numbers

## Exercise

In the silhouette view, score the Ekene cored rows with k-means labels at k 4 and standard scaling, and find the cluster with the lowest mean. Then switch the labels to the FACIES column and find the facies with the lowest mean. Switch the scaling to none and record how the overall mean moves. Finally set a sample size of 60 and note that the figure changes with the sample.
