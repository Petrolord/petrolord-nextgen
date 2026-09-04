# The droplet picture

One droplet, one size, one speed. That picture is small enough to solve on paper and it is the whole of what this engine believes.

{{panel:pd-droplet-explorer}}

## Why the droplet has a size at all

A droplet in a moving gas stream is held together by its interfacial tension and pulled apart by the dynamic pressure of the gas across it. The ratio of the two is the Weber number, and above a critical value the droplet shatters. The engine uses 30.0000. So the droplet that matters is the largest one that survives the gas going past it, and that size is set by the flow rather than chosen.

## Why the size then disappears

The same droplet is held up by drag and pulled down by its weight less buoyancy. Drag uses a coefficient of 0.4400, a rigid sphere in the Newton regime. Write the break-up condition and the force balance together and the diameter appears in both, so it cancels. What is left is a velocity that depends on exactly three groups and nothing else: the interfacial tension to the quarter power, the difference between the liquid and gas densities to the quarter power, and one over the square root of the gas density.

Everything else collapses into one number. The published value is 1.5935357894, and the engine reaches 1.5935346111 through its own derivation in field units, a relative difference of 7.3947e-7.

## What that one line then says

Published water at 60.0 dyne/cm and 67.0 lbm/ft3, gas gravity 0.65 and z 0.90.

| Station | Gas density, lbm/ft3 | Terminal velocity, ft/s |
| --- | --- | --- |
| 300.0 psia, 620.0 degR | 0.9432045725 | 13.0189530541 |
| 1000.0 psia, 620.0 degR | 3.1440152417 | 7.0706235386 |
| 2500.0 psia, 620.0 degR | 7.8600381043 | 4.3868983237 |

Three multiplications, no iteration and no convergence tolerance anywhere.

## The mistake

Believing the picture is a description of the tubing. Real tubing carries a spread of droplet sizes, droplets that merge and split on the way up, and liquid running as a film along the wall, a second transport mechanism this picture does not contain. A real droplet also deforms, and 0.4400 is a rigid sphere, so the drag it uses is not the drag the droplet feels.

## What it refuses

The picture never says how many droplets there are, so it never says how much liquid arrives at surface. It sorts one droplet into carried or falling back, and that is the entire verdict on offer.

## Exercise

In the panel, hold the fluid fixed and raise the pressure through 300.0, 1000.0 and 2500.0 psia at 620.0 degR, recording the density and the terminal velocity.

Then name the three groups the velocity depends on and say which of the three the station supplies.
