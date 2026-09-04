# Monthly factors and the write-back

`monthlyFactors` rolls a well's allocated volume over its theoretical volume for a month. `allocatedLedgerRows` turns the split back into ledger rows. Both are reshaping, and both quietly manufacture information.

{{panel:pd-exception-explorer}}

## A monthly factor carries the mix of days

It is one well's allocated volume divided by its own theoretical volume for that month, dimensionless and weighted by the days that well was in the split.

| Published well and month | Theoretical oil, stb | Allocated oil, stb | Oil factor |
| --- | --- | --- | --- |
| P-1, 2025-01-01 | 8400.000000000 | 7909.324414716 | 0.941586239847 |
| P-2, 2025-01-01 | 4160.000000000 | 3906.675585284 | 0.939104708001 |
| P-1, 2025-02-01 | 15140.000000000 | 15291.318573378 | 1.009994621755 |
| P-2, 2025-02-01 | 10346.666666667 | 12588.681426622 | 1.216689570872 |

On the teaching field OGUTA, invented for this course and neither real nor published, the allocated window opens on 2024-10-31, so October holds one date and all four wells carry that date's oil factor of 0.947703084569. November is a month of mixed days and they separate: OGUTA-17 at 0.963317484735, OGUTA-2 at 1.083626062925, OGUTA-6 at 1.081584722021, OGUTA-9 at 1.083836690888.

## The factor that means nothing to scale

A phase with no theoretical volume for the month carries a factor of 1 for that phase. A derived demonstration of one well whose test recorded no gas returns an oil factor of 0.900000000000, a water factor of 1.000000000000 and a gas factor of 1.000000000000, on a metered gas of 500.000000 Mscf, a theoretical gas of 0.000000 Mscf and an allocated gas of 0.000000 Mscf. The run raises `["no_basis"]`.

One value, two meanings: the tests agreed with the meter exactly, or there was nothing to scale. The diagnostic that tells them apart sits on a different array.

## The write-back gives a silent well an hours column

`allocatedLedgerRows` carries the uptime through as an `hours_on`. On the teaching field it writes 69 rows across 4 wells and every one of the 69 carries an `hours_on`. On 2024-11-20 it writes 1233.319797595 stb of oil at 24.000000000 h for OGUTA-2 and 310.547186969 stb at 12.300000000 h for OGUTA-6.

The 24 h is the number `computeAllocation` substitutes when no ledger row existed, so a well that filed nothing acquires a row saying it ran all day. Read back by `derivePoint`, an absent hours column is uptime unknown; read back from a written ledger, it is a full day on stream.

## The mistake

Quoting a monthly factor of one as agreement. Check the theoretical volume for that phase first.

## What it refuses

`monthlyFactors` will not say which of its two meanings a one is, and `allocatedLedgerRows` will not mark a row as allocated rather than measured.

## Exercise

Write the four OGUTA monthly oil factors for 2024-11-01 and say why they differ.

Then say what a `1.000000000000` gas factor would require you to check.
