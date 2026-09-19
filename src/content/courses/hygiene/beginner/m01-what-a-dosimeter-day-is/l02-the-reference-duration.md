# The reference duration

{{panel:hy-noise-dosimeter}}

At 95.000000 dBA the OSHA reference duration is 4.000000 h. At 100.000000 dBA it is 2.000000 h, and at 85.000000 dBA it is 16.000000 h. The reference duration is the time at a sound level that gives exactly 100 percent noise dose, and every contribution in a dosimeter record is divided by one.

The two criteria in this tier write it as a formula. OSHA writes T = 8 / 2^((L - 90)/5) hours. NIOSH writes T = 480 / 2^((L - 85)/3) minutes. The engine answers the same question through `noiseReferenceDurationH`, which takes a level and a criterion and returns the hours, or reports that the level is below the threshold.

## The published tables, reproduced

OSHA prints the reference duration as Table G-16a, 51 rows from 80 to 130 dBA. Every row is a golden case, and the engine's fresh call is checked against the printed value within the tolerance the table's own rounding allows.

| level, dBA | engine T, hours | printed T, hours | engine minus printed |
| --- | --- | --- | --- |
| 81.000000 | 27.857618 | 27.900000 | -0.042382 |
| 90.000000 | 8.000000 | 8.000000 | 0.000000 |
| 97.000000 | 3.031433 | 3.000000 | 0.031433 |
| 106.000000 | 0.870551 | 0.870000 | 0.000551 |
| 125.000000 | 0.062500 | 0.063000 | -0.000500 |

The differences are the table's rounding and nothing more. The 125 dBA row shows it plainly: the formula gives exactly 0.062500 h and the table prints 0.063, a round-half-up of the fourth decimal. A reader who treats the printed figure as the true one has taken the rounding for the physics.

## The NIOSH table

NIOSH prints the same quantity as Table 1-1 on its own criterion of 85 dBA and a decibel exchange rate of 3 dB. The table prints hours, minutes and seconds, and the golden stores hours. At 85.000000 dBA the engine gives 8.000000 h, which is 480.000000 minutes. At 94.000000 dBA it gives 1.000000 h, which is 60.000000 minutes. At 100.000000 dBA it gives 0.250000 h, which is 15.000000 minutes.

The engine reproduces 49 rows of Table 1-1. One further printed row is refuted by the formula itself, and the Expert tier reads that row as an erratum in the source.

## Why the time halves

Both formulas halve the reference duration for each step of the decibel exchange rate. On OSHA, 90.000000 dBA gives 8.000000 h, 95.000000 dBA gives 4.000000 h and 100.000000 dBA gives 2.000000 h. The next lesson is about that step. For now, notice that the reference duration is a property of the criterion as much as of the level: the same 94.000000 dBA gives 4.594793 h on OSHA and 1.000000 h on NIOSH.

A reference duration may be longer than a working day. At 80.000000 dBA on OSHA it is 32.000000 h. That is a statement about the allowance: a worker at that level would need 32.000000 h to use it up.

## Exercise

Open the dosimeter panel and find the reference duration at 81.000000 dBA on the OSHA criterion. The engine gives 27.857618 h and the table prints 27.900000 h. Put 81 into T = 8 / 2^((L - 90)/5) yourself and check which of the two figures your arithmetic reproduces. Then round your answer to one decimal and say whether the printed row is a rounding of the formula or a different number.
