# Two retention lengths

Each liquid phase needs a length that gives it its own retention time in its own band, and a vessel has one length. The engine reports both figures, takes the larger, and names the phase that set it.

{{panel:fc-slug-explorer}}

## Where two lengths come from

A phase needs its retention volume divided by the cross-section it was given. On the AGBAMI pinned case the oil sits in 2.925687 ft of depth and needs 8.510368 ft of drum, while the water sits in 2.074313 ft of depth and needs 21.181362 ft. The requirement is 21.181362 ft and `retentionPhase` reads water.

The proportional case answers differently. Its split was built to make the two lengths agree, so the engine returns one liquid retention requirement of 12.311666 ft, with `phaseRetentionLengthsFt` null and `retentionPhase` null.

## Why null is the honest answer there

A null `retentionPhase` under a proportional split says the contest was never held. Reporting the oil as the controlling phase would be arbitrary, and reporting both as controlling would suggest a tie that survived a comparison. There is a tolerance for a genuine tie: two retention lengths that agree within a relative gap of 1e-9, the engine constant `RETENTION_TIE_REL`, leave `retentionPhase` null rather than letting floating point pick a winner.

| case | retention length ft | length ft | controlling | retentionPhase |
| --- | --- | --- | --- | --- |
| proportionalSplitLiquidRetention | 4.964382 | 4.964382 | liquid-retention | null |
| d2Probe10ftHalfFull40pctWaterExplicit | 4.964382 | 4.964382 | liquid-retention | null |
| explicit25pctWaterWaterRetentionSets | 7.943011 | 7.943011 | liquid-retention | water |
| thickOilWaterCarryover | 2.581478 | 2.581478 | liquid-retention | null |
| lowLevelSmallOilDropCarryunder | 8.263614 | 8.263614 | liquid-retention | null |
| gasOverloaded6ftGasControls | 0.689497 | 16.976527 | gas | null |

## Two contests, not one

The retention contest between oil and water is separate from the contest between liquid retention and gas capacity. On gasOverloaded6ftGasControls the retention requirement is 0.689497 ft and the vessel is 16.976527 ft long because the gas requirement is the larger, so `controlling` reads gas while `retentionPhase` stays null.

So a full reading of a three-phase result is two questions. Which requirement set the length, liquid retention or gas. And if it was liquid retention, which phase inside it, or neither.

## The mistake

The mistake is averaging. A reviewer who sees 8.510368 ft and 21.181362 ft and splits the difference has designed a vessel that gives the water less than its 8.000000 minutes, which is the retention time somebody wrote down because the water needed it.

The second mistake is assuming the oil always wins because oil is the product. On the AGBAMI pinned case the water wins outright, and it wins because the pin gave it the thinner band while leaving it the longer retention time. Phase importance has nothing to do with which requirement is larger.

## What sets each length

Nothing about the two lengths is decided by the droplets. The retention lengths come from rates, retention times and areas, while the droplet verdicts decide whether the vessel that results is acceptable at all. Reading one from the other gets the order of work wrong.

## Exercise

Give the two retention lengths on the AGBAMI pinned case, say which sets the requirement and what `retentionPhase` reads, and explain why the proportional case reports one length with `retentionPhase` null. Then state what `controlling` reads on gasOverloaded6ftGasControls and why the 0.689497 ft retention requirement did not set the vessel length.
