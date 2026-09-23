# The Mahalanobis distance

{{panel:dq-outliers-explorer}}

Every rule so far has looked at one channel at a time. Logs are read in pairs and triples, and some bad data only shows up when two channels are read together. In a clean sand, bulk density and neutron porosity move against each other: more porosity means lower density and higher neutron. A sample whose density and neutron are each ordinary on their own can still sit off that trend, and no single-channel rule can see it.

EKENE-7's oil sand, density and neutron together, through `mahalanobis`:

| EKENE-7 oil sand, RHOB and NPHI | value |
| --- | --- |
| rows | 60 |
| complete rows used | 48 |
| rows skipped (EKENE-7 entries) | 80 to 91 |
| centre RHOB, g/cm3 | 2.280625 |
| centre NPHI, v/v | 0.243313 |
| covariance RHOB RHOB | 0.003079 |
| covariance RHOB NPHI | -0.001576 |
| covariance NPHI NPHI | 0.001153 |
| correlation, derived | -0.836264 |
| cutoff, chi-square 0.975 on 2 degrees of freedom | 7.377759 |
| rows flagged (EKENE-7 entries) | 60 |

## The distance

For each complete row x, the engine computes the squared distance from the centre:

d^2 = (x - mean)' S^-1 (x - mean)

with the classical mean of each channel and the SAMPLE covariance matrix S, which divides by n - 1. The inverse covariance does the work. It scales each channel by its own spread, as a z-score would, and it also accounts for the correlation, so a step along the trend costs little and a step across it costs a lot.

## Entry 60

Entry 60 is a planted defect: a density of 2.221000 g/cm3 and a neutron of 0.188000 v/v, each inside the sand's range, off the trend together. Its z-scores in the oil sand are -1.074527 on density and -1.645167 on neutron. Neither is unusual, and the z-score run on each channel alone flags 0 entries. Low density should come with high neutron in this sand, and entry 60 has low density with low neutron.

Its squared Mahalanobis distance is 22.397696, far beyond the cutoff of 7.377759, and it is the only row flagged. The correlation of -0.836264 is what makes the difference. Only a distance that knows the correlation sees the pair as unusual.

## Complete rows only

The density has its twelve-sample gap inside the oil sand, entries 80 to 91. A row with a missing value in either channel cannot enter the covariance or be measured, so the engine skips it and lists it. Of 60 rows, 48 were complete and used. The skipped list shows which entries the test never examined.

## Classical estimates, stated

The centre and the covariance are classical estimates, and outliers pull them. A cluster of bad rows can widen the covariance and hide itself, the multivariate form of masking. Robust covariance estimators exist that resist this, and the engine does not build one. Its basis block labels the covariance "sample covariance (n - 1), classical (not robust)", in its own words, so no result is mistaken for a robust one.

## Two variables, one question

The engine takes rows of p variables, and this course uses two so the trend can be pictured. The question is always the same: does this row sit far from the centre of the cloud, measured in the cloud's own shape? The next lesson turns the distance into a flag.

## Exercise

Open the explorer's Mahalanobis view with the oil sand density as the first variable and neutron as the second. Confirm 48 complete rows used, the skipped rows at the density gap, the cutoff of 7.377759 and the single flag at entry 60. Then switch to the z view, load the oil sand density, and check that no entry is flagged there. State in one sentence what entry 60 has that neither single channel shows.
