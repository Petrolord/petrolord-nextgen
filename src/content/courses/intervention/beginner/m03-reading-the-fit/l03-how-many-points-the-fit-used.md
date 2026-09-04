# How many points the fit used

The count in the return is not the length of the history. It is the number of points left after `logLogSlope` removed every point whose y is not strictly positive, and the removal is silent.

{{panel:pd-diagnostic-explorer}}

## Four fits and what each one drew through

| Fit | Points handed in | n returned | Span reported |
| --- | --- | --- | --- |
| published power law | 11 | 11 | 2.000000000 |
| teaching ratio, whole history | 38 | 38 | 2.380211242 |
| teaching derivative, whole history | 38 | 34 | 2.122891107 |
| derived six-point demonstration | 6 | 4 | 0.903089987 |

The first row is golden, the middle two are teaching well ELELENWO-4, a constructed history that is not a real well and not a published one, and the last is a derived demonstration. Only the first two drew through everything they were given.

## The silent drop

ELELENWO-4 holds 38 samples from t = 15.000 to 3600.000 days, 34 with a positive derivative and 4 with a negative one. The four sit at 2308.407093, 2676.963401, 3104.362776 and 3600.000000 days, at derivatives of -9.958064965, -8.779998197, -7.741300002 and -6.825482691, after the well was beaned back on day 2200. A log axis has nothing to say about a negative number, so the derivative fit removes them and returns a slope of 1.229355998655 at an r-squared of 0.994988493568 on n = 34.


Read the object without checking that count and the fit looks like a reading of the whole well. It is a reading of the well before the choke.

## Handed six, drew four

The derived demonstration makes the same drop visible in miniature. Six points go in, two negative, and the return is ok = true with n = 4, a slope of 1.000000000 and an r-squared of 1.000000000. A perfect fit on four of the six points, with no flag, no note and no warning.

## What it refuses

Below three surviving points the fit stops. Handed two points it returns ok = false with n = 2 and one sentence: "A slope needs at least three points that are both positive; a log-log plot has nothing to say about zero or negative values." Handed four points of which one y is negative and one is zero it returns the same refusal, again with n = 2, because only two survived the filter. The count in a refusal is also a count after the drop.

## The mistake

Quoting the count as the size of the record. A reader who writes "fitted on 34 samples" beside a 38 sample history has stated the truth and hidden the interesting part, which is that the fit chose the 34 by a rule that has nothing to do with the well.

## Exercise

Write the number of samples the teaching well holds, the number its derivative fit used, and the days at which the missing ones sit.

Then say what the return would have to carry for a reader to notice the drop without going back to the raw history.
