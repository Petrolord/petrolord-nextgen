# A rating is across a wall

A burst rating is not a pressure the pipe can hold. It is a difference in pressure the wall can carry, and a difference needs two sides.

{{panel:wi-annulus-explorer}}

## The row, read as a difference

Every row in `maaspRows` is the same statement:

    allowable surface pressure = factor x limit - (annulus density - backup density) x g x TVD

The bracket is a difference of densities, not a density. It is the net weight per unit volume that the wall is asked to carry, and it only becomes a pressure once you multiply it by g and by the true vertical depth of the element.

If the two densities are equal, the bracket is zero and the element sees nothing but whatever you apply at surface.

## The published fixture

One element, taken at a factor of 0.8 on a limit of 30000000 Pa, sitting at a TVD of 2048.29303343 m, with 1200 kg/m3 in the annulus and 1030 kg/m3 behind the wall.

The rated term is 24000000 Pa. The differential head is 3414771.788968672 Pa. The allowable surface pressure is 20585228.21103133 Pa.

The engine result matches the published golden of 20585228.211031675 Pa to an absolute error of 3.46451997756958e-07 Pa, which is floating point noise and nothing else.

## The depth is vertical, always

The element sits at a measured depth of 2400 m. Its true vertical depth, derived from the survey by minimum curvature, is 2048.2930334297903 m against a golden of 2048.29303343 m.

Use the measured depth by mistake and you inflate the head by the ratio of the two, because a hydrostatic column only knows about vertical distance. On this well that error would be large enough to change an operating decision, and it points the wrong way. The allowable would come out too low, so the mistake hides itself as conservatism.

## Why the differential form matters

Once you accept that the row is a difference, three things follow that a simple rating comparison would never suggest.

The far side is part of the answer, so it has to be specified. The annulus fluid subtracts, so weighting up is not free. And an allowable can come out negative, which is not an error in the arithmetic but a real statement about the well.

The rest of this module works through each of those.

## Exercise

Set the annulus density equal to the backup density in the panel and confirm the allowable equals the rated term exactly.

Then enter the measured depth of 2400 m in place of the true vertical depth and record how far the allowable moves.
