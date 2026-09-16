# A limit that is not a pressure drop

The erosional check and the pressure drop read the same velocity, 2.244621 ft/s, and then ask different questions of it. One asks what the line costs. The other asks whether the line survives.

{{panel:fc-liquid-explorer}}

## What they share, and what they do not

The velocity the erosional check reads is the same velocity the pressure drop read, 2.244621 ft/s, and the flow area behind it is the same 0.347410 ft2. The density is in both as well. The 54.500000 lb/ft3 sits inside the velocity head that the pressure drop is built on, and it sits under the square root that gives the ceiling of 13.545709 ft/s.

What the pressure drop asks for and the erosional check never does is the length, the roughness and the viscosity, the last of the three reaching the loss through the Reynolds number. Lengthen the OGBIA line and the 25.660631 psi grows while the 13.545709 ft/s ceiling does not move at all. Change the density instead and both move, and they move opposite ways: the velocity head rises with it while the ceiling, which carries it under a root, falls. The density table shows that second half, where 45.000000 lb/ft3 is allowed 14.907120 ft/s against 13.545709 ft/s at 54.500000.

## The same ceiling on every bore

| nominal | schedule | bore in | velocity ft/s | erosional ft/s | ratio | inside the limit |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | 40 | 2.067000 | 33.463911 | 13.545709 | 2.470444 | false |
| 3 | 40 | 3.068000 | 15.189621 | 13.545709 | 1.121360 | false |
| 4 | 40 | 4.026000 | 8.820843 | 13.545709 | 0.651191 | true |
| 8 | 40 | 7.981000 | 2.244621 | 13.545709 | 0.165707 | true |
| 16 | 40 | 15.000000 | 0.635441 | 13.545709 | 0.046911 | true |

The erosional velocity is 13.545709 ft/s on every row, because it depends on the density and the c factor and not on the bore. What changes down the table is the velocity that has to sit under it.

## Why the studio prints both

The Pipeline and Line Sizing Studio puts an RP 14E verdict on every row of its sizing sweep, and that is what stops a bore being chosen on pressure drop alone. A 2 in schedule 40 line is cheap to buy and it fails this check at a ratio of 2.470444, which no amount of pressure budget makes acceptable.

## Two verdicts of different kinds

A pressure drop is a cost, and a cost can be traded against pumping, against the bore, or against the route. An erosional verdict is a boolean about the wall, and a line that reads false on it is asking for a different bore rather than a larger allowance.

## Three rows fail, and here the cost agrees with them

The 2 in and 3 in rows come back false at ratios of 2.470444, 2.807374 and 1.121360. Their pressure drops on this duty are 20803.315944, 28841.350797 and 2820.384450 psi, so on this line the two criteria remove the same rows.

That agreement belongs to this line. A short line at a high rate can post an affordable pressure drop and still sit above its ceiling, and then the boolean is what stands between the design and the wall.

## The mistake

Sizing on pressure drop and checking erosion afterwards as a formality. Here the two criteria happened to agree, so the formality would have cost nothing, and a habit that works because of a coincidence is a habit that has not yet been tested.

## Exercise

Say what the erosional check and the pressure drop share besides the velocity, and name three things the pressure drop needs that the erosional check never asks for. Then say why the erosional velocity is identical on every row of the bore table, and what changes instead.
