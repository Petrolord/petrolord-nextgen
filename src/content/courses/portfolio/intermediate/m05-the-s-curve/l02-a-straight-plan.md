# A straight plan

The Planned line on the S-curve is the budget spread evenly over the calendar days of the window, the same straight line that gives the metrics their planned value.

{{panel:ec-cost-explorer}}

## The plan on OFON-1

| point | label | Planned | Actual |
| --- | --- | --- | --- |
| 0 | Feb 27 | 0 | 0 |
| 1 | Mar 27 | 2507947 | 3100000 |
| 2 | Apr 27 | 5284603 | 3100000 |
| 3 | May 27 | 7971689 | 8300000 |
| 4 | Jun 27 | 10748344 | 8300000 |
| 5 | Jul 27 | 13435430 | 12700000 |
| 6 | Aug 27 | 16212086 | 15090000 |
| 7 | Sep 27 | 18988742 | null |
| 8 | Oct 27 | 21675828 | null |
| 9 | Nov 27 | 24452483 | null |

At each point Planned is OFON-1's budget of 27050000 times the days elapsed since 2027-02-01 over the days in the window. Mar 27 reads 2507947, Apr 27 reads 5284603 and May 27 reads 7971689. The steps between points are not equal. The line is straight in days, so a long month adds more plan than a short one, and the month labels hide that.

## What the plan does not know

The plan has no shape. OFON-1's lines are DRL-01 at 14200000 for rig and drilling services, CSG-02 at 3900000 for casing and tubulars, CMT-03 at 1250000 for cementing, LOG-04 at 2100000 for logging and testing, and CMP-05 at 5600000 for completion. A well spends rig time and casing early and completion late. The engine draws one straight line for the whole AFE: there is no plan per line, no bell shape and no phasing you can enter. Every calendar day is charged an equal slice of the budget.

## Actual against a smooth line

Invoices arrive in lumps and the plan is smooth, so the two lines keep crossing. At Mar 27 the Actual of 3100000 is above the Planned 2507947. At Apr 27 the same 3100000 is below 5284603. At May 27, 8300000 is above 7971689 again, and at Jun 27 the same 8300000 is below 10748344. Each crossing is an invoice date meeting a straight line. None of them is news about the well.

## A budget line, set against cost

At Aug 27 the Actual is 15090000 against a Planned 16212086. That gap is spending below a straight budget line. It is a cost comparison with no progress in it. SPI divides earned value by planned value, and OFON-1's earned value of 15231500 comes from the progress column, which the curve never plots. A reader who calls the Aug 27 gap "behind schedule" has done cost arithmetic and given it a schedule name.

## The mistake

The first mistake is treating each crossing of Actual over Planned as a change in performance. The deeper one is a forecast copied from the budget. A forecast drawn by following the Planned line to its end says the job will spend like a straight line and finish on budget, and it hides every overrun the lines already show: OFON-1's EAC is 27600000 against a budget of 27050000. Before EC5-0, editing a line in the Suite copied its budget into its forecast. The repaired app no longer does, and one forecast rule serves every screen.

## Exercise

Write OFON-1's Planned and Actual at Mar 27, Apr 27, May 27 and Jun 27, and say at each point which is larger. Then explain why the gap at Aug 27 between an Actual of 15090000 and a Planned 16212086 is not a schedule measure, and name the number from the metrics that is.
