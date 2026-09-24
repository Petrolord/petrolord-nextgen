# Merging from single rows

{{panel:ef-judge-explorer}}

k-means starts from k centres and moves them. Agglomerative clustering works the other way: it starts with every row as a cluster of its own and merges, one pair at a time, until a single cluster is left. It needs no k to run and no seed at all, and the whole history of merges is kept.

## The procedure

At every step the engine finds the two closest clusters and merges them. What "closest" means between two clusters of several rows is the linkage, the subject of the next lesson. With 180 rows there are 180 clusters at the start and one at the end, so the history holds 179 merges, one fewer than the rows.

The distance between rows is Euclidean on the scaled logs. By default the logs are standardised with the population standard deviation fitted on the rows clustered, as in k-means, so gamma ray does not rule the distances.

## The first merge and the last

On the 180 cored rows of the Ekene field, GR, RHOB, NPHI and PEF, standard scaling, Ward linkage:

| merge | rows joined | height | rows in the new cluster |
| --- | --- | --- | --- |
| first | rows 24 and 63 | 0.069063 | 2 |
| last | the final two clusters | 30.809387 | 180 |

The first merge joins rows 24 and 63 of the cored rows, counted from 0, the closest pair of all; both are limestone. The height of a merge records how far apart the two clusters were when they joined. The last merge joins the final two clusters into one of 180 rows at the largest height of the tree.

On these rows the merge heights of all three linkages never fall from one merge to the next. Each merge sits at or above the merges that made its parts, so the history can be drawn as a tree with every join above the two branches it joins.

## Deterministic by construction

Nothing in the procedure is drawn at random. The same rows, scaling and linkage give the same history every time, so an agglomerative result carries no seed. That differs from k-means, where a result is quoted with its seed and its number of starts.

## The price: every pair of rows

To find the closest pair at every step, the engine holds every pairwise distance between rows. The number of pairs grows with the square of the rows, so the engine caps the rows it accepts, and says so by name. Passed 3001 rows (the cored rows repeated), it refuses, verbatim:

> X has 3001 rows, above the 3000 agglomerative clustering accepts (it holds every pairwise distance, n(n - 1)/2 of them): cluster a sample or use kmeans

The message names the way out: a sample of the rows, or k-means, which compares each row only with k centres. At the other end, a single row gives nothing to merge:

> X must be an array of at least 2 rows

## Exercise

In the judge explorer, open the agglomerative view on the Ekene cored rows with Ward linkage and a cut at k 4. Find the first merge and the last in the linkage matrix and check their heights against the table above. Run it again and confirm every figure repeats, with no seed to set. Then switch to complete linkage and see whether the first merge joins the same two rows.
