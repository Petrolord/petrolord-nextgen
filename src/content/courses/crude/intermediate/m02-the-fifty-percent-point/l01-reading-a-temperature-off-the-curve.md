# Reading a temperature off the curve

Module 1 built the blend's curve by holding temperature fixed. This module turns the curve around and asks it for a temperature.

{{panel:crude-valuation-explorer}}

## The inverse question

volumePercentAt answers "how much has distilled by this temperature". temperatureAtVolumePercent answers the reverse: "at what temperature has this much distilled". It is the same curve read along the other axis, and the Associate tier met it on single crudes: linear between the curve's points, and unknown outside them.

On a blend, the curve it reads is the blend's own curve from blendDistillationCurves. That is the whole point of building that curve. Once the blend has a curve of its own, every temperature question about the blend is asked of that curve, with the same function a single crude would use.

## The Kwale blend, read at five points

The digest prints the Kwale blend, Kwale Light and Ughelli Medium at 55 and 45, read at five volume percents.

| volume percent | temperature F |
| --- | --- |
| 10 | 212.2121 |
| 30 | 411.6294 |
| 50 | 587.3184 |
| 70 | 796.5882 |
| 90 | 1133.0737 |

None of those temperatures is a point of the blend's curve. The blend's 14 points sit at the temperatures the two crudes measured, and the blend's volume percent at those temperatures is whatever the weighting gives: 8.0714 at 190 F, 43.6471 at 530 F, 85.5000 at 1030 F. A round volume percent such as 10 or 50 almost never falls on one of them. So each reading is an interpolation between the two curve points on either side of it.

## Why the fifty percent point gets a name

Of all the temperatures a curve can give, the one at 50 percent is singled out. T50 is the temperature by which half the barrels have boiled off. It is a single number that says where the middle of the crude sits on the boiling scale, and it feeds the characterisation factor this module takes up in lesson 4.

For the Kwale blend, the engine's T50 is 587.3184 F. For the studio's default pair, 60 and 40, which is what the app opens on, it is 617.1429 F.

## What interpolation assumes

Linear interpolation assumes the curve is a straight line between two measured points. A real TBP curve is smooth and bends, so the straight line is an approximation, and its quality depends on how close the points are. That is one more reason module 1 kept every temperature either crude measured: the more points the blend's curve stands on, the shorter each straight stretch between them.

The approximation is stated, and it is the same one used everywhere in the engine. volumePercentAt reads linearly between points to build the blend's curve, and temperatureAtVolumePercent reads linearly between points to get a temperature back from it. One rule, both directions.

## Where the curve says nothing

On a partial blend the inverse has the same limit as the forward reading. The Kwale Light and Ebocha blend of module 1 runs from 3.5217 percent at 110 F to 85.4516 percent at 920 F. A volume percent outside that stretch has no temperature, because the blend's curve does not reach it.

## Exercise

The blend's curve has a point at 530 F where it reads 43.6471 percent and a point at 650 F where it reads 56.9474 percent. The engine's T50 is 587.3184 F. Say which two points temperatureAtVolumePercent interpolated between to reach that figure, and why neither of those two temperatures is the blend's T50.
