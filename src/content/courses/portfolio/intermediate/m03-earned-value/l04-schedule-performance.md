# Schedule performance

The schedule performance index, SPI, is earned value divided by planned value: the work done against the work the calendar expected by the as-of date. Earned value does not move with the date and planned value does, so SPI is a reading of a date as much as of a project.

{{panel:ec-cost-explorer}}

## One AFE, six dates

| as of | planned value | earned value | SPI | CPI |
| --- | --- | --- | --- | --- |
| 2027-01-15 | 0 | 15231500 | null | 1.009377 |
| 2027-02-01 | 0 | 15231500 | null | 1.009377 |
| 2027-06-30 | 13345861 | 15231500 | 1.141290 | 1.009377 |
| 2027-08-15 | 17466060 | 15231500 | 0.872063 | 1.009377 |
| 2027-11-30 | 27050000 | 15231500 | 0.563087 | 1.009377 |
| 2028-01-10 | 27050000 | 15231500 | 0.563087 | 1.009377 |

As of 2027-06-30, 15231500 / 13345861 = 1.141290: OFON-1 reads ahead of its plan. As of 2027-08-15, 15231500 / 17466060 = 0.872063: the same progress reads behind. From the end day on, 15231500 / 27050000 = 0.563087. The lines did not change between those rows. Only the calendar did.

## Null before the start

Where planned value is 0 the engine reports SPI as null. Before the window opens, and on the start day itself, no whole day has elapsed, so there is nothing to divide by. OFON-1 has already earned 15231500 by its figures, and SPI still declines to call it early or late. A null is the honest answer, and a report that prints it as 0 or as 1 has made one up.

## SPI after the end

Once planned value reaches the whole budget, SPI is earned value over budget, which is percent complete divided by 100: 0.563087 against 56.3087 percent. Before the EC5-0 repair, the AFE wizard asked for no dates, time progress fell back to 1, and SPI always equalled percent complete divided by 100, on every day of the AFE's life. On OFON-1 that fallback would print 0.563087 on every date, including the middle of the window.

## Published cases

| case | earned value | SPI |
| --- | --- | --- |
| suite test: CPI 1.25 | 100.0000 | 0.500000 |
| progress beyond 100 percent earns beyond the budget | 150.0000 | 1.500000 |
| suite test: weighted earned value | 110.0000 | 0.275000 |

The second shows SPI inheriting progress typed past 100 percent: 1.500000 comes from that typing and says nothing about speed.

## What it refuses

SPI is one ratio for the whole AFE, and it does not know which lines are late. It compares budget-weighted progress with a straight-line plan, so a drilling line naturally ahead of an even plan in its early months lifts it, and a completion campaign still to come drags it after. It weighs work by money and the calendar by money, and it counts no days of delay. It inherits every weakness of the progress typed in.

## The mistake

The mistake is SPI read on a report with no date. OFON-1's SPI is 1.141290, 0.872063 and 0.563087 on the same lines, and a reader given one of them without its as-of date cannot tell ahead from behind. The dashboard passes today as the as-of date, so a screenshot taken on one day and read on another quietly changes meaning. Quote SPI with its date, every time. The second mistake is reading a null as a problem to fix: before the start there is no schedule to be ahead of.

## Exercise

Compute OFON-1's SPI as of 2027-06-30 and 2027-08-15 from its earned value and planned values, and say which date reads ahead and which behind. Then explain why SPI is null as of 2027-02-01, and why from 2027-11-30 on it equals percent complete divided by 100.
