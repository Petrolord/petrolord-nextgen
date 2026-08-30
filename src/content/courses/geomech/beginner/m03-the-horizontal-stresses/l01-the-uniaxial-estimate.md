# The uniaxial estimate

Where the two horizontal stresses come from when nobody measured them.

{{panel:gm-stress-explorer}}

## The idea

Imagine a block of rock buried under more rock, unable to move sideways because the rock beside it is doing the same thing.

Squeeze it vertically and it tries to bulge sideways. It cannot, so the neighbouring rock pushes back. That push is the horizontal stress.

## The formula

    Shmin = k0 x (Sv - alpha x Pp) + alpha x Pp + strain term

with k0 the ratio of horizontal to vertical EFFECTIVE stress under that no-sideways-movement condition.

SHmax is the same formula with the two tectonic strains swapped.

## Reading it in three parts

**The first term** is the effective vertical stress scaled by k0. That is the part that comes from burial alone.

**The second term** adds the pore pressure back, because the formula computes an effective stress and the output is a total one.

**The third term** is a tectonic contribution: the extra stress from the region being stretched or squeezed independently of burial.

## Why it is called uniaxial

Because the condition assumed is uniaxial strain: the rock is free to compress vertically and completely confined horizontally.

That is a reasonable picture for a thick flat-lying sedimentary sequence loaded by burial and nothing else. It is a poor picture near a fault, a salt body, or anywhere the region is actively deforming.

## What it produces in this profile

At 2000 m, with a Poisson ratio of 0.28 and the published strains:

| stress | value | as EMW |
|---|---|---|
| Shmin | 35988505.652777776 Pa | 1834.903134749266 kg/m3 |
| SHmax | 39894755.652777776 Pa | 2034.0664575965175 kg/m3 |

The two differ by 3906250 Pa, which is entirely the tectonic strain difference.

## What it does NOT know

Anything about faulting. The formula will happily return a horizontal stress larger than the overburden, or a stress state that no rock could sustain without slipping on an existing fault.

That is what the frictional bounds are for, two lessons from here, and it is the single most important qualification on this estimate.

## The honest label

This is a screening estimate. It is defensible where the assumptions hold, it is cheap, and it is what almost every well has instead of a measurement.

## Exercise

At 1000 m, compute Shmin by hand from the overburden, the pore pressure, k0 and the strain term, and check against the panel.

Then say what the answer would be with no tectonic strain at all, and what fraction of the total the strain term is.
