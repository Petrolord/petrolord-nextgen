# A cumulative never falls

{{panel:dq-checks-explorer}}

A cumulative production total can rise or stay level. It cannot fall, because oil once produced stays produced. That makes a cumulative one of the easiest columns on a sheet to check for internal agreement, and `cumulativeCheck` does it: each present value is compared with the last present value before it, and a drop larger than the tolerance is flagged. Here is EKENE-3's cumulative oil across the days where it matters.

| day | cumulative oil, bbl |
| --- | --- |
| 68 | 1338506.200000 |
| 69 | null |
| 70 | 1331009.500000 |

| flagged day | compared with day | drop, bbl | the engine reason |
| --- | --- | --- | --- |
| 70 | 68 | 7496.700000 | cumulative falls from 1338506.2 at entry 67 to 1331009.5 |

## Against the last present value

Day 69 is missing, a lost reading. So day 70 has no immediate neighbour to compare with, and the engine compares it with day 68, the last present value. This is a declared choice. A check that compared only neighbouring entries, and skipped any comparison touching a missing value, would never look at day 70 at all, and the fall would pass unseen. Comparing with the last present value means a lost reading cannot hide the next one.

## Reading the flag

The engine counts entries from 0, so "entry 67" in the reason is day 68. The flag carries its figures as fields: `previous` 1338506.200000, `value` 1331009.500000 and `drop` 7496.700000. The reason prints each cumulative in the shortest form that reads back to its field, and that is the engine's sentence. When you reason with the drop, use the `drop` field: 7496.700000 bbl.

## What the drop is

The planted defect on day 70 is a keying error of ten thousand barrels, a stated input. The drop the engine reports is smaller: it is the error less the two days of production between the readings, and those two days, derived, come to 2503.300000 bbl. In other words, the flag measures what the sheet shows, a fall from day 68 to day 70, and the true size of the keying slip is only recoverable once you know how much the well produced in between. The engine reports the first; the second takes your reading of the sheet.

## The tolerance

A tolerance exists because meters and allocation systems produce small corrections that can nudge a cumulative down slightly. The check's tolerance says how large a fall you will accept as noise. The flagged count in module six uses a tolerance of 0, which accepts no fall at all.

With a tolerance of 8000 bbl, a stated input, the same drop is not flagged. That is the honest warning: a tolerance is for meter noise, and a tolerance wide enough to swallow a keying error hides it. Choose the tolerance from what your meters actually do, and state it beside the result.

## Exercise

Open the checks explorer on the consistency view. The cumulative box holds a stretch of EKENE-3's cumulative oil around day 70, with a meter tolerance of 0. Read the flag and copy its reason. Find the `null` for day 69, and check that the flagged entry is compared with the last present value before that `null`. Then set the meter tolerance to 8000 and read the flags again, and write one sentence on what that setting would cost you in a real file.
