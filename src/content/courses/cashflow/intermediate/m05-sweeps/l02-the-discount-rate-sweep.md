# The discount rate sweep

Sweep the nominal discount rate on AKATA and two things happen: the applied real rate follows it down the Fisher relation, and every discounted KPI moves while every undiscounted one holds still.

{{panel:ec-time-explorer}}

## AKATA, real basis, 3 percent inflation

| nominal rate, percent | applied real rate, percent | NPV | discounted payback, years | DPI | discounted take, percent |
| --- | --- | --- | --- | --- | --- |
| 0 | -2.912621 | 141637829.18 | 3.461632 | 0.555442 | 66.1723 |
| 2 | -0.970874 | 125059129.50 | 3.551362 | 0.492131 | 68.0483 |
| 4 | 0.970874 | 110028835.96 | 3.646118 | 0.434434 | 69.9844 |
| 6 | 2.912621 | 96365497.46 | 3.746005 | 0.381717 | 71.9813 |
| 8 | 4.854369 | 83912631.29 | 3.851132 | 0.333428 | 74.0399 |
| 10 | 6.796117 | 72534830.66 | 3.961607 | 0.289088 | 76.1610 |
| 12 | 8.737864 | 62114544.47 | 4.104424 | 0.248281 | 78.3457 |
| 15 | 11.650485 | 48059114.69 | 4.362158 | 0.192907 | 81.7443 |
| 20 | 16.504854 | 28144510.75 | 4.862835 | 0.113715 | 87.7437 |
| 25 | 21.359223 | 11736532.11 | 5.691901 | 0.047709 | 94.1819 |

## The zero-rate row

At a nominal rate of 0 percent the NPV is 141637829.18, which is the total nominal net cash flow, not the real total of 117362408.71. The applied real rate is -2.912621 percent: a nominal rate under the inflation rate is a negative real rate, and discounting the real flows at a negative rate inflates them back to money of the day. The real rate passes through zero between 2 and 4 percent nominal, and only from there does discounting on the real basis begin to shrink the real flows.

## Two ways to write one number

The NPV at 8 percent nominal is 83912631.29. AKATA's inflation sweep at a fixed 10 percent nominal reports a real total net cash flow of 83912631.29 at 8 percent inflation. They are the same number because they are the same arithmetic: dividing each nominal flow by the same factor per year is deflation when 8 percent is the inflation rate and discounting when it is the discount rate. The 2 percent row, 125059129.50, matches the real total at 2 percent inflation the same way.

## What holds still

The IRR, the undiscounted payback and the undiscounted take do not move. On the published discount_rate_multiyear_jv_real sweep from 0 to 20 percent in steps of 2, IRR is 47.9020 percent, payback 2.89 years, take 69.2573 percent, total revenue 767745022.67 and total tax 181905488.72 on every row, while NPV falls from 148905488.72 to 50852201.45. The rows are the same every time; only the exponent changes.

## What moves, and which way

NPV falls, discounted payback lengthens from 3.461632 to 5.691901 years, DPI falls from 0.555442 to 0.047709, and discounted take rises from 66.1723 to 94.1819 percent. The PV of capex barely moves, 255000000.00 to 246000000.00, because the capex sits in the first two years where the discount factor is still close to one.

## The mistake

The careful mistake is to sweep the rate looking for the one that makes the project right. The rate is a policy, set before the ledger is read, and the sweep is a sensitivity to that policy. The rate at which NPV would reach zero is the IRR, 29.2361 percent, and it is not on the table because it is not a candidate rate.

## What it refuses

The sweep refuses to move the applied real rate on its own: the real rate is derived from the nominal rate and the 3 percent inflation, and there is no sweep of the real rate directly.

## Exercise

Read the NPV at 10 and at 15 percent and say whether any undiscounted KPI differs between the two runs, and why. Then explain why the 0 percent row prints 141637829.18 and not 117362408.71.
