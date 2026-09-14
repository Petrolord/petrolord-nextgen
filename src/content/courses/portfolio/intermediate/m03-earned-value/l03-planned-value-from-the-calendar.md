# Planned value from the calendar

Planned value is the budget the calendar says should have been earned by the as-of date. The engine takes the budget times the elapsed fraction of the AFE window, so planned value is a straight line from 0 on the start day to the whole budget on the end day.

{{panel:ec-cost-explorer}}

## OFON-1 against its window

OFON-1's window runs from 2027-02-01 to 2027-11-30 on a budget of 27050000:

| as of | time progress | planned value |
| --- | --- | --- |
| 2027-01-15 | 0.000000 | 0 |
| 2027-02-01 | 0.000000 | 0 |
| 2027-06-30 | 0.493377 | 13345861 |
| 2027-08-15 | 0.645695 | 17466060 |
| 2027-11-30 | 1.000000 | 27050000 |
| 2028-01-10 | 1.000000 | 27050000 |

As of 2027-08-15 the elapsed fraction is 0.645695, and 0.645695 of 27050000 is the engine's planned value of 17466060. The printed fraction is rounded to six decimals, so a hand product lands a few USD away; quote the engine's 17466060.

## Whole days elapsed

The fraction counts whole days elapsed over the days in the window. The published case "asOf mid-window: SPI against 256 of 729 days" has a window of 2026-01-01 to 2027-12-31 and an as-of date of 2026-09-14, and the engine reports time progress 0.351166, which is 256 / 729. On the start day no whole day has elapsed, so OFON-1 as of 2027-02-01 has time progress 0.000000 and planned value 0, exactly as on 2027-01-15, before the window opens. After the end the fraction stops at 1.000000: 2028-01-10 reads 27050000, like the end day.

## A straight line

The plan is the budget spread evenly over the calendar. The engine has no rig schedule, no mobilisation month and no completion campaign to shape it. On OFON-1, drilling carries 14200000 of the budget and would normally be spent early, completion carries 5600000 and would normally be spent late, and the planned value treats every day of the window as costing the same.

## Before the repair

Before EC5-0 the AFE wizard asked for no dates. With no window the time progress fell back to 1, so planned value was the whole budget on every day of the AFE's life. The published case "no dates: time progress 1" still records that behaviour for an AFE entered without dates, returning time progress 1.000000. The repaired wizard asks for the window.

## What it refuses

It refuses an as-of date that is not a real date, with "asOf is not a valid date". It does not refuse a missing window: an AFE without dates still gets a planned value, the whole budget. It does not bend the line for front-loaded work or a suspended job.

## The mistake

The mistake is reading planned value as a forecast of spend. 17466060 as of 2027-08-15 is not what OFON-1 should have spent by then under any real drilling plan; it is 0.645695 of the budget because 0.645695 of the calendar has passed. The second mistake is quoting planned value with no date. 13345861 and 17466060 are both OFON-1's planned value on the same lines, and without the as-of date neither means anything.

## Exercise

State OFON-1's window and its planned value as of 2027-06-30 and 2027-08-15, and say what time progress each date carries. Then explain why planned value is 0 on 2027-02-01, why it stops at 27050000 after 2027-11-30, and what an AFE entered without dates reports as its planned value.
