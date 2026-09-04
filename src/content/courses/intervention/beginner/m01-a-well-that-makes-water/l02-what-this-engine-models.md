# What this engine models

Five exported calculations and two lookup tables. The whole module is a diagnostic: it names a picture and it prices removing skin, and it sizes no treatment anywhere.

## The five calculations

| Function | What it returns |
| --- | --- |
| logLogSlope | ordinary least squares of ln y against ln x over a window: a slope, an intercept, an r-squared, a point count and a span in log cycles |
| pssDenominator | ln(re/rw) - 3/4 + S, the group productivity is inversely proportional to |
| minimumSkin | the skin at which that group reaches zero and the productivity index goes infinite |
| skinPiMultiplier | what removing skin is worth, as a ratio of two of those groups |
| skinFromPiRatio | the skin implied by a measured uplift |

The two lookups are the mechanism table, carrying a label, a treatable flag and a note for channelling, coning, displacement and indeterminate, and the treatment table, carrying seven treatments and what each addresses. Neither computes anything.

## logLogSlope knows nothing about wells

It is arithmetic on two columns. Hand it the published power law of eleven points on y = a x^m and it returns slope 1.350000000000, intercept 1.308332819650, r2 1.000000000000, n = 11 and a span of 2.000000000 log cycles, fitted over all eleven points, x from 1.000000 to 100.000000. The published Theil-Sen slope through the same points is 1.350000000000 and its intercept 1.308332819650, so the difference on both is 0.0000e+0. Those are golden values and a derived re-run against them.

Nothing in that call knows the x axis was days or the y axis a ratio.

## The geometry side sizes nothing either

On the published geometry, re = 2000.000000 ft and rw = 0.350000 ft, minimumSkin returns -7.900724584041 against a published -7.900724584041. Removing a skin of 8.000 down to 0.000 returns a multiplier of 2.012565355861, matching the published value exactly. A multiplier is a fold increase, not a rate: no barrels, no pressure and no time appear in the return.

## The one dimensional number

The only number with a unit that this module produces itself is the start of the late window, in days. Everything else it returns is dimensionless, a boolean or a string. Slopes, intercepts, fit qualities and spans carry no unit, and the pseudo-steady-state group and the skin do not either.

## What the oracle actually checks

Two functions. The log-log slope, by Theil-Sen, the median of every pairwise slope, which shares no mean, no square and no covariance with least squares. The skin uplift, by a full radial Darcy rate in SI, permeability in square metres and pressures in pascals, divided as two real flow rates. The classifier, the screening, the ranking and the inverse skin are asserted against nothing at all.

## Exercise

List the five calculations and write beside each one whether it takes a series, a geometry, or both.

Then write the published power law return in full, all five members, and say which of them the classifier never reads.
