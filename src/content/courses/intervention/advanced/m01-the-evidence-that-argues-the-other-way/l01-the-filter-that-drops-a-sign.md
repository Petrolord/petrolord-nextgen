# The filter that drops a sign

A negative number cannot go on a log-log plot, so the engine removes it. It removes the sign with it, and on a well that has turned, the sign was the evidence.

{{panel:pd-candidate-explorer}}

## Two filters pointing the same way

`chanDiagnosis` builds its derivative fit from `clean.filter((p) => Number.isFinite(p.derivative) && p.derivative > 0)`, and `logLogSlope` filters `p.y > 0` again on whatever survives. Neither filter reports what it removed, and the `n` that comes back is the count after the drop rather than the count handed in.

A derived demonstration prices it. Hand `logLogSlope` six points of which two are negative and it returns `ok = true`, `n` of 4, a slope of 1.000000000 at an r-squared of 1.000000000, and `spanDecades` of 0.903089987. The six points cover 1.505149978 log cycles, so the fit describes 0.602059991 of a log cycle less than it was given.

## What it costs on a history that turns

Teaching well ELELENWO-4 carries 38 samples from t = 15.000000 to 3600.000000 days, a span of 2.380211242 log cycles. It is a teaching case built to carry this result, not a published case and not a real well. At the engine default `lateFraction` of 0.5 the late window opens at t = 250.242976 days and holds 19 samples: 15 with a positive derivative, 4 with a negative one, none exactly zero.

The four are the last four in the history, and they are contiguous.

| t, days | Water-oil ratio | Derivative |
| --- | --- | --- |
| 2308.407093 | 13.015370548 | -9.958064965 |
| 2676.963401 | 11.629409643 | -8.779998197 |
| 3104.362776 | 10.407411767 | -7.741300002 |
| 3600.000000 | 9.329979637 | -6.825482691 |

The ratio is falling and the derivative with it. Both filters discard all four.

## The slope that comes back, and the window it is not

The engine returns `derivativeSlope` 1.442132492 at `derivativeR2` 0.998513658 over `spanDecades` 0.900620470, and calls the mechanism channelling. That slope was fitted on 15 samples. The window it was cut from begins at t = 250.242976 days and runs to the end of the history at t = 3600.000000 days; the fit stops at the last rising sample.

The careful mistake is to read 1.442132492 as the slope of the late window. It is the slope of the part of the late window that was still climbing, taken over a shorter stretch than the window it is reported beside, and the samples it excluded are the ones that disagree with it.

## What it refuses

`logLogSlope` refuses only when too little survives the filter. Two points come back `ok = false`, `n = 2`, with "A slope needs at least three points that are both positive; a log-log plot has nothing to say about zero or negative values." Every point at the same time refuses with "Every point is at the same time, so there is no slope to measure." Nothing refuses because contrary samples were dropped.

## Exercise

Read ELELENWO-4 in the panel at `lateFraction` 0.5 and record the late sample count, the positive count and the negative count.

Then say, in one sentence, what a reader who saw only `derivativeSlope` and `derivativeR2` would have no way to learn.
