# Majority matching and split facies

{{panel:ef-judge-explorer}}

One-to-one matching refuses more clusters than facies. Majority matching accepts them: it gives each cluster its most common facies, so two clusters can share one name. That is useful when a facies really does come in two log signatures, and it carries a trap that this lesson spells out.

## The rule

The engine's basis, verbatim:

> majority: each cluster to its most common facies (several clusters may share one); a tie goes to the facies that sorts first

Each cluster is named independently of the others. No optimum is needed, since no cluster competes for a name.

## Five clusters matched by majority

k-means at k 5 on the 180 cored rows, seed 3, 10 starts, standard scaling:

| cluster | majority facies | rows of that facies | rows in the cluster |
| --- | --- | --- | --- |
| 0 | shale | 29 | 29 |
| 1 | limestone | 54 | 54 |
| 2 | sandstone | 49 | 51 |
| 3 | shaly-sand | 24 | 24 |
| 4 | shaly-sand | 21 | 22 |

Shaly-sand takes two clusters, 3 and 4. The accuracy over the 180 cored rows is 0.983333, with a macro F1 of 0.984510. At k 4 with one-to-one matching the accuracy was 0.950000. Note the cluster numbers: this is a different run from the teaching clustering, and its cluster 1 is the limestone one.

## The trap: splitting costs nothing

Majority matching scores higher at k 5 than one-to-one did at k 4. That is no evidence for k 5. Under majority matching, splitting a facies into two clusters costs nothing, because both halves take the same name. So splitting never costs the score anything, and at the extreme, one cluster per row would match every row.

A higher majority score at a larger k is therefore expected, and it tells you nothing about which k is right. Compare scores only at the same k and with the same matching mode, and say which mode you used.

## When majority is the right reading

Majority matching answers a different question from one-to-one. One-to-one asks whether the clusters are the facies. Majority asks whether each cluster lies mostly within one facies. The second is the right question when a clustering is deliberately finer than the facies scheme, for instance when a geologist expects a clean and a shaly variety of one facies to separate. On the table above, clusters 3 and 4 are nearly pure shaly-sand: 24 of 24 rows and 21 of 22. Whether they are two varieties of shaly-sand is for the core description to say, and the score is silent on it.

## Modes the engine offers

The engine offers exactly two modes, and refuses any other by name:

> mode must be 'one-to-one' or 'majority'

## Exercise

In the matching view, run the Ekene cored rows with k-means at k 5 and majority matching, and find the facies that takes two clusters. Then run k 6 and k 8 with majority matching, write down the accuracy at each, and compare it with the k 5 figure. Say in one sentence why a higher figure at a larger k would be no evidence for that k. Finally switch to one-to-one at k 4 and note the mode beside every figure you recorded.
