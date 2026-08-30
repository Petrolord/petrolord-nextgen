# The axial adjusted yield

One closed form, and it is an ellipse.

{{panel:ct-rating-explorer}}

## The formula

    Ypa = Yp x [ sqrt(1 - 0.75 x r squared) - 0.5 x r ]

with r the axial stress divided by the yield strength.

At r of zero it gives Yp exactly. At r of one it gives zero. In between it falls smoothly and it is always below the straight line between those two points.

## Where the shape comes from

It is the von Mises ellipse solved for the hoop stress. Set the equivalent stress equal to the yield strength with one axial stress and one hoop stress and no radial one, and solve the quadratic for the hoop stress. The negative root is the compressive branch, and that branch is this formula.

So it is not a fit. The 0.75 and the 0.5 are the coefficients that fall out of the quadratic.

## The curve, at L-80

| axial as a fraction of yield | adjusted yield (Pa) | as a fraction |
|---|---|---|
| 0 | 551580560 | 1 |
| 0.2 | 488085794.16750646 | 0.8848857801796105 |
| 0.4 | 407112318.2872466 | 0.738083151964686 |
| 0.6 | 305796469.04843414 | 0.5544003745317532 |
| 0.8 | 177118174.32582825 | 0.3211102550927978 |
| 1.0 | 0 | 0 |

The fractions in the last column are the same for every grade, because the formula depends on r only.

## What the engine does with it

    Ypa goes into the same four formulas, with the same three boundaries recomputed from it.

Two things therefore happen at once when tension is applied. The collapse value falls, and the regime boundaries move, so the pipe can change regime.

## Compression

The engine applies this only for POSITIVE axial stress. Compression would raise the collapse resistance by the same argument, and API does not credit it, so neither does the engine: the derating is applied when the pipe is in tension and skipped otherwise.

## Yield exhausted

If the axial stress reaches the yield strength, the adjusted yield is zero and there is nothing left to resist collapse. The engine returns a collapse pressure of zero and a regime named yield-exhausted rather than dividing by zero somewhere inside a polynomial.

## Exercise

Compute the adjusted yield fraction at r of 0.5 by hand from the formula, and check it against 0.6513878188659973.

Then say, without computing anything, whether the fraction at r of 0.5 is more or less than half, and why the answer is not obvious from the endpoints alone.
