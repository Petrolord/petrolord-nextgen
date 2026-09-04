# Working the capstone

There is a right order for a gas lift design, and most of what goes wrong comes from doing the steps in the wrong one.

{{panel:pd-unloading-explorer}}

## Write the inputs and the convention down first

A design is a string, not a list of valves, so every depth below an input you change will move. Record the kickoff and operating pressures, the decrement per valve, the transfer differential, the kill and unloading gradients, the bellows area, the port catalogue and the design gas rate before anything is computed.

The published `midDecrementKnifeEdge` case carries 1164.7 psia kickoff, 1064.7 psia operating, 26.75 psi per valve, 60.0 psi transfer differential, 0.46 psi/ft kill, 0.09 psi/ft unloading, a 0.77 in2 bellows and 600.0 Mscf/d. Every one is a decision somebody made.

## Space the string, then record how it stopped

Take the valve count and the stop reason together: 7 valves and `targetDepth` on the knife edge, against 6 valves stopping at 7207.583657538 ft at an unloading gradient of 0.12 psi/ft. A string that stopped short is a different object, and its stage numbers do not line up with one that reached bottom.

## Read the unloading sequence stage by stage

Do not stop at the warning list. Write the closing margin at each stage and each valve, because a warning carries no distance. The knife edge multipoints at stages 2, 3, 4 and 5, and its stage 5 margin is 0.124769727 psi at surface against 0.149791635 psi at valve depth by the published closing rule. Two independent evaluations of one edge, both small, agreeing in sign.

## Sweep the axis the verdict is nearest to

One axis, at the resolution its mechanism demands. Tenths of a psi per valve on the decrement, whose flip sits between 26.80 and 26.90. Catalogue crossings on the design gas rate, which reaches the verdict only through port selection and holds 0.124769727 psi from 400 to 1400 Mscf/d.

## Locate the injection point, then move the traverse

Record `limitedBy`. Pressure is a crossing, depth is the end of the table returned as an answer, and the two are not comparable.

Then halve the tabulation spacing once and read the depth again. If it moves, the first answer was not converged, and no reported residual will have said so: 4.67696e-3 psi came with a depth 1.317711139 ft off, and 1.5907e-2 psi with one 60.420814470 ft off.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Stop reason and valve count | Stated, and the same across anything compared |
| Every multipointing verdict | Reported with its margin, not as a warning |
| Nearest flip | Located by a sweep at the mechanism's resolution |
| Injection point | `limitedBy` stated, tabulation spacing stated, depth stable under one refinement |

Then the units: psia for pressure, Mscf/d for gas rate, ft TVD for depth, degF for temperature, psi/ft for gradients, in for ports.

## Exercise

Work the published knife edge case through the order, one line each: inputs, valve count and stop reason, the four multipointing stages with the stage 5 margin, the axis you would sweep and its step, and the injection point checks.

Then name the omission that would make a graded answer unauditable, and the number that closes it.
