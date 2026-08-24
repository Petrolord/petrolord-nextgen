# Quality control

Validation is easy to run and easy to run in a way that produces numbers meaning nothing. This lesson lists the checks, cheapest first.

{{panel:mp-validation-explorer}}

## The three setup checks

Run these before any residual is computed.

**Is the frame the same in every run?** Derived once from the full control set and reused. If each subset derives its own frame, the residuals contain a lattice shift. On Ekene that shift is about 0.24 m, small enough to pass unnoticed and large enough to matter on a field where the whole answer is a few metres.

**Are the settings the same in every run?** Same method, cell size and extrapolation limit. A leave-one-out run with a wider limit than the full map is answering a different question.

**Does the full-control run reproduce the map you are validating?** Set the panel to all six wells and confirm the crest at 1539.7181 m and P-1 at 1542.6199 m. If the baseline does not match the map in use, nothing computed from it applies to that map.

## The three procedure checks

**Was the removed well actually removed?** A residual of zero at a withheld well means it was still in the control set. The residual of an exactly interpolating method at its own control is always zero, so a zero is a red flag rather than a good result.

**Is the prediction an interpolation or an extrapolation?** Check that the withheld well's location is inside the hull of the remaining control. If the software returns a value where the hull test should have blanked it, the mask has been disabled somewhere.

**Was the blind prediction recorded before the well joined the control?** There is no way to check this after the fact, which is why it has to be a discipline rather than a check. A blind residual of exactly zero means it was not.

## The three interpretation checks

**Do the residuals share a sign?** Two or more of the same sign points at something systematic: datum, pick convention or a missed trend. Opposite signs point at local structure. On Ekene they are opposite, so no correction is appropriate.

**Is any summary statistic being quoted over fewer than about five residuals?** A mean over two is cancellation; a root mean square over two is dressing up. Quote them individually.

**Is a jackknife spread being quoted for more than one location?** It is a per-location quantity. One number for a whole map means someone computed it once and reused it.

## What a failed check means

Each of these fails differently and the responses differ.

A moving frame is a silent bias in every residual and is fixed by rebuilding the runs, not by adjusting the numbers.

A zero residual at a withheld well is a procedural error and the run has to be repeated.

An extrapolated prediction is not a validation at all and should be reported as a blank.

Opposite-signed residuals are a finding rather than a fault and the correct response is to write them down as they are.

## The check that costs one extra run

Add the new well to the control, then leave it out again.

On Ekene, the seven-well leave-one-out at Ekene-7 reproduces the blind residual exactly, at $-5.6728515625$ m. It must, because removing Ekene-7 from the seven-well set restores the original six wells, so the prediction is the same calculation.

That identity is a complete end-to-end test of the machinery: the frame, the settings, the sampling and the removal logic all have to be right for it to hold. A disagreement of any size means something in the pipeline differs between the two paths, and it is much easier to find that with a known answer in hand.

## Worked example

A validation report shows six residuals with a root mean square of 3.1 m, a mean of $-0.2$ m, and a note that all six wells were cross validated on a six-well field. What is wrong?

The count. A six-well field cannot have six cross-validatable wells unless every well is interior to the hull of the other five, which is geometrically impossible: the hull of any point set has at least three vertices, and those vertices cannot be interior to the rest.

So at least three of the six residuals are extrapolations, the mask was disabled or absent, and the summary statistics are dominated by numbers the map would never be asked to produce.

## Exercise

Name the three setup checks and say which of them the seven-well leave-one-out at Ekene-7 tests end to end. Then explain why a residual of exactly zero at a withheld well is a red flag.

As a self-check: the setup checks are one frame for every run, identical settings for every run, and a full-control run that reproduces the map being validated. The seven-well leave-one-out at Ekene-7 tests all three at once, because it must reproduce the blind residual of $-5.6728515625$ m exactly, which it can only do if the frame, the settings and the removal logic are all consistent between the two paths. A zero residual is a red flag because an exact interpolator returns its control value exactly at a control point, so a zero means the well was never actually removed from the set.
