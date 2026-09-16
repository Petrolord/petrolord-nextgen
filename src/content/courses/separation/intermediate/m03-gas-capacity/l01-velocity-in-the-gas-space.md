# Velocity in the gas space

The gas velocity is the actual gas rate divided by the gas area. ABANA-2 puts 29.490437 ft3/s through 25.132741 ft2 at a level of 0.500000, which is 1.173387 ft/s.

{{panel:fc-slug-explorer}}

## The rate the vessel sees

The numerator is not the rate on the flow sheet. ABANA-2 is a 110.000000 MMscfd stream, which is 1273.148148 standard ft3/s, and standard conditions are not conditions inside the drum. At 614.700000 psia and 95.000000 degF, with a z of 0.908065 and a gas density of 2.239712 lb/ft3, that stream occupies 29.490437 ft3/s.

The vessel sees the second figure. Every velocity, every margin and every gas length in horizontal sizing is built on it.

## The area the gas actually has

| diameter ft | gas area ft2 | gas velocity ft/s |
| --- | --- | --- |
| 5.000000 | 9.817477 | 3.003871 |
| 6.000000 | 14.137167 | 2.086022 |
| 7.000000 | 19.242255 | 1.532587 |
| 8.000000 | 25.132741 | 1.173387 |
| 9.000000 | 31.808626 | 0.927121 |
| 10.000000 | 39.269908 | 0.750968 |

The same 29.490437 ft3/s runs through every row. A 5.000000 ft drum gives it 9.817477 ft2 and it moves at 3.003871 ft/s; a 10.000000 ft drum gives it 39.269908 ft2 and it moves at 0.750968 ft/s. Four times the area, a quarter of the speed.

## Why the fall is so steep

The gas area rises with the square of the bore while the rate stays where it is, so the velocity falls away faster than the diameter grows. Between 5.000000 ft and 6.000000 ft the velocity drops from 3.003871 ft/s to 2.086022 ft/s, a change of nearly a foot per second for one foot of steel. Between 9.000000 ft and 10.000000 ft the same extra foot is worth the move from 0.927121 ft/s to 0.750968 ft/s. Widening a narrow drum buys a great deal of gas room and widening a wide one buys very little, which is the shape behind most of the judgement calls in horizontal sizing.

## The level moves it too

The gas area depends on the level as well as the bore. On the 8.000000 ft drum the gas holds 25.132741 ft2 at a level of 0.500000 and 37.582708 ft2 at 0.300000, so the velocity falls from 1.173387 ft/s to 0.784681 ft/s when the level controller is dropped. The stream did not change. The room available to it did.

## The mistake

There are two, and they pull in opposite directions, which is why neither is self-correcting.

The first is using the standard rate. Dividing 1273.148148 standard ft3/s by 25.132741 ft2 gives a velocity tens of times too high, and everything downstream reports a vessel in crisis. That one is usually caught, because the answer is absurd.

The second is using the whole cross-section. Dividing 29.490437 ft3/s by 50.265482 ft2 rather than by the gas area of 25.132741 ft2 halves the velocity on a drum at half full, and the answer is not absurd at all. It is a plausible number that says the vessel has twice the room it has, and it gets worse as the level rises: at a level of 0.750000 the gas holds 9.826958 ft2 of that same circle.

## Exercise

Give the gas velocity for the 5.000000 ft, 8.000000 ft and 10.000000 ft drums on ABANA-2, and state which rate you divided by and why. Then give the velocity on the 8.000000 ft drum at a level of 0.300000, and say which of the two common mistakes produces a number that looks reasonable.
