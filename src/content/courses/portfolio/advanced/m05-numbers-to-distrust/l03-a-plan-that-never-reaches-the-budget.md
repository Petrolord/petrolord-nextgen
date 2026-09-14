# A plan that never reaches the budget

The S-curve's Planned line is the budget spread in a straight line across the window, with one point per calendar month. The points stop at the start of the last month, so the plan ends short of the budget it is meant to reach.

{{panel:ec-governance-explorer}}

## OFON-1's plan

The window runs 2027-02-01 to 2027-11-30 on a budget of 27050000, read as of 2027-08-15:

| point | label | Planned | Forecast |
| --- | --- | --- | --- |
| 0 | Feb 27 | 0 | 0 |
| 6 | Aug 27 | 16212086 | 15090000 |
| 7 | Sep 27 | 18988742 | 19374834 |
| 8 | Oct 27 | 21675828 | 22116556 |
| 9 | Nov 27 | 24452483 | 24949669 |

There are 10 points. Each Planned value is the budget times the share of the window elapsed at the start of its month, so the last point sits on the first of November and the rest of the window to 2027-11-30 is never plotted. The last Planned point is 24452483 against a budget of 27050000, and 2597517 of the plan never appears.

The metrics do reach the budget. As of 2027-11-30 time progress is 1.000000 and planned value is 27050000. The chart and the metrics disagree about the same plan.

## The forecast stops short too

After the as-of date the Forecast line is the EAC spread linearly from the start, and the same last bucket cuts it off. OFON-1's EAC is 27600000, a variance at completion of -550000, which is an overrun. The last Forecast point is 24949669, below the budget of 27050000. A reader of the chart alone sees a forecast finishing under budget on an AFE that forecasts an overrun.

The forecast also jumps, from the last actual of 15090000 to 19374834 at the first projected point, because the projected points sit on the EAC line from the start and never continue from the spend.

## When the plan does reach it

A published case whose window ends exactly on a bucket has 13 points, and its last point reads Planned 2000 and Forecast 2450, the whole EAC. A published case over one calendar year has 12 points and ends at Planned 1101 at Dec 20. The shortfall depends on where the end date falls against the month starts. OFON-1 ends on 2027-11-30, so it loses almost a whole month of plan.

## Left as published

EC5-0 bounded the curve to its window, so it no longer runs past the end. It did not add a point on the end date. The plan stopping short is a finding, taught as a property of the engine as published.

## The mistake

The first mistake is reading the gap between the last Planned point and the budget as money the plan never meant to spend. The second is reading the last Forecast point as the EAC. On OFON-1 the first treats 2597517 as slack, and the second turns a variance of -550000 into an apparent saving. Take the EAC, the variance at completion and planned value from the metrics, and use the curve for its shape.

## Exercise

Give OFON-1's last Planned point, its budget and the shortfall, and explain why the last point falls short. Then give the last Forecast point and the EAC, and say what a reader of the chart alone would conclude about how the AFE finishes.
