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

The factor is one plus 1.8 times the mass fraction of dissolved solids. It is linear, and the multiplier of 1.8 is declared, the second of this course's four kinds of number. Nothing in this repository checks it, and the declaration puts it where a reviewer can find it and argue with it.

## Why the correction stops

The module states the correction to 300000 ppm and refuses past it by name. A linear correction is a fit through a range of measurements, and past saturation there is nothing behind the straight line. An engine that kept extrapolating would return an artefact of the algebra rather than a property of any water, so it names the input and hands the problem back.

## The other end of the range

The module also refuses a negative salinity, because dissolved solids cannot be negative. Small as it is, that guard has the shape every input check here takes: state the quantity, state the range, and name the input that falls outside it. A guard that quietly moved a bad input to the nearest good one would leave the caller unable to say which number the answer belonged to.

## Reading the table as a designer, which takes both effects

Fresh water at this temperature runs at 0.000639217342 Pa.s and the most saline row at 0.000961382883. On its own, thicker water means slower droplets and a coarser cut. But the same dissolved solids also make the water heavier, which is the next lesson, and a larger density difference means a finer cut. A cut size carries the square root of the viscosity over the density difference, so the two effects sit on opposite sides of one fraction.

The engine settles which one wins. At 41 C the UZERE salinity makes the water 1.111600 times as viscous and 43.400000 kg/m3 heavier. Run the UZERE basin on each crude of the sweep, in fresh water and in that brine:

| API | fresh water cut, micron | UZERE brine cut, micron | brine cut over fresh cut |
| --- | --- | --- | --- |
| 12 | 378.634626 | 239.252567 | 0.631882 |
| 24 | 187.699403 | 165.003927 | 0.879086 |
| 46 | 128.975585 | 123.773404 | 0.959665 |

Those are three of the six rows, and the last column is below one on all six: the saline water cuts finer on every crude, most of all on the heaviest, where the density difference was smallest to begin with. The two effects would balance only at 432.288889 kg/m3 against the brine, and the largest difference in this sweep is 253.057299 kg/m3.

Salinity is therefore a treating question as well as a materials one. A field whose water gets saltier has moved two properties at once, and which way its separation duty went is a question for the model.

{{panel:pw-water-explorer}}

## Exercise

Name both of the properties a rising salinity moves, say which side of a cut size each one lands on, and say which of them wins over the range this course sweeps. Then name the two things this module does when a salinity arrives outside the range the correction is stated over, and say which of those two a lookup table would have done instead.
