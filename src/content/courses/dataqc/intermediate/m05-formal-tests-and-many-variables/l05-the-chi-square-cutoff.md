# The chi-square cutoff and its limits

{{panel:dq-outliers-explorer}}

A squared Mahalanobis distance needs a line to be compared with. If the rows come from a multivariate normal distribution with p variables, the squared distance follows a chi-square distribution on p degrees of freedom. The engine flags a row when d^2 exceeds the chi-square quantile at 1 - alpha on p degrees of freedom. The quantile comes from the safety statistics engine's `chiSquareQuantile`, imported.

The EKENE-7 oil sand, density and neutron, p = 2, at five stated values of alpha:

| alpha, stated | cutoff on 2 degrees of freedom | rows flagged |
| --- | --- | --- |
| 0.100000 | 4.605170 | 3 |
| 0.050000 | 5.991465 | 2 |
| 0.025000 | 7.377759 | 1 |
| 0.010000 | 9.210340 | 1 |
| 0.001000 | 13.815511 | 1 |

The three largest squared distances in the sand:

| EKENE-7 entry | d^2 |
| --- | --- |
| 60 | 22.397696 |
| 62 | 6.581737 |
| 56 | 5.442663 |

## Reading the two tables together

At the default alpha of 0.025 the cutoff is 7.377759 and only entry 60 is flagged. Loosen alpha to 0.05 and the cutoff falls to 5.991465, below entry 62's 6.581737, so two rows are flagged. At 0.100000 the cutoff of 4.605170 also lets in entry 56 at 5.442663. Tighten alpha to 0.001000 and the cutoff rises to 13.815511, and entry 60 at 22.397696 is still beyond it.

Only entry 60 is a planted defect. Entries 62 and 56 are rows of the sand that sit somewhat off the centre. Whether they are flagged depends entirely on alpha, which is the choice this lesson is about.

## Why 0.025

The engine's default alpha is 0.025, a Petrolord choice. A chi-square cutoff at alpha applied to every row of a clean sample will flag about alpha of the rows by chance alone, so a smaller alpha means fewer false flags on a log with many rows. The alternative, 0.05, is a common and reasonable choice. The engine takes 0.025 and writes it into the basis block, and a caller who wants another value passes it.

## The limits of the cutoff

The cutoff rests on two assumptions, and a report should state both.

The first is that the rows are roughly multivariate normal. A sand with two distinct facies, or a log crossing a bed boundary, is not one cloud, and the chi-square quantile then says little about how rare a distance is.

The second is that the centre and covariance are good estimates. They are classical, and outliers pull them. The engine builds no robust covariance, and its basis block labels the covariance "sample covariance (n - 1), classical (not robust)".

## Refusals

The sample covariance of p variables needs at least p + 2 complete rows. With too few, the engine refuses, naming the field `rows`:

> rows need at least p + 2 = 4 complete rows for a sample covariance of 2 variables

If one variable is constant, or a multiple of another, the covariance matrix has no inverse:

> rows have a singular covariance matrix: a variable is constant or one is a linear combination of others

That check uses an absolute pivot test inside the linear algebra library. Variables with very small variance in the caller's units can be refused as singular even when they are not, and rescaling the variables avoids it.

## Exercise

Open the explorer's Mahalanobis view with the oil sand density and neutron. Run it at alpha 0.025, then 0.05, then 0.100000, and confirm 1, 2 and 3 rows flagged and the cutoffs in the table. Then type four rows in which the neutron is exactly twice the density, and read the refusal.
