# CPI before any spend

CPI is earned value over actuals. When actuals are 0 that ratio has no value, and the AFE engine as published reports 1 in its place, the same number an AFE exactly on budget reports.

{{panel:ec-governance-explorer}}

## OFON-1 with nothing spent

OFON-1 as entered earns 15231500 against actuals of 15090000, a CPI of 1.009377: the work done is worth slightly more budget than the money spent on it. Set every actual to 0 and leave progress alone.

| case | earned value | actuals | CPI |
| --- | --- | --- | --- |
| OFON-1 as entered | 15231500 | 15090000 | 1.009377 |
| OFON-1, every actual 0 | 15231500 | 0 | 1.000000 |
| published weighted earned value | 110.0000 | 0.0000 | 1.000000 |
| published empty AFE | 0.0000 | 0.0000 | 1.000000 |

The engine returns 1 whenever actuals are 0. Earned value of 15231500, of 110.0000 or of nothing at all makes no difference.

## Why 1 is the wrong placeholder

Earned value over zero actuals is not a performance, because dividing by 0 has no answer. A reader who sees 1.000000 reads "on budget to the unit", which is a claim about spend that the AFE cannot make. OFON-1 with no actuals reports 15231500 of work done and nothing charged against it. That is either costs not yet posted or progress typed ahead of the work, and CPI hides both behind the one value that looks healthiest. This is a finding EC5-0 left in place, taught as a property of the engine as published.

## What still reads correctly

Earned value does not use actuals, so it stays 15231500. Planned value comes from the calendar, so SPI as of 2027-08-15 is still 15231500 over 17466060, which is 0.872063. The forecast is a different matter: the rule takes the larger of the budget and actual plus commitment, so a zero actual changes any line that was forecasting from its spend, such as CSG-02 with its actual of 4300000.

## Where it shows

Early in an AFE's life CPI reads 1.000000 on every report until the first cost posts. The published empty AFE also reports SPI 1.000000, so an AFE with no lines, no progress and no spend reads as perfect on cost and on schedule at once. On OFON-1 as of 2027-01-15, before the window opens, SPI is null because planned value is 0, while CPI, which never looks at the date, reads 1.009377 from the lines as entered.

## The mistake

The mistake is reading a CPI of 1.000000 as good news. It is the engine's answer for no spend, and on a report it cannot be told apart from exact performance. The check is one number, the actuals total. When actuals are 0, write CPI as not meaningful, give the earned value beside it, and say what is holding the actuals at zero.

## Exercise

Give OFON-1's earned value, actuals and CPI as entered and with every actual set to 0. Explain why 1.000000 measures nothing about cost performance in the second case, and name the one total to read before quoting any CPI.
