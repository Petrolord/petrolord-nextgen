# The dial is clamped

Hand `chanDiagnosis` a window fraction it does not like and it does not refuse it. It quietly replaces it with one it does like, and returns a verdict computed on the substitute.

{{panel:pd-channel-explorer}}

## Six values, two windows

Teaching well ELELENWO-4 is 38 samples from 15.000 to 3600.000 days, a case built for this course rather than a published one. These are the fractions as handed in, and the window each one actually produced.

| lateFraction as handed in | Window starts, days | Derivative slope | Mechanism |
| --- | --- | --- | --- |
| -3.00 | 2308.407093 | n/a | coning |
| 0.00 | 2308.407093 | n/a | coning |
| 0.05 | 2308.407093 | n/a | coning |
| 0.10 | 2308.407093 | n/a | coning |
| 1.00 | 15.000000 | 1.229355999 | displacement |
| 2.50 | 15.000000 | 1.229355999 | displacement |

A negative fraction and a fraction of zero are not errors here. They land on the floor, which is 0.10, and the floor on this history opens the window at t = 2308.407093 days. A fraction of 2.50 lands on the ceiling of 1.00 and reads the whole series.

## What the floor does to this well

The samples after t = 2200 days are the ones where the well was beaned back, and their derivatives are negative: the sample at 2308.407093 days carries a derivative of -9.958064965. On the clamped window nearly all the surviving samples are those, no positive-derivative fit can be built, and the reading comes back coning rather than channelling. Coning is not treatable, so the water shutoff is refused.

That is a different mechanism, a different recommendation and a different spend, produced by a typed value the module considered too small to use.

## The mistake

Treating a rejected input as a caught input. A user who types 0.05 believing it will be refused gets a reading with an ok flag of true, a named mechanism, a note and a start time, none of which mentions that the number typed was discarded. The clamp is documented nowhere: not in the return object, not in a note, not in a warning.

## What it refuses

Not the fraction. What it refuses at the floor is the slope: with no positive derivative left, the derivative fit fails and no derivativeSlope, derivativeR2 or spanDecades is returned at all. A verdict still is.

The only trace of the substitution is lateFromT. At any fraction of 0.10 or below it reads 2308.407093 days, and at 1.00 or above it reads 15.000000 days, so identical start times across different typed values are the signature to look for.

## Exercise

Enter 0.05, 0.10 and 2.50 in the panel and record the window start and the mechanism for each.

Then say which two of the three readings are the same reading, and how you would tell from the result object alone that a fraction had been replaced.
