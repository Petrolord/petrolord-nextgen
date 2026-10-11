# Bulk shift and anchors

With the wavelet chosen and its phase checked, the synthetic is placed in time. The Seismic Interpretation course teaches the bulk shift in full; here it runs on every pack well, with anchors, which let the shift change between two times.

{{video:qi-c9}}

## The bulk shift

`suggestBulkShift` slides the synthetic along the trace one whole sample at a time, up to a stated search of 20 ms either way, and at every lag takes the normalised cross-correlation on the samples both traces carry. The answer is the lag of the largest correlation. A positive shift means the seismic event is later, so the synthetic moves down; a negative one, earlier.

## Every pack well

Each well's synthetic uses the statistical wavelet of its own trace.

| well | bulk shift ms | correlation |
| --- | --- | --- |
| Ekene-1 | 0.000000 | 0.983438 |
| Ekene-2 | -4.000000 | 0.965477 |
| Ekene-3 | 0.000000 | 0.977607 |
| Ekene-4 | -4.000000 | 0.962720 |

Ekene-1 and Ekene-3 need no shift. Ekene-2 and Ekene-4 move by -4.000000 ms, one sample on the 4.000000 ms clock: on those two wells the recorded event is a little earlier than the checkshots put it. The correlations run from 0.962720 at Ekene-4 to 0.983438 at Ekene-1, and the two shifted wells carry the two lowest.

For the first question, all four wells tie at their checkshot times or one sample from them.

## A designed check

Ekene-1's checkshot times are moved by a stated amount before the synthetic is built:

| checkshot times moved by, ms | bulk shift found, ms | correlation |
| --- | --- | --- |
| -8.000000 | 8.000000 | 0.983438 |
| 8.000000 | -8.000000 | 0.983438 |

The search returns the opposite of the planted move both ways, at the same correlation as the unshifted tie, 0.983438.

## Anchors

`makeTieWarp` takes pairs of (synthetic time, seismic time). Between two anchors the mapping is linear. Beyond the first and the last it continues with slope one, a constant shift, so a single anchor is a bulk shift. A designed pair, (1250, 1252) and (1350, 1356) ms:

| synthetic time ms | seismic time ms |
| --- | --- |
| 1200.000000 | 1202.000000 |
| 1250.000000 | 1252.000000 |
| 1300.000000 | 1304.000000 |
| 1350.000000 | 1356.000000 |
| 1400.000000 | 1406.000000 |

Between the anchors, 1300.000000 ms falls halfway and takes the shift halfway between the two, so the synthetic is stretched over the interval; outside them, each end keeps its own anchor's shift.

Both times must increase from one anchor to the next. `makeTieWarp` refuses a pair that would fold time: a tie may stretch or squeeze an interval, but may not reverse it.

## Which to use

A bulk shift moves every time by one amount, enough when one lag fits the whole span. Anchors serve a tie whose lag changes with time; each is a stated choice the tie records.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "The tie and the time-depth record", with the trace window at 1100 to 1500 ms and Bulk shift search at 20 ms. Step Well through the four wells and read Bulk shift and Correlation at that shift against the table. At Ekene-1, set Checkshot times moved by to -8 ms, then 8 ms, and confirm the shift found. The explorer builds no anchors, so work the designed pair by hand: write the seismic times for 1200, 1300 and 1400 ms from the anchor rule, then say why a second anchor earlier than the first in seismic time is refused.
