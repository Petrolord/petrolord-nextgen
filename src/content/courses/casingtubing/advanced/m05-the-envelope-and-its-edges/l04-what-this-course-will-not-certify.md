# What this course will not certify

The line between what is taught and what is graded.

## The claim

This tier teaches several things that no capstone field asks for, deliberately, and the go-live migration asserts it.

## Taught and not graded

**Buckling length change.** Discussed in module 3 and module 4, computed nowhere, graded nowhere.

**Annular pressure buildup.** Named as the missing coupling in module 5, computed nowhere.

**Erosional velocity as a design limit.** Computed, taught, and not graded, because a screening correlation should not be the thing a certificate says somebody can produce.

**Connection sealing and compression ratings.** Named in the Associate tier as the boundary of the efficiency table, not carried by the catalog and not gradeable.

**Casing wear.** Named in both lower tiers as the reason the ratings should really be recomputed, and it belongs to a different course.

**Fatigue.** Named, not modelled.

**Temperature derating of the yield strength.** Named in the Professional tier, not modelled.

## Why the distinction matters

A course that TEACHES a topic is saying it is worth knowing about.

A course that GRADES a topic is saying two further things: that the learner can produce the answer, and that the answer is worth producing.

For every item on the list above, at least one of those two further claims would be false. Either this engine cannot produce the answer at all, or it can produce a screening version that should not be certified.

Keeping the two claims apart is the whole point of having the list.

## What IS graded, and why each one earns it

**Piston, ballooning and thermal forces.** Closed forms with published derivations, exact given their inputs, and independently reproduced by a numpy oracle.

**The total.** The sum of the three, so it also checks that the signs were understood.

**The helical limit.** A closed form with an exact ratio to the sinusoidal one, so it can be checked two ways.

**The total length change.** Three closed forms added, and it is what the stroke verdict is made of.

Six quantities, all exact, all reproducible, and none of them a screening correlation.

## The assertion

The go-live migration for this course refuses to run if any capstone field name matches a pattern from the not-graded list: buckling length, annular buildup, erosion, wear, fatigue, connection sealing or temperature derating.

That is a scope decision written as a check, so that a later edit that quietly added an erosion field would be stopped rather than reviewed.

## Exercise

Take the seven items on the not-graded list.

For each, say which of the two claims fails: that the learner could produce the answer, or that the answer is worth producing.
