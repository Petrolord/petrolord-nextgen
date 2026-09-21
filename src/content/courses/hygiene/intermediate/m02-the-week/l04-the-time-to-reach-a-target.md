# The time to reach a target

{{panel:hy-noise-dosimeter}}

At 94.000000 dBA a person reaches LEX,8h 85 in 1.007140 hours. At 97.000000 dBA they reach LEX,8h 87 in 0.800000 hours. At 100.000000 dBA they reach LEX,8h 80 in 0.080000 hours. These come from `lexAllowedDurationH`, which returns the hours at one sound level that alone bring the day to a target LEX,8h.

| LAeq, dBA | hours to 80 | hours to 85 | hours to 87 |
| --- | --- | --- | --- |
| 82.000000 | 5.047659 | 15.962099 | 25.298221 |
| 85.000000 | 2.529822 | 8.000000 | 12.679146 |
| 88.000000 | 1.267915 | 4.009498 | 6.354626 |
| 91.000000 | 0.635463 | 2.009509 | 3.184857 |
| 94.000000 | 0.318486 | 1.007140 | 1.596210 |
| 97.000000 | 0.159621 | 0.504766 | 0.800000 |
| 100.000000 | 0.080000 | 0.252982 | 0.400950 |

## Reading down a column

Each step of three decibels down the table roughly halves the hours, because three decibels roughly doubles the energy. At 85.000000 dBA the hours to 85 are exactly 8.000000, which is the pivot of the whole metric: eight hours at 85 dBA is LEX,8h 85 and 100 noise exposure points. At 88.000000 dBA the hours are 4.009498, close to half, and at 91.000000 dBA they are 2.009509, close to a quarter. The small departures from exact halving are because three decibels is a rounding of the doubling step.

## The inverse of the Associate reference duration

The Associate tier asked the same kind of question of a noise dose: the hours at a level that give 100 percent. On the OSHA criterion, with its decibel exchange rate of 5 dB, the reference duration at 95 dBA is 4.000000 h. Here, on the energy relation, the hours to LEX,8h 85 at 94.000000 dBA are 1.007140. The two figures are not comparable in any direct sense. They come from different criteria, different exchange relations and different regulations, and a planner who quotes one as the other has mixed two systems.

## Hours above a day

Read the top-right corner. At 82.000000 dBA a person would need 25.298221 hours to reach 87, which is more than a day. The door returns the arithmetic without refusing, because the question it answers is a level and a target, and the answer is a number of hours. It is your job to notice that a figure above 24 means the target cannot be reached in a day at that sound level.

## One task alone

The door answers for one task in isolation. On a real day the other tasks have already used part of the allowance, so the hours available at the loud task are fewer than the table shows. Work that out with noise exposure points: take the points the other tasks carry, subtract them from the points at the target, and convert what is left into hours at the loud task's sound level. If nothing is left, the target has already been reached before the loud task begins.

The door refuses a missing target and a missing level, in its own words:

> targetLexDbA must be a finite number

> laeqDbA must be a finite number

## Exercise

From the table, record the hours to 85 at 88.000000 dBA and at 91.000000 dBA, and state the ratio between them to one decimal place using those two figures. Then find the one cell in the table that exceeds a day, and state its level and its target. Finally, write one sentence saying why the hours to 85 at 85.000000 dBA are exactly 8.000000.
