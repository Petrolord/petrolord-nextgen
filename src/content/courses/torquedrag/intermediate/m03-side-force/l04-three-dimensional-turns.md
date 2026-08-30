# Three-dimensional turns

Changing azimuth as well as inclination, and the sine that scales it.

{{panel:td-string-explorer}}

## The azimuth term

The side-force expression has two components:

    N = hypot( T dPhi sin(theta),  T dTheta + w ds sin(theta) )

The first is the azimuth term and it carries `sin(theta)`.

That factor is the same one that appears in the dogleg severity formula, and for the same reason: turning the well at low inclination barely bends the string, because the hole is nearly along the axis you are rotating about.

## The scale

| inclination | fraction of an azimuth change that becomes curvature |
|---|---|
| 5 degrees | 0.0872 |
| 30 degrees | 0.5 |
| 60 degrees | 0.866 |
| 90 degrees | 1.0 |

So a 10 degree turn at 5 degrees inclination is worth less than a 1 degree build. The same turn at 90 degrees is worth the full 10.

## The three-dimensional well in this course

It reaches 60 degrees of inclination and 60 degrees of azimuth over 1800 m, building and turning together.

Its worst side force is 1115.6196090493668 N per metre, and its surface torque rotating on bottom is 15657.408635706728 N.m. Both are lower than the build-and-hold well's despite a comparable maximum inclination, because it is a much shorter well.

## The right way to compare

Not by absolute numbers, which are dominated by length, but by side force per metre against the local geometry.

Take the three-dimensional well's worst side force against its drill collars' buoyed weight per metre of 1288.2065631957541 N/m. The maximum is BELOW that, which tells you the maximum is not in the collars.

## Why turns are set early in practice

Because of the sine. Getting the azimuth right while the well is still near vertical costs almost nothing in dogleg, side force, torque or drag.

A correction of the same size at 80 degrees costs nearly the full amount, and it costs it in the lateral direction, which is the direction the anti-collision calculation cares about most.

That is the same conclusion the Well Design and Surveys course reaches from the uncertainty side, arrived at independently from the mechanics side.

## The subtlety in the formula

Notice the azimuth term is inside a hypotenuse with the inclination term rather than added to it.

That is because the two curvatures are perpendicular: building bends the string in the vertical plane and turning bends it horizontally. Perpendicular contributions combine in quadrature, so a well doing both has less total curvature than the sum of the two.

That is a real effect and it is why a 3D turn is cheaper than doing the build and the turn in sequence.

## Exercise

Compute the total curvature per metre for a well building at 2 degrees per 30 m while turning at 3 degrees per 30 m at 60 degrees inclination.

Then compute what it would be if the same build and turn were done sequentially, and quantify the saving.
