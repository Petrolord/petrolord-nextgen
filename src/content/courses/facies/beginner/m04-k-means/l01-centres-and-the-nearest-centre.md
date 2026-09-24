# Centres and the nearest centre

{{panel:ef-cluster-explorer}}

k-means splits the rows into k clusters. Each cluster has a centre, a point in the same space as the rows, and every row belongs to the cluster whose centre is nearest. That is the whole rule. You choose k; the engine places the centres so that rows sit as close to their own centre as it can manage. It works on the standardised logs, so nearest means nearest on the scaled logs, where every log counts.

| cluster | rows | GR centre | RHOB centre | NPHI centre | PEF centre |
| --- | --- | --- | --- | --- | --- |
| 0 | 54 | -0.936030 | 1.282017 | -1.285698 | 1.406984 |
| 1 | 56 | -0.327638 | -1.056447 | 0.077937 | -0.888609 |
| 2 | 30 | 1.865588 | 0.318773 | 1.467810 | 0.052958 |
| 3 | 40 | 0.323144 | -0.490776 | 0.525721 | -0.695094 |

## One start, read closely

The table is one start of k-means, k 4, seed 3, on the 180 cored rows with standard scaling, and its centres are in standard units. A centre is the mean of its rows. Cluster 2 sits 1.865588 standard units above the mean on GR and 1.467810 above it on NPHI: its rows read high gamma ray and high neutron, and it is still named only by its number. Cluster 0 sits low on GR and NPHI and high on RHOB and PEF. The four sizes are 54, 56, 30 and 40 rows.

This is a single start, and the next lessons show that more starts find a slightly better arrangement. Every figure from k-means is quoted with its seed and its number of starts for that reason.

## The nearest centre

A row goes to the centre at the smallest Euclidean distance on the scaled logs. The engine's basis reads:

> nearest centre by Euclidean distance on the scaled features; squared distances within 1e-12 (relative) of the smallest are tied and go to the lower centre index

The second half is a tie rule. A row equally near two centres goes to the lower centre number, so the same rows always give the same labels.

## Two moves, repeated

Given the centres, putting each row at its nearest centre is easy. Given the rows of each cluster, the best centre is their mean. k-means alternates the two: assign every row, move every centre to the mean of its rows, assign again. The next two lessons open where the first centres come from and when the alternation stops.

## What k must be

k counts clusters, so it must be a whole number from 1 to the number of rows. Ask for 0 clusters of the 180 cored rows and the engine refuses:

> k must be a whole number from 1 to 180 (the number of rows)

Ask for three clusters of two rows and it names the new limit:

> k must be a whole number from 1 to 2 (the number of rows)

Choosing k within that range is your decision. This tier states k 4, one per core facies, and leaves judging that choice to the Professional tier.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows and the four logs, set k to 4, the seed to 3 and the starts to 1, and check the sizes against the table above. The panel prints centres in log units; for each cluster, describe it in one line by its logs. Then set k to 0 and read the refusal, and set k to one more than the number of rows and read it again.
