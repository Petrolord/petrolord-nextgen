# No threshold in this metric

{{panel:hy-noise-dosimeter}}

The EVWRENI crew's quietest task is 73.800000 dBA for 1.800000 h. It carries 1.706800 noise exposure points and a task LEX of 67.321825 dBA, and it is in the day's LEX,8h of 86.646970 dBA. Every task counts, however quiet. LEX,8h has no threshold.

| metric | threshold | what a quiet period contributes |
| --- | --- | --- |
| OSHA PEL noise dose | 90.000000 dBA | nothing below it |
| OSHA action level noise dose | 80.000000 dBA | nothing below it |
| NIOSH noise REL noise dose | 80.000000 dBA | nothing below it |
| LEX,8h | none | its energy share |

## What a threshold does in the Associate metrics

A noise dose integrates only the periods at or above its criterion's threshold. On the OBEN walkdown from the Associate tier, the OSHA PEL setup integrates 2 of the 6 periods, and the action level and the NIOSH noise REL integrate 5. The 76.500000 dBA period is integrated by none of the three. The threshold is a choice written into each regulation, and it is inclusive: a period sitting exactly on it counts.

## What LEX,8h does instead

The energy relation has no floor. A task at 73.800000 dBA carries a small share of the energy and the formula adds it. On the EVWRENI day the share is small enough that dropping the task would barely move the result, and that is the point: in this metric a quiet task is small, and in a thresholded metric it is zero. The two treatments give different answers on the same survey, and neither is a correction of the other.

## The extremes the engine reports

Eight hours at 0.000000 dBA gives LEX,8h 0.000000 dBA and 0.000000 points, with both action flags false. A task of zero hours contributes nothing, and its own task LEX is reported as absent. The small case of 100.000000 dBA for 0.000000 h beside 85.000000 dBA for 8.000000 h returns 85.000000 dBA and 100.000000 points, exactly as if the loud entry were never there.

A record with no time in it at all is refused. So is one that totals more than a day. The engine's own words, both on field `periods`:

> the periods total zero hours: there is no exposure to express

> the periods total 25 h: a daily exposure covers at most 24 hours

A task whose level is missing is refused on the field that names it:

> periods[0].laeqDbA must be a finite number

## Why this matters on a survey sheet

A surveyor accustomed to thresholded dosimeters may leave quiet tasks off a LEX,8h task list because they would not have counted on the dosimeter. On a day like EVWRENI that costs little. On a long day with many hours in a moderately noisy control room it can matter more, because hours at a modest sound level still carry energy. List every task with its hours, and let the formula decide how much each one matters. A task sheet whose hours do not add up to the day has quietly dropped a task, and the formula has no way to know.

## Exercise

Open the dosimeter panel's LEX view and find the EVWRENI eight-hour day. Record the task LEX and the points of the 73.800000 dBA task. Then state how many of the OBEN walkdown's periods the OSHA PEL noise dose integrates and how many a LEX,8h over the same periods would include. Finally, write one sentence saying which of the two metrics you would use to report a day against the EU action values, and why a threshold has no place in it.
