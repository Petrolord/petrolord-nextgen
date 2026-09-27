# Correlation between projects

{{panel:prms-aggregation-calculator}}

Two projects in one field often share a cause: the same oil price, the same reservoir model, the same aquifer. When one comes in low, the other tends to as well. The engine takes that tendency as a stated correlation with no default, cites PRMS 4.2.5.3 beside it, and refuses a call that leaves it out.

## Four correlations, one set of projects

The Ekene Reserves were run under four stated correlations, each on seed 20271112 and 20000 draws. Every sampled figure below is an estimate, printed with its seed and draws; none is graded:

| correlation (stated) | P90 | P10 | arithmetic 1P | arithmetic 3P |
| --- | --- | --- | --- | --- |
| uniform -0.4 | 20.009881 | 33.799166 | 15.809794 | 38.387162 |
| uniform 0 | 18.487436 | 35.154764 | 15.809794 | 38.387162 |
| pairs: 0.5, 0.2, 0.2 | 17.300834 | 36.465253 | 15.809794 | 38.387162 |
| uniform 0.95 | 15.891238 | 38.110353 | 15.809794 | 38.387162 |

As the stated correlation rises, the sampled P90 moves down toward the arithmetic 1P, and the sampled P10 moves up toward the arithmetic 3P. The arithmetic columns do not move at all: the arithmetic sum does not read the correlation. A negative correlation spreads the other way, so the sampled low climbs further above the sum of the lows.

## Stated two ways

A correlation is either one figure for every pair (type "uniform" with a rho) or one figure for each pair (type "pairs"). With three varying projects there are three pairs, and every one must be stated; a correlation of 0 is entered like any other. The refusals, verbatim:

> correlation must be an object { type: "uniform", rho } or { type: "pairs", pairs } (stated; no default); got nothing

> correlation.pairs must be one pair for each of the 3 pairs of varying projects (a correlation of 0 is entered as a pair like any other); the first missing pair is EKN-2 and EKN-U; got "2 pairs"

A pair stated twice is refused, and so is a pair naming a constant project, since a constant does not vary.

## The limits of a correlation

The canonical sampler takes a correlation strictly between -1 and 1. A correlation of 0.999 is accepted; a correlation of 1 is refused, verbatim:

> correlation.rho must be a number above -1 and below 1 (the canonical sampler takes a correlation strictly between -1 and 1); got 1

A set of correlations must also fit together. Three projects cannot all be strongly negatively correlated with each other: if the first moves against the second and the second against the third, the first and third must move together. The engine tests the matrix through its Cholesky factor, and refuses one that is not positive semidefinite, verbatim:

> correlation must be a positive semidefinite correlation matrix (the Cholesky factor misses the stated matrix by 0.8); got {"type":"uniform","rho":-0.6}

A uniform -0.4 on three projects passes that test; a uniform -0.6 does not.

## What a report carries

A sampled total is quoted with its correlation, its seed and its draws, because each moves it.

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves, independent". Read the P90 and the P10 with their seed and draws. Set the Correlation for every pair (stated) control to 0.95 and read them again, then compare with the start "Ekene Reserves, strongly correlated". Next set it to 1 and read the refusal, then to -0.6 and read the other one. Finally set the Correlation (stated) control to "not stated" and read what the engine asks for.
