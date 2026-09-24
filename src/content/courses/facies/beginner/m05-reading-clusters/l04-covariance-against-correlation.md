# Covariance against correlation

{{panel:ef-cluster-explorer}}

Principal components can start from two matrices. The correlation matrix, the engine's default, standardises every log first, so each counts equally. The covariance matrix only centres each log and keeps it in its own unit. On logs measured in very different units the two give very different components, and the difference is the same one that made gamma ray rule a raw distance.

| component | eigenvalue (squared log units) | explained variance ratio | GR weight | RHOB weight | NPHI weight | PEF weight |
| --- | --- | --- | --- | --- | --- | --- |
| PC1 | 1032.566971 | 0.998581 | 0.999905 | -0.000827 | 0.002535 | -0.013558 |
| PC2 | 1.463494 | 0.001415 | 0.013638 | 0.102828 | -0.028688 | 0.994192 |
| PC3 | 0.002748 | 0.000003 | -0.000189 | 0.978841 | -0.174857 | -0.106283 |
| PC4 | 0.001509 | 0.000001 | -0.002211 | 0.176909 | 0.984173 | 0.010132 |

## The covariance form

Ask `pca` for `matrix: 'covariance'` and it centres each log, keeps its unit and divides by n - 1. The basis reads:

> covariance matrix of the centred features, divisor n - 1 (as scikit-learn PCA explained_variance_)

The table is that call on the 180 cored rows. Its first component is almost GR alone: GR's weight is 0.999905, and the largest of the other three weights in size is PEF's, -0.013558. That component carries 0.998581 of the variance. The second is almost PEF alone, with a weight of 0.994192, and carries 0.001415.

## Why GR takes the first component

A covariance component follows variance in the logs' own units. The covariance matrix's diagonal is each log's variance: 1032.370110 for GR in gAPI squared, against 0.018860, 0.009384 and 1.636367 for RHOB, NPHI and PEF. GR's variance dwarfs the rest, so the direction of greatest spread lies almost exactly along the GR axis. A covariance PCA of these logs is a gamma ray PCA, and its first component adds little to the GR log itself.

## The correlation form, for comparison

On the correlation matrix the first component carries 0.682351 and draws on all four logs, with loadings of 0.699368 on GR, -0.808009 on RHOB, 0.894337 on NPHI and -0.887452 on PEF. Its eigenvalues sum to 4.000000, one for each standardised log. That component describes how the four logs move together, which is what an electrofacies study wants to see.

## When the covariance form is right

When every log is in the same unit and a larger spread really should count for more. Fisher's iris measurements, all in centimetres, are such a case, and the published figure for them is the covariance form; the next module uses it as a check on the engine. For wireline logs in gAPI, g/cm3, v/v and b/e, the engine defaults to the correlation form, so that every log counts.

## The same choice in k-means

The choice between the two matrices is the same choice as scaling or not scaling the logs before k-means. Clustering the raw logs with k 4, seed 3 and ten starts gives four centres spread over 93.344030 gAPI of GR, in clusters of 67, 24, 65 and 24 rows. The standard run gives 29, 59, 54 and 38. Whenever you meet a figure from principal components or k-means, ask which matrix or which scaling produced it.

## Exercise

Open the cluster explorer on the view "Principal components". Keep the cored rows and the four logs, and read the explained variance ratios with the matrix set to correlation. Switch to covariance and read them again, with the loadings. Write down which log dominates the first covariance component. Then remove GR from the logs, keep covariance, and write down which log takes over the first component and what share it carries.
