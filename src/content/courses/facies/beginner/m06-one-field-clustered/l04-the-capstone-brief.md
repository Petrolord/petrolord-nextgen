# The capstone brief

{{panel:ef-cluster-explorer}}

The Associate capstone hands you a field of cored wells and asks for six numbers. Every one answers this tier's question, grouping logs into electrofacies, and every one is a value the engine returns. Each has a worked twin in this tier, computed on the Ekene cored rows with the same rule.

| the kind of field | the rule it tests | a worked twin in this tier |
| --- | --- | --- |
| a log's scale | the population standard deviation (n) of the rows clustered | GR, 32.041141 gAPI |
| the first component's share | the explained variance ratio of PC1, correlation matrix | 0.682351 |
| a log's loading on PC1 | weight x square root of the eigenvalue, correlation form | NPHI, 0.894337 |
| a row's PC1 score | the correlation form, the row counted from 0 | row 0, 1.334633 |
| the k-means inertia | the stated k and seed, ten starts, standard scaling | 58.289042 at k 4, seed 3 |
| a cluster centre in log units | the GR centre, in gAPI, of the cluster a named row sits in | row 0 of EKENE-1, cluster 1, 46.479661 gAPI |

## What each field asks of you

The scale field asks for the population standard deviation, divisor n, which is what the clustering scaler uses. The sample standard deviation (n - 1) is a different number: for Ekene GR it is 32.130517.

The share field asks for the correlation form, the engine's default. The covariance form gives a different figure, 0.998581 for Ekene, because it lets the gamma ray take the first component.

The loading field asks for the loading. The weight of the same log on the same component is a different number: for Ekene NPHI the PC1 weight is 0.541336 and the loading 0.894337.

The score field asks for a score on the correlation form, for the row the brief names, counted from 0. The "Principal components" view lists the fitted scores of ten rows from the row you choose; a fitted row projected with its own model gets the same score.

The inertia field asks for the result of the stated k and the stated seed with ten starts, in standard units. One start from the same seed can stop higher: Ekene seed 3 with one start stops at 58.330411.

The centre field asks for a figure in gAPI, the GR of the centre of the cluster a named row sits in. It does not ask for the cluster's number, which is a name, and a different seed can give the same cluster another number. The view "k-means, start by start" lists each fitted row's cluster from the row you choose: cored row 0, the first of EKENE-1, sits in cluster 1 of the teaching clustering, whose GR centre is 46.479661 gAPI.

## How to work it

Read the brief for its rows, its logs, its k and its seed, and use exactly those. Fit on every row the brief names. Check for missing values first, since the engine refuses a null by name. Then scale, run the components, run k-means, and read the centres. Before you open the capstone, reproduce every twin in the table in the cluster explorer and check each to the last printed digit.

## What the capstone will not ask

It asks for no choice of k and no comparison of clusters with core. Those are the Professional tier's. It asks for no predicted facies, which is the Expert tier's. An answer that brings any of them in has answered a question nobody asked.

## Exercise

Reproduce all six worked twins from the table in the cluster explorer. Use "Standard and min-max scaling" for the GR scale, "Principal components" for the share, the loading and the score, "k-means, start by start" for the inertia and the centre. For each, write down the rule, the rows and the settings you used.
