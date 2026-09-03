# When the curve does not reach

What the engine does when a sieve stack is too short to answer the question.

{{panel:ps-shot-explorer}}

## The situation

A D-value can only be interpolated between two measured points that bracket it. If the finest sieve in the stack retained only seventy percent of the sample, there is no D90 to be had: the curve stops before it gets there.

## What the engine returns

Null. Not zero, not the finest sieve size, and not an extrapolation.

Zero would be a grain size of nothing, which would propagate into a uniformity of zero and a gravel band of zero. The finest sieve size would be a real number that happened to be wrong. An extrapolation would be a guess dressed as a measurement.

Null is the only answer that cannot be mistaken for a result.

## What follows downstream

The uniformity is the ratio of D40 to D90, so a missing D90 makes the uniformity null. The sorting needs D10 and D95, so a short stack at either end kills that too.

And the completion type advisor, asked for an indication with a null uniformity or a null fines figure, returns the string saying the sieve coverage is insufficient rather than picking a rung.

That chain is the point. One missing measurement propagates all the way to the recommendation and stops it, rather than producing a recommendation from a hole in the data.

## The fines case is different

The fines percentage is the fraction finer than forty four microns, and the engine will produce it from a curve that does not reach forty four microns, in either direction.

If the whole curve is coarser than the cutoff, the fines are whatever is finer than the finest sieve, which is a real bound. If the whole curve is finer, the fines are whatever is finer than the coarsest, which is also real. Only between those does it interpolate.

That is a defensible difference: a percentile needs the curve to reach it, and a cumulative fraction at a fixed size can be read off the end of the curve.

## What to do about it

Ask for more sieves. A stack that does not reach ninety five percent retained cannot support a standalone screen decision, and no amount of arithmetic will change that.

## Exercise

Say what the engine returns for a D-value the curve does not reach, and give two wrong answers it avoids.

Trace the consequence of a missing D90 through to the completion type indication.

Then explain why the fines percentage behaves differently from a percentile, and say whether you find the difference justified.
