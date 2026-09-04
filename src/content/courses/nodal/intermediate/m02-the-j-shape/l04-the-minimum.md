# The minimum

The most quoted number in outflow work, and the engine never solves for it. It reads it off a grid.

{{panel:pd-vlp-explorer}}

## A reduction over rows

The module samples the outflow at a list of rates and returns the smallest pressure it found with the rate it was found at. The injected outflow is an arbitrary callable, so there is no derivative to take and no promise of smoothness. A reduction works on anything, and it is only as good as its grid.

| Well | Sample count | Sampled minimum rate, stb/d | Sampled minimum bhp, psia |
| --- | --- | --- | --- |
| BONNY-7 | 37 points | 604.341111 | 1477.003621 |
| FORCADOS-3 | 65 points | 1811.804452 | 2348.447272 |

Resampled at 20001 points, BONNY-7 bottoms at 627.069742 stb/d and 1476.243252 psia, FORCADOS-3 at 1843.619418 stb/d and 2348.191408 psia. The rate gaps are 22.728631 and 31.814966 stb/d. The pressure gaps are 0.76036884 and 0.25586360 psi.

## Why the rate is the fragile half

Tens of stb/d wrong in rate, under a psi wrong in pressure, on both wells. That pattern is guaranteed, not lucky. A minimum is a point of zero slope, so the curve is flat there, and over a flat region a large error in position buys a tiny error in height.

The flatness that makes the minimum PRESSURE robust is exactly what makes the minimum RATE fragile. One fact seen from two sides, and no amount of care in the sampling changes the trade.

FORCADOS-3 is the extreme version because its bottom is shallow. Its rows read 2434.793500 psia at 1295.33 stb/d, 2370.754916 at 1553.57, 2348.447272 at 1811.80, 2360.438061 at 2070.04 and 2401.733388 at 2328.28. Four consecutive samples inside a few tens of psi, so there is barely a bottom in the pressures for a grid to find.

## The reporting form

State the minimum pressure, which is reliable. State the minimum rate. State the sample count, because without it nobody downstream can tell whether 604.341111 stb/d is good to the last figure or sits in a band tens of stb/d wide.

Then never let a design margin be narrower than the resolution of the curve it was measured on. BONNY-7's sampled bottom is 604.341111 stb/d against a true 627.069742 stb/d, so a floor set a little above the sampled figure sits BELOW the rate at which the curve turns. That is the one place a loading floor must never be.

## What it refuses

It refuses an error bar. The pair arrives bare, and the 22.728631 stb/d gap is visible only because somebody resampled. It refuses to say the well is loading or what rate it makes: that needs the reservoir's curve.

And a reduction always returns something, even where no bottom exists. The published dry gas curve reports 13.289296 Mscf/d at 952.986300 psia, the left edge of a 25 point window on a monotone curve.

## The mistake

Quoting a minimum to four figures off a 25 point curve. That quotes the grid, not the well.

## Exercise

In the panel, read BONNY-7's sampled minimum and its finely sampled minimum, and write the rate gap and the pressure gap side by side.

Then say which of the two you would put a design margin against, and why the other one cannot carry it.
