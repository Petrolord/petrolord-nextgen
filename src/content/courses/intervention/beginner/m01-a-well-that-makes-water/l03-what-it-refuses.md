# What it refuses

Half of what this module teaches is in the sentences it prints when it declines to answer.

## The measurement refuses three ways

Hand `logLogSlope` fewer than three usable points and it returns ok = false with "A slope needs at least three points that are both positive; a log-log plot has nothing to say about zero or negative values." Two points returns n = 2. Four points of which one y is negative and one is zero also returns n = 2, and the same sentence.

Points that all sit at the same x return ok = false with "Every point is at the same time, so there is no slope to measure."

Those are the loud refusals. The quiet one costs more.

## The filter that does not announce itself

Every point whose y is not strictly positive is dropped before the fit, and the fit says nothing about it. Hand in six points of which two are negative and the return is ok = true, n = 4, slope 1.000000000, r2 1.000000000, spanDecades 0.903089987. The six points actually cover 1.505149978 log cycles, so the reported span is 0.602059991 of a log cycle short of what was handed in, and the n is the count after the drop rather than the count supplied.

A caller who does not compare n against its own array length cannot tell anything was removed.

## The classifier counts before it reads

A history of five samples is refused outright: ok = false, mechanism indeterminate, every fit field absent, with "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more." That is the one place a count is checked before any arithmetic runs.

## The geometry side refuses in two different shapes

`skinPiMultiplier` returns an object: ok = false with "The drainage and wellbore radii are needed, and the drainage radius has to be the larger one." when rw is not smaller than re, and ok = false with a sentence naming the floor when the skin sits below it.

`pssDenominator`, `minimumSkin` and `skinFromPiRatio` return a bare NaN for the same bad geometry. A wellbore radius of zero, or rw larger than re, gives a value with Number.isFinite false and no message and no object. `skinFromPiRatio` does the same for a negative claimed ratio and for a claimed ratio of zero.

## The mistake

Treating the two contracts as one. A call site that checks `result.ok` is correct for `skinPiMultiplier` and is reading an undefined property on the other three, which is falsy, so a working geometry looks like a failure and a NaN looks like a number. Only Number.isFinite tells an answer from a refusal on those three.

## Exercise

Write out the two refusal sentences the measurement can print, word for word.

Then take the six-point drop and write the span the fit reported beside the span the six points covered, and say what a caller would have to do to notice the difference.
