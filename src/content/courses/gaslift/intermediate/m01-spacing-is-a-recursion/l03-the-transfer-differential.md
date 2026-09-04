# The transfer differential

The transfer differential is the pressure margin a valve is required to hold over the tubing at the valve above it, and it is subtracted once, at every mandrel, from the head that buys depth.

{{panel:pd-valve-explorer}}

## Where it enters the arithmetic

The head that carries the recursion from one valve to the next is the injection pressure at the trial depth, less the transfer differential, less the transfer production pressure at the valve above. On westTexasOil, at the converged trial depth for valve 2, the injection pressure is 1080.184701047 psia, the transfer differential is 50.0 psi, the transfer production pressure at valve 1 is 326.624999472 psia, and the head is 703.559701575 psi. Divide that head by the 0.45 psi/ft kill fluid gradient and you have the interval.

The transfer production pressure is itself a straight line: 114.7 psia at surface plus 0.1 psi/ft, which puts valve 1 at 326.624999472 psia and valve 2 at 482.971649777 psia.

## It is a toll, not a slope

| Case | Transfer differential, psi | Decrement, psi per valve | Valves |
| --- | --- | --- | --- |
| westTexasOil | 50.0 | 25.00 | 8 |
| midDecrementKnifeEdge | 60.0 | 26.75 | 7 |
| deepHighPressure | 75.0 | 40.00 | 7 |
| constantPressurePPO | 100.0 | 0.00 | 6 |

The decrement and the differential both cost depth and they cost it differently. The decrement is cumulative: by valve 8 on westTexasOil the stage pressure has fallen to 839.7000 psia from a kickoff of 1014.7 psia, seven decrements below it. The differential takes the same 50.0 psi at every valve and never compounds. Two designs can lose the same total head with completely different distributions of it down the string.

## The mistake

Treating the differential as a safety factor that can be raised for comfort. It is the only thing holding the string open on constantPressurePPO, where the decrement is 0.00 psi per valve and the surface pressure sits at 1114.7 psia at all six stages. Raise it there and the recursion loses its only source of stage to stage change. Raise it on a surfaceClose design and every increment below valve 1 shortens, which is the same lever as the decrement pulled in a different place.

## What it refuses

The unloading and transfer lines are straight lines on constant gradients that the caller declares, 0.1 psi/ft on westTexasOil and 0.12 psi/ft on deepHighPressure. A real unloading column is neither straight nor constant. The engine does not pretend otherwise, it simply takes the gradient as an input, so the differential is measured against a line somebody chose.

## Exercise

Read the head for valve 2 on westTexasOil in the panel and confirm it against the injection pressure, the differential and the transfer production pressure at valve 1.

Then say what happens to that head, in one sentence each, when the differential rises and when the decrement rises.
