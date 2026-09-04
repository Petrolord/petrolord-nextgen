# Where a design flips

Several inputs reach the multipointing verdict on the published knife edge, and they reach it in three different shapes.

{{panel:pd-unloading-explorer}}

## Bellows area, the other half of R

Bellows area and port area are the two halves of R. Hold the 0.25 in port and walk the bellows on the published `midDecrementKnifeEdge` case.

| Bellows, in2 | R | Stage 5 surface margin, psi | Multipointing stages |
| --- | --- | --- | --- |
| 0.29 | 0.169266846 | 44.648190227 | 2, 3, 4, 5, 6, 7 |
| 0.50 | 0.098174770 | 14.644783759 | 2, 3, 4, 5, 6 |
| 0.77 | 0.063749851 | 0.124769727 | 2, 3, 4, 5 |
| 0.90 | 0.054541539 | -3.758264661 | 2, 3, 4 |
| 0.99 | 0.049583217 | -5.848970334 | 2, 3 |

0.77 in2 is the published value. Bellows area is continuous, so this axis behaves like the decrement: the margin walks and the verdict is its sign. Larger bellows gives smaller R, and smaller R gives a lower margin, right across the sweep.

## The transfer differential, which changes the string

| dpTransferPsi, psi | Valve count | Deepest, ft | Multipointing stages |
| --- | --- | --- | --- |
| 40.0 | 7 | 9000.000000000 | 2, 3, 4 |
| 50.0 | 7 | 9000.000000000 | 2, 3, 4 |
| 60.0 | 7 | 9000.000000000 | 2, 3, 4, 5 |
| 80.0 | 8 | 9000.000000000 | 2, 3, 4, 5 |
| 100.0 | 8 | 9000.000000000 | 2, 3, 4, 5 |

60.0 psi is the published value. Between 50.0 and 60.0 psi the verdict gains stage 5 with the string unchanged, and by 80.0 psi the string has gained a valve. Two different kinds of change on one axis.

## The axis that invalidates the comparison

The unloading gradient changes the design so much that the stage numbers stop meaning the same thing. At 0.09 psi/ft the string has 7 valves and reaches 9000.000000000 ft, at 0.12 psi/ft it has 6 and stops at 7207.583657538 ft, at 0.15 psi/ft it has 5 and stops at 5890.993805513 ft, at 0.2 psi/ft it has 4 and stops at 4567.931487911 ft.

Stage 5 on the 0.09 psi/ft design tests valve 4 at 6871.141344247 ft. On the 0.15 psi/ft design there is no stage 5. A margin swept along this axis compares different valves in different strings, and the last three rows never reach target depth.

## The mistake

Plotting a margin against every available input and reading the steepest line as the most important one. Steepness depends on the units of the axis. What separates these axes is whether the string underneath stayed the same.

## What it refuses

Every row moves one input. Nothing here says what two changes do together, and a design that clears each axis alone can still sit on the wrong side of both.

## Exercise

Write the bellows area at which the stage 5 verdict turns false and the transfer differential at which the valve count changes.

Then say why the stage 5 margins at 0.09 and 0.15 psi/ft of unloading gradient cannot be compared.
