# One element at a time

The friction factor form, and what goes into it.

## The expression

For any element of the flow path:

    dp = 2 f rho v^2 L / d

with f the Fanning friction factor, rho the density, v the velocity, L the length and d the characteristic diameter.

For a pipe, d is the inside diameter. For an annulus, d is the hole diameter less the pipe's outside diameter.

## The four things it needs

**The velocity**, which is the flow rate divided by the area. That is geometry.

**The density**, which is the mud weight.

**The length**, which is the element's measured depth span.

**The friction factor**, which is the only part that involves the rheology.

## Why the friction factor is the whole problem

Because it depends on the Reynolds number, which depends on the apparent viscosity, which depends on the shear rate, which depends on the velocity, which is what you are trying to find the pressure loss for.

For a Newtonian fluid that circularity is easy: the viscosity is a constant. For a shear-thinning fluid with a yield stress it is not, and the whole method specification the goldens name is about how to close it.

## The local power law

At each element the engine evaluates the Herschel-Bulkley model at that element's nominal shear rate and extracts a LOCAL power law: an n prime and a K prime that describe the fluid's behaviour near that rate.

Those two go into a generalised Reynolds number, and the friction factor follows from it.

The point of the method is that a single global n and K would be wrong nearly everywhere, and a local pair is right where it is evaluated.

## The characteristic dimension for an annulus

The hydraulic diameter of an annulus is four times the area over the wetted perimeter, which for concentric circles is exactly the difference between the two diameters.

That is a genuine result rather than an approximation, and it is why the annulus and the pipe can share one friction factor correlation.

## What the element form assumes

That the flow is fully developed, that the geometry is concentric, that the pipe is not rotating, and that the fluid properties are uniform.

None of those is exactly true in a real well, and the Expert tier names each one.

## Exercise

For the drill pipe in this course, 0.1086104 m inside diameter, compute the velocity at 0.025 m3/s.

Then do the same for the drill collars at 0.05715 m, and compute the ratio of the two velocities squared. That ratio is most of why the collars dominate the pipe pressure loss.
