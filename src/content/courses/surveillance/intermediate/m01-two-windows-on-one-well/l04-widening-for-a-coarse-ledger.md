# Widening for a coarse ledger

A monthly well compared over a seven-day window is one point against nothing. `detectExceptions` measures each well's cadence and stretches its windows to fit. It does not touch the volumes inside them.

{{panel:pd-exception-explorer}}

## The cadence, and what it stretches

`seriesCadenceDays` is the MEDIAN gap between consecutive points on a well, so gaps of [30,31,30,31,30] give 30.000000 and a single point gives null. A median over an even count averages the two middle gaps, so gaps of [1,1,30,30] give 15.500000, a cadence no gap in that series ever was.

The widening is three maxima: `recentDays` becomes max(recentDays, ceil(cadence x 1.5)), `baselineDays` becomes max(baselineDays, ceil(cadence x 4)), and `staleDays` becomes max(staleDays, ceil(cadence x 1.5)). At a cadence of 1.0 or 2.0 days that leaves the defaults of 7, 30 and 7 untouched. At 7.0 days it gives 11, 30 and 11. At 30.0 days it gives 45, 120 and 45, and at 30.5 days it gives 46, 122 and 46.

## The volumes are not rescaled, and nothing says how long a row covers

`derivePoint` reads every ledger row as a calendar day. The published monthly well files a row of 15000.000000 stb over a PERIOD and comes back with an `oilPd` of 15000.000000 as well, because its `hours_on` is null. Its exception reads `rate_drop` at medium, value = 12000.000000000 against a baseline of 15000.000000000, printed as "Oil down 20%: 12,000 vs 15,000 stb/d baseline."

The teaching well OGUTA-14, which this course invented and which is neither published nor real, is the same trap with the numbers going the other way. Six period rows, the last of them covering fourteen days rather than a month.

| Date | Oil over the period, stb | Days since the previous row | Oil per elapsed day, stb/d |
| --- | --- | --- | --- |
| 2024-06-30 | 25600.000000 | 30 | 853.333333333 |
| 2024-07-31 | 24800.000000 | 31 | 800.000000000 |
| 2024-08-31 | 24000.000000 | 31 | 774.193548387 |
| 2024-09-30 | 23200.000000 | 30 | 773.333333333 |
| 2024-10-14 | 11600.000000 | 14 | 828.571428571 |

Its cadence is 30.000000, so its windows widen to 45 and 120 days and its `staleDays` widens to 45, which is why a well filing one row a month is not also reported as silent. The engine reports `rate_drop` at HIGH, value = 11600.000000000 against a baseline of 24400.000000000: "Oil down 52%: 11,600 vs 24,400 stb/d baseline."

## The mistake

Reading the period column and the per-elapsed-day column as the same story. The PERIOD VOLUME halved. The oil per elapsed day went UP, from 773.333333333 stb/d to 828.571428571 stb/d. The well is at the top of the severity ladder for producing more oil per day than it did in the period before, and the message hard-codes stb/d after a number that is a month of stb.

## What it refuses

The module has no field for period length and never asks for one. Nothing in a ledger row says what it covers, so the widening can correct the WINDOWS for a coarse cadence and can never correct the VOLUMES.

## Exercise

Read OGUTA-14 in the panel and write down its last period volume and the days that period covered.

Then say which of the two columns the reported 52 per cent came from.
