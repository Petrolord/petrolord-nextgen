# Plunger area

One diameter, squared. Every load and every volume in a rod pump design is downstream of it, and it is the fastest moving number in the whole calculation.

{{panel:pd-string-explorer}}

## The catalogue of plungers, with what each one pulls

| Plunger, in | Area, in2 | Fluid load at 1950 psi, lb |
| --- | --- | --- |
| 1.0625 | 0.886640895 | 1728.949746 |
| 1.2500 | 1.227184630 | 2393.010029 |
| 1.5000 | 1.767145868 | 3445.934442 |
| 1.7500 | 2.405281875 | 4690.299657 |
| 2.0000 | 3.141592654 | 6126.105675 |
| 2.2500 | 3.976078202 | 7753.352494 |
| 2.5000 | 4.908738521 | 9572.040116 |
| 2.7500 | 5.939573611 | 11582.168541 |

The diameters on that list read like a size chart, evenly spaced and unremarkable. The areas and the loads do not: they move as the square, so the step from 2.5000 in to 2.7500 in adds more load than the whole 1.0625 in plunger carries.

## The area is not the rod that carries it

The 1.7500 in plunger has an area of 2.405281875 in2. The 7/8 rod that might carry it has an area of 0.601320469 in2, and the 3/4 rod under it has 0.441786467 in2. The pump end of the design is wide and the string is narrow, which is the whole reason a fluid load of 4690.299657039 lb stretches the published taper 17.560655738 in.

## Where the area is used, and where it is not

The area is used for the fluid load: differential times area, exactly. It is not what the displacement constant multiplies. The engine's PUMP_CONSTANT of 0.116571155977 already contains pi over four, so the quantity it eats is the diameter squared and not the area. Feeding it an area applies pi over four a second time.

## The mistake

Choosing a plunger to hit a rate and then checking the load afterwards. Both come from the same square, so they cannot be traded against each other: going from 1.7500 in to 2.5000 in to raise volume also takes the fluid load from 4690.299657 lb to 9572.040116 lb, and every pound of that lands on the same rod string, is checked against the same structural capacity, and stretches the string further before the plunger moves.

## What it refuses

The area calculation refuses nothing and checks nothing. It will square any diameter handed to it, and a plunger larger than the tubing it is meant to sit in returns an area like any other. The barrel, the tubing and the pump bore are not modelled, so the only limit on plunger size in this engine is the limit a designer brings.

## Exercise

Read the area and the fluid load for the 1.5000, 1.7500 and 2.0000 in plungers at 1950 psi of differential.

Then say which of the two is the reason a plunger cannot simply be made bigger.
