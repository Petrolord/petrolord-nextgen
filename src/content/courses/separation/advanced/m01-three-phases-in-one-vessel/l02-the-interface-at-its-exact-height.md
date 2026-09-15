# The interface at its exact height

The water share fixes an area, and the interface is the depth whose circular segment has exactly that area. On AGBAMI that depth is 3.049149 ft, and it is found by inverting the segment area rather than by dividing the area by a width.

{{panel:fc-slug-explorer}}

## An area inverted, not divided

AGBAMI at 10.000000 ft and a level of 0.500000 gives the water 20.268340 ft2 of the 39.269908 ft2 of liquid. The engine asks which depth in a circle of 10.000000 ft produces a segment of 20.268340 ft2, and answers 3.049149 ft. The oil layer is what is left under the liquid surface, 1.950851 ft, and the two add to the liquid level of 5.000000 ft.

The inversion is exact to double precision. The engine bisects 100 times, so a depth turned into an area and back returns the depth it started from: a drum of 8.000000 ft at level 0.350000 has a depth of 2.800000 ft and an area of 15.678751 ft2, and that area returns 2.800000 ft.

## The rule that was retired

Before FC1-0 the layer thickness came from dividing the water area by the gas-liquid chord. On AGBAMI the chord at half full is the full diameter, 10.000000 ft, so the retired rule gave a water layer of 2.026834 ft against the exact 3.049149 ft.

A chord is the width of one line across the circle. A segment narrows toward the bottom of the drum, so a single width always overstates how much area a given thickness can hold, which understates the thickness. The error runs the same way on every case, and it ran into a carryunder check that was reading a water layer that was not there.

## The same gap across the published cases

| case | interface ft | water ft | oil ft | retired water ft | retired oil ft |
| --- | --- | --- | --- | --- | --- |
| proportionalSplitLiquidRetention | 2.540691 | 2.540691 | 2.459309 | 1.570796 | 2.356194 |
| explicit25pctWaterWaterRetentionSets | 1.826477 | 1.826477 | 3.173523 | 0.981748 | 2.945243 |
| thickOilWaterCarryover | 4.088701 | 4.088701 | 0.911299 | 3.020762 | 0.906229 |
| lowLevelSmallOilDropCarryunder | 1.249328 | 1.249328 | 1.750672 | 0.617770 | 1.544424 |
| gasOverloaded6ftGasControls | 1.524415 | 1.524415 | 1.475585 | 0.942478 | 1.413717 |

Every retired water figure sits below its exact one and every retired oil figure above, because the two layers have to share a fixed liquid depth and an understated water layer hands the difference to the oil.

## Why the direction matters

An understated water layer makes the water look thin, and a thin layer is quick to cross, so a rising oil drop appears to escape it in less time than it really needs. An overstated oil layer does the opposite to the falling water drop, which makes that check look harder than it is. One repair moved both verdicts, and only one of them moved toward safety.

## The mistake

The mistake is to take the chord for the interface because both are horizontal lines in the same drawing. The chord is the width of the gas-liquid surface and it is a width in ft. The interface is a depth measured from the bottom of the drum, and three-phase sizing places it. Neither number is available as a substitute for the other, and 10.000000 ft of chord against 3.049149 ft of interface on the same vessel is how far apart they can sit.

## Exercise

Give the AGBAMI water area, the interface depth it inverts to, and the oil layer above it, and show that the two layers add to the liquid level. Then state the retired chord rule, compute what it gives on AGBAMI, and explain why its error has the same sign on every published case.
