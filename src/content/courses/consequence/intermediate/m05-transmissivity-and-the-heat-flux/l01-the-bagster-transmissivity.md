# The Bagster transmissivity and its range

{{panel:cq-fire}}

Between the flame and the target lies air, and air absorbs part of the heat radiation crossing it. Water vapour does most of the absorbing. The transmissivity is the fraction that gets through, the third factor in the heat flux. The engine offers one way to compute it, the Bagster fit printed in the Yellow Book, and it limits that fit to the band where the Yellow Book advises using it.

## The fit as the engine prints it

The model string reads "Bagster: tau = 2.02 (pw x)^-0.09, valid 1e4 < pw x < 1e5 N/m". Here pw is the partial pressure of water vapour in Pa, the relative humidity times the saturation pressure, and x is the path length in metres FROM THE FLAME SURFACE to the target. The product pw x, in N/m, measures how much water vapour lies across the path. More vapour means a smaller transmissivity.

## Measured from the flame surface

The path length runs from the surface of the flame to the target. It is shorter than the distance from the pool centre, which the view factor reads. Feeding the centre distance into the fit understates the transmissivity; feeding the edge distance ignores the tilt. Whatever path a note uses, it states it.

## The fit swept

With pw at 1500 Pa (stated):

| path m, stated | pw x N/m, derived | transmissivity, or the refusal field |
| --- | --- | --- |
| 5 | 7500.000000 | `pathLengthM` |
| 10 | 15000.000000 | 0.850165 |
| 30 | 45000.000000 | 0.770127 |
| 60 | 90000.000000 | 0.723552 |
| 70 | 105000.000000 | `pathLengthM` |

Within the band the transmissivity falls slowly with the path, because of the small exponent. At 5 m and at 70 m the product falls outside the band, and the engine refuses.

## Outside the band

The Yellow Book advises against the fit outside 1e4 to 1e5 N/m, and below about 2.5e3 N/m the fit would return a transmissivity above one, which is impossible. The engine refuses anywhere outside the band, naming `pathLengthM`:

> pathLengthM: pw x lies outside 1e4 to 1e5 N/m, where the YB advises against the Bagster fit: supply a transmissivity from another source

The caller then supplies a transmissivity from another source, stated and cited. The engine exports the band as `BAGSTER_RANGE_PA_M`, 10000 to 100000.

## Single route, taught and never graded

Bagster is a single route quantity. When the engine's validation record plants a mistake in both the engine and its oracle, nothing catches it but the transcription itself: no second route and no published worked number stand behind the fit. The Yellow Book's own worked pool fire takes its transmissivity, 0.71474, from Hottel charts. So this course teaches Bagster and never grades it, and every graded heat flux in this course uses a stated transmissivity.

## Exercise

In the fire panel, open the Bagster view with pw at 1500 Pa and confirm the three in-band rows. Then find, by trial, the shortest path the panel accepts and the longest, and check each against the band by multiplying by pw. Finally, copy the refusal the panel shows at 5 m and name its field.
