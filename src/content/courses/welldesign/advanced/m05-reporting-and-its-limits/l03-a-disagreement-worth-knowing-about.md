# A disagreement worth knowing about

Seven parts in a thousand, on the one case with a kickoff.

{{panel:wd-clearance-explorer}}

## The finding

Of the eleven standard clearance cases, ten agree with the published oracle at every station to between one part in a hundred million and three parts in ten thousand billion.

The eleventh, which is the only one with a kickoff depth, agrees exactly on its minimum separation factor and on its centre-to-centre distances, and differs by up to about seven parts in a thousand at some stations.

## Where the difference is

Not at the minimum. At the FAR FIELD, where the two wells are widely separated and the separation factor is above twenty.

The disagreement grows with distance from the kickoff, and the largest instance is a factor of about 20.35 against an oracle value of about 20.21.

## What it is not

It is not a difference in the geometry. The centre-to-centre distances agree to about five parts in ten thousand billion, which is machine precision, so both implementations find the same closest approach on the same arcs.

It is not a difference in the error model. That is validated separately against its own workbook to machine precision.

## What it is

A difference in how the shared covariance below a kickoff is re-based.

Both implementations remove the uncertainty the two wells share above the kickoff point. The engine slices each error source's covariance below the kickoff index; the oracle does something equivalent but not identical in the accumulation of the systematic terms.

The two agree where the retained covariance dominates, which is near the kickoff and at the closest approach, and diverge slowly where the removed part would have been largest.

## Why it does not matter for a decision

Because the disagreement is at separation factors above twenty, and the thresholds are 1.0 and 1.5.

A factor of 20.35 and a factor of 20.21 lead to identical decisions, identical mitigations and identical reports. The number is a long way outside the range in which it carries information.

At the minimum, where the number does carry a decision, the two agree exactly.

## Why it is stated anyway

Three reasons.

**It is real.** A difference from a published oracle is a difference, and burying it because it is convenient would be exactly the behaviour this course argues against everywhere else.

**It bounds what this implementation can claim.** The claim is: every decision-carrying number is reproduced, and one far-field family of numbers differs by under one percent in the one case with shared uncertainty.

**It is a signpost.** Shared-uncertainty handling is the least standardised part of this calculation, the standard's own documentation acknowledges it, and an implementation difference showing up exactly there is informative rather than surprising.

## The rule it illustrates

When two implementations of an agreed method differ, find WHERE they differ before deciding whether it matters.

A difference at the answer is a defect. A difference far from the answer, in a quantity that carries no decision, in the one case that exercises the least standardised piece of logic, is a documented limitation.

Reporting them as the same thing, in either direction, is the mistake.

## The misconception to avoid

"An implementation either matches the standard or it does not." Matching is a claim about a set of numbers, and the useful version of the claim names the set. This one matches every minimum, every geometry, and every station of ten cases out of eleven, and it differs by under one percent at far-field stations of the eleventh.

## Exercise

You are reviewing two anti-collision packages that disagree by 0.7 percent on some stations of one case.

Write the three questions you would ask to decide whether the disagreement matters, and state what answer to each would make you reject one of the packages.
