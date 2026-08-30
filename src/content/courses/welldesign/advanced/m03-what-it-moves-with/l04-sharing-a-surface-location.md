# Sharing a surface location

Two wells from one slot, and the uncertainty that cancels.

{{panel:wd-clearance-explorer}}

## The situation

A sidetrack from an existing well. Two wells from the same slot. Two wells from adjacent slots on one template.

In each case the two wells share part of their position uncertainty, because they share part of their history.

## Why it matters

The combined uncertainty in the separation factor assumes the two wells' errors are independent and adds them in quadrature.

If they are not independent, that is wrong. Errors the two wells share do not contribute to their RELATIVE position at all: if the wellhead is 40 cm north of where the database says, both wells are 40 cm north, and the gap between them is unchanged.

Treating shared error as independent therefore inflates the combined uncertainty and understates the separation factor. The wells look closer than they are, and a plan that is actually safe is rejected.

## The kickoff mechanism

For a sidetrack, the sharing is exact down to the kickoff point: the two wells are the SAME hole above it.

The engine handles this with a kickoff depth. When one is supplied, it removes the reference well's covariance accumulated above that depth, keeping only what accrued below, so the comparison is between the two legs rather than between two independent wells.

Mechanically it slices each error source's covariance below the kickoff index rather than subtracting a matrix, which preserves the per-source structure.

## The one standard case with a kickoff

Of the eleven standard offsets, exactly one is specified with a kickoff depth, at 900 m.

That case is also the one whose separation factor is negative, and it is the one whose far-field factors differ slightly from the oracle. Both are noted in the module 5 lessons.

Its presence in the standard set is deliberate: shared uncertainty is a distinct piece of logic that the other ten cases do not exercise at all.

## What is shared without a kickoff

Even for two unrelated wells, some error sources are shared.

Both are surveyed against the same geomagnetic model at the same location, so a declination error affects both identically. That is what the GLOBAL propagation mode in the Professional tier marks.

Handling that properly requires knowing which sources are common between the two surveys, which requires knowing how each was surveyed. The full treatment is beyond the standard's basic method, and the standard's own documentation acknowledges it.

## The direction of the error

Worth stating clearly, because it is the opposite of the usual conservatism.

Ignoring shared uncertainty makes the calculation PESSIMISTIC: it reports the wells as closer than they are. So the error is in the safe direction, and the cost is rejected plans rather than collisions.

That is why the simplification is tolerable and why it is still worth correcting: a platform's shallow section can fail a scan that a correct treatment would pass, and the mitigation for a failed scan is expensive.

## The misconception to avoid

"Two wells from the same slot start from the same point, so their separation is exactly known at surface." Their separation is exactly known at the slot and diverges as soon as they are drilled, because each accumulates its own survey error below the kickoff. What is shared is everything ABOVE, and the kickoff mechanism exists to remove exactly that and no more.

## Exercise

Two sidetracks kick off from a common parent at 900 m and diverge. At 1500 m their computed centrelines are 22 m apart.

Say which parts of each well's position uncertainty should count towards their separation and which should not. Then say what would happen to the reported separation factor if the kickoff were not declared, and in which direction.
