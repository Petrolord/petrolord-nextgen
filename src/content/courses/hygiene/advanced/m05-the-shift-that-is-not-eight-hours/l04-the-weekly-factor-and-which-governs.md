# The weekly factor and which governs

{{panel:hy-protection-chemicals}}

On 10.000000 hour shifts and 70.000000 hours a week the daily factor is 0.700000 and the weekly factor 0.437500, so the weekly factor governs and a limit of 100 becomes 43.750000. On 12.000000 hour shifts and 60.000000 hours a week the daily factor of 0.500000 governs over a weekly 0.562500, and the ESTA 12-hour example adjusts a limit of 10.000000 to 5.000000 the same way. The weekly factor is ORACLE ONLY and is never graded on its own.

## The weekly formula

Brief and Scala give a second factor for a working week longer than 40 hours:

RF = (40/h) x (168 - h)/128

It has the same two parts as the daily one. The first scales the hours of breathing the air against a 40 hour week, and the second scales the recovery time against the 128 hours a 40 hour week leaves out of 168. The engine's door is `briefScalaWeeklyRf`.

| week, hours | weekly factor |
| --- | --- |
| 40.000000 | 1.000000 |
| 48.000000 | 0.781250 |
| 56.000000 | 0.625000 |
| 60.000000 | 0.562500 |
| 72.000000 | 0.416667 |
| 84.000000 | 0.312500 |

## The smaller factor governs

When a schedule gives both a shift length and a weekly total, `briefScalaAdjustedLimit` computes both factors and applies the SMALLER one, and it reports which governed. That is part of judgement J8. The smaller factor is the more protective, and a schedule is only as safe as its harder constraint.

| shift, hours | week, hours | daily factor | weekly factor | governing | adjusted limit for a limit of 100 |
| --- | --- | --- | --- | --- | --- |
| 12.000000 | 48.000000 | 0.500000 | 0.781250 | daily | 50.000000 |
| 10.000000 | 70.000000 | 0.700000 | 0.437500 | weekly | 43.750000 |
| 9.000000 | 54.000000 | 0.833333 | 0.659722 | weekly | 65.972222 |
| 14.000000 | 42.000000 | 0.357143 | 0.937500 | daily | 35.714286 |

A long shift in a short week is governed by the day. Many moderate shifts adding to a long week are governed by the week. The 9.000000 hour shift over 54.000000 hours is the second kind: each day is barely long, and the week is long enough to outweigh it. The panel beside this lesson computes both factors for any schedule you type and marks the one that governs, so the reading is never left to the eye.

## Why the weekly factor is never graded alone

The golden holds 0 published cases for the weekly factor and 4 oracle-only ones. No value a source prints reproduces it. So the weekly factor is ORACLE ONLY: the engine and an independent oracle agree, and nothing printed stands against either.

In grading, then, it only ever decides which factor is used. Where the daily factor governs by a clear margin, the weekly formula never enters the adjusted limit, and a small error in its constants could not move an answer the daily factor fixes. The ESTA example is such a case: the daily 0.500000 is well below the weekly 0.562500, and the adjusted limit of 5.000000 comes from the daily factor, which the BC regulation's printed factors reproduce.

## The refusals

The door needs at least one schedule. With neither, it refuses on `shiftHours`:

> give shiftHours, weeklyHours or both

A week of more than 168 hours, or of zero, is refused on `weeklyHours`:

> weeklyHours must be a number of hours above zero and at most 168

## Exercise

Take the 10.000000 hour, 70.000000 hour row and confirm that the weekly factor is the smaller, then multiply a limit of 100 by it to reproduce 43.750000. Then take the ESTA example and say how far below the weekly factor the daily one sits, and why that gap keeps the ORACLE ONLY weekly formula out of the adjusted limit.
