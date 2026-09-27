# The Monte Carlo underneath

{{panel:prms-aggregation-calculator}}

The arithmetic sum adds estimates. A probabilistic total adds outcomes: it draws a value for every project many times, adds each draw across the projects, and reads the low, best and high off the distribution of those totals. The engine does this with the canonical seeded Monte Carlo of lib/stats. Distributions, correlation and Monte Carlo as a subject belong to the uncertainty course; this module uses the sampler and reads what it returns.

## What the engine imports

The engine carries no sampler of its own. Its basis names what it calls, verbatim:

> lib/stats/stats.js: createCorrelatedSampler (Gaussian copula, Cholesky), mulberry32, fitTriangularToPercentiles, quantile

mulberry32 is the seeded random number generator; createCorrelatedSampler draws the projects together with the stated correlation; fitTriangularToPercentiles fits a triangular through stated estimates; quantile reads the percentiles of the totals.

## How the low is read

The engine's labels line, verbatim:

> lib/conventions/percentile.js (P90 = the 0.1 quantile of the totals, the low estimate)

The sampled totals are sorted, and the value with a tenth of them below it is the low: 90 percent of the draws meet or exceed it. That is a reading the engine states. The alternative it names reads the P90 at the 0.9 quantile, which would turn the label upside down. This course follows the convention of lib/conventions/percentile.js throughout: P90 is always the low estimate.

## The Ekene Reserves, sampled

With the stated pair correlations (EKN-1 and EKN-2 0.5, EKN-1 and EKN-U 0.2, EKN-2 and EKN-U 0.2), seed 20271112 and 20000 draws, the engine's reason reads, verbatim:

> statistical aggregation (canonical Monte Carlo, seed 20271112, 20000 iterations): P90 17.300834, P50 26.430497, P10 36.465253, mean 26.699904 MMbbl

| outcome | a seeded Monte Carlo estimate on seed 20271112 and 20000 draws |
| --- | --- |
| P90 | 17.300834 |
| P50 | 26.430497 |
| P10 | 36.465253 |
| sampled mean | 26.699904 |

Each figure is an estimate. The same seed and draws reproduce it exactly on any machine; a different seed gives a slightly different figure. The course prints every sampled figure with its seed and draw count, and grades none of them.

## What is exact beside it

The same call returns exact figures too: each project's low, best, high and mean, the arithmetic sums, and the sum of the means. On Ekene the sum of the means is 26.821102, exact, against the sampled mean of 26.699904; the gap is sampling error.

## What the calculator shows

The Monte Carlo table in the calculator carries its own heading: a seeded Monte Carlo estimate on the stated seed and draws, marked as not graded. The seed and the draw count each have a visible control, and neither has a default.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". Read the Monte Carlo table and its heading, and find the seed and the draws in the Seed (stated) and Draws (stated) controls. Read the two engine notes under the reasons and name the function each import performs. Then write the P90, P50 and P10 as a report would, each with its seed, draws and correlation.
