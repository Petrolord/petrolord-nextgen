# Actuals from invoices

The S-curve's Actual line is built from dated invoices, while the AFE metrics read actuals from the cost lines. On OFON-1 the two agree by construction, and nothing in the engine makes them agree.

{{panel:ec-cost-explorer}}

## Four invoices, one line

| invoice date | amount |
| --- | --- |
| 2027-02-20 | 3100000 |
| 2027-04-10 | 5200000 |
| 2027-06-05 | 4400000 |
| 2027-07-18 | 2390000 |

At each point of the curve the Actual is the sum of every invoice dated on or before that point's day. OFON-1's points stand on the first of each month, so as of 2027-08-15 the line climbs in steps.

| point | label | Actual |
| --- | --- | --- |
| 1 | Mar 27 | 3100000 |
| 2 | Apr 27 | 3100000 |
| 3 | May 27 | 8300000 |
| 4 | Jun 27 | 8300000 |
| 5 | Jul 27 | 12700000 |
| 6 | Aug 27 | 15090000 |
| 7 | Sep 27 | null |

Past the as-of date the Actual is null at Sep 27, Oct 27 and Nov 27. The curve plots no actual after the report's date, even though the window runs on to 2027-11-30.

## Two sources of actual

The metrics sum the actual column on the cost lines: DRL-01 9800000, CSG-02 4300000, CMT-03 640000, LOG-04 350000 and CMP-05 0, a total of 15090000. The S-curve sums the invoices, whose derived total is also 15090000. They match on OFON-1 because the teaching field was written to match.

On a live AFE they need not. A cost line's actual can carry an accrual for work done and not yet billed, and an invoice can be booked before anyone updates the line. When the two disagree, the percent spent of 55.7856 and the CPI of 1.009377 describe the lines, the Actual line describes the invoices, and both sit on one screen with nothing to say which is which.

## An invoice with no date

One published case bills two invoices over a past window: an amount of 100 with no date field at all, and an amount of 200 whose date is null. The first point's Actual is 200 and the last point's Actual is 200. A null date is read as a day in 1970, so that amount counts in every bucket from the first. The missing date never counts, so that amount never appears. The engine as published refuses neither, and flags neither.

## What the line refuses

The Actual line has no commitments in it, no accruals and no line detail. It cannot show which cost line an invoice paid, and an invoice dated after the as-of date is cut from the curve while an actual typed on a line is not.

## The mistake

The mistake is assuming that the curve's last Actual is the dashboard's actuals. On OFON-1 both read 15090000, which teaches the wrong habit. The check belongs in every reading: compare the line total with the last Actual at or before the as-of date, and treat any difference as a question about accruals, billing or a missing date. The second form is trusting a curve that starts above zero, which on the published case is an undated invoice pulled back to 1970.

## Exercise

Build OFON-1's cumulative invoices at Mar 27, May 27, Jul 27 and Aug 27 from the four invoice amounts. Then name the two places the engine reads actuals from, give one reason a live AFE could show different totals in them, and say what the published case's first-point Actual of 200 tells you about its invoice dates.
