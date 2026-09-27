# CPI before any spend

CPI is earned value over actuals. When actuals are 0 that ratio has no value, and the AFE engine reports CPI as null with cpiStatus "no-spend". The ratio is honest. The number to distrust is the earned value sitting beside it.

{{panel:ec-governance-explorer}}

## OFON-1 with nothing spent

OFON-1 as entered earns 15231500 against actuals of 15090000, a CPI of 1.009377: the work done is worth slightly more budget than the money spent on it. Set every actual to 0 and leave progress alone.

| case | earned value | actuals | CPI | cpiStatus |
| --- | --- | --- | --- | --- |
| OFON-1 as entered | 15231500 | 15090000 | 1.009377 | ok |
| OFON-1, every actual 0 | 15231500 | 0 | null | no-spend |
| published value earned with no spend | 400.0000 | 0.0000 | null | no-spend |
| published empty AFE | 0.0000 | 0.0000 | null | no-spend |

The engine forms no ratio over zero actuals, whatever the earned value. The Suite's CPI tile reads "N/A" with "Nothing spent yet, so no cost efficiency". The published empty AFE, with no lines, no progress and no spend, also reports SPI null with spiStatus "no-budget", so it reads as nothing on both ratios.

## What the null is hiding

OFON-1 with no actuals reports 15231500 of work done and nothing charged against it. That combination is either costs not yet posted or progress typed ahead of the work, and the null CPI says only that no ratio can be formed. It does not say which of the two is true, and it does not warn that the earned value is suspect. Both readings need the lines: check which ones carry progress, and whether their invoices have arrived.

## What still reads correctly

Earned value does not use actuals, so it stays 15231500. Planned value comes from the calendar, so SPI as of 2027-08-15 is still 15231500 over 17466060, which is 0.872063, with spiStatus "ok". The forecast is a different matter: the rule takes the larger of the budget and actual plus commitment, so a zero actual changes any line that was forecasting from its spend, such as CSG-02 with its actual of 4300000, and the EAC moves with it.

## Where it shows

Early in an AFE's life CPI reads null on every report until the first cost posts, while SPI can already read a value once the window has opened. On OFON-1 as of 2027-01-15, before the window opens, the order reverses: SPI is null with spiStatus "no-planned-value" because planned value is 0, while CPI, which never looks at the date, reads 1.009377 from the lines as entered.

## The mistake

The mistake is filling the gap. A report that prints CPI 1 or CPI 0 where the engine says null has invented a cost performance nobody measured, and one that drops the line altogether hides the earned value that should have raised a question. Write CPI as not available, give the earned value and the actuals total beside it, and say what is holding the actuals at zero.

## Exercise

Give OFON-1's earned value, actuals, CPI and cpiStatus as entered and with every actual set to 0. Explain why the earned value of 15231500 with no spend deserves a question, and name the one total to read before quoting any CPI.
