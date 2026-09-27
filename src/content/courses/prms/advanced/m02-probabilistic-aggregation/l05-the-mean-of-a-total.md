# The mean of a total

{{panel:prms-aggregation-calculator}}

The low and the high of a total depend on how its projects move together. The mean of a total does not. Whatever the correlation, the mean of a sum is the sum of the means, and the engine computes that exactly beside every sampled total.

## The engine's line

On the Ekene Reserves at the field level, verbatim:

> the mean of the total is the sum of the means (no portfolio effect in means, PRMS 4.2.5.2): 26.821102 exact, 26.699904 sampled

The exact figure adds three closed-form means: 16.821102 for EKN-1, 6.000000 for EKN-2 and 4.000000 for EKN-U. The sampled figure is the average of 20000 totals on seed 20271112, an estimate.

## Why no portfolio effect in means

A portfolio effect is what the previous lessons showed on the low and the high: with independence, the total's low sits above the sum of the lows and its high below the sum of the highs. The mean shows no such effect. Averages add, whether the projects move together, apart or not at all. The correlation reshapes the spread of the total around its mean; it does not move the mean.

## The four runs

The same projects under four stated correlations, each on seed 20271112 and 20000 draws. The sampled means are estimates:

| correlation (stated) | sampled mean | exact sum of the means |
| --- | --- | --- |
| uniform -0.4 | 26.737094 | 26.821102 |
| uniform 0 | 26.711647 | 26.821102 |
| pairs: 0.5, 0.2, 0.2 | 26.699904 | 26.821102 |
| uniform 0.95 | 26.703026 | 26.821102 |

The exact column is the same on every row. The sampled means differ from it, and from each other, by the sampling error of each run.

## The mean and the best estimate

The mean is a different figure from the best estimate. The Ekene arithmetic 2P is 26.396958, the sum of three best estimates, and the sampled P50 is 26.430497 on the stated seed and draws; the exact sum of the means is 26.821102. For a skewed distribution the mean sits apart from the P50. EKN-1's fitted triangular has a best estimate of 16.650000 and a mean of 16.821102; EKN-2's lognormal has a best estimate of 5.746958 and a mean of 6.000000.

## Why the mean matters in this tier

The mean is the figure risking works on. A risked mean multiplies each project's mean by a stated chance and adds the products, and because means add without a portfolio effect, that sum is exact. The next module computes it on the Ekene Contingent Resources. The tile "Sum of the means" is the unrisked figure it starts from.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the mean column of the project table and add it up; compare your sum with the "Sum of the means" tile. Read the sampled mean in the Monte Carlo table. Then switch to "Ekene Reserves, a negative correlation" and "Ekene Reserves, strongly correlated" and write, for each, the sum of the means and the sampled mean with its seed and draws. Say which figure moved.
