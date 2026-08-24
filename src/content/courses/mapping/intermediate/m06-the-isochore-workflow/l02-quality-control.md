# Quality control

An isochore is easy to build and easy to build wrongly, and a wrong one looks like a map. This lesson lists the checks that catch the failures, cheapest first.

{{panel:mp-isochore-explorer}}

## The three arithmetic checks

Seconds each, and they pin the result at three unrelated points.

**Every mapped thickness is positive.** A negative value anywhere means the subtraction ran in the wrong order, or a well has its top and base swapped. The Ekene isochore runs 25 to 35.898 m and never approaches zero.

**The isochore mean equals the difference of the two surface means.** $1582.5211 - 1550.2668 = 32.2543$, which is the isochore's own mean. This holds because averaging is linear over the same live set, so a failure means the two surfaces do not share a live set.

**The isochore minimum is not the difference of the two minima.** $1570 - 1539.7181 = 30.28$, and the isochore minimum is 25. If those two ever agree it is worth understanding why, because it would mean both surfaces reach their extremes at the same node.

## The three geometry checks

**Do the two frames match?** Origin, cell size and node count, field by field. Better still, was there ever more than one frame?

**Do the two live sets match?** On Ekene both are 201 and the isochore keeps all of them. A base surface with fewer live nodes than the top is normal and must be reported; it is not an error, it is lost coverage.

**Does every well land where you think?** Five of the six Ekene wells sit on nodes and one does not. That is a property of the frame origin and the cell size, and it decides whether the honouring check can even run at a given well.

## The three control checks

**Sample the isochore at each well.** Expect the measured thickness exactly where the well lands on a node. Ekene returns 32, 29, 25, 31 and 34 exactly, and a blank at Ekene-2.

**Compare the map mean against the well mean, and expect them to differ.** On Ekene the gap is 1.088 m. A gap of zero is not reassuring; it would mean the area weighting happened to cancel, which is a coincidence rather than a confirmation.

**Refine the cell size and re-read the extremes.** The minimum should settle onto a well value and the maximum should too. Anything that moves away from the control under refinement is the fit inventing structure.

## What a failed check means

Each of these fails for a different reason, which is the point of holding nine of them.

A negative thickness is a sign error and is fixed in seconds. Mismatched frames make the whole map meaningless and cannot be repaired by adjusting anything downstream. A mismatched live set is not a fault at all but a coverage statement that has to reach the report. An extreme that will not settle under refinement is real spline behaviour that has to be described rather than removed.

The temptation in every case is to adjust a setting until the check passes. That converts a broken map into a tuned one, which agrees with whatever it was tuned to and with nothing else.

## The check that is hardest to run and worth most

Compare your isochore against one built the other way, by gridding the six well thicknesses directly.

On a disciplined workflow the two agree to rounding: on Ekene the largest disagreement anywhere is 0.00011 m. That agreement is a consequence of the spline being linear in its control values and both surfaces sharing the same control locations.

So a disagreement larger than rounding means one of those two conditions has failed: either the control locations differ between the surfaces, which usually means a missing pick, or the two surfaces were not gridded the same way. It is a single number that tests the whole workflow, and it costs one extra gridding run.

## Worked example

An isochore has a mean of 31.9 m, a minimum of minus 2.4 m and a maximum of 44 m, over 180 live nodes against a depth map's 201. What do the checks say?

The negative minimum fails the first check outright, so the map is not usable as it stands. A single node at minus 2.4 m in an otherwise positive map is not a global sign error, which would make everything negative; it is one well with swapped picks, or two surfaces crossing where the spline has overshot between sparse control.

The 180 against 201 is a separate finding and not a fault: the base surface has less coverage than the top, and the report must say the thickness map covers 90 percent of the mapped structure.

Fix the crossing first, then re-run every other check, because a sign problem invalidates the statistics that the other checks compare against.

## Exercise

Name the three arithmetic checks and state which of them would catch two surfaces that did not share a live node set. Then say what a disagreement between the subtraction route and the direct-gridding route implies.

As a self-check: the three are that every thickness is positive, that the isochore mean equals the difference of the surface means, and that the isochore minimum is not the difference of the two minima. The mean check catches a mismatched live set, because the equality only holds when both means are taken over the same nodes. A disagreement between the two routes larger than floating-point rounding means either that the two surfaces do not share their control locations, usually a missing pick in one of them, or that they were not gridded with identical settings.
