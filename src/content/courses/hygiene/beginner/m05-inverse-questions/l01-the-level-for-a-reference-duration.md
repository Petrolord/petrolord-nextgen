# The level for a reference duration

{{panel:hy-noise-dosimeter}}

Ask the engine which sound level gives exactly 100 percent noise dose in 3.000000 h and it answers 97.075187 dBA on OSHA and 89.245112 dBA on NIOSH. The door is `noiseLevelForReferenceDurationDbA`. It takes hours and a criterion and runs the reference duration formula backwards.

Most questions in this tier go from a level to a time or a noise dose. The inverse questions go the other way, and they are the ones a planner asks: if this task takes three hours, how loud can it be before it uses the whole day's allowance?

## The table

| hours | OSHA level, dBA | NIOSH level, dBA |
| --- | --- | --- |
| 0.250000 | 115.000000 | 100.000000 |
| 0.500000 | 110.000000 | 97.000000 |
| 1.000000 | 105.000000 | 94.000000 |
| 2.000000 | 100.000000 | 91.000000 |
| 3.000000 | 97.075187 | 89.245112 |
| 4.000000 | 95.000000 | 88.000000 |
| 6.000000 | 92.075187 | 86.245112 |
| 8.000000 | 90.000000 | 85.000000 |
| 12.000000 | 87.075187 | 83.245112 |
| 16.000000 | 85.000000 | 82.000000 |

Every doubling of hours lowers the level by one decibel exchange rate: 5 dB on OSHA and 3 dB on NIOSH. The rows at 3, 6 and 12 hours sit between the doublings and come out as fractions of a decibel. Notice that 92.075187 is exactly 5 below 97.075187, and 87.075187 exactly 5 below that. The pattern holds wherever you start.

## Reading the answer correctly

The answer is a level held steady for the whole of those hours, with nothing else on the day. It gives exactly 100 percent noise dose on its own criterion. If the worker has already used part of the allowance, the level for the remaining hours has to be lower, and the right question becomes the time left at a level from the previous module.

Two rows deserve a second look. At 16.000000 h the OSHA level is 85.000000 dBA, which is above the action level threshold of 80 and below the PEL threshold of 90. A reference duration on the PEL itself stops at the threshold. The engine's formula still returns the level, and the OSHA table G-16a runs down to 80 dBA, but a period at 85 dBA would not be integrated by the PEL setup at all. At 0.250000 h the OSHA level is 115.000000 dBA, the highest level Table G-16 permits, and anything shorter pushes the level past it.

## Each criterion, its own ladder

At every row NIOSH gives a lower level than OSHA, and the gap widens as the hours get shorter, from 90.000000 against 85.000000 dBA at eight hours to 115.000000 against 100.000000 dBA at a quarter of an hour. That is two ladders of different slope, 5 dB and 3 dB a step, climbing from two different criterion levels. When you plan a task against both criteria, the NIOSH level is the stricter answer at every duration.

## Exercise

Take the NIOSH row for 3.000000 h, 89.245112 dBA. Put 89.245112 into T = 480 / 2^((L - 85)/3) and convert your answer from minutes to hours, and check that it comes back to 3.000000 h. Then use the table to find the OSHA and NIOSH levels for 6.000000 h, and say how much each drops from the 3.000000 h row and why the two drops differ.
