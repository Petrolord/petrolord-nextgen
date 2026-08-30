# A string in compression in a hole

Why a long thin bar inside a slightly larger tube does not simply buckle away.

{{panel:ct-tubing-explorer}}

## The classical answer is wrong here

Euler's buckling load for a pinned bar of length L is

    pi squared x EI / L squared

For this tubing, EI is 295444.3330705022 N m squared and L is 2500 m, which gives about 0.47 N.

Half a newton, on a string whose three operating cases carry forces of hundreds of kilonewtons. If Euler applied, this completion would have buckled while it was being run.

## Why it does not apply

Because the string is not free to move sideways. It is inside a casing with a radial clearance of 0.03408680000000001 m, and it is lying in it under its own weight.

To buckle, it has to lift itself off the low side of the hole. That is a completely different problem from Euler's, and its answer depends on the weight of the string and on the clearance rather than on the length.

## What the limit depends on

Three things:

**Stiffness,** EI, because a stiffer string resists bending.

**Buoyed weight per unit length,** because a heavier string has to be lifted further against gravity to buckle.

**Radial clearance,** because a tighter hole gives the string less room to develop a wave.

Not the length. The formula contains no length at all, which is the second time in this tier that a length has dropped out of something that intuitively should contain it.

## The Dawson-Paslay form

    base = sqrt( EI x weight per metre x sin(inclination) / radial clearance )
    sinusoidal = 2 x base

The engine adds a helical limit at a fixed multiple of the same base, which the next lesson is about.

## The inclination

The sine of the hole angle appears because the restoring force is the component of weight pressing the string against the low side.

In a VERTICAL hole that sine is zero and there is no restoring force at all, so the sinusoidal limit collapses to zero and the string buckles under any compression. That is a real result and it is why the classical treatment of vertical tubing buckling is a different formula.

This engine passes an inclination of 90 degrees, treating the packer region as horizontal, which is the most stable orientation and the least conservative choice.

## Exercise

Compute the sinusoidal buckling limit for this string from the four inputs, using EI of 295444.3330705022, a buoyed weight of about 115.85 N per metre, an inclination of 90 degrees and a clearance of 0.03408680000000001 m.

Check your answer against 63373.03101988061 N.
