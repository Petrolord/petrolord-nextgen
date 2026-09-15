# The gas space

The gas space in a horizontal vessel carries two separate duties, and the cross-section gives a different number for each: an area the gas flows through, and a height a droplet has to fall across.

{{panel:fc-slug-explorer}}

## Two numbers from one cut

| level fraction | gas area ft2 | gas height ft |
| --- | --- | --- |
| 0.200000 | 43.108759 | 6.400000 |
| 0.300000 | 37.582708 | 5.600000 |
| 0.400000 | 31.489815 | 4.800000 |
| 0.500000 | 25.132741 | 4.000000 |
| 0.600000 | 18.775668 | 3.200000 |
| 0.750000 | 9.826958 | 2.000000 |

The gas area is what the total 50.265482 ft2 has left after the liquid takes its share. The gas height is the diameter less the liquid depth, so on the 8.000000 ft drum at a level of 0.300000 it is 5.600000 ft, and at 0.750000 it is 2.000000 ft.

## The area sets the velocity

ABANA-2 carries 110.000000 MMscfd, which arrives in the vessel at 29.490437 ft3/s once the pressure of 614.700000 psia, the temperature of 95.000000 degF and a z of 0.908065 have been applied. That actual rate divided by the gas area is the velocity in the gas space. At a level of 0.500000 the gas has 25.132741 ft2 and runs at 1.173387 ft/s. Drop the level to 0.300000 and the gas has 37.582708 ft2 and slows to 0.784681 ft/s.

Nothing about the stream changed between those two readings. The level controller moved, the gas was given more room, and the velocity fell.

## The height sets the fall

A droplet entrained in that gas has to reach the liquid surface before the gas carries it out of the vessel. The distance it falls is the gas height, 4.000000 ft on the drum at a level of 0.500000, and the speed it falls at is the settling velocity, 1.958255 ft/s for this stream at a horizontal mesh K of 0.400000.

Raising the level shortens the fall and shrinks the flow area at the same time, which pulls the two duties in opposite directions. That tension is why a horizontal vessel has two length requirements rather than one.

## What the gas space is not

The gas space is not the shell. The whole cross-section of 50.265482 ft2 belongs to the gas only in a drum with no liquid in it, which is not a separator. The gas space is also not fixed by the vessel: it is fixed by the vessel and the level together, and the level is an operating setting somebody can change after the steel is built.

## The mistake

The mistake is taking the velocity from the full circle. On ABANA-2 at a level of 0.500000 that halves the answer, and it halves it in the safe-looking direction, so a vessel that is running fast reads as though it had room. The other mistake is using the standard rate. ABANA-2 at 110.000000 MMscfd is 1273.148148 standard ft3/s, and dividing that by an area gives a velocity forty times too large. The vessel sees 29.490437 ft3/s and nothing else.

## Exercise

Give the gas area and the gas height for the 8.000000 ft drum at levels 0.300000, 0.500000 and 0.750000. Then compute the gas velocity at the first two of those levels from an actual rate of 29.490437 ft3/s, and say which of the two duties of the gas space each of your answers belongs to.
