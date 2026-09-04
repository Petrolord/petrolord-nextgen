# Skin adds undivided

A radius enters through a logarithm and a skin enters as itself, so one unit of skin outweighs most of the geometry.

{{panel:pd-diagnostic-explorer}}

## The denominator against skin, on the published geometry

| Skin | Denominator | Flow efficiency against an undamaged well |
| --- | --- | --- |
| -3.0 | 4.900724584 | 1.612154376 |
| -2.0 | 5.900724584 | 1.338941425 |
| -1.0 | 6.900724584 | 1.144912319 |
| 0.0 | 7.900724584 | 1.000000000 |
| 1.0 | 8.900724584 | 0.887649596 |
| 2.0 | 9.900724584 | 0.797994583 |
| 4.0 | 11.900724584 | 0.663886012 |
| 6.0 | 13.900724584 | 0.568367824 |
| 8.0 | 15.900724584 | 0.496878274 |

Every unit of skin moves the denominator by exactly one. The efficiency column does not step evenly, because it is one denominator divided into another.

## The same unit of skin is worth different money

A derived sweep on the published geometry, removing one unit from different starting points.

| Skin removed | Multiplier | Uplift, percent |
| --- | --- | --- |
| 20.0 to 19.0 | 1.037173720 | 3.717372 |
| 12.0 to 11.0 | 1.052908025 | 5.290802 |
| 8.0 to 7.0 | 1.067110830 | 6.711083 |
| 5.0 to 4.0 | 1.084028497 | 8.402850 |
| 3.0 to 2.0 | 1.101002709 | 10.100271 |
| 2.0 to 1.0 | 1.112350404 | 11.235040 |
| 1.0 to 0.0 | 1.126570669 | 12.657067 |

The heavily damaged well gains least per unit, not most, because the unit is a smaller share of a bigger denominator. Removing all of the damage is a different question: the published pair 12.000 down to -3.000 returns 4.060771880315.

## The mistake

Quoting an uplift percentage without the skin it starts from. An uplift of 3.717372 percent and one of 12.657067 percent are the same treatment, one unit of skin, on the same geometry. A vendor who promises a percentage has said nothing until they name the skin they start from and the skin they claim to reach. Both are inputs somebody typed, and neither is measured here.

The other half of it is arguing over a skin of 6.0 against 8.0, at efficiencies of 0.568367824 and 0.496878274, when the design question is the after-skin.

## What it refuses

`skinPiMultiplier` returns exactly 1.000000000000000 when the skin does not change, a departure from one of 0.0000e+0, so it refuses to credit a job that moved nothing. On a geometry it cannot use it refuses with an object rather than a number, ok = false, and the message reads "The drainage and wellbore radii are needed, and the drainage radius has to be the larger one."

What it does not refuse is an after-skin no treatment can reach. That gate sits somewhere else and it is not where the refusal text says it is.

## Exercise

Read the multiplier for 8.0 down to 7.0 and for 1.0 down to 0.0.

Then say which of the two wells a contractor paid on percentage uplift would rather have, and why it is not the more damaged one.
