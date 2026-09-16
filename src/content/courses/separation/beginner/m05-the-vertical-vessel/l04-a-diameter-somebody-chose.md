# A diameter somebody chose

Vessels are bought in the sizes a fabricator rolls, so the real question is rarely what diameter the gas demands. It is which of the offered diameters works, and on ABANA-1 the smallest one on the list does not.

{{panel:fc-separator-explorer}}

## The same stream in five vessels

| diameter ft | liquid ft | height ft | L/D | gas velocity ft/s | margin | carries the gas |
| --- | --- | --- | --- | --- | --- | --- |
| 2.000000 | 11.169859 | 17.169859 | 8.584929 | 1.536071 | 0.949450 | false |
| 2.500000 | 7.148710 | 13.148710 | 5.259484 | 0.983085 | 1.483516 | true |
| 3.000000 | 4.964382 | 10.964382 | 3.654794 | 0.682698 | 2.136263 | true |
| 3.500000 | 3.647301 | 9.647301 | 2.756372 | 0.501574 | 2.907691 | true |
| 4.000000 | 2.792465 | 8.792465 | 2.198116 | 0.384018 | 3.797800 | true |

Every row holds the same stream, the same 35.091146 ft3 of retention volume and the same allowance. Only the diameter moved, and with it every other column.

## The row that fails

At 2.000000 ft the gas crosses at 1.536071 ft/s against a settling velocity of 1.458422 ft/s. The margin is the settling velocity over the gas velocity, 0.949450, and a margin below 1 means the gas is moving faster than a drop can fall. The vessel does not carry its gas, and the engine reports false rather than a dimension somebody could build.

It fails by about five parts in a hundred, which is the uncomfortable part. Nothing about the row looks wrong: it returns a liquid depth of 11.169859 ft, a height of 17.169859 ft and a slenderness of 8.584929, all perfectly ordinary numbers. The verdict is the only thing that says the vessel is unusable.

## Why the gas-required diameter did not warn anyone

The gas needs 2.052551 ft and the shop offers 2.000000 ft. The gap is five hundredths of a foot, and a reader rounding the requirement to two feet has taken a vessel with no margin and made it a vessel with negative margin.

A required diameter is a floor, so it rounds up and never down. That is the whole rule, and the 2.000000 ft row is what breaking it looks like.

The same trap catches anyone who takes the nearest offered size. Nearest is the right rule for a dimension with tolerance on both sides, and a required minimum has tolerance on one side only. Every column in the 2.000000 ft row prints a perfectly ordinary number, it is the narrowest and cheapest looking vessel on the list, and it is the only one that cannot do the job.

## The direction everything moves

The height falls and the margin rises with diameter, because the same liquid volume spreads over a larger floor while the same gas crosses a larger area. From 2.000000 to 4.000000 ft the height falls from 17.169859 to 8.792465 ft and the margin climbs from 0.949450 to 3.797800.

Both changes are improvements, which raises the obvious question of why anyone would not take the widest vessel. The answer is that a wider drum costs more steel per foot, and at 4.000000 ft the slenderness of 2.198116 is approaching a shape that is more a tank than a separator.

## The mistake

Choosing on height. The 2.000000 ft vessel is the cheapest looking row on any diameter basis and it is the one that cannot do the job. Feasibility is a separate question from size, and it has to be answered first.

## Exercise

Give the margin at 2.000000 ft and at 3.000000 ft and say what a margin below 1 means physically. Then explain why the gas-required diameter of 2.052551 ft must be rounded up rather than to the nearest offered size, and say which two columns improve as the vessel widens.
