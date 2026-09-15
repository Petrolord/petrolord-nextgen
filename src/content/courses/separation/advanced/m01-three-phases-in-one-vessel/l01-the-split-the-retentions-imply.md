# The split the retentions imply

A three-phase vessel holds two liquids for two different times, and when nobody pins the interface the engine divides the liquid cross-section in proportion to the storage duty each phase brings.

{{panel:fc-slug-explorer}}

## Where the share comes from

AGBAMI carries 12000.000000 bpd of oil held 5.000000 minutes and 8000.000000 bpd of water held 8.000000 minutes, in a drum 10.000000 ft across at a liquid level of 0.500000. Duty is a rate times a time, so the water asks for 8000.000000 times 8.000000 barrel-minutes against the oil's 12000.000000 times 5.000000, and the water takes 0.516129 of the liquid cross-section.

Rate alone would have given the water 8000.000000 of 20000.000000 barrels a day, a share of 0.400000. The extra three minutes of water retention moved the split from 0.400000 to 0.516129, which is the whole point of a retention-proportional rule.

## The two areas

| figure | ft2 |
| --- | --- |
| liquid area at level 0.500000 | 39.269908 |
| water area | 20.268340 |
| oil area | 19.001568 |

The water area is the larger of the two even though the water is the smaller stream, and the two add back to the liquid area the level defines.

## One requirement, and one only

Because the split was built to give both phases the same length, the proportional case returns a single liquid retention requirement of 12.311666 ft. The field `phaseRetentionLengthsFt` comes back null and `retentionPhase` comes back null, because there is no second length to report and no phase that won a contest nobody ran.

That is a design choice worth stating plainly. The proportional split makes the two lengths agree by construction, so the engine reports one number and refuses to dress it up as a comparison.

## The mistake

The first mistake is reading 0.516129 as a water cut. A water cut describes what arrives at the inlet, and 0.400000 is that figure here. The share the vessel is divided by describes how much cross-section each phase needs to sit still for its own retention time, and the two agree only when the retention times are equal.

The second mistake is reversing the reasoning. The share follows from the retentions, so raising the water retention from 8.000000 minutes widens the water band and pushes the interface up. A reviewer who fixes the interface first and then argues about retention times has the dependency backwards.

## What the split refuses

The rule needs both rates and both retention times by name. Leave out the oil rate and the engine throws a SeparatorInputError on `qOilBpd` with the message "qOilBpd is required: the oil rate in bpd (a vessel with no oil to separate is a two-phase vessel) (got undefined)". Leave out the oil retention time and it throws on `oilRetentionMin`. Neither one is guessed, halved or defaulted, because a split built on a missing term is a split built on nothing.

## Exercise

Write the water share for AGBAMI and show the two barrel-minute figures it came from. Then say why the rate share of 0.400000 and the cross-section share of 0.516129 differ, and give the water area, the oil area and the liquid area at a level of 0.500000. Finally, explain why `phaseRetentionLengthsFt` and `retentionPhase` are both null on this case.
