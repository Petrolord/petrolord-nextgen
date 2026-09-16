# Head belongs to the machine and pressure to the fluid

A centrifugal pump makes head. It does not make pressure. The pressure appears when a fluid of a particular density is standing in the head the machine made, and a different fluid in the same machine gives a different pressure.

{{panel:fc-pump-explorer}}

## One conversion, both ways

The OKONO duty head of 417.801018 ft on a fluid of specific gravity 1.040000 is a discharge pressure of 188.100891 psi. Convert that back and the engine returns 417.801018 ft.

The round trip closes, which is worth knowing because the two directions are separate exports and either could have been written with a different constant inside it. They were not. There is one packaging and it is used both ways.

## The same head on five fluids

Now hold the head and change only the fluid:

| gravity | head ft | discharge psi |
| --- | --- | --- |
| 0.620000 | 417.801018 | 112.137070 |
| 0.850000 | 417.801018 | 153.736305 |
| 1.000000 | 417.801018 | 180.866242 |
| 1.040000 | 417.801018 | 188.100891 |
| 1.250000 | 417.801018 | 226.082802 |

The head column never moves. The pressure column reads 112.137070 psi on the top row and 226.082802 psi on the bottom one.

That column is the whole lesson. The impeller is doing the same work on every row. It is spinning at the same speed and throwing the fluid out at the same velocity, so it raises every one of those fluids by the same height. What each fluid then weighs is what turns that height into a pressure.

## What this costs the power as well

The power chain of the previous lesson takes the specific gravity for the same reason. Hydraulic power is the rate times the head times the gravity, packaged into horsepower, so the same duty on a lighter fluid is less work and on a heavier fluid is more. Head is the one quantity in the chain that the fluid does not touch.

## Why the engines are written in head

This is the reason a pump curve is published in feet rather than in psi. A curve in feet is a property of the machine, so one catalogue serves every fluid the machine will ever be asked to move. A curve in psi would be a property of the machine and one fluid together, and it would have to be reissued for every service.

It is also why the duty point in this course is solved in feet. Both curves are in feet, the crossing is in feet, and the conversion to pressure happens afterwards, once, on the answer.

## The mistake

Taking a vendor's discharge pressure and using it on a different fluid. A pump quoted at 188.100891 psi on a produced water of gravity 1.040000 is quoted at 112.137070 psi on a light condensate of gravity 0.620000, and nothing about the machine changed. The number that travels between services is the head.

## Exercise

Give the OKONO duty head, its discharge pressure at gravity 1.040000, and the pressure the same head gives at gravity 0.620000. Then say in one sentence why pump curves are published in feet, and what a curve published in psi would have to be reissued for.
