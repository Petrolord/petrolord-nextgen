# What a period row does not say

Nothing in a ledger row records how long the row covers. `derivePoint` reads every row as one calendar day, and the exception message hard-codes stb/d.

{{panel:pd-reading-explorer}}

## The windows widen and the volumes do not

`detectExceptions` measures each well's cadence as the median gap between its points, then stretches its windows: `recentDays` becomes the larger of itself and the cadence times 1.5 rounded up, `baselineDays` the larger of itself and the cadence times 4. At a cadence of 1.0 days the windows stay at 7 and 30. At 30.0 days they become 45 and 120.

That fixes the count of points being compared. It does nothing to the volumes, which are still period totals compared against period totals with a per-day unit printed after them.

## The teaching monthly well

OGUTA-14 is invented by this course. It files six period rows, and the last covers fourteen days rather than a month.

| Period ending | Oil over the period, stb | Oil per elapsed day, stb/d |
| --- | --- | --- |
| 2024-05-31 | 26400.000000 | n/a |
| 2024-06-30 | 25600.000000 | 853.333333333 |
| 2024-07-31 | 24800.000000 | 800.000000000 |
| 2024-08-31 | 24000.000000 | 774.193548387 |
| 2024-09-30 | 23200.000000 | 773.333333333 |
| 2024-10-14 | 11600.000000 | 828.571428571 |

The first row has no earlier row to measure an elapsed span against, so its per-day column is empty. Across the rest of them the period column halves on the last row while the per-elapsed-day column rises. Its `seriesCadenceDays` is 30.000000, so `recentDays` is 45, `baselineDays` is 120 and `staleDays` is 45.

## What the engine says about it

Type `rate_drop`, severity high, value 11600.000000000, baseline 24400.000000000, message `Oil down 52%: 11,600 vs 24,400 stb/d baseline.` High is the top of the ladder, and the well earned it for producing more oil per elapsed day than it did in the period before.

## The mistake

Trusting the unit in the sentence. The value and the baseline are means of period volumes in stb. Only a ledger where every row covers exactly one day makes that sentence true, and nothing in the module checks whether it does.

## What no function can recover

There is no duration column, so nothing downstream can rescale. `movingAverage` works over a date window rather than a point count, which is what lets a monthly and a daily ledger share a chart, but it averages the period volumes it is given. On the same monthly rows a 7-day window returns them unchanged as 26400, 25600, 24800, 24000, 23200 and 11600.

## Exercise

Read OGUTA-14 in the panel and record the period volume and the oil per elapsed day on the last two rows.

Then say which column the exception used, and what the severity would have been had it used the other.
