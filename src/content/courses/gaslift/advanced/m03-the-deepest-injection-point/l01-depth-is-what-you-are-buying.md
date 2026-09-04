# Depth is what you are buying

Surface pressure is the thing a compressor sells and depth is the thing a well needs. The deepest injection point is the exchange rate between them.

{{panel:pd-unloading-explorer}}

## The exchange rate, walked

On the published injection point case, a 9 row flowing traverse from 164.7000 psia at 0.0 ft to 1146.7000 psia at 8000.0 ft, with a transfer differential of 100.0 psi and gas of 0.65 gravity:

| Surface injection, psia | Depth bought, ft | Limited by |
| --- | --- | --- |
| 814.7 | 5720.258653058 | pressure |
| 864.7 | 6227.361380141 | pressure |
| 914.7 | 6732.128853068 | pressure |
| 964.7 | 7236.797664483 | pressure |
| 1014.7 | 7739.815725361 | pressure |
| 1064.7 | 8000.000000000 | depth |
| 1114.7 | 8000.000000000 | depth |

Every step down that column moves the crossing several hundred feet deeper, at a steady rate, right up to the point where it buys nothing at all.

## Where the purchase stops

The last three rows are not a crossing. When the gas still wins at the deepest tabulated row the function returns that row and labels the result depth rather than pressure. At 1114.7 psia the injection pressure there is 1705.371137408 psia against a production pressure of 1146.7000 psia, which are hundreds of psi apart and nowhere near the 100.0 psi transfer differential. The answer 8000.000000000 ft means the table ran out, and the same number is returned for 1064.7, 1114.7 and 1164.7 psia.

## The other end of the same behaviour

Push the surface pressure down and the depth collapses faster than the pressure does: 714.7 psia buys 4703.296676249 ft, 514.7 psia buys 2647.944878219 ft, and 314.7 psia buys 538.553047921 ft. When the gas loses at the very first tabulated row the function returns a depth of 0 and still calls it limited by pressure, which is its way of saying the well will not lift on this injection pressure at all.

## The mistake

Reading 8000.000000000 ft as an achievement. Three of the seven rows report the same depth, so two compressor settings that both saturate report the same answer even though one of them has far more injection pressure in hand at the bottom row than the other. The limitedBy field is the only thing separating them, and it is easy to skip.

## What it refuses

The module never says what the extra depth is worth. There is no inflow relation in it, so a deeper point of injection cannot be converted into rate, drawdown or revenue anywhere inside this function. It reports feet, and turning feet into barrels is a nodal calculation somebody else has to do.

## Exercise

Walk the surface injection pressure from 814.7 to 1114.7 psia in the panel and record the depth and the limitedBy value at each step.

Then say at which setting the exchange rate goes to zero, and which field in the output told you.
