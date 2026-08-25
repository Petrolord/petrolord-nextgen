# One number is not a statistic

The tier has one cross-validation residual and will shortly have a second from the blind test. This lesson is about what can and cannot be said with them, and it is the most important discipline in the tier.

## What one residual supports

**A statement about that location.** At Ekene-6 the five-well map was 9.84 m too deep. That is a fact and it needs no qualification.

**A lower bound on the map's error scale.** The map is capable of being wrong by about ten metres somewhere in its interior. It has been demonstrated once.

**An order-of-magnitude expectation.** If a prediction can miss by 10 m at one interior point, a prediction at another interior point is more likely to be wrong by metres than by centimetres.

That third statement is weak and it is still worth having, because the alternative most reports offer is no statement at all.

## What one residual does not support

**A mean.** The mean of one number is that number, and calling it a mean invites the reader to imagine other numbers behind it.

**A standard deviation or a root mean square.** Both need a spread and there is none. A root mean square of one value is its absolute value dressed up.

**A bias.** With one residual there is no way to separate a systematic tendency from a single local miss. The 9.84 m could be the map reading uniformly deep everywhere, or one culmination it happened to miss, and one number cannot tell.

**A confidence interval.** No interval can be constructed from a sample of one.

## The two-residual trap

With the blind test the tier has two: $+9.84$ m at Ekene-6 and $-5.67$ m at Ekene-7. It is very tempting to compute:

$$\text{mean} = +2.09\ \mathrm{m}, \qquad \text{mean absolute} = 7.76\ \mathrm{m}, \qquad \text{root mean square} = 8.03\ \mathrm{m}$$

All three are arithmetically correct and none of them should be reported as a field error estimate.

The mean of $+2.09$ m is the worst of the three, because it suggests the map is nearly unbiased when what actually happened is that two large errors of opposite sign partially cancelled. A reader given $+2.09$ m will conclude the map is good to about two metres. It is not.

If any single figure has to be quoted, the **mean absolute** or the **root mean square** is the honest one, because neither lets cancellation flatter the result. Even then it is a summary of two numbers and has to say so.

## What to write instead

> Two residuals are available. Leave-one-out at Ekene-6 gives $+9.84$ m; the blind test at Ekene-7 gives $-5.67$ m. They have opposite signs, so no bias can be established, and two values do not support a spread. Errors of five to ten metres have been demonstrated at interior locations.

That paragraph makes no claim it cannot support and it is more useful than a root mean square, because a reader can see both numbers and form their own view.

## The signs matter more than the magnitudes

Two residuals of the same sign would suggest something systematic worth investigating: a datum problem, a consistent pick bias, or a trend the interpolator is missing.

Two of **opposite** sign say the errors are local rather than systematic, which is exactly what unresolved short-wavelength structure produces. That is a real finding from a sample of two, and it is the one inference the small sample does support.

## Where a real uncertainty comes from

Not from these two numbers. Module 5 builds one a different way, by repeating the mapping with each well dropped in turn and watching how far the answer at the prospect moves. That produces six values at a single location rather than one value at each of six locations, and six values do have a spread.

It is a different quantity from a residual and it answers the question that actually gets asked, which is how much the mapped depth at the prospect could move.

## Worked example

A report states: *cross validation gives a mean residual of 2.1 m, so the map is accurate to about two metres.* What is wrong?

Two things. The mean is over two residuals of opposite sign, so it measures cancellation rather than accuracy; the individual errors are 9.84 and 5.67 m. And accuracy at a location is not what a mean residual measures even with a large sample, since a mean measures bias while accuracy at a point is governed by the spread.

The corrected sentence is that two residuals of opposite sign, 9.84 m and 5.67 m, have been measured, that no bias can be established from them, and that errors of that order should be expected at interior locations.

## Exercise

List three quantities that cannot be computed from a single residual, then state which single summary of two residuals is the least misleading and why the plain mean is the most misleading.

As a self-check: a standard deviation, a bias and a confidence interval cannot be computed from one residual, and neither can a meaningful mean. Of the summaries of two residuals the mean absolute or the root mean square is least misleading, because neither allows errors of opposite sign to cancel. The plain mean is the most misleading, because $+9.84$ and $-5.67$ average to $+2.09$ m, which reads as a map accurate to about two metres when both individual errors are several times that.
