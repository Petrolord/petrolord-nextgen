# The contingency table

{{panel:ef-judge-explorer}}

Everything so far in this tier has judged clusters by their own geometry: inertia, silhouette, merge heights. None of it asked whether a cluster is a rock type. A cluster becomes an electrofacies with a rock name only when it is compared with core, and the comparison starts with one table.

## What the table counts

The contingency table has a row for each cluster and a column for each core facies. Each cell counts the cored rows that sit in that cluster and carry that facies. The engine's basis, verbatim:

> contingency[i][j] counts rows in cluster clusterLabels[i] with core facies faciesLabels[j]

Facies names sort by character, so the columns always read limestone, sandstone, shale, shaly-sand. Clusters are listed in their own order.

## The teaching clustering against core

The teaching clustering is k-means, k 4, seed 3, 10 starts, standard scaling, on the 180 cored rows:

| cluster | limestone | sandstone | shale | shaly-sand | rows |
| --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 29 | 0 | 29 |
| 1 | 0 | 50 | 0 | 9 | 59 |
| 2 | 54 | 0 | 0 | 0 | 54 |
| 3 | 0 | 0 | 0 | 38 | 38 |

Read across a row to see what a cluster holds. Cluster 0 holds all 29 shale rows and nothing else. Cluster 2 holds all 54 limestone rows and nothing else. Cluster 3 holds 38 shaly-sand rows and nothing else. Cluster 1 holds two facies: all 50 sandstone rows and 9 shaly-sand rows.

Read down a column to see where a facies went. Limestone, sandstone and shale each sit wholly in one cluster. Shaly-sand is split: 38 rows in cluster 3 and 9 in cluster 1.

The row totals are the cluster sizes, 29, 59, 54 and 38, and the column totals are the facies counts on the cored rows, 54, 50, 29 and 47. Every one of the 180 cored rows is in exactly one cell.

## The numbers are still names

The cluster numbers in this table come from seed 3. The same partition at seed 1 numbers its clusters differently, so the same table at seed 1 has its rows in another order with the same counts in them. Nothing about "cluster 0" makes it shale. It is shale-like because the table says its 29 rows are all core shale, and that statement belongs to this run with its seed.

## Two kinds of failure the table shows

A cluster holding two facies, like cluster 1, merges rock types the core keeps apart. A facies spread across two clusters, like shaly-sand, splits a rock type the core keeps whole. Both show in the table at a glance, before any score is computed, and both are worth writing down in words: which facies, which clusters, how many rows.

The table also shows what no geometric measure can. The silhouette of cluster 3 was the lowest of the four, and yet cluster 3 is pure: all 38 of its rows are shaly-sand. Compactness and purity are separate questions.

## Exercise

In the judge explorer, open the matching view on the Ekene cored rows with k-means at k 4 and read the contingency table. Name the cluster that holds two facies and the facies that is split. Then switch the clusters to Ward linkage at k 4 and read its table. Find its mixed clusters and its split facies, and write one sentence comparing them with the k-means table.
