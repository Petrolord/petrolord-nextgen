# Exact on a power law

Hand `logLogSlope` a true power law and it returns the exponent with nothing left over. That is what makes it a good estimator, and it is the same property that makes a perfect fit useless as evidence for one mechanism over another.

{{panel:pd-diagnostic-explorer}}

## Nothing left over

The golden case is eleven points on y = a x^m with a published true slope of 1.350000000000. Fitted over all eleven, spanning 2.000000000 log cycles, the engine returns a slope of 1.350000000000, an intercept of 1.308332819650 and an r-squared of 1.000000000000. The derived difference from the published slope is 0.0000e+0, from the published intercept 0.0000e+0, and the shortfall from a perfect fit is 0.0000e+0. Exact zeros, not small numbers.

## Two estimators with nothing in common

The oracle checks the slope by Theil-Sen, the median of every pairwise slope: no mean, no square and no covariance in common with the engine's least squares. On the published channelling history, read over samples 20 onward starting at t = 186.345364 days, 20 of the 40 samples and 1.206802663 log cycles, the derived difference between the two routes is 2.220446e-16, relative 1.387779e-16. On the published displacement history over that window it is 4.440892e-16. Agreement at that size is about arithmetic and nothing else.

## The ratio and its derivative return the same slope

| Published history | Form | Ratio slope | Derivative slope | Derivative r-squared |
| --- | --- | --- | --- | --- |
| channelling | a t^m, m = 1.600000000 | 1.600000000 | 1.600000000 | 1.000000000 |
| displacement | a t | 1.000000000 | 1.000000000 | 1.000000000 |
| coning | plateau t/(t+tau) | 0.230022389 | -0.539955222 | 0.948751314 |
| flat | constant | 0.000000000 | n/a | n/a |

Those are derived readings of published histories, every one over the window starting at t = 186.345364 days. The first two rows are power laws and each returns one number twice. Differentiate a power law and the result is another power law with the same exponent, so the ratio and its derivative lie on parallel lines in log space.

## Where the exactness stops

The coning history is a plateau form with tau = 200.000000000 and plateau = 4.000000000, which is not a power law. Over that same window the engine returns -0.539955222223 with an r-squared of 0.948751314445, while the published Theil-Sen value is -0.555098339661: a difference of 1.514312e-2, relative -2.728006e-2. There is no noise anywhere in that series. The two estimators weight a curved log-log trend differently and both are right about their own question. Neither is measuring a slope that exists.

## The mistake

Treating exactness as a result about the well. The fit is exact on the channelling history at 1.600000000 and exact on the displacement history at 1.000000000, both at an r-squared of 1.000000000, and the only thing standing between those two verdicts is steepness measured against a threshold of 1.3.

## Exercise

Write the engine's slope, intercept and r-squared on the eleven published power-law points, and the derived difference of each from the published value.

Then write the ratio slope and the derivative slope of the published channelling history, name the window they were taken over, and say what a reader learns about the mechanism from their being equal.
