# The arc between two stations

One assumption, and it is the right one.

## The problem

Two survey stations. At the first, an inclination and an azimuth; at the second, different ones; between them, a measured length of hole and no information at all.

Something has to be assumed about the shape in between, because TVD and displacement are integrals along that shape. Every survey calculation method in history is a different answer to that question.

## The minimum curvature assumption

Assume the hole between the two stations is a **circular arc**, lying in the plane containing both tangent directions, passing through both stations, and tangent to the measured attitude at each end.

That is the shape of least total curvature that satisfies the measurements, which is where the name comes from. It is also, physically, close to what a bottom hole assembly actually drills: a stiff steel assembly in a hole cannot change direction abruptly, so a smooth arc is a better model of it than any kink.

## The dogleg angle

The two attitudes are unit vectors. The angle between them is the **dogleg**, and it is the total angle the hole turns through over the interval:

    cos(beta) = cos(i1)cos(i2) + sin(i1)sin(i2)cos(a2 - a1)

That single formula carries both the inclination change and the azimuth change. A well that builds five degrees while turning thirty degrees at high inclination has a much larger dogleg than either number alone suggests, which is why build rate and turn rate are not enough on their own.

## The ratio factor

Having assumed an arc, the position increment follows. It is the straight chord between the stations, scaled by a factor that accounts for the arc bulging away from the chord:

    RF = (2 / beta) tan(beta / 2)

and then

    dTVD = (dMD / 2) [cos(i1) + cos(i2)] RF
    dNorth = (dMD / 2) [sin(i1)cos(a1) + sin(i2)cos(a2)] RF
    dEast  = (dMD / 2) [sin(i1)sin(a1) + sin(i2)sin(a2)] RF

Notice the structure: the bracketed part is the average of the two end directions, which is the balanced tangential method, and the ratio factor is the correction that turns it into an arc.

## What the ratio factor does

For a small dogleg it is essentially 1: a nearly straight interval is nearly its own chord. It grows slowly as the dogleg grows, reaching about 1.0115 at 30 degrees of dogleg in one interval, which is very aggressive.

That is why minimum curvature and balanced tangential agree so closely on ordinary wells and why the difference between them is measured in tenths of a foot rather than tens. The next lesson looks at the factor properly, and the one after that shows where the tens of feet actually come from.

## What it is exact for

If the hole really is a circular arc, minimum curvature is not an approximation at all. It is exact.

That is more useful than it sounds, because the trajectory DESIGNS in module 4 are built from arcs and holds, so the compiled station list is exactly reproduced by the same mathematics that will later be applied to the real surveys. The course's build-and-hold case reproduces its published endpoint to about four parts in ten billion for exactly this reason.

## The misconception to avoid

"Minimum curvature is the most accurate method." It is the most accurate of the classical methods on real wells, and it is exactly right only if the hole is a circular arc between stations. Its error is a property of the hole, not of the arithmetic, and it shrinks as the survey interval shrinks. Calling it exact is right for a designed path and wrong for a drilled one.

## Exercise

Two stations 30 m apart: the first at 30 degrees inclination and 90 degrees azimuth, the second at 33 degrees and 95 degrees.

Compute the dogleg angle from the formula above. Then compute what the inclination change alone would suggest, and what the azimuth change alone would suggest, and say why the answer is larger than either.
