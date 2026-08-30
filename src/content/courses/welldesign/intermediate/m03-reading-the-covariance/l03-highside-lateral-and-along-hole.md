# Highside, lateral and along hole

Three numbers, three decisions.

{{panel:wd-uncertainty-explorer}}

## Along hole: the depth question

Along-hole uncertainty is how far the station might really be from where the depth counter says, measured along the well.

**What it decides.** Where a formation top actually is. Where a casing shoe actually is. Whether a perforation interval covers the sand it was meant to.

**What drives it.** The three depth-only sources: reference, scale factor and stretch. They are systematic, so this uncertainty grows roughly linearly with depth.

**Its size.** On the validation well at 8000 m of measured depth it is 10.554140502828378 m, or a bit over one part in a thousand of the depth. That is representative for a drill pipe tally.

Ten metres of along-hole uncertainty in a lateral is not a problem. Ten metres of along-hole uncertainty at a casing point that has to land in a particular shale is.

## Highside: the vertical question

Highside uncertainty is how far the hole might be above or below where it is computed, measured perpendicular to the hole in the vertical plane.

**What it decides.** Whether a horizontal well is in the reservoir. Whether the well passes above or below a shallow hazard. What a TVD-based pressure calculation is actually referenced to.

**What drives it.** Inclination errors, which come from the accelerometers and from assembly sag. Sag is worth naming: it is one of the few sources with a large vertical component, because it biases inclination directly.

**Its size.** On the validation well it is roughly twice the along-hole value. In a lateral in a three-metre reservoir window, a highside sigma of that size means the model cannot tell you whether you are in the pay, which is exactly why geosteering exists.

## Lateral: the collision question

Lateral uncertainty is how far the hole might be to the left or right, horizontally, across the well.

**What it decides.** Whether the target was hit. Whether the neighbour is safe. Where the drainage actually is.

**What drives it.** Azimuth errors: declination, magnetic interference, magnetometer bias. All systematic or global, all accumulating linearly, all worst in the geometry this well has.

**Its size.** Much the largest of the three on the validation well, more than four times the highside. That ratio is typical for a long horizontal magnetic survey and it is the single most important shape fact in this tier.

## Reading them as a set

The three together describe a cigar: short along its own axis, short vertically, long sideways.

That shape has a consequence people find counterintuitive. Drilling FURTHER does not proportionally increase the depth uncertainty, but it does increase the lateral one, because lateral error is an angle times a lever arm and the lever arm is the displacement.

A well that turns back on itself can even have its lateral uncertainty partially cancel, which is why the covariance has to be accumulated properly rather than approximated by a rule of thumb.

## When the ordering is different

**A vertical well.** Lateral and highside are both small and roughly equal; along-hole dominates. The ellipse is nearly circular in plan.

**A gyroscopic survey.** Azimuth is much better, so lateral shrinks towards highside and the cigar becomes rounder.

**A short well.** Everything is small, and the surface position uncertainty, which is not in this model at all, becomes the dominant term.

## The misconception to avoid

"Position uncertainty is one number." It is three, in different directions, driven by different sensors, and they differ by a factor of four or more on an ordinary well. Quoting one number means quoting the largest and pretending the well is equally uncertain in every direction, which is wrong in the direction that makes targets look harder to hit and neighbours look further away than they are.

## Exercise

For each of the three components, name the decision it governs and the sensor set that dominates it.

Then, for a vertical exploration well 3000 m deep, say which of the three you would expect to be largest and why that reverses the ordering on the validation well.
