# An absent row and a full share

`computeAllocation` looks up a ledger row per well per date to find the hours. When there is no row at all, `Number.isFinite(null?.hours_on)` is false and the `defaultHours` of 24 is substituted.

{{panel:pd-reading-explorer}}

## Two wells, one meter, three spellings of off

A derived demonstration. SHARE-A produced every barrel the meter saw and SHARE-B produced nothing.

| What SHARE-B filed | Oil factor | SHARE-A allocated, stb | SHARE-B allocated, stb |
| --- | --- | --- | --- |
| a row saying hours_on 0 | 1.000000000000 | 1000.000000 | 0.000000 |
| no row at all | 0.500000000000 | 500.000000 | 500.000000 |
| a row of zeroes at hours_on 24 | 0.500000000000 | 500.000000 | 500.000000 |
| a row with a null hours_on | 0.500000000000 | 500.000000 | 500.000000 |

Told the truth about SHARE-B, the engine gives SHARE-A all of it. Told nothing, the engine gives SHARE-B half. The only thing that changed between those two cases is which rows exist.

The three silent cases fire `factor_out_of_band` three times, one per phase, and the case that filed a stated zero returns empty diagnostics. That diagnostic is the module noticing that the factor left the 0.7 to 1.3 band, which is a symptom. Nothing in it names a well credited on a default.

## The same shape on a teaching field

OGUTA-17 is invented by this course. It stops filing ledger rows part way through the allocated window and does not stop producing, so the facility meter keeps seeing it while the ledger does not.

| Date | Ledger row filed | Uptime | Theoretical oil, stb | Allocated oil, stb |
| --- | --- | --- | --- | --- |
| 2024-10-31 | no | 1.000000000 | 688.000000000 | 652.019722183 |
| 2024-11-01 | no | 1.000000000 | 688.000000000 | 666.519535534 |
| 2024-11-02 | no | 1.000000000 | 688.000000000 | 662.591172429 |
| 2024-11-03 | no | 1.000000000 | 688.000000000 | 660.058346871 |
| 2024-11-04 | no | 1.000000000 | 688.000000000 | 659.773646718 |
| 2024-11-05 | no | 1.000000000 | 688.000000000 | 664.869445937 |

From 2024-11-06 to 2024-11-20 it files no row either and takes no share at all, because the test carrying it has aged out. Not one of OGUTA-17's allocated days has a ledger row behind it.

## What the other half of the studio said

`detectExceptions` on the same well over the same days raises type `stale_data`, severity medium, value 23.000000000 days against a baseline of 7.000000000 days, message `No data for 23 days (field ledger runs to 2024-11-20).`

One well, one silence, two modules. Surveillance calls it missing and ranks it below every rate drop on the field. Allocation calls it a full day on stream.

## The mistake

Reading `factor_out_of_band` as a meter problem and going to look at the facility. The meter was right in every one of those cases. The factor moved because a theoretical total was inflated by a well that had told the engine nothing.

## Exercise

Take the demonstration in the panel and delete SHARE-B's row rather than setting its hours to zero.

Then record the oil factor and both allocated volumes, and say what an auditor would need in the return to tell those two cases apart.
