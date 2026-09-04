# The story so far

An Associate reading of this module is two things: one fitted line and one geometry group. Everything else in the module is built on top of those, and neither of them knows it is looking at a well.

## The fitted line and its five members

`logLogSlope` is ordinary least squares of ln y against ln x. It returns a slope, an intercept, an r-squared, a point count and a span in log cycles, and on the published power law of eleven points from x = 1.000000 to 100.000000 those come back as 1.350000000000, 1.308332819650, 1.000000000000, n = 11 and 2.000000000. Those are golden values and a derived re-run agreeing with them to 0.0000e+0.

The point count is the count after a drop nobody announces. Hand in six points of which two carry a negative y and the return is ok = true with n = 4 and spanDecades 0.903089987, while the six points actually cover 1.505149978 log cycles. The reported span is 0.602059991 of a log cycle short of what was supplied.

## The geometry group and its floor

Productivity is inversely proportional to ln(re/rw) less 3/4 plus S, and the 3/4 is the pseudo-steady-state constant for a circular drainage area rather than a fudge. On the published geometry, re = 2000.000000 ft and rw = 0.350000 ft, ln(re/rw) is 8.650724584041 and the floor where the group reaches zero is -7.900724584041.

The radii barely matter and the skin does. A twentyfold change in drainage radius, from 500 ft to 10000 ft on the published wellbore radius, moves the zero-skin denominator by 2.995732274, which one unit of skin more than covers.

## What removing skin is worth

A ratio of two of those groups, and nothing else. Published pairs on that geometry: a skin of 8.000 taken to 0.000 returns 2.012565355861, and a skin of 12.000 taken to -3.000 returns 4.060771880315. A skin that does not change returns 1.000000000000000 exactly, because it is one number divided by itself. None of these is a rate. No barrel, no pressure and no day appears anywhere in the return.

## The constants that turn a slope into a label

A derivative slope is compared against `channellingSlope` at 1.3, `coningSlope` at -0.1 and an `ambiguousBand` of 0.25, with `minR2` at 0.5, `minSpanDecades` at 0.4 and `minWor` at 0.1 deciding whether the reading is allowed at all. All six are shipped defaults, all overridable, and none of them was measured.

## What tells you it failed, and what does not

`skinPiMultiplier` returns ok = false with a sentence. `pssDenominator`, `minimumSkin` and `skinFromPiRatio` return a bare NaN for the same bad geometry, so only `Number.isFinite` separates an answer from a refusal on those three.

## Exercise

Write the five members of a fit return and say which one changes when a point is dropped.

Then write the geometry group in full and name the one input it adds undivided.
