# Before the start

Before an AFE's window opens there is no planned value to divide by, so the repaired engine reports SPI as null. It still reports everything that does not need the calendar.

{{panel:ec-cost-explorer}}

## Two dates with nothing planned

| as of | time progress | planned value | earned value | SPI | CPI |
| --- | --- | --- | --- | --- | --- |
| 2027-01-15 | 0.000000 | 0 | 15231500 | null | 1.009377 |
| 2027-02-01 | 0.000000 | 0 | 15231500 | null | 1.009377 |

On 2027-01-15 OFON-1's window, 2027-02-01 to 2027-11-30, has not opened. Time progress is 0.000000 and planned value is 0. SPI would be 15231500 divided by 0, and the engine returns null in place of a number.

The start day reads the same. On 2027-02-01 no whole day has elapsed, so time progress is still 0, planned value 0 and SPI null, exactly as before the start. Planned value first appears on the day after the start.

## The published boundary

The golden cases hold the same boundary on a second window, 2026-01-01 to 2027-12-31. As of 2025-12-31 the engine returns time progress 0.000000 and SPI null. As of 2026-01-01, the start day, it returns time progress 0.000000 and SPI null again.

Before EC5-0 the same division went ahead and SPI came out as Infinity or as NaN before the start date. Neither is a schedule reading, and a chart or a sort handed either one misbehaves quietly.

## Null is a reading

Null says the ratio does not exist yet. A zero would claim that nothing was earned against a real plan. A one would claim the job is exactly on schedule. A screen or a spreadsheet that turns null into either has invented a schedule reading the engine declined to give.

## What is still reported

Everything read from the lines is unchanged before the start: earned value 15231500, CPI 1.009377, the EAC of 27600000. That is correct arithmetic, and it is also a warning. Dated 2027-01-15, OFON-1 still carries progress of 72.0000 percent on DRL-01 and 100.0000 percent on CSG-02, with actuals of 15090000, before its window has opened. The engine never asks whether progress is plausible for the date. Earned value is only as good as the progress typed in, and a report dated before the start that shows earned value is a sign that either the window or the progress column is wrong.

## The mistake

The mistake is reading null as behind schedule. A portfolio of AFEs sorted by SPI with null counted as 0 puts every AFE that has not started at the bottom, as the worst performers. Counting null as 1 hides the same AFEs among the healthy ones. Neither is what the engine said. The honest line in a report is the as-of date, the start date and the word null, side by side.

## Exercise

Write OFON-1's time progress, planned value, earned value, SPI and CPI as of 2027-01-15 and as of 2027-02-01. Then explain why the start day gives null, and why an earned value of 15231500 on a report dated before the start should send you back to the progress column.
