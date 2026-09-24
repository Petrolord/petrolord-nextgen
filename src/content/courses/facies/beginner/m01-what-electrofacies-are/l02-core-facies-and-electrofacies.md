# Core facies and electrofacies

{{panel:ef-cluster-explorer}}

Core is the rock itself, cut from the well and described by a geologist. A core facies is the name that description gives a sample: sandstone, shaly-sand, shale, limestone. Logs run in every well; core is cut in few. An electrofacies is the attempt to recognise rock types from the logs alone, so that wells with no core can be described too. The two words sound alike and this course keeps them strictly apart.

| facies | cored rows |
| --- | --- |
| limestone | 54 |
| sandstone | 50 |
| shale | 29 |
| shaly-sand | 47 |

## The words, as this course uses them

A **facies** is the core facies of a cored row, or a facies predicted from core and called predicted. Nothing else earns the word.

A **cluster** is a group the engine made from the logs without looking at core. Clusters are numbered from 0, and the number is a name that carries no meaning.

An **electrofacies** is a cluster read as a rock type. It takes a facies name only after it has been matched against core, and that matching is taught in the Professional tier. Until then a cluster is described by its logs: high gamma ray and high neutron, or low gamma ray and high photoelectric factor.

## The core in the Ekene field

Six Ekene wells are cored, EKENE-1 to EKENE-6, 30 samples each, 180 cored rows in all. The table counts their core facies. The engine sorts names by character, so every list it returns reads limestone, sandstone, shale, shaly-sand, in that order. Two wells, EKENE-7 and EKENE-8, carry no core, and their facies column is null on every row.

## Why the course does not name clusters

The teaching clustering of this tier, k-means with k 4, seed 3 and 10 starts, puts the 180 cored rows into clusters of 29, 59, 54 and 38 rows. The core counts are 54, 50, 29 and 47. A size that happens to equal a facies count proves nothing about which rows are in it. Only a row by row comparison against core can say whether a cluster is a rock type.

The numbers themselves are also arbitrary. With ten starts, seed 1 finds exactly the same grouping as seed 3 and numbers it differently. Writing "cluster 0 is the shale" without the seed, the starts and a matching against core claims more than the clustering showed.

## What a cluster can honestly say

It can say which rows read alike on the logs you chose, after the scaling you chose. It can describe its centre in log units. It can place a new row from an uncored well at its nearest centre. Each is a statement about logs. Whether the groups are rock types is a separate question, which the course answers with core.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows, the logs GR, RHOB, NPHI and PEF, k 4, seed 3 and ten starts. Read the cluster sizes and centres. For each cluster write one line describing it by its logs alone, with no rock name. Then set the seed to 1, run it again, and pair each new cluster with the old one whose centre matches it.
