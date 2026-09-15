# Stokes between two liquids

A drop moving through another liquid settles under Stokes law, and this engine works it in the field form the standards use, with a packaged constant of 1.78e-6 that sits a little below the SI derivation on every case.

{{panel:fc-slug-explorer}}

## The two forms of one law

The field form multiplies 1.78e-6 by the square of the droplet size in microns and the difference in specific gravity, then divides by the viscosity in cP. The SI derivation is g times the square of the diameter times the density difference, over 18 times the viscosity. Same physics, two packagings, and an oracle written independently in SI checks the engine on every published case.

| case | micron | heavy SG | light SG | cP | engine ft/s | oracle ft/s | ratio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| stokes500um | 500.000000 | 1.050000 | 0.850000 | 2.000000 | 0.044500 | 0.044686 | 1.004184 |
| stokes150um | 150.000000 | 1.020000 | 0.800000 | 5.000000 | 0.001762 | 0.001770 | 1.004184 |
| stokes1000um | 1000.000000 | 1.080000 | 0.900000 | 1.000000 | 0.320400 | 0.321740 | 1.004184 |

## A gap that is a convention

The ratio is 1.004184 on all three cases, in the same direction every time. That is the signature of a rounded constant rather than an arithmetic slip, because a slip in the working would move with the inputs. The field constant 1.78e-6 is a rounded packaging of the SI group.

This course keeps the field constant and states the gap, because the field form is what the standards and the vendor datasheets are written in. The number to carry is its size: four parts in a thousand, always low.

## Where four parts in a thousand can bite

The gap matters only where a residence time sits close to a droplet time. A drop needing 111.4796 s in a phase that stays 300.0000 s is nowhere near the edge. A case cut fine enough that the two times almost meet could turn a verdict on the constant alone, so any gate on droplet settling has to hold a tolerance wider than that.

## The square law

Velocity goes as the square of the droplet size and inversely with viscosity, which is the most useful fact in the calculation. In 4.000000 cP oil a water drop settles at 0.017500 ft/s at 500.000000 micron, 0.008575 ft/s at 350.000000 micron, 0.004375 ft/s at 250.000000 micron, 0.001575 ft/s at 150.000000 micron and 0.000700 ft/s at 100.000000 micron.

Halving the drop quarters the speed. A specification tightened from 500.000000 to 250.000000 micron asks the phase to hold the drop four times as long.

## What settling refuses

A drop with no size or no viscosity to fall through returns an object carrying an `error` string, "settling needs a droplet size and viscosity". A pair of phases the wrong way round returns "the heavy phase must be denser than the light phase". Neither is a throw, because both are fair questions the method has no answer for.

## Exercise

Give the engine and oracle velocities for stokes500um and the ratio between them, and explain why the same ratio on all three cases points at a constant rather than at a mistake. Then write the settling velocity of a 250.000000 micron water drop in 4.000000 cP oil and say how it follows from the 500.000000 micron figure.
