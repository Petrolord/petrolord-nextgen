# Flow area

The tubing enters the whole calculation once, as an area, and it enters nowhere else.

{{panel:pd-droplet-explorer}}

## One number stands for the string

The area is the circle of the inside diameter, and the engine carries it in ft2 while the catalogue prints it in in2.

| Inside diameter, in | Flow area, ft2 | Cross-section, in2 |
| --- | --- | --- |
| 3.548 | 0.0686585475 | 9.88683084 |
| 3.476 | 0.0659002292 | 9.48963300 |
| 3.068 | 0.0513379000 | 7.39265760 |
| 2.441 | 0.0324984725 | 4.67978003 |
| 2.041 | 0.0227202653 | 3.27171821 |
| 1.995 | 0.0217076689 | 3.12590433 |
| 1.610 | 0.0141377124 | 2.03583058 |

The droplet balance never sees a diameter. The gas density never sees one. Only the step from a velocity to a rate does, which is why a smaller string changes the answer at all.

## The square law, checked rather than assumed

Doubling the inside diameter from 2.441 in to 4.882 in multiplies the area by 4.0000000000. It runs the other way with the same force: 3.548 in carries 0.0686585475 ft2 and 1.610 in carries 0.0141377124 ft2.

At a fixed critical velocity the critical rate is proportional to that area, so the same station that needs a large rate through wide tubing needs a small one through narrow tubing. The gas has not changed. The area has. That single fact is the entire argument for a velocity string, and it is also why the same well can be healthy and loaded on the same day depending on what is hanging in it.

## Every published critical rate is a rate through 2.441 in

The twelve published velocity rows all quote their critical rate through one string, 2.441 in at 0.0324984725 ft2. Row 5 reads 2496.154595078 Mscf/d and row 11 reads 1683.378448943 Mscf/d, and neither number survives a change of tubing.

## The mistake

Handing the engine a nominal size or an outside diameter. The input is an inside diameter, and the function will happily accept 3.548 where 3.068 belongs and return 0.0686585475 ft2 instead of 0.0513379000 ft2. Nothing checks the number against a tubing catalogue, and the resulting rate looks entirely reasonable. A wrong area is the quietest error in the whole calculation, because it never produces an implausible answer.

## What it refuses

The area is an input, not a deduction. The module computes it from a diameter somebody typed and never asks whether that string is in this well.

Converting a rate to a velocity through zero area returns nothing rather than a number. That is the only geometric case it guards.

## Exercise

Compute the flow area of 2.441 in and of 1.610 in by hand and check them against 0.0324984725 and 0.0141377124 ft2. Then take one published critical rate through 2.441 in and say, without recomputing it, whether the rate through 1.610 in at the same station is larger or smaller, and roughly by what factor.
