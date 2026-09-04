# Pump intake rate

Out of the several rates a well has at depth, exactly one is the duty, and the stage curve is read at that one and no other.

{{panel:pd-lift-explorer}}

## The definition

The rate through the pump is the liquid at depth plus whatever free gas survived the separator. The vented gas has gone up the annulus and is not in the impellers.

| Case | Liquid at depth, bbl/d | Gas through the pump, bbl/d | Rate through the pump, bbl/d |
| --- | --- | --- | --- |
| gassyOffshore, published | 2664.000000 | 86.400000 | 2750.400000 |
| highWaterCut, published | 4084.000000 | 14.400000 | 4098.400000 |
| QUA-IBOE-4, teaching | 2526.461538 | 485.100000 | 3011.561538 |

On the published golden design highWaterCut the separator efficiency is 0.0000, so the total stream at depth and the rate through the pump are the same 4098.400000 bbl/d. On the published golden design gassyOffshore they are not: the stream is 2952.000000 bbl/d and the duty is 2750.400000 bbl/d, because 201.600000 bbl/d went up the annulus.

## What is read at it

Everything the stage contributes. gassyOffshore at 2750.400000 bbl/d and 60 Hz reads a head per stage of 25.93855015 ft, an efficiency of 0.6929775821 and a brake power per stage of 0.6549201841 hp, inside the published range, in the recommended region. The teaching well QUA-IBOE-4, which is not a published case, reads 23.57901945 ft, 0.6706901367 and 0.5579653060 hp at 3011.561538 bbl/d.

## Frequency moves the reading, not the duty

highWaterCut runs at 50 Hz. Its duty is still 4098.400000 bbl/d, but the engine maps that back to an equivalent rate of 4918.080000 bbl/d on the 60 Hz curve, reads the curve there, and maps forward. The head per stage that comes back is 14.39891498 ft. The duty rate is a property of the well and the reference rate is a property of the reading.

## The mistake

Reading the curve at the total stream at depth. On gassyOffshore that is 2952.000000 bbl/d rather than 2750.400000 bbl/d, and it is the one place in the chain where the separator can be silently uninstalled: the gas is out of the impellers in the rate you should have used and back in the rate you did use. The error is a shift along the curve, so it changes the head, the efficiency and the region together.

## What it refuses

It reads the curve as though the fluid were single phase. A duty of 3011.561538 bbl/d carrying a gas volume fraction of 0.1610792254 is read exactly as the same rate of pure liquid would be, so no head degradation, no efficiency penalty and no surging behaviour appears in the numbers. Gas is present in the rate and in the density, and nowhere else.

## Exercise

Add the liquid at depth to the gas through the pump for all three cases and check the three duties in the panel.

Then read the head per stage on gassyOffshore at 2750.400000 and at 2952.000000 bbl/d, and record which way the error runs.
