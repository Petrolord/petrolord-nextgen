# Channelling against coning

Two pictures, opposite treatments. Channelling is water arriving through a path of its own, so a squeeze has something to seal. Coning is water pulled up through the same rock as the oil, so shutting off the bottom perforations lets the cone re-form above them.

{{panel:pd-diagnostic-explorer}}

## Two published shapes on one pair of axes

Both golden histories hold n = 40 samples from t = 10.000000 to 3000.000000 days over 2.477121255 log cycles. What differs is the shape of the derivative.

| Published history | Form | First derivative | Last derivative | Published lateDerivativeSlope |
| --- | --- | --- | --- | --- |
| channelling | a t^m, m = 1.600000000 | 1.273942946 | 11709.651930883 | 1.600000000000 |
| coning | plateau t/(t+tau), plateau 4.000000000, tau 200.000000000 | 0.181405896 | 0.234375000 | -0.555098339661 |

The channelling derivative climbs throughout. The coning derivative barely moves, because a cone reaches the perforations and stops growing.

## The window both slopes were taken over

Neither number means anything without it. The oracle reads series[20:], which starts at t = 186.345364 days, holds 20 of the 40 samples and covers 1.206802663 log cycles, and that is exactly what the classifier reads at its default. Over that window the engine returns slope 1.600000000000 with r2 1.000000000000 on channelling, and slope -0.539955222223 with r2 0.948751314445 on coning.

## Where the two independent routes separate

The published slopes come from Theil-Sen, the median of every pairwise slope, which shares no mean, no square and no covariance with the engine's least squares. On channelling the two agree to 2.220446e-16. On coning they differ by 1.514312e-2, a relative difference of -2.728006e-2, on data with no noise in it, because a plateau is not a power law and the two estimators weight a curved log-log trend differently.

Both answers are right about their own question. Neither is a measurement of a slope that exists.

## The sign, not the size, is the separation

`coningSlope` is -0.1. A rising derivative and a falling one are qualitatively different, which is why the engine calls the coning end the firm end: "The derivative is falling, at a slope of -0.54. The ratio has stopped climbing, which is what a cone does once it has reached the perforations and stopped growing."

The classifier returns mechanism coning, treatable = false, confidence high, ambiguous false. Nothing checked that. The golden publishes a late derivative slope and no expected mechanism, no expected confidence and no expected verdict, so the label is the engine's own assertion.

## The mistake

Ranking the two by how wet the well is. The published coning history ends at a ratio of 3.750000000 and the published channelling history ends at 7318.532456802, and it is the drier of the two that no squeeze will ever help.

## Exercise

Write the published late derivative slope of each history beside the slope the engine returns over that window, and name the window in samples and in log cycles.

Then say which history the two independent routes disagree on, by how much, and why noiseless data can produce a disagreement.
