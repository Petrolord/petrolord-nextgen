# Annular velocity

The mud's speed, and where it is slowest.

{{panel:hy-cleaning-explorer}}

## The expression

    v = Q / A,  A = pi/4 (d_hole^2 - d_pipe^2)

Flow rate over the open area. Nothing else.

## The four sections

Horizontal well, kcl_polymer, at 0.025 m3/s:

| interval | inclination | annular velocity |
|---|---|---|
| 0 to 1200 m | 0 degrees | 0.9797133674790398 m/s |
| 1200 to 2500 m | 90 degrees | 1.0441932494126904 m/s |
| 2500 to 2650 m | 90 degrees | 1.0441932494126904 m/s |
| 2650 to 2800 m | 90 degrees | 1.8487355891241068 m/s |

## Reading the four rows

**The slowest is the shallowest.** The cased section is 0.2204974 m in diameter with drill pipe at 0.127 m in it, which is the widest annulus in the well.

**The fastest is the deepest.** The drill collars at 0.17145 m in a 0.2159 m open hole leave a gap of 0.0223 m on each side, which is the tightest annulus.

**The middle two are identical**, because they are the same drill pipe in the same open hole.

## Why the worst cleaning is at the top

Because transport depends on the annular velocity and the slowest velocity is in the shallowest section.

That is the opposite of most people's intuition, which puts the cleaning problem at total depth where the hole is longest and most deviated.

It is also the opposite of where the annular PRESSURE loss concentrates, which is the tight annulus around the collars.

## The consequence

A hole cleaning problem is usually a large-hole problem. The 17 and a half inch section above a 12 and a quarter inch one has a much larger annulus, and its velocity is correspondingly lower.

That is why big hole sections need disproportionately large flow rates, and why the flow rate on a well is usually set by the largest open hole rather than the deepest.

## The one thing velocity does not tell you

How fast the CUTTINGS are going. They are denser than the mud and they fall through it, so their speed is the mud's speed less a slip velocity.

The next lesson is that slip.

## Exercise

Compute the annular flow area for each of the four intervals from the diameters given, and confirm the velocities above at 0.025 m3/s.

Then say which interval would be worst if the drill pipe in the cased section were replaced by heavy weight at 0.127 m outside diameter with a 0.1651 m tool joint.
