# The laminar branch

Below a Reynolds number of 2100 the engine uses the laminar law, where the friction factor is 64.000000 divided by the Reynolds number. At 1500.0000 that gives 0.042666666667.

{{panel:fc-liquid-explorer}}

## One input, and no pipe in it

The laminar expression contains the Reynolds number and nothing else. No roughness appears in it, so on this branch the wall makes no difference to the friction factor at all: a coated pipe and a used steel pipe of the same bore give the same answer.

The numerator is an engine return as well, read back as the friction factor times its own Reynolds number below the branch. That is a real physical statement rather than a simplification. In laminar flow the fluid moves in layers and the wall roughness sits inside a layer that is not being stirred, so the bumps have nothing to disturb.

## The friction factor grows as the flow slows

| Reynolds number | f |
| --- | --- |
| 2099.0000 | 0.030490709862 |
| 2017.9688 | 0.0317150585 |
| 1500.0000 | 0.042666666667 |
| 1008.9844 | 0.0634301170 |

Because the Reynolds number is underneath, a slower or thicker flow gives a larger friction factor. Nothing puts a floor under that growth: the numerator is fixed at 64.000000 and the Reynolds number falls as far as a duty takes it, which is the branch behaving exactly as its law says.

## A small rate can be an expensive line

The published case of 150.0000 bpd through 2.067000 in over 5000.000000 ft is fully laminar. It runs at 0.418299 ft/s, its Reynolds number is 15.5476, its friction factor is 4.1163843599 and it spends 130.867123 psi.

Compare that with the 25.660631 psi the OGBIA line spends carrying 12000.000000 bpd. The small line moves a fraction of the duty and costs more pressure, because a narrow bore and a crawling velocity put it deep into a branch where the friction factor is enormous.

## What the golden says about it

The oracle agrees closely on that case, at a friction factor of 4.1163780818 and a loss of 130.866726 psi. The branch is simple enough that two independent implementations land on the same answer, which is worth knowing before meeting a band where they could not.

## What the branch costs on the built line

The viscosity walk puts the OGBIA line on this branch at 60.000000 cp and at 120.000000 cp, where it spends 37.305974 psi and 74.611948 psi. That is the same pipe carrying the same 12000.000000 bpd that cost 25.660631 psi at 2.500000 cp.

A line goes laminar through a heavy fluid, a narrow bore or a low rate, and a cold heavy crude in a small line can meet all three at once.

## The mistake

Assuming a low velocity is always a cheap line. Velocity and cost move together on the turbulent branch, and a line slow enough to go laminar can spend more pressure than a much larger duty in a much larger pipe.

## Exercise

Say what the laminar friction factor depends on and what it ignores. Then give the friction factor and the loss on the 150.0000 bpd published case, and say why a line carrying so little costs so much.
