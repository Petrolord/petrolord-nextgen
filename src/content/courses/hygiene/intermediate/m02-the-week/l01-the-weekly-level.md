# The weekly level

{{panel:hy-noise-dosimeter}}

A five-day week with daily levels of 86.400000, 83.100000, 88.200000, 84.900000 and 81.700000 dBA has a weekly noise exposure level of 85.461288 dBA. The arithmetic mean of the same five days is 84.860000 dBA. The weekly level sits above the mean because it is an energy average, and the loud days weigh more.

| week | days | weekly LEX, dBA | arithmetic mean of the days, dBA |
| --- | --- | --- | --- |
| five days | 5 | 85.461288 | 84.860000 |
| four days | 4 | 87.600937 | 88.275000 |
| six equal days | 6 | 84.991812 | 84.200000 |

## The formula

LEX,w = 10 log10( (1/5) sum 10^(0.1 LEX,8h,k) ), for up to 7 days. Each day's LEX,8h is turned back into an energy term, the terms are added, the sum is divided by 5, and the result is turned back into decibels. The door is `lexWeeklyDbA`, and it takes the daily LEX,8h values as its only input.

## Why a weekly level exists

The EU and UK regulations allow the weekly level in place of the daily one where noise exposure varies markedly from day to day. A crew with one loud day and four quiet ones may sit above an action value on the loud day and below it across the week. The weekly level is how the regulation lets that week be read as a whole, and it is only as good as the daily figures fed into it. Each of those figures is itself a LEX,8h, built from a task list or a dosimeter record, so an error in one day's hours or one task's sound level travels straight into the week.

## The same energy average one level up

LEX,w is built the way LEX,8h is built. The daily level energy-averages tasks over a fixed eight hours; the weekly level energy-averages days over a fixed five. The energy averaging is the part the HSE L108 Figure 26 worked example reproduces for the day, so the averaging you meet here is the one this tier has already checked against a printed value.

## What the rows are telling you

The five-day row shows the ordinary case: the energy average is higher than the arithmetic one. The six-equal-days row shows a week longer than five days reading above its own daily level, 84.991812 dBA against six days at 84.200000 dBA, because six days of energy are divided by 5. The four-day row reads below its arithmetic mean, 87.600937 dBA against 88.275000 dBA, because four days are divided by 5 as well. The next lesson is about that divisor and why it never changes.

## Exercise

Open the dosimeter panel's LEX view and find the week. Record the five daily levels, the weekly level and the arithmetic mean. State which is larger and by how much, using the two printed figures. Then name the loudest day of the five and say in one sentence why that day moves the weekly level more than any other.
