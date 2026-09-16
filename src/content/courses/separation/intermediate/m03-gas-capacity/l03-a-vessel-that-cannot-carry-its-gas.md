# A vessel that cannot carry its gas

The 5.000000 ft and 6.000000 ft drums on ABANA-2 report gasCapacityOk false, with margins of 0.651911 and 0.938751. Both of them also report a length, a slenderness and a complete set of dimensions.

{{panel:fc-slug-explorer}}

## A full answer that is still a failure

| diameter ft | gas velocity ft/s | margin | length ft | L/D | carries the gas |
| --- | --- | --- | --- | --- | --- |
| 5.000000 | 3.003871 | 0.651911 | 59.572579 | 11.914516 | false |
| 6.000000 | 2.086022 | 0.938751 | 41.369847 | 6.894974 | false |
| 7.000000 | 1.532587 | 1.277745 | 30.394173 | 4.342025 | true |

The first two rows are fully dimensioned vessels. A fabricator could build the 6.000000 ft drum at 41.369847 ft from that row. It would separate less liquid out of the gas than the specification asked for, and every figure on the row would still be arithmetically correct.

## The engine says so in two places

The verdict appears as gasCapacityOk false, and the row carries a reason in its own list. The 5.000000 ft row reads gas-capacity and ld-out-of-band together, because it fails the capacity check and its slenderness of 11.914516 also sits outside a band of 3.000000 to 5.000000. The 6.000000 ft row carries the same pair.

Those two reasons are different kinds of finding. A slenderness outside the band is a preference that a project can restate. A capacity failure is the vessel not doing its job.

## The overloaded shape

The published gas-overloaded case shows the same failure with the volume turned up. A 6.000000 ft vessel takes gas at 2.829421 ft/s against a settling velocity of 0.500000 ft/s, for a margin of 0.176715 and gasCapacityOk false. Its gas length comes out at 16.976527 ft against a gas height of 3.000000 ft, and the controlling requirement on that vessel is gas rather than liquid.

A droplet in that vessel rides more than five times the height of the gas space before it lands, which is another way of saying most of them never do.

## What a failing row is good for

A failed row is still worth reporting, and the repaired engine reports it rather than dropping it. It tells a reviewer where the boundary sits: the family crosses from false to true between 6.000000 ft and 7.000000 ft, so anybody arguing for a smaller vessel now knows exactly what they are arguing against. A sweep that printed only the vessels that worked would hide that boundary and leave the reader guessing whether the smallest offered bore had ever been considered.

## The mistake

The mistake is reading down the length column. A sizing sweep that prints six rows of dimensions invites a reader to pick the one that suits the plot plan, and two of the six rows here describe vessels that fail. Nothing in the length of 41.369847 ft warns anybody.

The second mistake is trusting a sweep that reports only the rows it liked. The repaired engine returns every row with its own reasons attached, so the failures stay visible beside the successes, and a reviewer can see what was rejected and why.

## Exercise

Name the two ABANA-2 drums that cannot carry their gas, and give the margin, the length and the L/D for each. Then explain why the reason gas-capacity and the reason ld-out-of-band call for different responses from a project, and state what the published gas-overloaded case reported for its gas length and its gas height.
