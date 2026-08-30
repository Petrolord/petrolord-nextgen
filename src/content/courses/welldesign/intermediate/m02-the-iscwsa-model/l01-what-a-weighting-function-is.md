# What a weighting function is

The bridge from a sensor error to a survey error.

## The question it answers

An accelerometer has a bias of one milligravity. What does that do to the inclination reported at a station where the hole is at 47 degrees?

The answer depends on the geometry: at 47 degrees a bias on the axial sensor and a bias on the cross-axial pair affect the inclination differently, and at 90 degrees the axial one affects it hardly at all.

A weighting function is that dependence, written down.

## The form

For each error source, the model supplies a function that returns three numbers at each station:

    d(inclination)/d(source), d(azimuth)/d(source), d(depth)/d(source)

Multiply those by the source's magnitude and you have the inclination, azimuth and depth error that source causes at that station. Those three numbers are the source's effect in what the standard calls DIA space: depth, inclination, azimuth.

## Where they come from

Differentiating the survey equations.

Inclination is derived from the accelerometer readings by an explicit formula; differentiating that formula with respect to each sensor's bias and scale factor gives the accelerometer weighting functions. Azimuth is derived from the magnetometers and the accelerometers together; differentiating gives the magnetometer ones plus a set of cross terms.

The results are trigonometric expressions in inclination, azimuth, dip and the field strength. They are published in the standard, they are not obvious, and every implementation has to get all of them right.

## The examples worth carrying

**Axial accelerometer bias** affects inclination in proportion to the sine of the inclination. It is worst near horizontal and vanishes at vertical.

**Cross-axial accelerometer bias** affects inclination in proportion to the cosine. Worst at vertical.

Those two are complementary, which is why the model has both and why neither dominates everywhere.

**Axial magnetic interference** affects azimuth in proportion to the sine of the inclination and the sine of the azimuth relative to magnetic north, divided by the horizontal field component. It vanishes in a vertical hole, vanishes in a hole heading due magnetic north or south, and is worst in a horizontal hole heading east or west at high dip.

That last one is the largest single source in this course's validation well, and its geometry explains why.

## Why the model has several formulations per source

The codes ending TI1S, TI2S, TI3S are the same physical error in different inclination regimes.

Near vertical some of the expressions are singular. Near horizontal, others are. The standard supplies a formulation for each regime and the implementation selects among them, which is what the vertical inclination limit in the header is for.

The engine has a set of singular overrides for exactly the sources where the general expression breaks down, applied only where they are needed.

## From DIA to position

The weighting functions give errors in depth, inclination and azimuth. Position error needs one more step: how the position at every station depends on the inclination and azimuth at every EARLIER station.

That is a second derivative matrix, built once from the survey itself, and the next lesson is about it.

## The misconception to avoid

"A one milligravity bias gives a fixed inclination error." It gives an inclination error that depends on where in the hole you are, and the whole point of a weighting function is that dependence. A budget quoted as "the tool is good to 0.1 degrees" has thrown away the geometry that makes the model useful.

## Exercise

For axial accelerometer bias, whose weighting on inclination goes as the sine of the inclination, compute the relative effect at 10, 45 and 85 degrees.

Then do the same for the cross-axial term, which goes as the cosine, and say at what inclination the two are equal.
