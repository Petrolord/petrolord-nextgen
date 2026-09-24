# Writing the quality note

{{panel:dq-monitor-explorer}}
{{panel:dq-checks-explorer}}

A quality note on EKENE-3 opens with the data and the settings, lists the checks in the order they ran with their counts, names each flag by its rule and its fields, reports the charts and their first signals, gives the scorecard with its weights and its weakest dimension, and closes with what the engine does not do. Its figures are the engine's fields at six decimals: the cumulative drop on day 70 is 7496.700000 bbl, the phase one centre 611.380000 psig, the first low signals day 21 on CUSUM and day 22 on EWMA, and the scorecard total 0.927390 with uniqueness weakest.

| part of the note | EKENE-3 |
| --- | --- |
| data and settings | 90 days of production; 50 in-control and 40 monitored days of wellhead pressure |
| checks, in order, with counts | oil 3 missing in 90; rate 2 failed in 87; phase sum 1 in 87 |
| flags, by rule and field | day 70, cumulative, `drop` 7496.700000 bbl against day 68 |
| charts and first signals | glitch on day 8 on all three; low from day 21 on CUSUM, day 22 on EWMA and individuals |
| scorecard | 0.927390 at weights 3, 2, 2, 1, 1; weakest uniqueness, 0.538462 |
| what the engine does not do | no fixes, no grade band, no unit conversion |

## Quote the field

Every flag carries its figures twice: as numeric fields and inside a reason sentence. The note quotes the field. On EKENE-3's cumulative oil the flag carries `previous` 1338506.200000, `value` 1331009.500000 and `drop` 7496.700000, and its reason reads, verbatim, "cumulative falls from 1338506.2 at entry 67 to 1331009.5". The reason prints each figure as the shortest decimal that reads back to its field, so a computed statistic prints every digit: the z flag in the last lesson reads "value 1 has z = 2.9999999999999996, beyond the threshold 2.9", and its `statistic` field is 3.000000. A reason may appear in the note in quotation marks, as the engine's own words. It is never the source of a figure the note reasons with.

## Entries and days

The engine counts entries from 0. "Entry 67" in the cumulative reason is day 68, and the flagged day is day 70. A note says which it means every time, and for a daily series it writes days.

## Settings beside results

Every result in the note carries the settings that produced it: the tolerance on the phase sum, lambda and L on the EWMA, k, h and their unit on the CUSUM, the weights on the scorecard. A result without its settings cannot be checked, and a reader who reruns it with other settings will get another answer and not know why.

## What the caller did

Any fix belongs in the note with the entries it touched. If EKENE-7's gamma ray had its four -999.25 values converted to null, the note says so, and gives both completeness figures, 1.000000 as delivered and 0.983333 converted. If a gap was dropped before charting, the note names the day.

## What the note does not claim

It does not say a flagged value is wrong; a flag is a rule that fired. It does not grade the scorecard total. It names each method as the stated statistical rule it is. And where a figure it needs has not been computed, it computes it with the engine and states the setting used, or leaves it out.

## Exercise

Write the quality note for EKENE-3 in six short paragraphs, one for each row of the table, using only figures this tier has printed. In the checks panel, rerun the cumulative check around day 70 and copy the `drop` field from the result into your note, then quote the reason sentence beside it in quotation marks. Mark each figure in your note with the setting that produced it.
