# Grouping a ledger by well

A ledger is a pile of rows with dates on them. Two functions turn that pile into something you can plot, they key on different things, and they disagree about which rows exist.

{{panel:pd-ledger-explorer}}

## Two groupings, two keys

`buildWellSeries` keys on `r.well.id` and returns one series per well. `buildFieldSeries` keys on the date and returns one point per field day. Neither asks the other anything, and neither is a filtered version of the other.

The published surveillance case is a 7-well field of 268 ledger rows that becomes 51 field days, with an asOf of 2025-06-30. Split by well instead, the same rows give this.

| Series | Points | Cadence, days |
| --- | --- | --- |
| I-1 | 47 | 1.000000 |
| O-1 | 47 | 1.000000 |
| P-1 | 47 | 1.000000 |
| P-2 | 47 | 1.000000 |
| P-3 | 6 | 30.000000 |
| P-4 | 27 | 1.000000 |
| P-5 | 47 | 1.000000 |

Those counts and cadences are published in `surveillance_cases.json`.

## A point count is not a data quality score

P-3 files 6 points where P-1 files 47 over the same ledger. That is a cadence of 30.000000 days against 1.000000, not a well that lost forty rows. P-4 files 27 points at a cadence of 1.000000 days, which is a different thing again: a daily well with a gap in it.

## The row nobody attached a well to

Hand two rows in, one of which carries no well. `buildWellSeries` returns 1 series with 1 point on it. `buildFieldSeries` on the identical two rows returns 1 field day carrying 1800.000000 stb of oil. Both rows are in the field total and one row is in the well series, and nothing in either return says a row was dropped.

So the field oil and the sum of the well series can differ by exactly the rows nobody attached a well to. There is no reconciliation figure anywhere in either object.

## The teaching field, well by well

The teaching field OGUTA is invented for this course. It is not a published case and not a real field. Its ledger holds 473 rows over 8 wells, running 2024-09-12 to 2024-11-20, which spans 70 calendar days. OGUTA-2 has 70 points at a cadence of 1.000000 days. OGUTA-14 has 6 points at a cadence of 30.000000 days, first 2024-05-31 and last 2024-10-14, so part of its series predates the field ledger entirely. OGUTA-17 has 47 points and its last row is dated 2024-10-28, twenty-three days before the ledger ends.

## The mistake

Reading a well list off the field series. The field series has no well identity in it at all, and the only place a well type is known is the record you handed in.

## Exercise

Group the published ledger both ways in the panel and write down the field day count and the seven series point counts.

Then say which of P-3 and P-4 is the well with a gap, and which is the well on a different cadence.
