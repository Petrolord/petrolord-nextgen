# The chord, and what it is not

The chord is the width of the gas-liquid surface across the drum, 8.000000 ft on ABANA-2 at a level of 0.500000 and 6.928203 ft at a level of 0.750000.

{{panel:fc-slug-explorer}}

## The width at each level

| level fraction | liquid depth ft | gas-liquid chord ft |
| --- | --- | --- |
| 0.200000 | 1.600000 | 6.400000 |
| 0.300000 | 2.400000 | 7.332121 |
| 0.400000 | 3.200000 | 7.838367 |
| 0.500000 | 4.000000 | 8.000000 |
| 0.600000 | 4.800000 | 7.838367 |
| 0.750000 | 6.000000 | 6.928203 |

The chord rises to the diameter at half full and falls away on both sides of it. Levels 0.400000 and 0.600000 both read 7.838367 ft, because a chord the same distance above the centre is as wide as one the same distance below it. A chord on its own therefore cannot tell you whether the vessel is running high or low.

## Where a chord earns its place

The chord is the surface the gas sees when it looks down at the liquid, so it is the gas-liquid interface area per foot of vessel length.

## Three things the chord is not

It is not the oil-water interface. In a three-phase vessel the water lies under the oil and the level between them is placed by three-phase sizing from the split the retention times imply, at its own height on the circle. The gas-liquid chord is an entirely different surface, higher up, with no relationship to where the water stands.

It is not a length. A vessel length runs in feet along the axis of the drum and the chord is a width across it. Both are quoted in feet and they measure in different directions.

It is not an area. At half full the chord is 8.000000 ft and the liquid area is 25.132741 ft2, and nothing turns one into the other without the length.

## The mistake

The mistake this course keeps finding in old work is the gas-liquid chord passed into a carryunder or interface check as the height of the water layer. The chord is a width and the interface is a height, so the check was reading a layer that was not there, and it reported a verdict with no defect visible in the arithmetic. A number in feet that came from the wrong geometry is the hardest sort of error to see.

The plainer version is using the chord in the place of the diameter. They agree at a level of 0.500000, so a spot check at half full never catches it. At 0.300000 the chord is 7.332121 ft against a diameter of 8.000000 ft.

## Exercise

Give the chord at levels 0.300000, 0.500000 and 0.750000 on the 8.000000 ft drum, and explain why 0.400000 and 0.600000 share the value 7.838367 ft. Then state the three things the chord is not, and say why a check run at half full would not expose a chord used in the place of a diameter.
