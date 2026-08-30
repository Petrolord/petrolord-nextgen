# The methods it replaced

Four ways to integrate the same station list, and they do not agree.

## The four

**Tangential.** Take the whole interval at the LOWER station's attitude. The simplest possible assumption: the hole went in a straight line in the direction it was pointing when you got to the bottom of the interval.

**Balanced tangential.** Take half the interval at each end's attitude. Equivalent to averaging the two direction vectors.

**Angle averaging.** Average the inclination and average the azimuth, then take the whole interval at that average attitude. Not the same as averaging the vectors, because the sine and cosine of an average is not the average of the sines and cosines.

**Minimum curvature.** Balanced tangential times the ratio factor. The circular arc.

## Why the first one is so wrong

The tangential method uses the attitude at the BOTTOM of the interval for the WHOLE interval.

On a build, the bottom of every interval is the steepest point in it. So the method treats each interval as steeper than it really was, which means it under-counts vertical depth and over-counts horizontal displacement, on every single interval, in the same direction.

That is a systematic bias, not a scatter, and it accumulates all the way down the well.

## The published comparison

The Applied Drilling Engineering chapter 8 example is a due-north build at 3 degrees per 100 ft, from vertical to 60 degrees, over 2000 ft of measured depth. The textbook publishes the answer for all four methods:

| method | true vertical depth (ft) | north displacement (ft) |
|---|---|---|
| minimum curvature | 1653.99 | 954.93 |
| angle averaging | 1654.18 | 955.04 |
| balanced tangential | 1653.61 | 954.72 |
| tangential | 1628.61 | 998.02 |

Three of them agree within six tenths of a foot. The fourth is out by twenty-five feet of TVD and forty-three feet of northing, on a two thousand foot well.

The panel computes all four on the same station list so you can see it rather than take it on trust, and the next lesson is about what that error means for a well.

## Why anyone used the tangential method

Because it can be done by hand with a table of sines, one line per station, and until the 1970s that is how survey calculations were done. It is not stupidity; it is the cost of arithmetic before calculators.

The wells drilled on it are still there, in the same fields, in the same databases, with their positions computed that way unless somebody has recomputed them.

## The one that is still competitive

Angle averaging is within two tenths of a foot of minimum curvature on this case, and it is simpler. It is genuinely fine for most wells.

Its weakness is azimuth: averaging azimuths across a course change near north requires care with the wrap from 359 to 1 degrees, and averaging inclination and azimuth separately is not the same as averaging directions in three dimensions. On a strongly turning interval it drifts, where minimum curvature does not.

## The misconception to avoid

"Old wells have old survey calculations, so their positions are slightly out." Not slightly, and not randomly. The bias is systematic and one-signed, and on a build section it is metres per thousand metres. An offset well whose position came from a tangential calculation is not where its database says it is, and the anti-collision scan in the Expert tier is where that matters.

## Exercise

Using the table above, compute the tangential method's TVD error as a percentage of the true TVD, and its north error as a percentage of the true north displacement.

Then say which of the two percentages is larger, and explain from the geometry why the horizontal error is proportionally worse than the vertical one on a build.
