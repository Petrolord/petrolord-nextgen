# Fisher's iris as a published check

{{panel:ef-cluster-explorer}}

Every Ekene figure in this course comes from the engine, and the Ekene field is synthetic. A course built that way needs at least one check against a source outside the programme. Fisher's iris data is that check. It has nothing to do with rock. It is here because a published figure for it exists, and the engine's arithmetic can be held against that figure digit by digit.

| component | eigenvalue | explained variance ratio | to eight decimals, as published |
| --- | --- | --- | --- |
| PC1 | 4.228242 | 0.924619 | 0.92461872 |
| PC2 | 0.242671 | 0.053066 | 0.05306648 |
| PC3 | 0.078210 | 0.017103 | not published |
| PC4 | 0.023835 | 0.005212 | not published |

## The data

Fisher published it in 1936, in The use of multiple measurements in taxonomic problems, Annals of Eugenics, volume seven, pages 179-188. It holds 150 flowers of three species, with four measurements each in centimetres: sepal_length, sepal_width, petal_length and petal_width. The copy used here is the file scikit-learn ships.

## The published figure

The scikit-learn example "Comparison of LDA and PCA 2D projection of Iris dataset" prints the explained variance ratio of the first two covariance components as [0.92461872 0.05306648]. The engine, asked for `pca` with `matrix: 'covariance'` on all 150 flowers, gives the table above. At eight decimals it agrees with the published figure on both components, at every printed decimal.

That agreement checks the covariance matrix, the Jacobi rotations that find the eigenvalues and the ratios taken over all four components.

## Why the covariance form

All four iris measurements are in centimetres, so there is no unit problem to fix, and the published figure is the covariance form. On the correlation matrix the same flowers give eigenvalues 2.918498, 0.914030, 0.146757 and 0.020715, and a first ratio of 0.729624. The choice of matrix moves the figure, so a check is only a check when it uses the same matrix as the source. Here that is covariance.

## k-means on iris

k-means on the raw measurements, k 3, one per species, seed 3 and ten starts, gives an inertia of 78.851441 in squared centimetres, with clusters of 50, 38 and 62 flowers. The standard library oracle that checks the engine's arithmetic reads the same figure, 78.851441, at six decimals for the same call.

No scaling is needed, because all four measurements share a unit. The species hold 50 flowers each, and the clusters hold 50, 38 and 62. The sizes alone show that the clusters and the species differ: at least one cluster mixes two species. It is the lesson of the whole tier. A clustering can be computed exactly right and still not recover the groups a specialist would draw.

## What the check does and does not cover

It covers the arithmetic of principal components and k-means on a public dataset. It does not show that the Ekene clusters are rock types, or that k 4 is the right number for Ekene. Those are questions about the data, and core answers them.

## Exercise

Get the iris measurements from the file scikit-learn ships, with a header line naming the four columns. Paste them into the cluster explorer's "Principal components" view with the matrix set to covariance, and set the logs to the four measurement names. Check the first two ratios against the published figure. Then switch to correlation and read the first ratio again. Finally, in "k-means, start by start", run k 3, seed 3, ten starts, scaling none, and write down the inertia and the three sizes.
