# Authorisation for expenditure

An authorisation for expenditure, an AFE, is the approval to spend a stated sum on a stated scope inside a stated window. Every later cost reading is measured against that promise.

## OFON-1 as authorised

OFON-1 is authorised in USD for the window 2027-02-01 to 2027-11-30, across five cost lines:

| code | description | budget |
| --- | --- | --- |
| DRL-01 | Rig and drilling services | 14200000 |
| CSG-02 | Casing and tubulars | 3900000 |
| CMT-03 | Cementing | 1250000 |
| LOG-04 | Logging and testing | 2100000 |
| CMP-05 | Completion | 5600000 |

The engine totals the budget at 27050000. DRL-01 alone carries 14200000 of it, more than half, and CMP-05 holds 5600000 for completion work that has spent nothing yet.

## What a line carries

Beside its code and description, each line holds a budget, a commitment (money contracted and not yet paid), an actual (money spent), an optional entered forecast and a progress percent typed by whoever reports the work. On OFON-1 the engine totals commitments at 5000000 and actuals at 15090000. Dated invoices sit beside the lines.

The AFE itself carries the window, the currency and, for a joint venture, the partners' working interests. It carries no rig schedule, so the engine shapes its plan from the two window dates alone.

## Four readings from one promise

The engine turns those inputs into four readings:

- the cost at completion, an EAC of 27600000 against the budget of 27050000, a variance at completion of -550000;
- the work earned, an earned value of 15231500;
- how well money turned into work, a CPI of 1.009377;
- whether work keeps pace with the calendar, an SPI that depends on the date of the report and reads 0.872063 as of 2027-08-15.

The first three are read from the lines as entered and do not change with the date. Only the schedule reading does.

## What it refuses

The engine refuses a negative progress figure and names the cost item that carries it. It refuses an as-of date that is not a real date with the message "asOf is not a valid date". It accepts progress past 100.0000 percent and lets that line earn more than its budget. It plans spending as a straight line across the window, and its earned value is only as good as the progress typed in.

## The mistake

The first mistake is reading the budget as the cost. 27050000 is what was authorised; the engine forecasts 27600000 on the same lines, because CSG-02 has already spent 4300000 against a budget of 3900000 and CMT-03 carries an entered forecast of 1400000 against a budget of 1250000. The second is reading actuals as progress. Spending 15090000 says nothing about how much work it bought. The typed progress says that, and on OFON-1 it earns 15231500.

## Exercise

State OFON-1's currency, window, total budget, total commitments and total actuals. Then name the two lines that lift the EAC of 27600000 past the budget of 27050000, and give the figure on each line that does it.
