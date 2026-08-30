# The flow path

Elements in series, and what the engine builds before it computes anything.

{{panel:hy-rheology-explorer}}

## The path

From the pump: down the standpipe and the kelly hose, down the inside of the drill pipe, down the inside of the heavy weight, down the inside of the collars, out through the bit nozzles, then back up the annulus between the collars and the hole, the heavy weight and the hole, and the drill pipe and the hole, all the way to surface.

Every one of those is a flow element with a length, a characteristic diameter and a velocity.

## What the engine builds

    buildFlowElements({ stations, string, geometry })

returns a list of pipe elements, a list of annulus elements, the depth of the bit, and a flag saying whether the hole geometry covered the whole string.

The pipe elements use the components' INSIDE diameters. The annulus elements use the hole diameter and the components' OUTSIDE diameters, and the characteristic dimension for an annulus is the difference between them.

## Why it is a series

Because the same mud goes through every element, one after another. The flow rate is the same everywhere and the pressure losses add.

That is the whole structure of the calculation:

    pump pressure = sum of pipe losses + bit loss + sum of annulus losses

with an optional surface loss for the standpipe and hose, which this course leaves at zero.

## Why the velocity differs everywhere

Because the areas differ. Velocity is flow rate divided by area, so the narrowest element has the highest velocity.

Inside the string, the collars' bore is the narrowest and the drill pipe's is the widest. In the annulus, the space around the collars is the tightest and the space in the big cased hole is the widest.

That is why the worst hole cleaning is in the largest annulus section and the worst pipe pressure loss is in the smallest bore, and neither of them is at total depth.

## The uncovered warning

If the geometry list does not describe the depth range the string occupies, the engine skips those annulus spans and warns.

It is a setup error rather than a result, exactly as the equivalent warning is in the torque and drag course.

## Exercise

Open the panel's chain view and read the element counts.

Then, from the string and hole dimensions in the previous lesson, compute the velocity inside the drill collars and inside the drill pipe at 0.025 m3/s, and say which one you expect to dominate the pipe pressure loss.
