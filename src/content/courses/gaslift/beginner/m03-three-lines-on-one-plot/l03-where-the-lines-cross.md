# Where the lines cross

Two things close the gap between the injection line and the transfer line, and only one of them is the designer's choice.

{{panel:pd-column-explorer}}

## The gap, stage by stage

On `westTexasOil` the surface injection pressure steps down 25.00 psi per valve, from 1014.7000 to 839.7000 psia across eight stages, while the transfer line rises 0.1 psi/ft with depth. What is left over is the head, and the head is what buys the next increment.

| Stage | Head, psi | Increment, ft |
| --- | --- | --- |
| Valve 2 | 703.559966806 | 1563.466503048 |
| Valve 3 | 548.606025184 | 1219.124638408 |
| Valve 4 | 419.802568739 | 932.894452784 |
| Valve 5 | 313.067352153 | 695.704880900 |
| Valve 6 | 224.894159876 | 499.764326349 |
| Valve 7 | 152.288961374 | 338.419771412 |

The head falls from 703.559966806 psi to 152.288961374 psi and the increments fall with it, from 1563.466503048 ft to 338.419771412 ft. The gas is not getting weaker. The injection line still gains pressure with depth, 201.016705 psi of it over 8000 ft. It simply gains far less than the 0.1 psi/ft the tubing side is gaining, while the surface end is being cut 25.00 psi at a time.

## Which of the two is doing the closing

`constantPressurePPO` answers that. It declares 0.00 psi per valve and holds 1114.7000 psia at every one of its six stages, so its surface pressure never falls at all. Its increments still shrink: 1826.240016740, 1575.994274277, 1360.182752078 and 1174.030990885 ft. The decrement accelerates the crossing. It does not cause it. The transfer line rising against a nearly flat injection line is enough on its own.

## A string runs out of room, not valves

`westTexasOil` places 8 valves against a declared limit of 12 and stops at target depth. `constantPressurePPO` places 6 against 10. `midDecrementKnifeEdge` places 7 against 12. `deepHighPressure` places 7 against 14 and stops on minimum spacing, its deepest mandrel at 8644.662255376 ft and still 1855.337744624 ft above its 10500.0 ft floor. Not one of the four exhausted its mandrels.

## The mistake

Reading the last increment as the recursion converging. `constantPressurePPO` drops from 1174.030990885 ft to 152.956208919 ft between its last two valves, and `westTexasOil` from 338.419771412 ft to 131.375432376 ft. Neither is the crossing arriving. Both are the final mandrel being pulled to target depth, and that branch returns before the minimum spacing test runs, so `westTexasOil` violates its own declared 250.0 ft minimum and `constantPressurePPO` its 200.0 ft minimum, in silence. The steepest looking convergence in the output is not convergence at all.

## What it refuses

The crossing is a crossing of straight lines whose gradients were typed in. It is exact arithmetic on assumed inputs, and no part of it tests whether the assumed inputs describe the well. The design also refuses to let the lines actually touch: it stops a declared differential short, 50.0 psi on `westTexasOil` and 100.0 psi on `constantPressurePPO`, so the crossing a design uses is always the one its author asked for.

## Exercise

List the `westTexasOil` heads and increments, and the `constantPressurePPO` increments beside them.

Then say which of the two designs proves that the surface decrement is not what closes the gap, and write the one sentence that makes the case.
