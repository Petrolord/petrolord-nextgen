# Between the measured points

An assay measures a curve at a handful of temperatures. A cut point can fall between them. So the engine has to say something about the curve between points, and it says the simplest thing it can defend: a straight line between neighbouring measured points.

{{panel:crude-assay-explorer}}

## Linear between points

volumePercentAt returns the volume percent distilled at a temperature, linear between measured points. temperatureAtVolumePercent is the inverse, linear between points too.

On Obigbo Light, the curve is measured at 10 at 205 and 30 at 390. At 300 F, which sits between them, the engine returns 20.2703. The curve is measured at 50 at 548 and 70 at 742. At 600 F the engine returns 55.3608.

| crude | temperature F | volumePercentAt |
| --- | --- | --- |
| Obigbo Light | 300 | 20.2703 |
| Obigbo Light | 548 | 50.0000 |
| Obigbo Light | 600 | 55.3608 |

The other direction works the same way. On Obigbo Light, 25 percent lies between the points at 10 and 30 percent, and the engine gives 343.7500 F. 95 percent lies between the points at 90 and 100 percent, and the engine gives 1220.0000 F.

| crude | volume percent | temperatureAtVolumePercent F |
| --- | --- | --- |
| Obigbo Light | 25 | 343.7500 |
| Obigbo Light | 95 | 1220.0000 |

## The partial assay between its points

Inside its measured range, the Ebocha partial assay reads exactly like a full curve.

| crude | temperature F | volumePercentAt |
| --- | --- | --- |
| Ebocha partial assay | 110 | 4.0000 |
| Ebocha partial assay | 240 | 14.5000 |
| Ebocha partial assay | 590 | 50.0000 |
| Ebocha partial assay | 920 | 88.0000 |

240 F sits between its points at 110 and 370, and the engine returns 14.5000. In the other direction, 80 percent sits between its points at 70 and 88, and the engine returns 848.8889 F. A partial curve is incomplete at its ends, and in the middle it is as good as any other.

## What a straight line assumes

A straight line between two measured points is the rule the engine states. It reproduces every measured point exactly, and between two points it reads the line that joins them and nothing else. On Obigbo Light, for example, the reading of 20.2703 at 300 F lies on the straight segment that joins 10 percent at 205 F to 30 percent at 390 F. Outside the measured range it answers only where the curve says so itself, at 0 percent below a first point at 0 and at 100 percent above a last point at 100.

## Why the method matters beyond one reading

The same interpolation serves every question the studio asks of a curve. A cut yield is two readings of volumePercentAt subtracted. A temperature at a volume percent is one reading of temperatureAtVolumePercent. The engine interpolates the same way every time, so every reading of one curve stands on the same straight lines.

In the assay explorer, drag a temperature marker along the Obigbo Light curve. Between measured points the reading moves along a straight segment. On a measured point it lands on the typed value.

## Exercise

Read the Obigbo Light points 10 at 205 and 30 at 390, and the engine's reading at 300 F. Quote all three. Say what the reading shows about where the engine places 300 F on the segment between the two points. Then read the Ebocha reading at 240 F and its two neighbouring points, and say what these figures show about how a partial curve reads inside its measured range.
