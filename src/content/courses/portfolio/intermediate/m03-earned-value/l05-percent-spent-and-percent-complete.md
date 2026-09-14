# Percent spent and percent complete

Percent spent is actuals over budget; percent complete is earned value over budget. They share a denominator, so the gap between them is the cost performance of the whole AFE, shown as two percentages.

{{panel:ec-cost-explorer}}

## OFON-1's two percentages

| reading | numerator | budget | engine percent |
| --- | --- | --- | --- |
| percent spent | actuals 15090000 | 27050000 | 55.7856 |
| percent complete | earned value 15231500 | 27050000 | 56.3087 |

OFON-1 has spent 55.7856 percent of its budget and completed 56.3087 percent of the work, weighted by budget. Percent complete runs slightly ahead of percent spent, and dividing one by the other returns CPI 1.009377, the same as 15231500 / 15090000, because the budget cancels.

## What each leaves out

Percent spent reads actuals only. The 5000000 committed on OFON-1 sits outside it, so a line with a large order placed and little paid looks barely started. LOG-04 has spent 350000 and committed 900000; percent spent sees the 350000.

Percent complete reads typed progress, weighted by budget, and nothing about money. CSG-02 is 100.0000 percent complete and contributes its budget of 3900000 to it, while its 4300000 of spend enters percent spent.

Neither figure is a forecast. The EAC of 27600000 comes from the forecast rule and uses neither percentage.

## A matched pair can hide a line

Both OFON-1 percentages sit close together, which reads as an AFE spending in step with its progress. Underneath, CSG-02 has finished over its budget, CMT-03 is forecast over its budget on an entered figure, and CMP-05 has spent nothing and done nothing. The pair averages those stories away. Two percentages that agree say the AFE as a whole is buying work at about its budgeted rate; they say nothing about which lines are not.

## What it refuses

Percent complete is only as good as the progress typed in, and percent spent is only as good as the actuals entered on the lines. Neither moves with the as-of date. Neither reads the invoices, which feed only the S-curve. The engine does not compare either with the calendar; that comparison is SPI, which divides earned value by planned value.

## The mistake

The mistake is reading percent spent as percent complete. A manager who says OFON-1 is "55.7856 percent done" has quoted spend and called it work. On this AFE the error is small, but the two measure different things, and on a line such as CSG-02, finished and over its budget, they part company completely. The opposite mistake is treating percent complete as money in hand: 56.3087 percent complete is a weighted sum of typed estimates.

## Exercise

State OFON-1's percent spent and percent complete, name the numerator of each, and show how they combine into CPI 1.009377. Then explain why LOG-04's commitment does not enter percent spent, and why the two percentages can sit close together while individual lines are over budget.
