# Onward

Everything in this tier is one pass over rows. A point, a field day, a window of field days, a mean. There is no second window anywhere in it, which is the reason it stops where it does.

## What a single pass cannot say

It cannot say a well changed. `derivePoint` sees one row and has nothing to compare it against. `computeKpis` sees one window and has nothing to compare it against either. Both return numbers and neither returns a verdict, and a reader who wants "this well is worth looking at" has to get it somewhere else.

It also cannot say who made a metered barrel, which is a different module entirely, and it cannot say which lift method a well should carry, which is two more.

What it can do is name the convention behind every figure it produces. A watercut is a fraction of liquid, a gas-oil ratio is per barrel of oil, a producing-day rate is a volume scaled to twenty-four hours and refuses at zero hours, a field ratio is volumetric, and a KPI window is a date window whose length the return states rather than measures.

## What the comparison half looks like

`detectExceptions` puts two windows on one well and reports the difference. Its defaults are `recentDays` 7 and `baselineDays` 30, with `rateDropPct` 20 per cent, `watercutRisePts` 10 points, `gorRisePct` 30 per cent, `downtimeHours` 12 hours, `staleDays` 7 and `minOilRate` 5.

Those lengths are not fixed. A well is measured on its own reporting cadence, and at a cadence of 30.0 days the widening rule takes `recentDays` to 45, `baselineDays` to 120 and `staleDays` to 45, so two wells on one field can be compared over windows of very different lengths with nothing in the return saying so.

Splitting a metered stream across wells is a second module with its own defaults, a `maxTestAgeDays` of 180 and a factor warning band from 0.7 to 1.3.

## And the half after that

The same rows, read a second way. The published gas-oil ratio rise on well P-1 is 70.033482142857 per cent read as a mean of daily ratios and 42.737789203085 per cent read volumetrically, an overstatement of 19.122961825433 per cent, and the golden publishes that disagreement rather than resolving it because resolving it would move numbers a shipped studio shows.

Knowing a number is a reading is what this tier is worth. Pricing the difference between two readings is what comes next.

## Exercise

Write down the eight default surveillance settings with their units.

Then say what the widening rule does to each of the three window lengths at a cadence of 30.0 days.
