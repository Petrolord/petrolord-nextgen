# D-values

Six percentiles, what each one is used for, and why the engine computes all six.

{{panel:ps-shot-explorer}}

## The six

D10, D40, D50, D70, D90 and D95. Each is the grain size at which that percentage of the sample has been retained.

The published sand in this course has a D10 of about two hundred and ninety six microns and a D95 of about twenty six, so its coarse decile is more than eleven times its fine tail.

## What each one is for

D50 is the median, and it is what a gravel is sized from. Saucier sizes the pack at five to six times the formation median, and nothing else in the gravel calculation reads any other percentile.

D10 is the coarse decile, and it is what a standalone slot is sized from. The Coberly-type window puts the slot between D10 and twice D10, on the reasoning that grains at the coarse end bridge the slot and the bridge then holds everything finer.

D40 and D90 together give the uniformity coefficient, which is the ratio between them.

D10 and D95 together give the sorting coefficient, on the same idea over a wider span.

D70 is carried because parts of the literature size on it, and because a percentile that costs nothing to compute is worth having when a client asks.

## Why the engine computes all six rather than the ones it needs

Because the two it strictly needs, the median and the coarse decile, do not tell you whether the curve is well described. Six percentiles across the range let a reader see the SHAPE, and the shape is what the uniformity and the sorting summarise.

And because a curve that cannot reach some of them says something. A sieve stack that stops at seventy percent retained cannot give a D90, and a completion type cannot be chosen from it.

## What they do not tell you

Anything about mineralogy. A quartz sand and a clay-rich sand with identical size distributions behave completely differently against a screen, because the clay swells and migrates and the quartz does not.

Anything about angularity. Angular grains bridge better than round ones at the same size.

And anything about how strongly the grains are cemented together, which is the whole subject of the sanding calculation and comes from a strength log rather than a sieve.

## Exercise

List the six D-values and say what each one is used for in this course.

Say which two are strictly required and why the other four are computed anyway.

Then name three things a grain size distribution does not tell you about a sand.
