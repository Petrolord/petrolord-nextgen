# What the QC checks

`validateWellTests` checks a test against three things a field already has: the test's own duration, the well's own test history, and the daily ledger row on the test date. It never needs a well model, which is why it can run everywhere.

{{panel:pd-exception-explorer}}

## Six codes and four settings

`zero_rate` fires when a test recorded no oil, water or gas. `short_duration` fires below `minDurationHours`, a default of 4 h. `rate_outlier` fires when the oil rate is more than `outlierPct`, a default of 50 per cent, away from the well's own test median. `ledger_mismatch` fires past `ledgerTolerancePct`, a default of 30 per cent. `watercut_mismatch` fires past `watercutTolerancePts`, a default of 10 points. `no_ledger` fires when the test date has no ledger row to compare against.

The published QC case hands in seven tests and gets four rows back.

| Test | Severity | Codes |
| --- | --- | --- |
| q-7 | high | `zero_rate`, `no_ledger` |
| q-4 | high | `rate_outlier`, `ledger_mismatch`, `watercut_mismatch` |
| q-6 | medium | `short_duration`, `no_ledger` |
| q-5 | medium | `watercut_mismatch` |

The sentences are the useful part. q-4 reads "Oil 1,500 stb/d is 200% off this well's 500 stb/d test median.", "Test oil 1,500 stb/d against 520 stb/d in the ledger, 188% apart." and "Test watercut 6% against 17% in the ledger.", while q-6 reads "2.5 h test, under the 4 h minimum for stabilized flow." A code is a category; the message carries both numbers that produced it.

## The outlier check cannot see a well's first three tests

The median is taken over the EARLIER tests on the same well only, and the check needs three of them.

| Tests on the well | Prior tests available | Codes on the last test |
| --- | --- | --- |
| 2 | 1 | `no_ledger` |
| 3 | 2 | `no_ledger` |
| 4 | 3 | `rate_outlier`, `no_ledger` |
| 5 | 4 | `rate_outlier`, `no_ledger` |
| 6 | 5 | `rate_outlier`, `no_ledger` |

The last test in every one of those rows is the same 1500 stb/d test against a history of 500s. A well's first bad test is never an outlier, and it then joins the median that judges every later one.

## The mistake

Reading a clean QC as a checked test. On the teaching field OGUTA, invented for this course and neither published nor real, six tests go in and five rows come out. Three of those five carry `no_ledger` at info alone, which means the test date had no ledger row, so the two ledger comparisons did not run and their silence says nothing.

## What it refuses

Every check needs a companion. No ledger row means no `ledger_mismatch` and no `watercut_mismatch`. Fewer than three prior tests means no `rate_outlier`. The QC will not fabricate the missing side, and it will not tell you in the severity column that a check was skipped rather than passed.

## Exercise

Read the teaching test g-o9-1 in the panel and write down its code, its severity and its message.

Then say which of the six codes could not have been evaluated on a test whose date has no ledger row.
