# Reporting the gap

A reconciliation is only useful if it is written down. This lesson is about what to write and where, because the reconciliation is the part of a simulation study that gets questioned first and documented least.

## What to record

Five things, and they fit in a short table.

**The two volumes and their difference.** The deck's 12132366.897955146 stb against the booked 12139208.107496763 stb, a difference of minus six hundredths of a percent.

**The convention each used.** Cell-centre clipping for the deck, area clipping with a full isochore for the booking. Without this, the two numbers are not comparable and a reader cannot tell whether the agreement means anything.

**What was held fixed.** Porosity, water saturation, formation volume factor, contact depth and the volumetric engine. This is the list that makes the residual attributable.

**What was tuned, and that it was tuned.** The kriging regional mean was set so the deck's volume would land on the booking. Saying so converts an arranged agreement into a documented calibration.

**What it cost.** A larger oil area, 266 cells against 169, with a thinner average column.

## Where to record it

In the deck, as a comment block near the top, and in the study document. Both, because they have different readers and different lifetimes.

A deck outlives the document that described it more often than the reverse. A deck with its provenance in comments can be picked up years later and understood; a deck without them is a set of numbers whose origin has to be reconstructed by whoever inherits it.

## The sentence that does most of the work

If only one line survives, make it this shape:

> This model reproduces the [booked volume] to [tolerance] under [convention], with the [parameter] calibrated for that purpose, at the cost of [what moved].

Every clause is load-bearing. Drop the convention and the comparison is meaningless. Drop the calibration and the agreement reads as independent. Drop the cost and the reader will find it themselves and wonder what else was not mentioned.

## What not to write

"The model matches the volumetric booking." True, uninformative, and it invites the reader to assume the match was free.

"The model has been validated against the volumetrics." Wrong word. Validation is a test the model could have failed. This match was arranged, so it tested nothing; it calibrated something.

That distinction matters more than it sounds. A study that calls its calibration a validation has no remaining independent check on its static model, and does not know it.

## What an independent check would look like

Something the model was not tuned to reproduce. A well not used in the mapping and whose top the surface then predicts. A pressure survey the model was not history matched against. A tracer return the allocation did not assume.

Ekene has none of those spare, which is honest to say and is itself worth writing down: the static model is calibrated to the booking and has no independent structural check.

## The misconception to avoid

"Documenting the tuning weakens the study." It is the only thing that makes the study auditable. An undocumented calibration is discovered eventually, and when it is, everything else in the study becomes suspect by association. A documented one is a decision a reader can agree or disagree with, which is a much better position to be in.

## Exercise

First, write the five-line reconciliation table for this deck, with a value and a convention on every line.

Second, explain in two sentences the difference between calibrating a model against a number and validating it against one, and say which this deck did.
