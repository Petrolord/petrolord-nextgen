# Reading an overrun off the curve

The S-curve's Planned line is the budget spread in a straight line across the window, with one point per calendar month and a closing point dated the window end. The closing point is where the curve states the budget and the EAC. A reader who stops one point early sees neither.

{{panel:ec-governance-explorer}}

## OFON-1's curve

The window runs 2027-02-01 to 2027-11-30 on a budget of 27050000, read as of 2027-08-15:

| point | label | windowEnd | Planned | Forecast |
| --- | --- | --- | --- | --- |
| 0 | Feb 27 | false | 0 | 0 |
| 6 | Aug 27 | false | 16212086 | 15090000 |
| 7 | Sep 27 | false | 18988742 | 19374834 |
| 8 | Oct 27 | false | 21675828 | 22116556 |
| 9 | Nov 27 | false | 24452483 | 24949669 |
| 10 | 30 Nov 27 | true | 27050000 | 27600000 |

There are 11 points: 10 monthly points from the start date, then the closing point labelled with its day, "30 Nov 27", with windowEnd true. On the closing point Planned is the budget total, 27050000, and Forecast is the EAC, 27600000. The last monthly point sits on the first of November, and the closing point adds the remaining 2597517 of plan.

## The overrun, read at the end

OFON-1's EAC of 27600000 against its budget of 27050000 is a variance at completion of -550000, an overrun, and the closing point shows it as Forecast above Planned. The metrics agree: as of 2027-11-30 time progress is 1.000000 and planned value is 27050000.

## Reading one point early

The last MONTHLY point, "Nov 27", shows Forecast 24949669 and Planned 24452483. Both sit below the budget. A reader who takes that row as the end of the chart sees a forecast finishing under 27050000 on an AFE that forecasts an overrun of 550000, and a plan that seems never to reach the money authorised. Neither is true of the AFE. Both come from stopping a month short of the window end.

The same care applies at the other end of the forecast. After the as-of date the Forecast line is the EAC spread linearly from the start, so it jumps from the last actual of 15090000 to 19374834 at the first projected point. No money is spent at that jump: the line switches from counting invoices to drawing the EAC.

## When a month step lands on the end

A published case whose window ends exactly on a month step, 2026-01-01 to 2026-05-01, has 5 points, and the step on 1 May becomes the closing point, so no date appears twice. Its closing point "1 May 26" carries Planned 400, the budget, and Forecast 380, the EAC. Wherever the end date falls against the month starts, the closing point carries the budget and the EAC.

## The mistake

The mistake is taking the EAC from the last monthly point. On OFON-1 that turns a variance of -550000 into an apparent saving. Read the closing point by its windowEnd flag, and take the EAC, the variance at completion and planned value from the metrics, with the curve for its shape.

## Exercise

Give OFON-1's closing point with its label, Planned and Forecast, and the variance at completion they imply. Then give the last monthly point's Planned and Forecast, and say what a reader who stopped there would conclude about how the AFE finishes.
