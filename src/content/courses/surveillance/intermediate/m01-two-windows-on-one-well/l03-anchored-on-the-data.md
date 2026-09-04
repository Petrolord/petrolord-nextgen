# Anchored on the data

Nothing in `detectExceptions` knows what day it is. Every window it builds is measured back from the latest ledger date on the field, so a dataset three years old surveils exactly as it did the day it was filed.

{{panel:pd-exception-explorer}}

## The anchor is a field property, not a well property

The published surveillance case is a 7-well field of 268 ledger rows over 51 field days, and the anchor it returns is an `asOf` of 2025-06-30 with 9 exceptions raised. The teaching field OGUTA, invented for this course and neither published nor real, carries 473 rows on 8 wells running 2024-09-12 to 2024-11-20, 70 calendar days spanned, and anchors at 2024-11-20.

`asOf` comes back in the return for one reason: a reader cannot otherwise tell what the word recent meant. Two runs of the same function over the same wells, one before a late row arrives and one after, place both windows a day apart and nothing else in the object says so.

## What the anchor does to a well that stopped filing rows

The staleness check measures each well against the FIELD anchor, not against itself. OGUTA-17 files its last row on 2024-10-28 while the field runs to 2024-11-20, and the engine reports `stale_data` at medium, value = 23.000000000000 against a baseline of 7.000000000000, with the message "No data for 23 days (field ledger runs to 2024-11-20)."

That well has not stopped producing. It has stopped reporting, and the only function that notices is the one comparing its last date against the field's.

## The staleness setting decides whether the well is in the list at all

| staleDays | Exceptions on OGUTA | OGUTA-17 |
| --- | --- | --- |
| 7 | 8 | `stale_data`, medium |
| 21 | 8 | `stale_data`, info |
| 30 | 7 | nothing |
| 60 | 7 | nothing |

At 30 days and above it raises no exception of any kind, and absence from a list reads exactly like a well that is fine.

## The mistake

Assuming the anchor is today, so an old list must look stale. The opposite is true: the list is always internally consistent and never says how long ago its anchor was. A list built on a ledger that stopped a year ago prints no exception about the year.

## What it refuses

`detectExceptions` will not look forward. A row dated after `asOf` cannot be in either window, and a well whose entire ledger predates the baseline window contributes no points, so `windowMean` returns a null mean and every comparison on that well is skipped rather than reported as zero.

One function in the same module does read the wall clock. `summarizeDeferments` defaults its `asOf` to today, in a file whose windows are anchored on data precisely so that they do not move overnight.

## Exercise

Read the OGUTA list at `staleDays` of 7 and again at 30 and record what happens to OGUTA-17.

Then say what a reader of the 30-day list alone would conclude about that well.
