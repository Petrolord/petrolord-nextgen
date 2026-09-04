# Fitting the discarded stretch

Fit the samples the engine threw away and they make a cleaner line than the ones it kept. That is the sharpest single fact in this course.

{{panel:pd-candidate-explorer}}

## The turn, and the four samples past it

Teaching well ELELENWO-4 is beaned back on day 2200. Its last sample before the choke sits at t = 1990.592514 days with a water-oil ratio of 14.587294415, the peak of the whole history. The first sample past the turn is at t = 2308.407093 days, and four samples follow the turn to the end at t = 3600.000000 days. ELELENWO-4 is a teaching case built for this course, not a published one.

Fitted on their own, those four samples give a log-log ratio slope of -0.749171775150 at an r-squared of 0.999955540052, on `n` of 4 over a span of 0.192990101 log cycles from t = 2308.407093 to t = 3600.000000 days. The magnitude of the falling derivative over the same four samples fits at a slope of -0.850000000000 with an r-squared of 1.000000000000.

## What the engine reported instead

| Reading | Slope | Fit quality, fraction | Samples |
| --- | --- | --- | --- |
| the verdict the engine gave | 1.442132492 | 0.998513658 | 15 used, 4 dropped |
| the discarded stretch on its own | -0.749171775150 | 0.999955540052 | 4 |

The engine returned mechanism channelling on the first row, over a window opening at t = 250.242976 days, and reported the fit quality 0.998513658 as evidence for it. The second row is a tighter line. A rate cut followed by a falling water-oil ratio is the coning field test, and the coning answer, and `coningSlope` sits at -0.1, which -0.749171775150 clears without argument.

Fit quality does not arbitrate between them, because fit quality is a statement about a line and not about a well.

## The honest limit on the second row

The discarded stretch spans 0.192990101 log cycles. `minSpanDecades` is 0.4. Handed to `chanDiagnosis` as a window in its own right, that stretch would not clear the span gate, and four samples is a thin case whatever its r-squared. The second row is not a better verdict. It is proof that the history holds a second verdict, which the return object does not mention.

## The mistake

Quoting 0.998513658 as though a high fit quality meant the mechanism was settled. Both fits are excellent, they point in opposite directions, and the one the engine did not print is the tighter of the two.

## What it refuses

Nothing in `chanDiagnosis` will fit the discarded stretch for you, report its slope, or flag that a second fit was available. The refusal is silent: the samples leave at the filter and the return object has no field for them.

## Exercise

In the panel, fit the four samples from t = 2308.407093 days to t = 3600.000000 days on ELELENWO-4 and record the slope and the r-squared.

Then say why that r-squared is not on its own a reason to prefer coning over channelling here.
