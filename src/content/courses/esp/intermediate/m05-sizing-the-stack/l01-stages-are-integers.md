# Stages are integers

The stage count is a ceiling. It is never the division, and it is never rounded to nearest.

{{panel:pd-lift-explorer}}

## The division and the ceiling

`stageCount` divides the head required by the head one stage makes at the duty, and rounds up.

| Case | Head required, ft | Head per stage, ft | Before rounding | Stages | Rounded away |
| --- | --- | --- | --- | --- | --- |
| gassyOffshore | 4978.341767 | 25.93855015 | 191.92829740 | 192 | 0.07170260 |
| highWaterCut | 3797.140461 | 14.39891498 | 263.71017991 | 264 | 0.28982009 |
| QUA-IBOE-4 | 4032.187516 | 23.57901945 | 171.00742988 | 172 | 0.99257012 |
| IBENO-2 | 725.090193 | 22.53660704 | 32.17388454 | 33 | 0.82611546 |

QUA-IBOE-4 is the case to keep. It asks for 171.00742988 stages, so it is given 172, and 0.99257012 of a stage is bought to cover a fraction barely past a whole number. Nothing about that is a judgement call: a ceiling has no tolerance and no threshold, and a sliver of a stage costs a whole one.

## Where the head per stage comes from

It is one reading off the stage curve, at the duty rate, on the fluid in the pump, at the drive frequency. The published gassyOffshore design reads 25.93855015 ft at 2750.400000 bbl/d and 60 Hz on a fluid of specific gravity 0.8628600064, in the recommended region and inside the published range.

The published highWaterCut design runs at 50 Hz, so its 4098.400000 bbl/d maps back to an equivalent 4918.080000 bbl/d on the 60 Hz curve, and the stage makes 14.39891498 ft there. Slower drive, less head per stage, and 264 stages for a smaller requirement than the one 192 stages covers.

## The mistake

Rounding to nearest. On QUA-IBOE-4 that takes the count a stage below 172, and the shorter stack does not make 4032.187516 ft. Nothing in the report says so: either count looks plausible on a page, and no warning in this package fires on a stack that is short.

The second mistake is assuming the rounded away fraction is always small. Across these four cases it runs from 0.07170260 of a stage to 0.99257012 of a stage, and nothing about the well predicts which end you land on.

## What it refuses

`stageCount` returns NaN on a head per stage of zero and NaN on a negative head per stage, and those are the only two things it refuses. It does not check that the head per stage came from inside the published data. It does not check the region: highWaterCut is sized at 264 stages with the duty in downthrust and one warning raised, and the count comes back all the same.

A stage count is arithmetic on one stage reading, so every property of that reading, good or bad, is multiplied by the count. It is also arithmetic on one head requirement, and it inherits whatever gradient that requirement was converted at.

## Exercise

Divide each head requirement in the panel by its head per stage, write the unrounded figure, then round up.

Then find the case where rounding to nearest would change the answer, and say how much head its stack would then be missing.
