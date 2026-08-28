# Reporting a calibrated model

A calibration that is not written down is indistinguishable from a coincidence. This lesson is the write-up.

## The five lines

**The two volumes and the gap.** 12132366.897955146 stb against the booked 12139208.107496763, minus 0.056 percent.

**The convention each used.** Cell-centre clipping for the deck, area clipping with a full isochore for the booking. Without this the two numbers are not comparable and the agreement means nothing.

**What was held fixed.** Porosity, water saturation, formation volume factor, contact depth, and the volumetric engine itself. This is the list that makes the residual attributable.

**What was tuned, and that it was tuned.** The kriging regional mean, set by bisection so the deck's volume would land on the booking.

**What it cost.** 266 oil cells against 169, so a larger area at a thinner average column.

## The sentence

If only one line survives into a summary, use this shape:

> This model reproduces the booked volume to within a tenth of a percent under the cell-centre convention, with the kriging regional mean calibrated for that purpose, at the cost of a larger oil area than the booking.

Every clause is load-bearing. Drop the convention and the comparison is meaningless. Drop the calibration and the agreement reads as independent confirmation. Drop the cost and a reader will find it themselves.

## Where it goes

Both in the deck, as a comment near the top, and in the study document.

Decks outlive the documents that describe them. A deck carrying its own provenance can be picked up years later and understood; one without it is a set of numbers whose origin has to be reconstructed by somebody who was not there.

## The word to avoid

Validated.

The model was not validated against the booking. It was calibrated to it, and a calibration is not a test. Writing "validated" claims an independent check that does not exist, and the claim will be believed.

That distinction is worth defending even when a reviewer pushes back, because the alternative is a study that thinks it has evidence it has not got.

## What an independent check would need

Something the model was not tuned to reproduce.

A seventh well, drilled after the surface was made, whose top the model then predicts. A pressure survey the history match did not use. A tracer return the allocation did not assume.

Ekene has none of these spare. All six wells went into the interpolation, and the field has no independent structural data. So the honest closing line is that the static model is calibrated to the booking and carries no independent structural check.

That sentence is uncomfortable and it is the most useful one in the report, because it tells the next person exactly what to go and get.

## What to do with the uncertainty

Not hide it in a single number. If the regional mean is unconstrained, the model's volume is uncertain in a way the calibration has concealed rather than removed.

The standard response is a range: build the model at a shallower and a deeper regional mean, run the forecast on all three, and report the spread. That converts a hidden assumption into a stated sensitivity, which is what a reader can actually use.

## The misconception to avoid

"Documenting the tuning weakens the study." It is the only thing that makes it auditable. An undocumented calibration is discovered eventually, and when it is, everything else becomes suspect. A documented one is a decision a reader can agree or disagree with.

## Exercise

First, write the five-line reconciliation table for this model, with a value and a convention on every line.

Second, the study has no independent structural check. Describe the sensitivity study you would run instead, and say what you would report from it.
