# One valve at a time

Valve 2 has no depth until valve 1 has one, and the engine finds it by iterating a depth that appears on both sides of its own equation.

{{panel:pd-valve-explorer}}

## The fixed point behind one mandrel

Valve n sits where the injection line at that stage's surface pressure, less the transfer differential, still beats the transfer production pressure at valve n-1, with kill fluid filling the interval between them. Depth sets the injection pressure and the injection pressure sets the depth, so the engine iterates to 0.01 ft.

The published westTexasOil case runs a decrement of 25.00 psi per valve, a transfer differential of 50.0 psi and a kill fluid gradient of 0.45 psi/ft. Valve 1 sits at 2119.249994721 ft, its transfer production pressure is 326.624999472 psia, and the stage pressure for valve 2 is 989.7000 psia.

| Iterate | Injection at the trial depth, psia | Next depth, ft |
| --- | --- | --- |
| 0 | seed | 2369.249994721 |
| 1 | 1048.015754582 | 3611.229450521 |
| 2 | 1078.436825240 | 3678.831829762 |
| 3 | 1080.089990080 | 3682.505529404 |
| 4 | 1080.179819890 | 3682.705151205 |
| 5 | 1080.184701047 | 3682.715998220 |
| 6 | 1080.184966278 | 3682.716587623 |

It converges at 3682.716587623 ft against a published depth of 3682.716497769 ft.

## The seed carries no information

Iterate 0 is valve 1 plus the 250 ft minimum spacing, and the first step throws it 1241.979455800 ft deeper. A seed wrong by more than a thousand feet that still lands on the answer tells you the fixed point contracts hard, not that the guess was good.

## Increments shrink on the way down

From valve 1 the increments run 1563.466503048 ft, then 1219.124638408, 932.894452784, 695.704880900, 499.764326349, 338.419771412 and 131.375432376 ft. The surface pressure falls by a fixed amount per valve while the transfer pressure the valve has to beat rises with depth, so the head available to the next mandrel keeps thinning. A string runs out of room rather than out of valves: westTexasOil is allowed 12 valves and places 8.

## The mistake

Treating the eight depths as eight independent placements read off the well. They are one chain. Recompute valve 3 on its own and it agrees with the table, because it was handed valve 2 at 3682.716497769 ft. Move valve 2 and the same arithmetic gives a different valve 3 and a different valve 4, all the way down, with nothing in the output marking the rest as stale.

## What it refuses

The recursion knows nothing about whether the well flows: there is no IPR anywhere in the module. The annulus column is static, with no friction, no velocity and no injection rate in it, so every injection pressure in that iteration is a shut in gas column.

## Exercise

Run westTexasOil in the panel and record the increment from its neighbour for valves 2 through 8.

Then name the single number in the valve 2 iteration that proves the minimum spacing seed is a starting point and not an estimate.
