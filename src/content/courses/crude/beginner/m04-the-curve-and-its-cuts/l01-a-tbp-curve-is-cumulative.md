# A TBP curve is cumulative

A true boiling point curve, or TBP curve, is how an assay says what a barrel turns into. It is measured by distilling the crude in a laboratory column and recording how much has come over by each temperature. Each point reads: this volume percent of the crude has distilled by this temperature.

{{panel:crude-assay-explorer}}

## One curve, read as points

The library's Obigbo Light curve is seven measured points, in volume percent distilled at degrees F:

| crude | points (volume percent at F) |
| --- | --- |
| Obigbo Light | 0 at 85; 10 at 205; 30 at 390; 50 at 548; 70 at 742; 90 at 1060; 100 at 1380 |

The first point, 0 at 85, is the initial boiling point: nothing has distilled below 85 F. The last point, 100 at 1380, is where everything has. Between them, 50 at 548 says half the crude by volume boils below 548 F.

## Why cumulative matters

Every point counts everything that has distilled so far, from the lightest molecule up to that temperature. So the curve only rises as the temperature rises.

That is what makes a cut possible. The volume that boils between two temperatures is the reading at the upper one minus the reading at the lower one. This module's last two lessons build every cut yield on that one subtraction, and it only works because the curve is cumulative.

## The two ways to read it

The engine reads a curve in both directions, with two functions.

volumePercentAt takes a temperature and returns the volume percent distilled. On Obigbo Light at 548 F it returns 50.0000, the measured point.

temperatureAtVolumePercent takes a volume percent and returns the temperature at which the curve reaches it. On Obigbo Light at 50 percent it returns 548.0000, the same point read the other way.

| crude | temperature F | volumePercentAt |
| --- | --- | --- |
| Obigbo Light | 548 | 50.0000 |
| Obigbo Light | 1380 | 100.0000 |

| crude | volume percent | temperatureAtVolumePercent F |
| --- | --- | --- |
| Obigbo Light | 10 | 205.0000 |
| Obigbo Light | 50 | 548.0000 |

At a measured point both readings return the point exactly. The next two lessons deal with what the engine does between measured points and outside them.

## Four curves and a partial one

Every crude in the library has a curve, and the curves differ in where they sit. Obigbo Light reaches 50 percent at 548 F, Egbema Medium at 668 F, Asarama Heavy at 790 F and Ubie Condensate at 320 F. Those are the measured 50 percent points, as typed in the library.

The Ebocha partial assay is different. Its curve reads 4 at 110; 25 at 370; 50 at 590; 70 at 760; 88 at 920. It starts at 4 percent and stops at 88. The part of the barrel below 4 percent and the part above 88 percent were not measured, and the engine remembers that every time it reads the curve.

## What the curve is for

A refinery buys a crude for its products. The TBP curve, read at a refinery's cut points, is what turns an assay into a product slate: this much naphtha, this much diesel, this much residue.

## Exercise

Read the Obigbo Light curve and the two tables in this lesson. Quote what volumePercentAt returns at 548 F and what temperatureAtVolumePercent returns at 50 percent. Say what the two figures show about the relationship between the two functions at a measured point. Then read the 50 percent points of the four full curves and say what they show about which crude is lightest by boiling range.
