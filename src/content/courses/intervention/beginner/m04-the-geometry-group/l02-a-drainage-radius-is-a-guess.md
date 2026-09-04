# A drainage radius is a guess

The radii enter through a logarithm, which forgives a bad guess. The skin enters undivided, which does not.

{{panel:pd-diagnostic-explorer}}

## A twentyfold range of drainage radius, on the published wellbore radius

Sweeping the drainage radius across a factor of twenty, holding the published rw of 0.35 ft, moves the zero-skin denominator by 2.995732274 in total.

| Drainage radius, ft | ln(re/rw) | Denominator at zero skin | Floor |
| --- | --- | --- | --- |
| 500 | 7.264430223 | 6.514430223 | -6.514430223 |
| 1000 | 7.957577403 | 7.207577403 | -7.207577403 |
| 1500 | 8.363042512 | 7.613042512 | -7.613042512 |
| 2000 | 8.650724584 | 7.900724584 | -7.900724584 |
| 3000 | 9.056189692 | 8.306189692 | -8.306189692 |
| 5000 | 9.567015316 | 8.817015316 | -8.817015316 |
| 10000 | 10.260162496 | 9.510162496 | -9.510162496 |

Those are derived sweep points on the published wellbore radius, not published cases. The published geometry itself is the 2000 ft row.

## The skin covers that whole sweep on its own

On the same geometry the denominator at a skin of 0.0 is 7.900724584 and at a skin of -3.0 it is 4.900724584. Those two rows sit further apart than the entire twentyfold radius sweep does. Three units of skin are worth more to this group than everything between a 500 ft drainage radius and a 10000 ft one.

## Where a drainage radius comes from

Nothing in this module computes one. It arrives from well spacing, from a map or from a material balance, and the engine cannot disagree with it. The floor moves with it though. At 500 ft the geometry allows -6.514430223 and at 10000 ft it allows -9.510162496, so an after-skin that a small drainage area refuses outright is accepted in silence by a large one.

## The mistake

Spending an afternoon narrowing the drainage radius and then entering a skin from a build-up nobody re-read. The radius is the number with the wide range and the small effect. The skin is the number with the large effect, and it is the one an interpretation can be wrong about by several units.

The second half of the same mistake is entering a nominal casing size where an open-hole radius belongs. That is not refused, because it is a legal geometry: it returns a legal group, a legal floor and a legal multiplier, all of them describing a well that does not exist.

## What it refuses

`pssDenominator` and `minimumSkin` both return a bare NaN when the wellbore radius is larger than the drainage radius, `Number.isFinite` false in each case, and `pssDenominator` does the same on a wellbore radius of zero. Nothing else about a geometry is checked.

## Exercise

Read the floor at a drainage radius of 1500 ft and at 3000 ft.

Then say which of the two would refuse a design taken to an after-skin of -8.0, and which would accept it and hand back a number.
