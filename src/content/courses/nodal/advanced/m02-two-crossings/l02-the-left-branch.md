# The left branch

A genuine solution of the equations, and a place no well has ever produced from. Both halves matter.

{{panel:pd-node-explorer}}

## A real root

FORCADOS-3 reports an unstable heading crossing at 234.488087 stb/d and 3570.828888 psia beside an operating point at 2125.009203 stb/d and 2366.909222 psia. At the lower rate the two curves genuinely read the same pressure.

## Why it does not hold

The residual falls through that root: +575.820837 psi at 4.135950 stb/d, zero at the crossing, then down to -509.628610 psi at 985.078572 stb/d.

Nudge the rate up and the residual is negative, so the well accelerates, and it does not stop until the residual returns to zero at 2125.009203 stb/d. Nudge it down and the residual is positive, so the well slows, and nothing below catches it. Disturbances in both directions grow.

The upper crossing has the opposite arrangement, negative below and rising to +3284.465003 psi above, so disturbances decay.

## Which limb each sits on

FORCADOS-3's true tubing minimum is 2348.191408 psia at 1843.619418 stb/d. The lower crossing is far to the left of it and far above it; the upper sits 281.389786 stb/d right of it and 18.717814 psi above it, with the flag the operating point is on the rising friction limb set to yes.

Near the lower crossing the column is nearly dead weight: at 262.37 stb/d the gravity term is 2537.939031 psi against a friction term of 7.228229 psi, a gravity share of 0.99716002. Extra rate buys a large weight reduction for almost nothing, which is why the tubing requirement falls so steeply there.

## The reporting trap

A solver returning the first sign change returns 234.488087 stb/d.

| Reported quantity | Lower crossing | Operating point |
| --- | --- | --- |
| Rate, stb/d | 234.488087 | 2125.009203 |
| Flowing pressure, psia | 3570.828888 | 2366.909222 |
| Stability verdict | unstable | stable |

The two are 1890.521117 stb/d apart, the full stable window width. A rate in the low hundreds at 3570.828888 psia against a reservoir pressure of 3720 psia reads as a tight well produced gently, and nothing announces it as wrong.

The golden compositeTwoCrossings notes that the operating point is the reduction over the two crossings, not the first found, and reports 44.984487 stb/d marked stable no beside 1787.246675 stb/d marked stable yes. The parabola case analyticResidualWide does the same at 800.000000 and 1200.000000 stb/d, where both roots and both signs are exact algebra with no search anywhere in the oracle.

## The opposite mistake

Discarding the lower crossing throws away the most useful number on the well. It is the threshold: below 234.488087 stb/d FORCADOS-3 loses itself, above it the physics carries the well up unaided. Gas lift, kick-off and unloading exist to clear that number.

It moves. FORCADOS-3's window is 2064.445505 stb/d at a wellhead pressure of 860 psia and 1473.513228 stb/d at 1160 psia, so choking the well raises its threshold.

## What it refuses

No amplitude, no period, no time constant. The model says only that the equilibrium is not one the well returns to.

## Exercise

Record both crossing rates, both pressures and the stable window width.

Then read the residual just below and just above the lower crossing and say what each sign predicts the well will do next.
