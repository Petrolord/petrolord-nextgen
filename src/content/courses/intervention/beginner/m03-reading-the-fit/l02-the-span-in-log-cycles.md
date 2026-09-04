# The span in log cycles

`spanDecades` is the distance the surviving points cover along the log x axis, counted in log cycles. It is the only member of the return that says how much ground the line was drawn across.

{{panel:pd-diagnostic-explorer}}

## What two cycles looks like

The published power law puts eleven points at x = 1.000000, 2.000000, 3.000000, 5.000000, 8.000000, 10.000000, 20.000000, 35.000000, 50.000000, 80.000000 and 100.000000, and the engine reports a span of 2.000000000. On that axis distance is multiplication rather than subtraction: the step from 1.000000 to 10.000000 and the step from 10.000000 to 100.000000 are the same distance, though the second moves far more in x. Six of those points sit at x of 10.000000 or less, and least squares weights every pair the same.

## The span is measured after the drop, not before

The derived demonstration is six points, two of them with a negative y. The fit removes those two silently, returns n = 4 and reports a span of 0.903089987, while the six points it was handed cover 1.505149978. The reported span is 0.602059991 of a cycle short of the data, and nothing in the object says a point was removed.

The same thing happens on a history. Teaching well ELELENWO-4 is a constructed case, not a real well and not a published one. Its 38 samples run from t = 15.000 to 3600.000 days, and its ratio fitted whole reports 2.380211242 log cycles on all 38. Its derivative fitted whole reports 2.122891107 on 34, because the four samples at 2308.407093, 2676.963401, 3104.362776 and 3600.000000 days have a negative derivative and a log axis has nothing to say about them.

## Days are not cycles

Those four dropped samples run from 2308.407093 to 3600.000000 days, a long stretch of the well's life on a calendar and a short one on a log axis, because the samples are spaced geometrically. A history that doubles in length in days adds a fraction of a cycle. A long-looking record can still be a short reading, which is why the span and the sample count answer different questions.

## What it refuses

Hand the fit a column where every point is at the same time and it returns ok = false with one sentence: "Every point is at the same time, so there is no slope to measure." Zero span, no slope, and an explicit refusal rather than a number that looks like an answer. Further down the module the span is also a gate, with minSpanDecades set to 0.4, so a fit that survives the drop can still be too short to be read.

## The mistake

Reading the reported span as a description of the data handed in. It describes the points that survived, and 2.122891107 against 2.380211242 on the same 38 samples is the only visible trace that four were thrown away.

## Exercise

Write the span the six-point demonstration reports and the span it was handed, and the difference between them.

Then write the two spans the teaching well returns for its ratio and its derivative fitted whole, and name what makes them different.
