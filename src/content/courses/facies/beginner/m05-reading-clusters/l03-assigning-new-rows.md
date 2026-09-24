# Assigning new rows to the nearest centre

{{panel:ef-cluster-explorer}}

A clustering fitted on the cored wells is most useful when it can describe a well that was never cored. `assignClusters` takes a fitted k-means result and new rows, scales the new rows with the scaler fitted on the clustered rows, and puts each at its nearest centre. Nothing is refitted: the centre, the scale and the four cluster centres all stay as they were.

| cluster | EKENE-7 rows assigned |
| --- | --- |
| 0 | 1 |
| 1 | 19 |
| 2 | 10 |

## The engine's words

The basis reads:

> scaled with the fitted scaler, then the nearest centre; squared distances within 1e-12 (relative) of the smallest are tied and go to the lower centre index

## EKENE-7

EKENE-7 is uncored, 30 rows. Assigned against the teaching clustering, k 4, seed 3, 10 starts, fitted on the 180 cored rows, it puts 1 row in cluster 0, 19 in cluster 1 and 10 in cluster 2. No EKENE-7 row goes to cluster 3.

Its first row, at 6565 ft, goes to cluster 2 at a distance of 0.365418 standard units from that centre. The largest distance of any EKENE-7 row to its centre is 1.164413. Over the cored rows themselves, the largest distance to their own centre is 1.168721. So no EKENE-7 row sits farther from its centre than the farthest cored row sits from its own. On that check the new well looks like the rows the clustering was built on.

## Why the scaler is not refitted

If EKENE-7 were scaled on its own mean and standard deviation, its logs would be measured against itself. A well reading high on gamma ray everywhere would be pulled back to a mean of 0. Scaling with the cored rows' centre and population standard deviation (n) keeps every well on one ruler, so a high reading stays high.

## A check that costs nothing

Assign the cored rows themselves and the engine returns exactly the labels k-means fitted. A cored row's own cluster is in `labels`, one per row in row order: the first rows of EKENE-1, EKENE-2 and EKENE-4 (rows 0, 30 and 90) sit in cluster 1, of EKENE-3 and EKENE-5 (rows 60 and 120) in cluster 2, and of EKENE-6 (row 150) in cluster 3.

## When the model and the rows disagree

Pass new rows with three logs to a model fitted on four:

> X must have 4 columns, as the model was fitted on

Pass a PCA result where a k-means result was expected:

> model must be the result of kmeans

## What an assignment claims

It claims that a new row's logs sit nearest to one centre. It does not claim a facies, because the cluster has none until it is matched against core.

## Exercise

Open the cluster explorer on the view "New rows at the nearest centre". It opens with the cored rows clustered at k 4 and seed 3, and the EKENE-7 rows as new rows. Check the counts per cluster against the table above, and read the distance of the first new row. Then replace the new rows with the first ten cored rows and check their clusters against the fitted rows the k-means view lists. Finally put the EKENE-7 rows back, raise the GR of the first one by 30 gAPI, and write down how its cluster and its distance change.
