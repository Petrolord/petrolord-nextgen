# Friction from the loss kernel

The same function the hydraulics course uses, called once per segment.

{{panel:cm-placement-explorer}}

## What is called

    elementLoss({ model, rhoKgM3, vMs, dCharM, kind, lengthM }).dpPa

which is the pressure-loss kernel from the Drilling Fluids and Hydraulics engine. This course does not have its own friction model; it imports one.

That is the right arrangement. A cementing engine that reimplemented pipe friction would be a second place for the same physics to be slightly different.

## What is passed, per segment

**The rheology model.** Each fluid carries a Herschel-Bulkley fit from its own Fann dial readings. The mud, the spacer, the lead and the tail all have different ones.

**The density.** The fluid's own.

**The velocity.** The pump rate divided by the local capacity. Inside the casing that is the constant inside capacity; in the annulus it is the row's capacity, so the velocity changes at the section boundary.

**The characteristic dimension.** Inside, the casing bore. In the annulus, the EFFECTIVE bore less the casing outside diameter, which is the hydraulic gap and which carries the excess with it.

**The kind.** `pipe` inside and `annulus` outside, which selects the correct geometry factors in the kernel.

## Segments with no rheology contribute nothing

    if (!model) return acc;

A fluid supplied without a rheology fit is treated as frictionless. That is not a failure mode, it is a feature the vertical fixture uses deliberately: none of its three fluids carries a rheology, so its friction is identically zero and its closed forms can be checked by hand.

It is also a silent trap on a real run. Forget the rheology on one fluid and its friction quietly disappears.

## Velocity depends on the excess

The annular velocity is the rate over the capacity, and the excess inflates the capacity, so a bigger excess means a SLOWER annular velocity and less friction.

On this well the two annular velocities are 1.4973771889585683 m/s in the cased section and 1.476222714457212 in the washed-out open hole. The open hole is the slower of the two despite being drilled with a smaller bit, because the 15 percent excess made it the wider annulus.

## The whole-path sum

    friction = frictionOver(inside) + frictionOver(annulus)

Both legs, added. There is no separate bit or shoe pressure drop: the float equipment and the shoe are treated as having no restriction, which understates the real friction by whatever the float equipment costs.

## Exercise

The annular velocity in the cased section is 1.4973771889585683 m/s at 0.02 cubic metres a second.

Compute what it would be at 0.03, and then say what the same change does to the velocity in the open hole section, whose capacity is 0.013548091222369345 square metres.
