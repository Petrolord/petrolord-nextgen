# Onward

The Associate reading ends with a decision: OKONO at 450.0000 million USD funds OK-1, OK-3 and OK-4 for a risked EMV of 291.0000. The Professional tier starts where that decision ends, with the money being spent against an authorisation for expenditure, an AFE.

## A different model

OFON-1 is an AFE in USD with a window from 2027-02-01 to 2027-11-30 and five cost lines. Its totals are a budget of 27050000, commitments of 5000000 and actuals of 15090000, in whole USD. It shares nothing with OKONO: a portfolio is million USD across projects, and an AFE is its own currency across lines. Their numbers are never mixed. The window matters, because every schedule number is read at an as-of date inside or outside it.

## One forecast rule

A line forecasts its entered forecast when that is positive, and otherwise the larger of its budget and its actual plus commitment. CSG-02 has spent 4300000 against a budget of 3900000, so it forecasts 4300000. CMT-03 carries an entered 1400000. The AFE's estimate at completion is 27600000, a variance at completion of -550000, an overrun. A forecast copied from the budget would hide both lines, and before EC5-0 the Suite copied the budget into a line's forecast whenever the line was edited.

## Earned value and the as-of date

| as of | planned value | earned value | SPI | CPI |
| --- | --- | --- | --- | --- |
| 2027-01-15 | 0 | 15231500 | null | 1.009377 |
| 2027-06-30 | 13345861 | 15231500 | 1.141290 | 1.009377 |
| 2027-08-15 | 17466060 | 15231500 | 0.872063 | 1.009377 |

Earned value weights each line's progress by its budget, 15231500 on OFON-1, and CPI is earned value over actuals, 1.009377, at every date. Planned value comes from the calendar, so SPI is ahead of plan at 1.141290 in June and behind at 0.872063 in August, and null before the start. An SPI read from a report with no date means nothing. Earned value is only as good as the progress typed in, and the plan is a straight line through the window.

## The S-curve

The curve is built in monthly buckets and stops at the window end, so its last Planned point is 24452483 against a budget of 27050000. Past the as-of date the forecast jumps from the last actual of 15090000 to 19374834. Neither the shortfall nor the jump is an event at the well.

## What carries forward

Three habits. Prove a number by hand before trusting a screen. Read every answer against its flag, whether overLimit or a null SPI. And state the basis beside every figure: a limit for a funded set, an as-of date for a schedule index.

## Exercise

Give OFON-1's EAC and variance at completion and name the line that forecasts its actual. Then state SPI at 2027-06-30 and 2027-08-15, and say why CPI is the same on both dates.
