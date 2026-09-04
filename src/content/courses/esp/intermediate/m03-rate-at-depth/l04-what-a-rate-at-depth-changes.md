# What a rate at depth changes

The duty rate is not a reporting detail. It selects a point on a curve, and everything after it is read at that point.

{{panel:pd-lift-explorer}}

## The chain it starts

| Case | Duty, bbl/d | Head per stage, ft | Efficiency | Stages | Shaft hp |
| --- | --- | --- | --- | --- | --- |
| gassyOffshore, published | 2750.400000 | 25.93855015 | 0.6929775821 | 192 | 125.69771587 |
| highWaterCut, published | 4098.400000 | 14.39891498 | 0.6745418519 | 264 | 172.55965200 |
| QUA-IBOE-4, teaching | 3011.561538 | 23.57901945 | 0.6706901367 | 172 | 95.41621294 |

Head per stage divides the head requirement to give the stage count, and brake power per stage multiplies it to give the shaft power. Move the duty and both move.

## It also picks the region

The region is a band around the best efficiency rate: below 0.75 of it the duty is downthrust, above 1.25 of it it is upthrust. The published golden design highWaterCut lands in downthrust and raises one warning: the duty sits left of the recommended range and the stages wear on the thrust washers. gassyOffshore and the teaching well QUA-IBOE-4, which is not a published case, both land in the recommended region. That warning is mechanical, not numeric. Nothing in the head, the efficiency or the power changes because of it.

## Why the tank rate lands somewhere else

The liquid at depth is 1.11000000 times the tank liquid rate on gassyOffshore, 1.02100000 on highWaterCut and 1.17300000 on QUA-IBOE-4. Designing on the tank rate reads the curve to the left of the duty by that multiple, which is enough to change the region band on a well that was already near an edge.

## The mistake

Correcting for gas twice. A designer who sizes on the total stream at depth and then also selects a gas handler has taken the vented gas out once and left it in once. The rate through the pump is the complete statement.

## What it refuses

The region flag and the inside the published range flag are labels on an answer, not refusals. A duty outside the published rate range still returns a head, an efficiency and a power, because the fit is a polynomial and a polynomial answers everywhere. Above 10 cSt it reports that the water curve overstates head and efficiency, then waits for Hydraulic Institute factors from the user rather than inventing them.

## Exercise

Read the head per stage, the efficiency and the region for all three duties in the panel.

Then rerun gassyOffshore on its tank liquid rate and record what the head per stage and the region become.
