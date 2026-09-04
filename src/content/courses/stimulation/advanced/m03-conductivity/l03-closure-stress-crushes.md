# Closure stress crushes

The proppant you bought is not the proppant that ends up in the fracture, because the rock leans on it for the life of the well.

{{panel:st-pack-explorer}}

## The catalogue is a function, not a value

Pack permeability is quoted against closure stress, never as a single number. The published proppant is 20/40 ISP ceramic, and the engine carries it as this table of nominal pack permeability in darcies against closure in thousands of psi.

| Closure, kpsi | Pack permeability, darcy |
| --- | --- |
| 2 | 250 |
| 4 | 180 |
| 6 | 120 |
| 8 | 70 |

Read the two ends of that column. Between the shallowest and the deepest tabulated closure the pack loses most of what it started with, falling from 250 darcy to 70 darcy. Nothing about the grains changed. Only the load did.

The mechanism is grain crushing and rearrangement. Point contacts fail, fines are generated, and the fines migrate into the pore throats of the pack itself. A ceramic proppant is bought precisely to push that collapse further down the stress axis.

## What it costs the published job

The published closure stress is 38.13195 MPa, which is 5.530572 kpsi. That falls between the 4 kpsi and the 6 kpsi rows, so the engine interpolates log-linearly between 180 darcy and 120 darcy and lands on about 131.98 darcy.

So before any gel damage at all, closure has already taken roughly half of the 250 darcy the same proppant would deliver in a shallow, lightly stressed sand. That loss is charged straight to conductivity, and from there straight to dimensionless conductivity, which is why the published job comes out under the 1.6 optimum.

## What the engine refuses to do

The interpolation is clamped at the table edges. Ask for a closure below 2 kpsi or above 8 kpsi and the engine returns the edge value and raises a clamped flag rather than extrapolating the curve into stresses nobody measured. The catalogue rows are marked approximate planning data. A real design is governed by vendor conductivity cells measured to API RP 19D, not by this table.

## Exercise

Convert the published closure stress to kpsi and identify the two table rows the engine interpolates between.

State what fraction of the 2 kpsi permeability survives at the published closure, and then at the 8 kpsi row.

Say what the engine does, and what it flags, if you hand it a closure stress of 10 kpsi.
