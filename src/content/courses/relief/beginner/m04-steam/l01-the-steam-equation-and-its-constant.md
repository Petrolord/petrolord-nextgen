# The steam equation and its constant

{{panel:fc-sizing-explorer}}

The steam route is the simplest of the three in this tier. There is no branch, no loop and no gas property to state. A flow, a relieving pressure, three coefficients and one correction produce an area.

## What it needs, and what it does not

The gas route needs a molecular weight, a compressibility, a temperature and an isentropic exponent. The steam route needs none of them, because saturated steam at a stated pressure is a defined state, and the published equation folds all of that into one leading constant.

That constant is 51.500000000000, recovered from one steam area taken below the Napier threshold at unit coefficients. The validation oracle checks the same constant against the published SI form of the equation, and it checks the correction against the standard's own SI statement of it, so on this route two published statements of the same method are made to meet.

## TEBIDABA, stated and worked

TEBIDABA is the steam stream of this tier. It states 94000.0000 lb/hr, a set pressure of 1740.000000 psig, a 10.000000 percent overpressure allowance, a Kd of 0.975000, a Kb of 1.000000, a Kc of 1.000000 and a KSH of 1.000000, which is the saturated value.

Worked through, the relieving pressure is 1928.700000 psia, the correction is 1.021727, the required area is 0.949984 in2, and the orifice is J at 1.287000 in2 with a margin of 1.354759.

## Below the threshold there is no correction at all

The correction is exactly one up to a published threshold pressure, so at any relieving pressure below that threshold the equation is the bare one. These three rows, at the TEBIDABA load, are all below it.

| relieving psia (stated) | KN | required area in2 |
| --- | --- | --- |
| 1000.000000 | 1.000000 | 1.872044 |
| 1400.000000 | 1.000000 | 1.337174 |
| 1500.000000 | 1.000000 | 1.248029 |

The direction is the one you would expect and the reason is worth saying out loud. The required area falls as the relieving pressure rises, because a higher pressure pushes more mass through the same hole, so less hole is needed for the same flow. Every row above has a correction of exactly 1.000000, so nothing in that column confounds the reading.

Do not divide one of those three areas by another. The course prints no ratio between them, so a quotient formed here rests on nothing.

## Which return fields to read

A steam call comes back with three things: the area, the correction the engine worked out, and a warning slot that is empty on these three rows. The correction is returned rather than hidden, which matters, because on this route the correction is the only part of the answer a reader cannot reconstruct by eye.

## Exercise

List what the steam route needs handed to it and name the four inputs the gas route needs that it does not. Then work the TEBIDABA relieving pressure from its stated set pressure and allowance, and say what the correction was at that pressure.
