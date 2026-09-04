# The static gradient

Set the rate to zero and the friction group vanishes, leaving the cleanest column in the engine and the easiest to misread.

{{panel:pd-vlp-explorer}}

## What zero rate does

The integrand's denominator holds the squared density group scaled by the elevation ratio, plus the friction group. At zero rate the friction group is zero and the integrand collapses to a reciprocal of the density group: smooth, slowly varying, with no competing terms to bend it.

The golden staticVertical column, 8000 ft vertical, 2.441 in, 0.65 gravity, a wellhead at 800 psia and 100 degF, 200 degF at the shoe, 0 MMscf/d, converges to 952.982971 psia with a midpoint of 877.111721 psia.

BONNY-7's static injection column, 6700 ft, gravity 0.61, a wellhead at 640 psia and 84 degF, 176 degF at the shoe, converges to 735.995592 psia. At the sixteen sub-intervals it runs at it reads 735.995265 psia with a midpoint of 688.588305 psia, and a gradient of 0.01432765 psi/ft.

## The number to internalise

0.01432765 psi/ft. Nearly seven thousand feet of gas, worth under a hundred psi.

BONNY-7's tubing, dead, at a wellhead pressure of 420 psia, stands at 2570 psia. Two columns in one hole, an order of magnitude apart. Gas lift replaces a heavy fluid with a light one, it does not push.

FORCADOS-3's lift gas column reports 0.15674503 psi/ft, but it is not static: it carries 10.5 MMscf/d through 2.125 in at a friction group of 0.02721909, and most of that figure is friction. A reported gradient is static only when the rate is zero.

## The gradient is an average, not a local property

It is the total rise over the total depth, back-calculated from the ends. The midpoints prove it: 688.588305 psia on BONNY-7 against ends of 640 and 735.995592 psia, 877.111721 psia on the golden case against 800 and 952.982971 psia. Both land above the straight line joining their ends by under a psi, too small to catch by eye and too systematic to be noise.

Descend and pressure rises, steepening the gradient, while absolute temperature rises, easing it. On BONNY-7 the temperature change is proportionally larger, so the gradient eases with depth and the profile bows above the chord. The compressibility factor agrees: 0.93241456 averaged over the column against 0.91517071 at the wellhead.

## Static against flowing, same string

| Case | MMscf/d | Bottomhole, psia | Midpoint, psia |
| --- | --- | --- | --- |
| staticVertical | 0 | 952.982971 | 877.111721 |
| flowingVertical | 4 | 1069.628989 | 934.181862 |
| flowingHighRate | 9 | 1437.879989 | 1130.753380 |

Almost all the extra pressure the highest rate column needs is friction, and its midpoint has pulled far clear of the straight line between its ends, because friction loss concentrates where the gas is thinnest and fastest, near the top.

## The mistake

Borrowing a psi/ft figure and multiplying. It fails twice: the borrowed gradient belongs to another column, and even the correct average is wrong at an intermediate depth because the profile is not straight. If you want a pressure at a depth, run the column to that depth.

## Exercise

Record BONNY-7's wellhead pressure, converged bottomhole pressure, gradient and midpoint. State whether the midpoint sits above or below the straight line joining the ends, and name the input that decides it.
