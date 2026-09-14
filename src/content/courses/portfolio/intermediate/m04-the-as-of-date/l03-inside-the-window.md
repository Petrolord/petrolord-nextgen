# Inside the window

Between the start and the end of an AFE, planned value is the budget spread evenly across the calendar, and SPI compares it with the earned value that the progress column produces.

{{panel:ec-cost-explorer}}

## Two dates inside OFON-1

| as of | time progress | planned value | earned value | SPI |
| --- | --- | --- | --- | --- |
| 2027-06-30 | 0.493377 | 13345861 | 15231500 | 1.141290 |
| 2027-08-15 | 0.645695 | 17466060 | 15231500 | 0.872063 |

Time progress is the days elapsed since the start over the days from the start to the end. Planned value is OFON-1's budget of 27050000 times that fraction: 0.493377 of it on 2027-06-30 and 0.645695 of it on 2027-08-15. SPI is earned value over planned value, so 15231500 over 13345861 gives 1.141290 and 15231500 over 17466060 gives 0.872063.

The fraction prints to six decimals while the engine multiplies the unrounded one, so the budget times the printed 0.493377 lands a few units away from 13345861. Quote the planned value the engine prints.

## The same count on a published window

The golden case on a two-year window, 2026-01-01 to 2027-12-31, counts the same way. As of 2026-09-14 the engine returns time progress 0.351166 and SPI 1.139063. The as-of date minus the start date is the numerator, and the end date minus the start date is the denominator.

## A straight line through a lumpy job

The plan the engine divides by is a straight line in calendar days. OFON-1's largest line, DRL-01 at 14200000 of the 27050000 budget, is rig time that a well spends early. CMP-05, 5600000 of completion, is spent late. The straight plan knows neither fact. An SPI above 1 in June and below 1 in August can simply be the shape of a well measured against a line that has no shape.

## The same earned value on both dates

Earned value is 15231500 on both dates because the progress column did not change between them. Planned value grew from 13345861 to 17466060 while earned value stood still, so SPI fell from 1.141290 to 0.872063 on the calendar alone. Either the work stopped for those weeks or nobody updated progress. The engine cannot tell the two apart, and neither can the SPI.

CPI does not help. It is earned value over actuals, 1.009377 on both dates, and it never looks at the calendar.

## The mistake

The first mistake is reading SPI below 1 as proof of slippage, and SPI above 1 as proof the job is ahead, when the plan is a straight line and the well is not. The second is building a trend from two SPIs without checking whether progress was entered between them: a falling SPI on unchanged progress is a measure of how stale the progress column is. The third is reading CPI of 1.009377 as if it confirmed the schedule.

## Exercise

Write OFON-1's time progress, planned value and SPI as of 2027-06-30 and 2027-08-15, and show each SPI as earned value over planned value. Then give two different explanations for SPI falling between the dates while earned value stayed at 15231500, and say what you would check on the AFE's lines to choose between them.
