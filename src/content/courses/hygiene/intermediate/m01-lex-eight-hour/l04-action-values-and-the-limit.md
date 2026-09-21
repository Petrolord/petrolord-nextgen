# Action values and the limit

{{panel:hy-noise-dosimeter}}

The engine exports three EU values as `EU_NOISE_VALUES`: a lower action value of 80.000000 dBA, an upper action value of 85.000000 dBA and a limit value of 87.000000 dBA. Four hours at 88.000000 dBA gives LEX,8h 84.989700 dBA, which is at or above the lower action value and below the upper one.

| tasks | LEX,8h, dBA | points | lower action | upper action |
| --- | --- | --- | --- | --- |
| 88.000000 dBA for 4.000000 h | 84.989700 | 99.763116 | true | false |
| 85.000000 dBA for 10.000000 h | 85.969100 | 125.000000 | true | true |
| 85.000000 dBA for 8.000000 h | 85.000000 | 100.000000 | true | true |
| 80.000000 dBA for 8.000000 h | 80.000000 | 31.622777 | true | false |
| 0.000000 dBA for 8.000000 h | 0.000000 | 0.000000 | false | false |

## The flags are at or above

Both action flags read at or above the value. Eight hours at 80.000000 dBA gives exactly 80.000000 dBA and the lower flag is true. Eight hours at 85.000000 dBA gives exactly 85.000000 dBA and the upper flag is true. A figure sitting on a value has reached it. The first row shows how close the other side is: 84.989700 dBA and 99.763116 points, a hair under the upper value, and the upper flag is false.

## The limit value is read at the ear

The limit value of 87.000000 dBA applies to the noise exposure at the ear with hearing protection taken into account. The engine does not compute that. LEX,8h is the level in the workplace, so the engine returns the two action flags and no limit flag. The protector module of this tier estimates a level under a protector by several methods, and none of them is the EU at-the-ear assessment. Do not put a LEX,8h against 87.000000 dBA and write a verdict.

## Action values and the action level are different metrics

The OSHA hearing conservation action level from the Associate tier is a TWA of 85 dBA on a decibel exchange rate of 5 dB with an 80 dBA threshold, and equivalently a noise dose of 50 percent. The EU action values are LEX,8h levels on the energy relation with no threshold. Both carry the number 85, and they measure different things. A report that writes "above the action level" for a LEX,8h of 85.969100 dBA has named the wrong regulation and the wrong metric. Write "at or above the upper action value" and name the metric.

## What the flags do and do not say

A flag is a comparison, and this course lists verdict words among the things it never grades: every graded field is a number. How you write a flag up is a matter of practice, and here is the practice this course follows. Quote LEX,8h to the precision the engine prints, name the value you compared it with, and let the reader draw the flag from the two. The 0.000000 dBA row shows why that matters here: both flags are false there, and both are false for 84.989700 dBA against the upper value, and the two situations share nothing.

## Exercise

From the table, list every row whose upper action flag is true and give its LEX,8h. Then take the first row and state, in noise exposure points, how far it sits below the 100.000000 points of the upper action value. Finally, write one sentence naming the metric and the value you would quote for the row at 85.969100 dBA.
