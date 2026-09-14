# A report dated once

An AFE report is true on one day. The repaired engine takes that day as an explicit as-of date, and only the numbers that depend on the calendar move when it changes.

{{panel:ec-cost-explorer}}

## One AFE, six dates

OFON-1 runs in USD over a window from 2027-02-01 to 2027-11-30. Nothing on its lines changes between these six reports. Only the as-of date does.

| as of | time progress | planned value | earned value | SPI | CPI |
| --- | --- | --- | --- | --- | --- |
| 2027-01-15 | 0.000000 | 0 | 15231500 | null | 1.009377 |
| 2027-02-01 | 0.000000 | 0 | 15231500 | null | 1.009377 |
| 2027-06-30 | 0.493377 | 13345861 | 15231500 | 1.141290 | 1.009377 |
| 2027-08-15 | 0.645695 | 17466060 | 15231500 | 0.872063 | 1.009377 |
| 2027-11-30 | 1.000000 | 27050000 | 15231500 | 0.563087 | 1.009377 |
| 2028-01-10 | 1.000000 | 27050000 | 15231500 | 0.563087 | 1.009377 |

Earned value stays at 15231500 and CPI at 1.009377 in every row. Time progress, planned value and SPI are the only columns that move. Actuals of 15090000, the EAC of 27600000 and the variance at completion of -550000 are read from the lines as entered, and none of them knows what day it is.

## Why the date is an input

Planned value is the budget of 27050000 times the elapsed fraction of the window at the as-of date, and SPI is earned value over planned value. SPI is therefore a statement about a day. The 1.141290 of 2027-06-30 and the 0.872063 of 2027-08-15 are both correct readings of the same lines. Quoted without its date, an SPI cannot be checked, because nobody can rebuild the planned value it was divided by.

Passing the date in makes the report reproducible: run OFON-1 as of 2027-08-15 this week or next year and planned value is 17466060 both times. The dashboard passes today as the as-of date, so a report for a partner meeting should print the day it was run for.

## What it refuses

A date the engine cannot read is refused with AfeInputError: "asOf is not a valid date". The published cases refuse a string that is not a date, a month 13 and 30 February, even on an AFE with no window dates.

An AFE with no window is accepted. The published case with no dates returns time progress 1.000000 and SPI 0.250000, as if the window were already over.

## History: the report with no date

Before EC5-0 the AFE wizard asked for no dates. Time progress fell back to 1, so SPI equalled percent complete divided by 100: on OFON-1, 0.563087 from a percent complete of 56.3087, on whatever day the report was opened. The repaired wizard asks for the window.

## The mistake

The mistake is an SPI read on a report with no date. A reader who compares 1.141290 in one monthly pack with 0.872063 in the next sees a project losing schedule, when earned value in both is 15231500 and only the calendar moved. The plan advanced while the recorded progress stood still, and whether the rig was idle or the progress column went unupdated is a question the report cannot answer. The second form is dividing an earned value from one date by a planned value from another.

## Exercise

Write OFON-1's planned value and SPI as of 2027-06-30 and as of 2027-08-15, and name four metrics that are identical in both reports. Then say what the published case with no dates returns for time progress and SPI, and why a report built on it cannot be compared with a dated one.
