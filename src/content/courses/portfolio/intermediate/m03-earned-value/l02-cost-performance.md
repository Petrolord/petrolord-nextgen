# Cost performance

The cost performance index, CPI, is earned value divided by actuals: how much authorised work each unit of spend has bought. Over 1 the work cost less than its budget said; under 1 it cost more.

{{panel:ec-cost-explorer}}

## OFON-1's CPI

The engine reports earned value 15231500 and actuals 15090000, so CPI is 15231500 / 15090000 = 1.009377. For every USD spent, OFON-1 has earned slightly more than one USD of budgeted work.

The index is the whole AFE in one figure, and the lines underneath do not agree with each other:

| code | earned value (budget x progress) | actual |
| --- | --- | --- |
| DRL-01 | 10224000 (derived) | 9800000 |
| CSG-02 | 3900000 (derived) | 4300000 |
| CMT-03 | 687500 (derived) | 640000 |
| LOG-04 | 420000 (derived) | 350000 |
| CMP-05 | 0 (derived) | 0 |

DRL-01, CMT-03 and LOG-04 have earned more than they spent. CSG-02 has earned 3900000 for 4300000 of spend on a finished line. The drilling line, the largest by far, carries the index over 1.

## CPI beside the EAC

The same AFE reports CPI 1.009377 and a variance at completion of -550000. The two do not contradict each other; they are built from different columns. CPI reads progress and actuals. The forecast rule reads budgets, actual + commitment and entered forecasts, and never reads progress. CMT-03 shows it plainly: it has earned 687500 for 640000 spent, a line performing well on cost, and it forecasts 1400000 against 1250000 because its engineer entered that figure.

## CPI does not move with the date

Earned value and actuals are read from the lines as entered, so CPI is 1.009377 at every as-of date: before the window opens, in the middle and after it closes. Only schedule measures move with the date.

## Published cases

| case | earned value | actuals | CPI |
| --- | --- | --- | --- |
| suite test: CPI 1.25 | 100.0000 | 80.0000 | 1.250000 |
| progress beyond 100 percent earns beyond the budget | 150.0000 | 90.0000 | 1.666667 |
| suite test: weighted earned value | 110.0000 | 0.0000 | 1.000000 |

100.0000 / 80.0000 = 1.250000 and 150.0000 / 90.0000 = 1.666667. The third row cannot be a division: nothing has been spent.

## What it refuses

When actuals are 0 the engine as published returns CPI 1, whatever has been earned. The weighted earned value case reports CPI 1.000000 with 110.0000 earned and nothing spent. This is recorded as a finding and has not been repaired, so CPI 1.000000 on an AFE with no spend means "undefined" and must be read that way. CPI also inherits every weakness of the progress figures: progress past 100 percent raised the second case to 1.666667 without a dollar being saved.

## The mistake

The mistake is reading CPI 1.009377 as "under budget". OFON-1 is forecast to overrun by 550000 on the same day. CPI says work has been bought at slightly better than budget on average, weighted heavily by drilling; it says nothing about CSG-02, already finished over its line, or about CMT-03's entered overrun. Read CPI beside the variance at completion, never instead of it.

## Exercise

Compute OFON-1's CPI from its earned value and actuals, and name the one line whose earned value is less than its actual. Then explain how the AFE can report CPI 1.009377 and a variance at completion of -550000 at the same time, and what CPI 1.000000 means on an AFE with no spend.
