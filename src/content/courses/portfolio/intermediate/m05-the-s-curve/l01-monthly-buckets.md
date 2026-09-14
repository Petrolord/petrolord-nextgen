# Monthly buckets

The S-curve samples an AFE once a month across its window. Each point is a set of cumulative totals on a single day, under a month label that is easy to misread.

{{panel:ec-cost-explorer}}

## Ten points for OFON-1

OFON-1's window runs from 2027-02-01 to 2027-11-30. As of 2027-08-15 the engine returns 10 points, one per calendar month from the start date to the end date.

| point | label | Planned | Actual | Forecast |
| --- | --- | --- | --- | --- |
| 0 | Feb 27 | 0 | 0 | 0 |
| 1 | Mar 27 | 2507947 | 3100000 | 3100000 |
| 2 | Apr 27 | 5284603 | 3100000 | 3100000 |
| 3 | May 27 | 7971689 | 8300000 | 8300000 |
| 4 | Jun 27 | 10748344 | 8300000 | 8300000 |
| 5 | Jul 27 | 13435430 | 12700000 | 12700000 |
| 6 | Aug 27 | 16212086 | 15090000 | 15090000 |
| 7 | Sep 27 | 18988742 | null | 19374834 |
| 8 | Oct 27 | 21675828 | null | 22116556 |
| 9 | Nov 27 | 24452483 | null | 24949669 |

## What a label means

"Feb 27" is February of the window's year, a short month name followed by a two-digit year. It is not a day of February. Each point stands on the start date stepped forward by whole months, which on OFON-1 is the first day of each month, and every column is cumulative to that day.

The invoices prove it. OFON-1 is billed 3100000 on 2027-02-20, 5200000 on 2027-04-10, 4400000 on 2027-06-05 and 2390000 on 2027-07-18. The Feb 27 point shows an Actual of 0 although an invoice is dated inside February, and that invoice first appears at Mar 27. At Jun 27 the Actual is 8300000, which is 3100000 plus 5200000; the June invoice of 4400000 first appears at Jul 27, making 12700000. The July invoice of 2390000 first appears at Aug 27, taking the total to 15090000.

## No point lands on the as-of date

The metrics report a planned value of 17466060 as of 2027-08-15. That number is on no point of the curve. Aug 27, standing on the first of August, shows Planned 16212086, and Sep 27 shows 18988742. The as-of date falls between two buckets, so the curve cannot show the planned value that the SPI of 0.872063 was divided by. Earned value, 15231500, is not plotted at all.

## What the buckets refuse

The buckets are a fixed calendar grid. There is no weekly or daily resolution, no point on the as-of date, and no point on the end date unless the end falls exactly on a monthly step. OFON-1's end, 2027-11-30, is not on a step from 2027-02-01, so its last point is Nov 27. Before EC5-0 the walk did not stop at the window: it ran on to the current month. The repaired walk stops at the window's end.

## The mistake

The common mistake is reading "Jul 27" as July's spending, or as spend to the end of July. Its Actual of 12700000 leaves out the invoice of 2027-07-18. A reader who takes the July point as a month-end total understates spend by that whole invoice, then watches 2390000 appear in August and reports an August spike that never happened. The second form is reading "Feb 27" as a date and hunting for a cut-off on a day that does not exist.

## Exercise

For OFON-1 as of 2027-08-15, write the Actual at Jun 27, Jul 27 and Aug 27, and name the invoice each step adds. Then explain why the planned value of 17466060 used by the SPI appears on no point of the curve, and name the two points it falls between.
