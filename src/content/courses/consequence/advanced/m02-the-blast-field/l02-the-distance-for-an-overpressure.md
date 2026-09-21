# The distance for an overpressure

{{panel:cq-harm}}

The question a plan usually asks runs backwards: how far from the charge does a stated overpressure still reach? An emergency plan or a layout review acts on that distance directly. The engine answers with `distanceForOverpressure`, which inverts the Kinney and Graham fit.

## Bisection on Z

The engine inverts the fit by searching. Its method, verbatim: "inverse of the Kinney and Graham fit by bisection on Z". It brackets the scaled distance at which the fit gives your target overpressure, halves the bracket until it is tight, and then converts that Z back to a distance with the charge you stated. The search runs on Z because the fit only knows Z; the charge enters once, at the end, through cube root scaling.

BONGA's 500 kg of TNT, at five target overpressures (stated):

| overpressure Pa, stated | Z m/kg^(1/3) | distance m |
| --- | --- | --- |
| 100000 | 2.749433 | 21.822266 |
| 50000 | 3.791181 | 30.090623 |
| 20000 | 6.227368 | 49.426650 |
| 10000 | 9.988894 | 79.281907 |
| 5000 | 17.786268 | 141.169703 |

Halving the target from 10000 to 5000 Pa takes the distance from 79.281907 m to 141.169703 m. In the tail of the curve a modest drop in the target overpressure pushes the distance a long way out.

## The round trip

Every row of that table round trips through the forward fit: feed the distance back in with the same charge and the engine returns the target overpressure. That is the check you should run on any inverse you quote. The forward table of the previous lesson gives a second, independent look. At 50 m the forward fit returned 19626.657230 Pa, just under 20000 Pa, and the inverse puts 20000 Pa at 49.426650 m, just inside 50 m.

The inverse is graded in this course alongside the forward fit, because the same published column stands behind both. A capstone grades the distance itself, at the six decimals this course prints.

## Where the inversion refuses

The fit gives overpressures only over Z from 0.05 to 40. A target too small to occur inside that span, or too large, has no Z to find, and the engine refuses:

> overpressurePa: lies outside the overpressures the fit gives over Z = 0.05 to 40 m/kg^(1/3)

For BONGA's charge the far edge of the span sits beyond 300 m, where the forward fit gave 2247.931733 Pa. A target below the edge ratio of 0.020934 times ambient is refused. The refusal carries no distance, because any distance it gave would come from outside the range the fit is used over.

## Reading a distance in a note

A distance for an overpressure is only as good as the charge behind it. If the charge came from a fuel mass, the yield factor chose it, and the TNT equivalence is a single route quantity with no second check. Write the stated TNT mass beside every distance, and write the target overpressure with its unit.

## Exercise

On the harm panel's blast view, enter 500 kg of TNT and each target in the table above, and confirm the five distances. Take the 10000 Pa row and run it forward at 79.281907 m to confirm the round trip, to within the rounding of the typed distance. Then enter a target of 1000 Pa, record whether the engine returns a distance or a refusal, and name the field.
