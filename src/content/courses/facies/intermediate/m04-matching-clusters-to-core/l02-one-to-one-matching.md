# One-to-one matching

{{panel:ef-judge-explorer}}

The contingency table shows what each cluster holds. To score a clustering against core, each cluster needs a facies name, so every cored row gets a predicted facies to compare with its core facies. One-to-one matching gives each cluster a different facies.

## The rule

One-to-one matching chooses the assignment of facies to clusters, each cluster a different facies, that puts the most rows on their own facies. The engine finds that optimum with the Hungarian method. Its basis, verbatim:

> one-to-one: each cluster to a different facies, maximising the rows matched (Hungarian); among equal totals the first mapping in cluster order that takes the first facies

The alternative in common use is greedy matching: give each cluster, one at a time, its best facies still free. Greedy can lock in an early choice that costs more later. The optimum over all assignments has no such trap, and its total is unique.

## The teaching clustering matched

k-means, k 4, seed 3, 10 starts, on the 180 cored rows:

| cluster | matched facies | rows of that facies in the cluster | rows in the cluster |
| --- | --- | --- | --- |
| 0 | shale | 29 | 29 |
| 1 | sandstone | 50 | 59 |
| 2 | limestone | 54 | 54 |
| 3 | shaly-sand | 38 | 38 |

171 of the 180 cored rows land on their own facies under this mapping. The 9 that do not are the shaly-sand rows of cluster 1: once cluster 1 is named sandstone, its shaly-sand rows are predicted sandstone and scored wrong. The accuracy over the 180 cored rows is 0.950000, which is 171 / 180.

Here the optimum is easy to see, because each cluster has one dominant facies and no two clusters want the same one. The method earns its place when two clusters are both mostly the same facies, and only one of them can have it.

## Ties in the total

Two mappings can match the same number of rows. The engine then takes the first mapping in cluster order that gives cluster 0 the first facies. On a small stated case, facies a, b, a, b and clusters 0, 0, 1, 1, both mappings match 2 rows; the engine maps cluster 0 to a and cluster 1 to b. The rule is stated so the same data always give the same names.

## More clusters than facies

One-to-one needs a facies for every cluster. With 5 clusters and 4 core facies one cluster would be left without a name, and the engine refuses, verbatim:

> clusters has 5 clusters, more than the 4 core facies: one-to-one matching would leave clusters unmatched; use mode 'majority' or fewer clusters

The message names both ways out. The next lesson takes the first.

Fewer clusters than facies is accepted, and leaves a facies with no cluster. At k 3, one-to-one matching of the k-means clusters gives shaly-sand no cluster: none of its rows can be predicted correctly, and the accuracy over the 180 cored rows is 0.738889.

## The labels must line up

The matching reads one cluster label per cored row. A list one short is refused:

> clusters must be an array of 180 labels, one per row

## Exercise

In the matching view, run the Ekene cored rows with k-means at k 4 and one-to-one matching, and read the mapping and the rows matched. Change k to 3 and find the facies left without a cluster. Change k to 5 and read the refusal. Then return to k 4 and try complete linkage, and compare its rows matched with the k-means figure.
