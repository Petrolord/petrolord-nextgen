# The divisor of five

{{panel:hy-noise-dosimeter}}

Four days at 89.500000, 87.100000, 90.200000 and 86.300000 dBA give a weekly level of 87.600937 dBA, below their arithmetic mean of 88.275000 dBA. Four days at 90 dBA give 89.030900 dBA. Six equal days at 84.200000 dBA give 84.991812 dBA. In each case the sum is divided by 5, whatever the number of days.

| week | daily LEX,8h values, dBA | days | weekly LEX, dBA |
| --- | --- | --- | --- |
| four days | 89.500000, 87.100000, 90.200000, 86.300000 | 4 | 87.600937 |
| six equal days | 84.200000 (six times) | 6 | 84.991812 |

## The judgement call, by name

The engine's judgement call J10 reads: the weekly LEX always divides by 5 and accepts at most 7 days. The engine reports how many days it was given, so four days report days 4 and are still divided by 5. That is the statutory formula as written, and the engine follows the formula rather than the day count.

## What the divisor means

The weekly level is a nominal five-day week. A person who works four days has worked a shorter week, and a week of four days at 90 dBA carries less energy than a nominal week of five, so its weekly level of 89.030900 dBA sits below 90. A person who works six days has worked a longer week, and six days at 84.200000 dBA carry more energy than five, so the weekly level of 84.991812 dBA sits above the daily figure. In both directions the divisor charges the week for the days actually worked against a fixed five-day reference, the same way the daily normaliser charges a long day against a fixed eight hours.

## How strong the evidence is

The energy averaging the weekly level shares with the daily one is reproduced by the L108 Figure 26 worked example. The divisor of 5 is the statutory formula, and no printed case with other than five days is known to set against it. So on any week that is not five days the engine and an independent oracle agree, and no source prints a number that could catch a shared misreading there. That is the evidence class this course calls oracle only. Treat a four-day or six-day weekly level as arithmetic you can defend from the written formula, and say so when you report it.

## The limits of the door

A week has at most seven days, and a week with no days has no level. The engine refuses both on field `dailyLexDbA`:

> dailyLexDbA holds more than 7 days: a week has 7

> dailyLexDbA must be a non-empty array of daily exposures

A day that is not a number is refused on the index that names it:

> dailyLexDbA[1] must be a finite number

## Exercise

From the table, record the weekly level and the day count for the four-day week and for the six-equal-days week. For each, state whether the weekly level sits above or below the arithmetic mean of its days, and name the judgement call that explains it. Then write one sentence saying why a four-day week at 90 dBA reports 89.030900 dBA.
