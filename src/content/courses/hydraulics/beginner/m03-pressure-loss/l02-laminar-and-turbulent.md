# Laminar and turbulent

Two friction factor laws, and the number that chooses between them.

## The Reynolds number

    Re = rho v d / mu_effective

with the effective viscosity taken from the local power law. It is the ratio of inertial to viscous forces, and it decides which regime the flow is in.

For a shear-thinning fluid the definition is generalised, so that the transition happens at roughly the same Reynolds number as it does for a Newtonian fluid.

## Laminar

Below the critical Reynolds number the flow is orderly: layers of fluid sliding over one another with no mixing across them.

    f = 16 / Re   in a pipe
    f = 24 / Re   in an annulus

The 16 and the 24 are exact results for the two geometries, derived rather than fitted. An annulus has more wall per unit of area, so it costs more.

In laminar flow the pressure loss is proportional to the velocity to the FIRST power for a Newtonian fluid, and to a power between n and 1 for a shear-thinning one.

## Turbulent

Above the transition the flow is chaotic: eddies carry momentum across the flow and the effective resistance rises sharply.

    f = a / Re^b

with a and b functions of the local flow behaviour index. This is the Bourgoyne form and it is an empirical correlation rather than a derivation.

In turbulent flow the pressure loss is proportional to roughly the velocity to the power 1.8, which is much steeper than laminar.

## Where each one is

**Inside the drill pipe** at drilling rates: turbulent, comfortably. The velocities are metres per second in a small bore.

**In the annulus**: usually laminar, sometimes transitional. The velocities are around one metre per second in a much larger space.

That difference matters. The pipe loss responds steeply to flow rate and the annulus loss responds gently, which is why the pump pressure rises much faster with rate than the equivalent circulating density does.

## Why laminar in the annulus is wanted

Because a laminar annulus carries cuttings better at the same velocity, erodes the hole less, and costs less pressure.

A turbulent annulus is a sign the flow rate is high enough to be causing problems, and in soft formations it washes the hole out.

## Exercise

The pipe loss on the slant well with kcl_polymer goes from 3316099.4156169523 Pa at 0.015 m3/s to 14277397.13302024 Pa at 0.035.

Compute the exponent that relates the two, as the log of the pressure ratio over the log of the rate ratio. Say which regime that exponent implies.
