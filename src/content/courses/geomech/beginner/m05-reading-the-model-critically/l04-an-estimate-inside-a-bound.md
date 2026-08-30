# An estimate inside a bound

The distinction the whole module has been building to.

{{panel:gm-stress-explorer}}

## Two statements of different kinds

**"Shmin is about 36 MPa at 2000 m."** An estimate. It says where the value probably is, given a model of how the rock got there.

**"Shmin at 2000 m cannot be below 29111960.636391964 Pa or above 97179541.99562845 Pa."** A bound. It says what the value cannot be, given that the crust has faults in it and they have not all slipped.

## The engine keeps them apart

It computes the estimate, then clamps it into the bound, then COUNTS how often it had to.

That count is the honest part. A clamped value is not the estimate any more: it is the edge of the range the estimate was supposed to lie in.

## What the engine's own header says

That a legacy version of this model mixed the two, and that the clamps are counted and reported precisely so they cannot be mistaken for predictions.

That is a note about software written by somebody who had been bitten. It is worth reading as a warning rather than as history.

## Reading a clamped output

A clamped Shmin means: the estimate said something the crust cannot sustain, so here is the most it could be.

The true value is somewhere at or below the bound, and the model has nothing further to say about where.

## The four clamps in this profile

At the published parameters, four of 52 samples are clamped, all at the top.

At 50 m both horizontal stresses come out at exactly 2531747.107419281 Pa, because both were pushed above the passive limit and both were pulled back to it. Two stresses agreeing exactly is a signature of clamping rather than a physical result.

## The signature to look for

**Two stresses exactly equal.** Almost never physical, almost always a clamp.

**A stress sitting exactly on a bound.** Same thing.

**A clamp count above zero with no comment in the report.** The commonest failure of all, because the count is easy to compute and easy not to look at.

## The rule to carry

Ask of every stress number: is this an estimate, a bound, or a measurement?

Estimates carry the model's uncertainty. Bounds are one-sided and often loose. Measurements are rare and are what everything else should be calibrated to.

A report that does not label them is asking you to treat all three the same, and they are not the same.

## Exercise

At 2000 m, compute both frictional bounds and confirm the published Shmin sits comfortably inside them.

Then find, in the panel, a friction angle low enough that 2000 m becomes clamped, and say what that would mean about the field.
