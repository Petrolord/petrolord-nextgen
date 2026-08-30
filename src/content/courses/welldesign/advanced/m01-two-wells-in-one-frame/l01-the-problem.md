# The problem

Two holes in the same rock, and one of them was drilled twenty years ago.

## Where it arises

**Platform and pad drilling.** Slots are metres apart at surface and the wells must separate immediately below the mudline. Thirty wells from one structure is ordinary.

**Infill drilling.** A mature field has decades of wells, drilled with different tools, surveyed with different models, recorded in databases of varying quality.

**Relief wells.** The one case where the object is to INTERSECT, deliberately, and the same mathematics runs in reverse.

**Shallow gas and hazards.** Not another well, but the same geometry: stay a stated distance from a known object.

## What a collision costs

A wellbore intersected while drilling can flow. If the offset is a producer, its pressure is now in your annulus with no barrier. If it is an injector, you have an unplanned high-rate connection. Either way it is a well control event with two wells involved, and the standard outcome is losing both.

That is why the thresholds in this tier are conservative and why an anti-collision scan is a permit-to-drill item rather than an engineering nicety.

## What makes it hard

**Both wells are uncertain.** Each has its own ellipse from the Professional tier, and they are of different sizes because they were drilled with different tools in different decades.

**The uncertainties are partly shared.** Two wells from the same slot share their surface position, and both are surveyed against the same geomagnetic model. Treating those as independent overstates the combined uncertainty; ignoring the sharing entirely understates it.

**The geometry is continuous.** The closest approach between two wells is generally NOT at a survey station of either one; it is somewhere on an arc between stations, and it has to be solved for.

**The offset's survey may be a plan.** If the neighbour has no definitive survey, what you are clearing against is where somebody intended it to go.

## The output

A separation factor at every station of the reference well: a dimensionless number that is greater than 1 when the wells are further apart than their combined uncertainty at the chosen confidence, and less than 1 when they are not.

Plus the depth at which the minimum occurs, the geometry at that depth, and a classification against agreed thresholds.

## What this tier uses

The ISCWSA standard clearance example: one reference well of a hundred stations to 2940 m, and eleven offset wells, with published per-station separation factors and an independent oracle.

Every one of the eleven is reproduced here. Five of them are below the no-go threshold. One of them goes negative.

That set exists for the same reason as the error model's validation well: so that two implementations can be compared on a case whose answer is agreed.

## The misconception to avoid

"Anti-collision is a distance check." It is a distance check divided by an uncertainty, and the uncertainty is usually the larger term. Two wells fifty metres apart can be a no-go and two wells thirty metres apart can be clear, depending entirely on how well each one's position is known.

## Exercise

List four situations in which an anti-collision scan is required, and for each, say whether the offset's position is likely to be a definitive survey or a plan.

Then say which of the four you would expect to have the largest uncertainty on the offset well, and why.
