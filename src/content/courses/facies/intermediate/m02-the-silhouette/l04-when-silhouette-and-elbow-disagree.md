# When the silhouette and the elbow disagree

{{panel:ef-judge-explorer}}

The elbow prints inertia against k and picks nothing. The silhouette can be printed against k too, and the engine does name the k with the highest mean. On the Ekene rows that k differs from the number of facies the core describes, and this lesson reads the disagreement.

## The silhouette at every k

The elbow call with `withSilhouette` true scores each k's winning clustering. On the 180 cored rows, standard scaling, seed 3, 10 starts at every k:

| k | inertia | drop fraction | mean silhouette |
| --- | --- | --- | --- |
| 2 | 245.390847 | 0.659179 | 0.650162 |
| 3 | 81.231125 | 0.668972 | 0.690362 |
| 4 | 58.289042 | 0.282430 | 0.545063 |
| 5 | 51.743024 | 0.112303 | 0.503776 |
| 6 | 47.642067 | 0.079256 | 0.505098 |
| 7 | 44.956011 | 0.056380 | 0.492984 |
| 8 | 41.863457 | 0.068791 | 0.266816 |

At k 1 there is no silhouette: every row sits in one cluster, and the silhouette needs a second.

## What the engine names, and how

The highest mean silhouette is at k 3, 0.690362, and the engine returns `bestSilhouetteK` 3. Its basis states the rule, verbatim:

> bestSilhouetteK has the highest mean silhouette; a tie goes to the smaller k. No elbow is picked automatically: read the drops

So the engine names the silhouette's k by a stated rule and leaves the elbow to be read. At k 4, where the core has its four facies, the mean silhouette is 0.545063.

## Three pieces of evidence, three answers

On these rows the figures point different ways:

* The largest drop fraction is at k 3, 0.668972, and the fraction falls again after k 4.
* The highest mean silhouette is at k 3, 0.690362.
* The core describes 4 facies.

Why would k 3 look best to both measures? Both reward groups that are compact and far apart. When two facies overlap in the logs, merging them gives one compact group instead of two that touch, and both measures prefer that. The later modules of this tier show this directly: at k 3 one-to-one matching against core leaves shaly-sand with no cluster at all, its recall 0.000000, and the accuracy over the 180 cored rows falls to 0.738889. The k the silhouette prefers loses a whole facies.

## Neither figure chooses k alone

The silhouette scores how compact and apart the groups are, and says nothing of whether they are the rock types. The elbow says where extra centres stop paying. Neither knows what the clustering is for. On a field with core, the core facies are the purpose, and the comparison against them decides; on a field without core, the silhouette and the elbow are evidence to be written down beside the k chosen, with the reason for the choice.

A mean silhouette also moves with scaling and with the sample it was scored on, and every k in this table is a seeded run. The table is quoted with its seed, its starts and its scaling.

## Exercise

In the elbow view, run the Ekene cored rows with seed 3 and largest k 8, and read the highest-mean-silhouette tile. Then open the silhouette view and score the k-means labels at k 3 and at k 4. At each k, find the cluster with the lowest mean silhouette. Write three sentences: the k the silhouette prefers, the k the core describes, and the k you would choose with the reason you would give.
