# Salinity, and a correction stated to a limit

Produced water is brine, and how much salt it carries changes both of the properties this course runs on. This lesson takes the viscosity half. Hold the temperature at 41 C and move the total dissolved solids:

| ppm TDS | salinity factor | brine Pa.s |
| --- | --- | --- |
| 0 | 1.000000 | 0.000639217342 |
| 25000 | 1.045000 | 0.000667982123 |
| 62000 | 1.111600 | 0.000710553998 |
| 120000 | 1.216000 | 0.000777288288 |
| 200000 | 1.360000 | 0.000869335586 |
| 280000 | 1.504000 | 0.000961382883 |

## The form of the correction

The factor is one plus 1.8 times the mass fraction of dissolved solids. It is linear, and the multiplier of 1.8 is declared, which places it in the second of this course's four kinds of number. There is no publication in this repository to check it against, and the engine does not pretend otherwise. What the declaration buys is that the multiplier sits in one frozen object where a reviewer can find it and argue with it.

## Why the correction stops

The module states the correction to 300000 ppm and refuses past it, saying that the salinity correction in this module is stated to that figure. That refusal is the interesting part of the lesson. A linear correction is a fit through a range of measurements, and past the point where brine saturates there is nothing behind the straight line at all. An engine that kept extrapolating would keep returning a number, and the number would be an artefact of the algebra rather than a property of any water. Refusing names the input and hands the problem back to somebody who can look it up. The engine would rather say nothing about a saturated brine than say something confident.

## The other end of the range

The module also refuses a negative salinity, on the grounds that total dissolved solids cannot be negative. That looks like a trivial guard and it is not: it is the shape every input check in this engine takes. State what the quantity is, state the range the method is good over, and name the input when something outside that range arrives. A guard that quietly moved a bad input to the nearest good one would be deleting the input, and the caller would never know which number the answer belonged to.

## Reading the table as a designer

Fresh water at this temperature runs at 0.000639217342 Pa.s and the most saline row at 0.000961382883. Thicker water means slower droplets and a coarser cut out of the same equipment. Salinity is therefore not just a materials question about what the vessel is made of. It is a treating question, and a field whose water is getting saltier as it matures is a field whose separation duty is getting harder for that reason alone.

{{panel:pw-water-explorer}}

## Exercise

Say what the salinity factor would do to a treating answer if the water freshened over field life. Then name the two things this module does when a salinity arrives outside the range the correction is stated over, and say which of those two a lookup table would have done instead.
