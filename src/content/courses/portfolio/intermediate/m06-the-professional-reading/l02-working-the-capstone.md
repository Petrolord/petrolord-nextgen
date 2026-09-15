# Working the capstone

A graded AFE reading is worked in the order the engine works: lines, forecast, earned value, date, curve. The method is shown here on OFON-1, and its numbers belong to OFON-1 alone.

{{panel:ec-cost-explorer}}

## The lines and the currency

Open the AFE in the explorer and write its currency and window before touching any metric. OFON-1 is in USD, over 2027-02-01 to 2027-11-30. Then check the totals against the lines: the budgets sum to 27050000, the commitments to 5000000 and the actuals to 15090000. Add the invoices separately: OFON-1's four total 15090000 as well. If the two actual totals differ, say so at the top: the metrics and the S-curve then describe different money. Check every invoice has a date, and read the count of undated invoices beside the curve.

## The forecast, line by line

Apply the rule to each line before reading the EAC, and write the branch each line took.

| code | budget | actual + commitment | entered forecast | itemForecast | rule used |
| --- | --- | --- | --- | --- | --- |
| DRL-01 | 14200000 | 12400000 | none | 14200000 | budget |
| CSG-02 | 3900000 | 4300000 | none | 4300000 | actual + commitment |
| CMT-03 | 1250000 | 940000 | 1400000 | 1400000 | entered |
| LOG-04 | 2100000 | 1250000 | none | 2100000 | budget |
| CMP-05 | 5600000 | 1200000 | none | 5600000 | budget |

OFON-1's EAC is 27600000 and its variance at completion -550000. An answer that quotes only the EAC has shown no reading, because the branch on each line is the reading. Look for an entered forecast that is not positive: the rule ignores it, and that line falls back to the larger of its budget and its actual plus commitment.

## Earned value and CPI

Multiply each budget by its progress. DRL-01, 14200000 at 72.0000 percent, earns 10224000; CMT-03, 1250000 at 55.0000 percent, earns 687500. The AFE earns 15231500, CPI is 1.009377, percent spent 55.7856 and percent complete 56.3087. Read the progress column with suspicion. CSG-02 at 100.0000 percent earns only its budget of 3900000 against an actual of 4300000, and a line whose progress was never updated earns nothing new however much it spends.

## The date, then SPI

Set the explorer's as-of date to the date the task names, and write that date beside every planned value and SPI you quote. For OFON-1 as of 2027-08-15: time progress 0.645695, planned value 17466060, SPI 0.872063. Then place the date in the window. On or before the start day SPI is null, and on or after the end it equals percent complete divided by 100. A date the engine cannot read is refused with "asOf is not a valid date".

## The curve

Read the S-curve at the same as-of date. Count the points, compare the last Actual with the line actuals, find the first projected Forecast point, and write the last Planned point beside the budget. On OFON-1 that is 10 points, a last Actual of 15090000, a jump to 19374834 and a last Planned of 24452483 against 27050000.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Lines | Currency, window and three totals checked |
| Actuals | Line actuals and invoice total compared, dates checked |
| Forecast | Rule branch named on every line, then EAC and variance |
| Earned value | Earned value by line, CPI, percent spent, percent complete |
| Date | As-of date written beside planned value and SPI |
| Curve | Points, last Actual, forecast jump, plan shortfall |

## The mistake

The careful mistake is doing every calculation right against the wrong date. Every metric except time progress, planned value and SPI is identical at every date, though the S-curve's Actual and Forecast split moves, so an answer whose SPI was read at the app's default of today, with every other number correct, looks complete and answers a different question.

## Exercise

Work OFON-1 in the order given, as of 2027-08-15. For each step write the OFON-1 number that shows you read it. Then name the step at which an entered forecast that is not positive would first become visible, and the step at which a report run on the wrong date would.
