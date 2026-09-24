# Why gamma ray rules a raw distance

{{panel:ef-cluster-explorer}}

A distance adds squared differences across the logs, and it has no idea what units they are in. A difference of ten gAPI on the gamma ray and a difference of ten hundredths of a g/cm3 on the density enter the sum as ten and as one tenth. So the log with the largest numbers dominates the distance, whether or not it is the log that separates the rocks best. On the Ekene cored rows that log is GR.

| log | variance on the 180 cored rows (covariance matrix diagonal, divisor n - 1) |
| --- | --- |
| GR | 1032.370110 |
| RHOB | 0.018860 |
| NPHI | 0.009384 |
| PEF | 1.636367 |

## Variance in the log's own units

The table gives each log's variance in its own squared units. GR's is 1032.370110 gAPI squared. The next largest is PEF at 1.636367, and RHOB and NPHI sit in the hundredths and below. A raw distance adds squared differences, so it inherits these proportions: whatever GR says about two rows, it says far louder than the other three.

## The pairs already measured

The course measured row 0, the first sandstone of the cored rows, against the first shaly-sand, limestone and shale. On the raw logs GR supplied 0.998940, 0.976184 and 0.999334 of the three squared distances. The limestone differs from sandstone on density, neutron and photoelectric factor, yet those three logs together supplied only what GR left over.

## What it does to k-means

Run k-means with k 4, seed 3 and ten starts on the raw logs, scaling 'none', and the clusters follow the gamma ray.

| cluster, raw logs | rows | GR (gAPI) | PEF (b/e) |
| --- | --- | --- | --- |
| 0 | 67 | 28.005970 | 4.312836 |
| 1 | 24 | 84.158333 | 2.473750 |
| 2 | 65 | 52.741538 | 2.094154 |
| 3 | 24 | 121.350000 | 3.172917 |

The four centres spread over 93.344030 gAPI of GR, stepping up the gamma ray scale in bands. The cluster sizes, 67, 24, 65 and 24, sit beside core counts of 54, 50, 29 and 47. With standard scaling the same call gives clusters of 29, 59, 54 and 38 rows, and a different grouping.

## Two inertias that cannot be compared

The raw run reports an inertia of 10331.820703 and the standard run 58.289042. The first is in gAPI squared, mostly, and the second in standard units. They measure different spaces and say nothing about which run is better. Compare inertias only between runs made on the same scaling.

## The remedy

Put every log on a common scale before any distance is taken. The engine's default for k-means is standard scaling, and the next two lessons open it and its alternative, min-max. Scaling is a decision about which logs count and by how much, and it is written down with every result.

## Exercise

Open the cluster explorer on the view "k-means, start by start". Keep the cored rows, k 4, seed 3 and ten starts, and run it three times with the scaling set to standard, min-max and none. For each, copy the cluster sizes and the GR centres into a table. Write down which scaling gives clusters that differ mostly by gamma ray, and one sentence on why.
