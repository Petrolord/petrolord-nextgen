# Half full is an assumption

At a level of 0.500000 the 8.000000 ft drum splits into 25.132741 ft2 of liquid and 25.132741 ft2 of gas, and the chord is the full diameter of 8.000000 ft. That symmetry is a special case of the geometry rather than a law of separators.

{{panel:fc-slug-explorer}}

## What half full buys you

| level fraction | liquid area ft2 | gas area ft2 | chord ft |
| --- | --- | --- | --- |
| 0.300000 | 12.682775 | 37.582708 | 7.332121 |
| 0.500000 | 25.132741 | 25.132741 | 8.000000 |
| 0.600000 | 31.489815 | 18.775668 | 7.838367 |

Only the middle row has equal areas, and only the middle row has a chord equal to the diameter. Every convenience that makes half full easy to sketch by hand belongs to that one level.

## What it costs when the level is lower

ABANA-2 at a level of 0.500000 needs 23.270539 ft of length for its liquid. Drop the level to 0.300000, change nothing else about the stream or the drum, and the same duty needs 46.113917 ft. The liquid area fell from 25.132741 ft2 to 12.682775 ft2, so the same retention volume has to lie in a narrower trough, and the only place left to put it is along the axis.

The gas side moves the other way in the same step. The gas area rises from 25.132741 ft2 to 37.582708 ft2 and the velocity falls from 1.173387 ft/s to 0.784681 ft/s, so the vessel gets better at carrying its gas at the same time as it gets worse at holding its liquid.

## The level is an operating setting

The level fraction is not a property of the vessel. It is where the level controller is set, and it can be moved on a running plant by anybody with the authority to move it. A drum sized at 0.500000 and run at 0.300000 is a drum with half the retention it was bought for, and nothing about the steel changed.

That is also why the level belongs in the record beside the dimensions. A length of 23.270539 ft is meaningless without the level it was sized at, because the same drum and the same stream give 46.113917 ft at a level somebody else considers normal.

## The mistake

The mistake is inheriting half full from a sketch. A drawing shows the liquid at the centreline because that is how a drum is drawn, a spreadsheet defaults to 0.500000 because somebody had to put something in the cell, and neither is a statement about the control philosophy of the plant. When a level has been stated, the stated level governs.

The second mistake is assuming the error is small. Between 0.500000 and 0.300000 the liquid length on this vessel roughly doubles, which is not a rounding difference, and it moves the slenderness with it.

## Exercise

Give the liquid area, the gas area and the chord for the 8.000000 ft drum at levels 0.300000 and 0.500000. Then state the liquid length at each of those levels for ABANA-2, give the gas velocity at each, and say why the two sides of the vessel improve and worsen in opposite directions as the level falls.
