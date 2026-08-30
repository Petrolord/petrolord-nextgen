# Vertical hydrostatics

Pressures from depth alone, and what is left out.

## The assumption

Every pressure in this course is a density times gravity times a true vertical depth.

No friction, no acceleration, no dynamics, and no dependence on what the fluid is doing.

## When that is exactly right

When nothing is moving. A shut-in well is a static column, and a static column's pressure IS density times gravity times height.

So the shut-in calculations, which are the formation pressure, the kill mud weight, the MAASP and the kick tolerance, are all on solid ground.

## When it is not

While circulating. The annulus has friction in it, so the pressure at the bottom while circulating exceeds the static value by the annulus friction, which is the equivalent circulating density from the previous course.

The kill sheet handles that with the slow circulating rate pressure, which is a measured friction term added to the drill pipe side. The annulus side gets no such term.

## What that costs

The MAASP compared against a casing pressure DURING circulation is being compared against a number that does not include the annulus friction below the shoe.

The pressure at the shoe while circulating is higher than the casing gauge plus the mud column, by the friction between the shoe and surface.

So the effective MAASP during circulation is LOWER than the static one, and the engine does not compute the difference.

## How much

At the slow circulating rates used for a kill, the annulus friction is small: a few bar rather than tens. The Drilling Hydraulics course computes it, and its equivalent circulating density uplift at a low rate is modest.

That is why the omission is tolerable, and it is why kills are circulated slowly.

## The other omission

Temperature. A mud column's density varies with temperature down the hole, and the true hydrostatic pressure is an integral rather than a product.

For a water-based mud the effect is a fraction of a percent and the compressibility partly offsets it. For an oil-based mud in deep water it is larger.

## What would be needed

A coupled thermal and hydraulic model, which is exactly what the previous course said it did not have either.

## The honest position

Static calculations are exact. Circulating ones carry an annulus friction term this engine does not compute, and the term is small at kill rates and would not be at drilling rates.

## Exercise

Estimate the annulus friction between the shoe and surface on the slant well at a slow circulating rate, using the Drilling Hydraulics course's numbers as a guide.

Then say what fraction of the MAASP it represents.
