# Measured depth, not vertical

Every depth in this course is along the hole, and the distinction matters more in some calculations than in others.

## Two depths

Measured depth is distance along the wellbore from the datum. True vertical depth is the vertical component of that. In a vertical well they are the same and in a deviated well they are not.

Every depth in this course is a measured depth: the hanger, the component tops and bottoms, the packer, total depth and every casing section boundary.

## Why that is the right choice here

Because every quantity this course computes is a length along the hole or an area across it.

A component length is a length of steel, which is along the hole. A stack up adds those lengths, which stays along the hole. A volume is an area times a length along the hole, which is correct: the fluid fills the annulus along its path, not along a vertical line.

Nothing in this course integrates a pressure gradient, and a pressure gradient is the one thing that needs vertical depth.

## Where vertical depth would be needed

The moment you ask about a hydrostatic pressure, at the packer or anywhere else, you need the vertical depth, because pressure accumulates with height and not with distance travelled.

The moment you ask about a temperature you need it too, because the geothermal gradient is vertical. And the moment you ask about the axial load on the string, you need it, because the weight of a section is its weight per unit length times its length while the buoyancy depends on vertical depth.

All three of those belong to the Casing and Tubing Design course, and all three are why that course carries a survey and this one does not.

## The error if you confuse them

In a well with a long tangent at sixty degrees, measured depth exceeds vertical depth by a factor of two in that section. Using measured depth in a hydrostatic calculation would double the pressure.

Using vertical depth in a volume calculation would halve the volume, which is just as wrong and much less likely to be noticed, because the number would still look plausible.

## What this course guarantees

Every depth is measured depth, consistently, throughout. No calculation here mixes the two, because none of them uses the vertical one at all.

That is a smaller guarantee than it sounds, and it is worth stating explicitly, because a course that quietly used both would be impossible to check.

## Exercise

List the five kinds of depth this course uses and confirm that all five are measured depths.

Then name three quantities that would require true vertical depth, and say which course computes each.

Finally, say what would happen to the annulus volume in this course if somebody substituted vertical depths for measured ones in a deviated well.
