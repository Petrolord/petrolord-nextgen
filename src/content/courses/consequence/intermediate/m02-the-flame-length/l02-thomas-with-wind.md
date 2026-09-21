# Thomas with wind

{{panel:cq-fire}}

A pool fire outdoors almost always burns in some wind. The Yellow Book states a second Thomas correlation for that case, and it is the one this course grades, because the Yellow Book's own worked pool fire uses it and so a published number stands behind it. This lesson reads the form, runs it on ERHA and shows the published check.

## The correlation as the Yellow Book states it

The engine's model string reads "Thomas with wind: L/D = 55 (m" / (rho_air sqrt(g D)))^0.67 u*^-0.21, u* = max(1, u10 / uc)". Three things change from the still air form. The constant becomes 55, the exponent on the dimensionless burning flux becomes 0.67, and a new factor appears: the scaled wind speed u* raised to the power minus 0.21. The scaled wind speed is the wind at 10 m divided by a characteristic wind speed uc that belongs to the fire itself, and it is never allowed below one.

## ERHA in a rising wind

ERHA is the stated heptane bund fire, 20 m across, burning at 0.101000 kg/(m2 s) in air of 1.2 kg/m3. Its characteristic wind speed is 2.546226 m/s. The engine swept the wind at 10 m:

| wind at 10 m, m/s, stated | scaled wind speed u* | L/D | flame length m |
| --- | --- | --- | --- |
| 0 | 1.000000 | 1.787319 | 35.746382 |
| 2 | 1.000000 | 1.787319 | 35.746382 |
| 4 | 1.570953 | 1.625578 | 32.511563 |
| 8 | 3.141905 | 1.405373 | 28.107457 |
| 12 | 4.712858 | 1.290662 | 25.813232 |

## What the table says

Two patterns stand out. At 0 and 2 m/s the length is identical, because both winds sit below uc and the scaled wind speed is held at one. Above uc the flame shortens as the wind rises: the wind bends the flame over and mixes air into it, so the fuel burns out in a shorter length. The shortening is gentle because the exponent is small. Doubling the wind from 4 to 8 m/s doubles u*, and the length falls only from 32.511563 to 28.107457 m.

## The published check

The Yellow Book works a benzene pool fire in a wind of 5 m/s. For its L/D the engine returns 1.102004 against the printed 1.101938, a relative difference of 5.99e-5. For the flame length it returns 46.775288 m against the printed 46.7725, a relative difference of 5.96e-5. A mistake copied into both the engine and its oracle would show up here, which is why Thomas with wind can carry a graded answer. Module six walks that example step by step.

## The wind form feeds everything after it

The flame length from this form is the one the rest of the chain reads. The surface emissive power from the radiative fraction divides by one plus four times L/D. The view factor reads the ratio of the flame length to the flame radius. A mistake in the flame length therefore reaches the heat flux twice. The tilt, computed next, reads the wind directly and never the flame length, so the two correlations stay independent until the view factor brings them together.

## Exercise

In the fire panel, load ERHA with the wind form and step the wind through the five stated values. Confirm each row of the table. Then find, by trial, a wind speed between the stated ones at which the panel's flame length is still 35.746382 m, and one just above it at which the length first falls. Write down what those two winds bracket.
