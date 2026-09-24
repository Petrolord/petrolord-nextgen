# The correlation matrix of the logs

{{panel:ef-cluster-explorer}}

Four logs do not carry four independent pieces of information. In a shale the gamma ray and the neutron porosity both run high; in a limestone the density and the photoelectric factor both run high. Logs that rise and fall together are correlated, and principal components start from a table of those correlations. `pca` builds that table by default.

|  | GR | RHOB | NPHI | PEF |
| --- | --- | --- | --- | --- |
| GR | 1.000000 | -0.192943 | 0.840604 | -0.340082 |
| RHOB | -0.192943 | 1.000000 | -0.502728 | 0.915911 |
| NPHI | 0.840604 | -0.502728 | 1.000000 | -0.622647 |
| PEF | -0.340082 | 0.915911 | -0.622647 | 1.000000 |

## How the engine builds it

Each log is centred on its mean and divided by its SAMPLE standard deviation, divisor n - 1. The matrix of those standardised logs is the correlation matrix. The basis reads:

> correlation matrix: features standardised with the SAMPLE SD (n - 1), so each score variance equals its eigenvalue and the eigenvalues sum to the number of features

The clustering scaler divides by n, so name the divisor whenever you quote a standard deviation. Every standardised log has variance 1 here, so every log counts equally in the matrix whatever its unit, and the diagonal reads 1.000000 four times.

## Reading the table

A correlation runs from minus one to one. Near one, two logs rise together; near minus one, one rises as the other falls; near zero, they move independently.

On the 180 cored rows RHOB and PEF correlate at 0.915911, the strongest pair: dense rows here also read a high photoelectric factor, which is the limestone. GR and NPHI correlate at 0.840604: high gamma ray rows also read high neutron porosity, which is where the shale sits. NPHI and PEF correlate at -0.622647. GR and RHOB, at -0.192943, are the weakest pair.

Those strong pairs are why fewer directions than four can describe most of the spread. The next lesson measures how much.

## The matrix is a choice

`pca` takes a `matrix` setting, 'correlation' by default or 'covariance'. The covariance form keeps each log in its own unit and is opened later in this tier. Ask for anything else and the engine refuses:

> matrix must be 'correlation' or 'covariance'

## What a correlation does not say

A correlation is measured across all 180 rows at once. It says that two logs move together over this set of rows; it does not say they move together within every facies, and it does not name a facies. It depends on which rows you pass: drop a well and every entry can move. Quote the matrix with its rows.

## Exercise

Open the cluster explorer on the view "Principal components". Keep the cored rows, the four logs and the correlation matrix. The panel shows components and loadings; to see the effect of a correlation, remove PEF from the logs and read the explained variance ratios, then put PEF back and remove RHOB instead. Write down which removal changes the first ratio less, and connect your answer to the correlation of RHOB and PEF in the table above.
