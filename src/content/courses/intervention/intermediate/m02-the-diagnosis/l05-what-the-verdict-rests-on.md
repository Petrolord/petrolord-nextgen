# What the verdict rests on

Four gates fire before a mechanism is named, and then one comparison names it. Nothing downstream of the gates has ever been checked against a published answer.

{{panel:pd-channel-explorer}}

## The four gates, with the words each one refuses in

A history of fewer than six samples is refused outright: "A Chan reading needs a history, not a handful of points. Six producing samples is the bare minimum and a useful reading wants far more." `minWor` is 0.1, and it is compared against the last sample ratio alone. A demonstration series climbing to 20.279117393 with its final reading replaced by a post shut in test of 0.060000000 comes back with no slope, no fit quality, no span and no confidence, on the note "The ratio is still only 0.060. There is no water problem here to diagnose, and nothing to treat."

`minR2` is 0.5, applied to the derivative fit. Below it the reading is refused with "The derivative scatters too much to carry a slope: the fit explains only 0.0 percent of it." Fit quality is a fraction in the returned object and a percentage in that sentence.

`minSpanDecades` is 0.4, applied to the span the derivative fit reports rather than to the window that was selected.

## Then one comparison

Past all four, the derivative slope is compared against `coningSlope` at -0.1 and `channellingSlope` at 1.3, and the mechanism follows. On teaching well ELELENWO-4, built for this course, the default window returns 1.442132492, which clears 1.3 by 0.142132492. That margin is the whole difference between a water shutoff squeeze returned as a candidate and one returned blocked.

## What no golden asserts

The published cases carry four labelled histories, a late derivative slope for each, five skin pairs, one geometry floor and one power law. They carry no expected mechanism, no expected confidence, no expected verdict, no expected refusal and no expected block reason. `chanDiagnosis`, `screenTreatments`, `rankTreatments` and `skinFromPiRatio` are asserted against nothing at all.

Two things in this module are genuinely checked. The log-log slope is checked against a Theil-Sen fit, the median of every pairwise slope, which agrees with the engine on the published power law to a difference of 0.0000e+0 on a slope of 1.350000000000. The skin uplift is checked against a full radial Darcy rate built in SI. Both are pure arithmetic. The part that returns a verdict is the part with no golden.

## The mistake

Treating a validated engine as a validated verdict. The arithmetic under the diagnosis is proven. The judgement built on top of it, the mechanism, the confidence and the recommendation, is untested code that has never been compared against a published answer.

## Exercise

Name the four gates and the threshold each one carries.

Then say, for a reading you trust, which of the numbers in front of you an independent oracle has ever checked.
