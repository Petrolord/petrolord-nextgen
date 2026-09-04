# Where the windows start and end

A window is a pair of dates. Every value and every baseline in a surveillance row is a mean over one of the two, and the row prints neither pair.

{{panel:pd-exception-explorer}}

## Half open, and they never overlap

`detectExceptions` measures both windows by day number back from `asOf`. The recent one is (asOf - recentDays, asOf] and the baseline window is (asOf - recentDays - baselineDays, asOf - recentDays]. Both are half open at the early end, so a boundary day belongs to the EARLIER of the two and to exactly one of them.

At the default `recentDays` of 7 and `baselineDays` of 30, an asOf of 2025-06-30, which is day number 20269, gives a recent window running 2025-06-24 to 2025-06-30 inclusive, seven days, and a baseline running 2025-05-25 to 2025-06-23 inclusive, thirty days. The surveillance golden publishes that same pair for the same well.

The teaching field OGUTA, invented for this course and neither published nor real, has an asOf of 2024-11-20: recent window 2024-11-14 to 2024-11-20, baseline 2024-10-15 to 2024-11-13, eight exceptions.

## A window is a date range, not a row count

`windowMean` averages the finite values inside the range and carries the count with it. OGUTA-2 has a mean CALENDAR oil volume of 618.142857142857 stb over 7 rows recently against 1038.900000000000 stb over 30 rows in the baseline. A well with holes in its ledger averages fewer rows over the same dates, and the count never reaches the returned exception.

## Which length actually moves the list

One setting at a time on the published field, everything else at its default.

| recentDays | Exceptions | High | Medium |
| --- | --- | --- | --- |
| 1 | 8 | 2 | 6 |
| 3 | 8 | 2 | 6 |
| 7 | 9 | 4 | 5 |
| 14 | 6 | 1 | 5 |
| 21 | 4 | 0 | 4 |
| 30 | 3 | 0 | 3 |

The same sweep on `baselineDays` at 7, 14, 30, 60, 90 and 180 returns 9 exceptions with 4 high and 5 medium at every one of the six. The baseline length is inert here and the recent length decides almost everything.

## The mistake

Reading `recentDays` as how much data the tool looked at, so a longer one is a better one. Widening it to 14 days takes the published list from 9 exceptions to 6 and leaves a single high; at 21 days no exception on the field is high at all. The bad days are still there, averaged against more ordinary ones, and a mean over a longer window is a weaker detector of a change that happened inside it.

## What it refuses

The returned exception says nothing about either window: not the dates, not the lengths, not how many rows made either mean. Each well also widens its own windows on its own cadence, so two rows in one list can rest on ranges of different length and nothing distinguishes them.

## Exercise

Set `recentDays` to 7, then 14, then 21 on the published field and record the exception count and the high count at each.

Then say why the high count falls faster than the total.
