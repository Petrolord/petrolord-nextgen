# A curve that closes on the end date

The S-curve walks monthly steps from the start date while they fall inside the window, then closes on a point dated the window end. That closing point is where the curve shows the budget and the EAC.

{{panel:ec-cost-explorer}}

## The last points on OFON-1

| point | label | windowEnd | Planned | Actual | Forecast |
| --- | --- | --- | --- | --- | --- |
| 8 | Oct 27 | false | 21675828 | null | 22116556 |
| 9 | Nov 27 | false | 24452483 | null | 24949669 |
| 10 | 30 Nov 27 | true | 27050000 | null | 27600000 |

As of 2027-08-15 OFON-1 has 11 points. The walk steps from 2027-02-01 by whole months, so the Nov 27 point stands on the first of November. The next step, the first of December, falls after the end date of 2027-11-30, so the walk stops there and the curve closes on a point dated the end, labelled with its day, "30 Nov 27", and marked windowEnd true.

On the closing point Planned is the budget total, 27050000, and Forecast is the EAC, 27600000. The last monthly point plans 24452483, so the closing point adds the remaining 2597517 of plan. Its Actual counts the invoices dated on or before the end when the end is on or before the as-of date, and is null otherwise. As of 2027-08-15 it is null.

## Read after the end

As of 2028-01-10 the window has closed, and the closing point "30 Nov 27" carries Planned 27050000, Actual 15090000 and Forecast 27600000. The actual is the invoice total to the end; the plan and the forecast are the budget and the EAC.

## When a step lands on the end

When a monthly step falls exactly on the end date, the closing point replaces it, so no date appears twice. A published window from 2026-01-01 to 2026-05-01, read on 2026-05-02, returns 5 points, and its last is "1 May 26" with Planned 400, Actual 120, Forecast 380 and windowEnd true. A published window over the calendar year 2020 with two invoices returns 13 points and closes on "31 Dec 20" with Planned 1200, Actual 350 and Forecast 1200.

## One calendar in every zone

The window, the as-of date, the monthly step, the day count and every label are read in UTC, so the same AFE draws the same curve in every time zone. A published window starting in February labels its first point "Feb 27" in every zone.

Invoices with no date the engine can read never reach the curve. The engine reports how many there are, and the AFE dashboard names that count beside the curve. OFON-1 has none.

## Reading an overrun off the curve

The closing point sets the EAC beside the budget: Forecast 27600000 against Planned 27050000, a variance at completion of -550000. The curve carries the same overrun the metrics report on the end day.

## The mistake

The mistake is stopping at the last monthly point. Nov 27 shows Forecast 24949669 and Planned 24452483, and a reader who takes those as the totals sees neither the budget nor the EAC, and understates the plan by 2597517. The second mistake is reading the null Actual on the closing point as zero spend: before the end is reached the curve simply has no actual to plot there.

## Exercise

Write OFON-1's Nov 27 and 30 Nov 27 points as of 2027-08-15, and give the plan the closing point adds. Then state the closing point as of 2028-01-10, and explain why a window ending on a monthly step never shows its end date twice.
