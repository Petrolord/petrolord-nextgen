# R squared does not protect you

The statistic everyone reaches for, doing almost none of the work here.

## What it is measuring

The coefficient of determination is the fraction of the variance in the fitted points that the line explains. It answers: given these points, how well does a straight line describe them?

It does not answer: are these the right points? And in well test analysis that is the question.

## The numbers

| window | permeability (mD) | r squared |
|---|---|---|
| every point | 23.12907021605519 | 0.9004033647584739 |
| at or after 0.5 h | 69.67866147403232 | 0.9795049460140368 |
| at or after 1 h | 77.62210530894819 | 0.9979060289526748 |
| at or after 2 h | 81.1750471708196 | 0.9997269766852961 |

Read down the right-hand column with the eye of someone used to regression. 0.90 is a good fit. 0.98 is a very good fit. 0.998 is an excellent fit. 0.9997 is essentially perfect.

Now read down the left-hand column. The "good fit" is wrong by a factor of nearly four. The "very good fit" is 18 percent low. The "excellent fit" is 9 percent low. Only the last row is within a few percent, and even it is still low.

## Why the scale is inverted

In most of engineering, the interesting range of r squared is between 0.8 and 0.99, and the last two digits are noise. Here the interesting range is between 0.999 and 0.99999, and the last two digits are the entire signal.

The reason is that the data are smooth. A buildup is a smooth monotonic curve, and any smooth curve is well approximated by a straight line over a limited range. The residuals from fitting a line to a gently curving smooth function are small compared to the total pressure change, so r squared stays high while the slope is badly wrong.

Scatter, which is what r squared is designed to detect, is not the problem in a well test. Curvature is. And r squared is a poor detector of curvature.

## What detects curvature

**A residual plot.** Fit the line, subtract it, and plot what is left against time. Curvature that is invisible in r squared is obvious as a systematic arc in the residuals. This costs nothing and almost nobody does it.

**The stability of the answer.** Move the window and see whether the answer moves. A line that is genuinely on a straight stretch gives nearly the same slope over any sub-window of it. A line fitted across a bend does not.

**The derivative.** The proper tool, and the next tier's subject. The derivative turns a gentle bend into a visible slope change, because differentiating amplifies exactly what r squared smooths over.

## The one thing r squared is good for

A low r squared IS informative. If a semilog fit over a window you believe should be radial comes back at 0.95, something is wrong: noise, a rate change mid-test, a gauge problem, or a window that spans two regimes.

So the statistic is worth computing and worth looking at. It just cannot be used the other way round. A high r squared is not evidence that the window was right, and on smooth data it is barely evidence of anything.

## The standard error of the slope

The engine's `linearFit` also returns the standard error of the slope, which is a more useful number than r squared for this purpose because it converts directly into a permeability range.

It shares the same blind spot: it describes scatter about the fitted line, not whether the line was fitted over the right regime. On noiseless data it goes to zero regardless of how badly the window was chosen. But when the data are real and noisy, it is the honest way to attach a range to the permeability, and it belongs in a report.

## The misconception to avoid

"An r squared of 0.9 is a good fit." In well test analysis on clean data, an r squared of 0.9 on a semilog line is a warning, not a result. Compare it against 0.9999, which is what a genuine radial stretch on clean data gives. The gap between them is the whole difference between a usable permeability and one that is wrong by a factor of four.

## Exercise

For each of the four windows in the table, compute the ratio of the permeability to the planted 85 mD, and plot that ratio against the QUANTITY 1 minus r squared on a logarithmic axis.

State what shape you get, and say what that shape implies about how much of an r squared improvement you should demand before accepting a window.
