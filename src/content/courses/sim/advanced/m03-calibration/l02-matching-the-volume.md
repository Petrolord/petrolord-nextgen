# Matching the volume

One parameter, one target, and a search. This lesson does it and reports the answer.

## The relationship

Move the regional mean shallower and the surface floats up: more columns rise above the contact, more of them carry a full oil column, and the model contains more oil.

Move it deeper and the structure closes tightly around the wells and the model contains less.

So the deck's oil in place is a monotonically decreasing function of the regional mean, which is exactly the condition a bisection search needs.

{{panel:sim-build-explorer}}

## The search

Bracket the answer with a shallow mean that gives too much oil and a deep one that gives too little, then bisect until the model's volume lands on the booking.

The answer is

$$\mu = 1570.026311 \text{ m TVD}$$

and at that value the deck's oil in place under the Eclipse cell-centre rule is 12132366.897955146 stb against the booked 12139208.107496763, a gap of minus 0.056 percent.

## Why the match is not exact

Because the objective is a step function.

As the mean moves, columns cross the contact one at a time and layers within a column cross it one at a time. The oil volume therefore changes in jumps rather than smoothly, and a bisection cannot land on a target that sits between two steps.

So the residual is not a failure of the search. It is the size of the smallest step the model can take, and reporting the match as "within a tenth of a percent" rather than as an exact figure is the honest phrasing.

## Sanity checks on the answer

**Is it physically reasonable?** 1570 m is about 10 m below the contact and a little below the deepest well, which found the sand at 1590 m. A regional level below the deepest well is what a structure that closes looks like. A calibrated mean of 1400 m, shallower than every well, would have been a signal that something else was wrong.

**Is it in the bracket's interior?** If the answer had come out at either end of the search range, the range was too narrow and the true answer is outside it. This one is comfortably interior.

**Does the volume respond as expected?** Shallower gives more oil. If the search had found the opposite, the objective or the sign convention would be wrong.

Those three take a minute and they catch a search that converged on nonsense.

## What one parameter can and cannot do

It can match one number. That is the whole content of having one degree of freedom.

It cannot simultaneously match the oil area, the crest depth and the volume, and the next lesson is about which of those it gave up.

If you need to match more than one quantity you need more than one parameter, and then you are into a genuine optimisation with all the usual questions about whether the parameters are identifiable.

## The misconception to avoid

"The search found the right regional mean." It found the regional mean that makes this model reproduce this booking under this clipping convention. Change the convention, the grid or the variogram and the calibrated value moves. It is a property of the calibration, not of the field.

## Exercise

First, state the calibrated regional mean and the resulting gap against the booking, and explain in one sentence why the gap is not zero.

Second, name the three sanity checks in this lesson and say what each one would catch.
