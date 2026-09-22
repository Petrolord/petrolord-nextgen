# Working the capstone

Six numbers from one well, at one station.

{{panel:wd-uncertainty-explorer}}

## What is asked

All six fields come from the ISCWSA MWD Rev4 validation well at its DEEPEST station, 8000 m measured depth, horizontal at 90 degrees on a 75 degree azimuth.

1. The north-north entry of the total covariance.
2. The lateral one-sigma uncertainty in the borehole frame.
3. The highside one-sigma uncertainty in the same frame.
4. The semi-major axis of the horizontal ellipse at the two-dimensional 95 percent factor.
5. The azimuth of that ellipse's major axis.
6. The percentage of the total variance contributed by the largest source.

## The settings

**The model** is ISCWSA MWD Rev4, the standard parameter set, no corrections applied.

**The header** is the fixture's own: total field 50000 nT, dip 72 degrees, declination minus 4 degrees, convergence zero, azimuths referenced to true north, standard gravity, and the vertical inclination limit the fixture states.

**The station** is the deepest one, index 267 of 268.

**The confidence factor** for field 4 is 2.7955. Field 5 is an azimuth and does not depend on the factor, because scaling an ellipse does not rotate it.

**The share** in field 6 is measured by TRACE: the sum of the three variances of that source's covariance, divided by the sum over all sources, times a hundred.

## The order

Fields 1, 2 and 3 come straight out of the model: the covariance and one rotation into the borehole frame. Do them first.

Field 5 before field 4, because the azimuth comes from the same eigen-decomposition and does not need the confidence factor, so getting it right confirms the decomposition before the scaling is applied.

Field 6 last, because it needs the per-source covariances rather than the total, and it needs the same trace summary the panel uses.

## The traps

**The covariance entry, not its square root.** Field 1 is a variance in square metres, not a sigma in metres. It is a four-figure number, not a two-figure one.

**Lateral and highside are not north and east.** They are the borehole-frame components, which need the rotation. On this well the difference is large: reading the diagonal of the map-frame matrix instead gives quite different numbers.

**The ellipse is horizontal.** It is the two-dimensional projection, from the north-east block, not the three-dimensional ellipsoid.

**The share is a percentage.** Report 58.3 rather than 0.583.

**The trace, not the lateral variance.** Ranking by a different summary gives a different share, and on this well it would give a different leader in some places.

## What to notice while you work

The lateral sigma is more than four times the highside one, which is the shape fact of the whole tier.

The ellipse azimuth is close to ninety degrees away from the well's own azimuth of 75, which is what "the ellipse points across the well" means quantitatively.

The largest source is more than half the total on its own, and it is not a sensor specification.

## Exercise

Before opening the panel, write down for each of the six fields the engine function that produces it and the units of its answer.

Then produce the six. Any field whose units you had to think about is one to revisit, because a variance quoted as a sigma is the commonest error in this material.
