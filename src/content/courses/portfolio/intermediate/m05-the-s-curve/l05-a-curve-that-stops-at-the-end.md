# A curve that stops at the end

The S-curve walks monthly steps only while they fall inside the window, so its last point can land before the end date and before the plan reaches the budget.

{{panel:ec-cost-explorer}}

## The last points on OFON-1

| point | label | Planned | Actual | Forecast |
| --- | --- | --- | --- | --- |
| 8 | Oct 27 | 21675828 | null | 22116556 |
| 9 | Nov 27 | 24452483 | null | 24949669 |

OFON-1's last Planned point, Nov 27, is 24452483 against a budget of 27050000, which is 2597517 short. Its last Forecast point is 24949669 against an EAC of 27600000. The walk steps from 2027-02-01 by whole months, so the Nov 27 point stands on the first of November. The next step, the first of December, falls after the end date of 2027-11-30, and the walk stops.

## Stopping short is not underspending

Nothing is missing from the plan itself. Planned value on 2027-11-30 is the full 27050000, and the metrics report exactly that on the end day. The curve simply has no point on that day. A chart that ends at 24452483 draws a plan that never reaches the approved budget, and a reader who takes the top of the chart as the planned total has lost 2597517 of it without noticing.

## When the curve does reach the end

A published window whose end falls exactly on a monthly step returns 13 points, from a first Planned of 0 to a last Planned of 2000, with a last Forecast of 2450: the whole EAC, reached because a point stands on the end date. A published window over one calendar year returns 12 points, labelled Jan 20 to Dec 20, with a last Planned of 1101. That window stops short in the same way as OFON-1, because its last step lands on the first of December and the year runs on past it.

## Repaired, and not repaired

Before EC5-0 the walk was not held to the window and ran on to the current month. The repaired walk stops at the window's end, so no point is plotted after it. The plan stopping short of the budget was not repaired. It is a property of the engine as published, and it touches the Planned and the Forecast lines alike.

## The mistake

The first mistake is reading the last Planned point as the budget, and the last Forecast point as the EAC. Take the budget and the EAC from the metrics, and take only the shape from the curve. The second is reading the gap between the last Forecast and the EAC as money the job will not spend.

## Exercise

Write OFON-1's last Planned and last Forecast points beside the budget and the EAC, and give the plan's shortfall. Then explain why a published window ending on a monthly step reaches its whole EAC while OFON-1's curve does not, and say where you would read OFON-1's planned value on its end day.
