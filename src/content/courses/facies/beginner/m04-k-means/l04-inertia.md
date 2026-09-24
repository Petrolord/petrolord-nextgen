# Inertia

{{panel:ef-cluster-explorer}}

Inertia is the single number k-means tries to make small. For every row, take the distance on the scaled logs from the row to the centre of its own cluster, square it, and add those squares over all the rows. Tight clusters, whose rows sit close to their centres, give a small inertia; loose clusters give a large one. The Lloyd passes of the last lesson lower it pass by pass until the labels stop changing.

| run, 180 cored rows, k 4, seed 3 | scaling | inertia |
| --- | --- | --- |
| one start | standard | 58.330411 |
| ten starts | standard | 58.289042 |
| ten starts | min-max | 4.258929 |
| ten starts | none (raw logs) | 10331.820703 |

## The engine's words

The basis reads:

> sum of squared distances of the rows to their centres, on the scaled features

On the scaled features is the important part. The inertia is measured in the space the clustering was made in. With standard scaling that is standard units, so the inertia of 58.289042 is a sum of squared standard units over 180 rows and four logs.

## One start and ten

The one-start run from seed 3 ends at 58.330411. Ten starts from the same seed end at 58.289042. The two figures are close, and they describe two different partitions of the rows: one start settled into a slightly looser arrangement. A lower inertia is a better fit for the same rows, the same logs, the same scaling and the same k. That is all it is.

## Figures that cannot be compared

The three ten-start runs in the table use the same rows, the same k and the same seed, and differ only in scaling. Their inertias are 58.289042, 4.258929 and 10331.820703. They are in three different units: squared standard units, squared fractions of each log's range, and a mixture of squared gAPI, g/cm3, v/v and b/e dominated by the gamma ray. Setting them side by side says nothing about which clustering is better. The same holds for runs on different rows or different logs: add a log and every squared distance gains a term, so the inertia is summed over a different space.

So an inertia is quoted with everything that fixes its units and its count: the rows, the logs, the scaling, k, the seed and the number of starts. The teaching clustering is written as inertia 58.289042 in standard units, 180 cored rows, GR, RHOB, NPHI and PEF, standard scaling, k 4, seed 3, 10 starts.

## What inertia does not measure

It measures how tightly the rows sit around their centres in the logs. It does not measure whether a cluster is a rock type: a clustering can have a low inertia and still mix two facies in one cluster, whose logs read alike. Nothing in the inertia comes from core. A lower inertia is a better fit of the same k; it says nothing yet about rock types.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows and the four logs, k 4 and seed 3. Read the inertia with one start and with ten, at standard scaling. Then read it at min-max and with no scaling, ten starts each. Put the four figures in a table with every setting that fixes their units. Finally remove PEF from the logs and write down why the new inertia cannot be compared with 58.289042.
