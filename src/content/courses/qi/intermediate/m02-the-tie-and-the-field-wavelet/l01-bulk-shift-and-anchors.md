# Bulk shift and anchors

With the wavelet chosen and its phase checked, the synthetic is placed in time. The Seismic Interpretation course teaches the bulk shift in full; here it runs on every pack well, and anchors are added, which let the shift change between two times.

{{video:qi-c9}}

## The bulk shift

`suggestBulkShift` slides the synthetic along the trace one whole sample at a time, up to a stated search of 20 ms either way, and at every lag takes the normalised cross-correlation on the samples both traces carry. The answer is the lag of the largest correlation. A positive shift means the seismic event is later, so the synthetic moves down; a negative one means the seismic event is earlier.

## Every pack well

Each well's synthetic uses the statistical wavelet of its own trace.

| well | bulk shift ms | correlation |
| --- | --- | --- |
| Ekene-1 | 0.000000 | 0.983438 |
| Ekene-2 | -4.000000 | 0.965477 |
| Ekene-3 | 0.000000 | 0.977607 |
| Ekene-4 | -4.000000 | 0.962720 |

Ekene-1 and Ekene-3 need no shift. Ekene-2 and Ekene-4 move by -4.000000 ms, one sample on the 4.000000 ms clock, the smallest move the search can make: on those two wells the recorded event is a little earlier than the checkshots put it. All four correlations are high, from 0.962720 at Ekene-4 to 0.983438 at Ekene-1, and the two shifted wells carry the two lowest.

For the first question, four wells tie at their checkshot times or one sample from them. The shift each well needs is part of its tie, recorded as the next lesson shows.

## A designed check

Ekene-1's checkshot times are moved by a stated amount before the synthetic is built, and the bulk shift is asked to find the move back:

| checkshot times moved by, ms | bulk shift found, ms | correlation |
| --- | --- | --- |
| -8.000000 | 8.000000 | 0.983438 |
| 8.000000 | -8.000000 | 0.983438 |

The search returns the opposite of the planted move in both directions, and the correlation equals the unshifted tie's 0.983438: a whole-sample move slides the same synthetic samples along the clock, and the bulk shift slides them back.

## Anchors

`makeTieWarp` takes pairs of (synthetic time, seismic time). Between two anchors the mapping is linear. Beyond the first and the last it continues with slope one, a constant shift, so a single anchor is a bulk shift. A designed pair, (1250, 1252) and (1350, 1356) ms:

| synthetic time ms | seismic time ms |
| --- | --- |
| 1200.000000 | 1202.000000 |
| 1250.000000 | 1252.000000 |
| 1300.000000 | 1304.000000 |
| 1350.000000 | 1356.000000 |
| 1400.000000 | 1406.000000 |

Above the first anchor, 1200.000000 ms maps with the first anchor's shift. Below the last, 1400.000000 ms maps with the last anchor's shift. Between them, 1300.000000 ms falls halfway and takes the shift halfway between the two, so the synthetic is stretched over the interval.

Both times must increase from one anchor to the next. `makeTieWarp` refuses a pair that would fold time: a tie may stretch or squeeze an interval, but may not reverse it.

## Which to use

A bulk shift moves every time by one amount, enough when one lag fits the whole span. Anchors serve a tie whose lag changes with time; each is a stated choice the tie records.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set View to "Wavelets and the tie" and Data to each Ekene well in turn, with the statistical wavelet and the bulk shift search set to 20 ms. Read the shift and the correlation. At Ekene-1, set the checkshot time shift to -8 ms, then 8 ms, and confirm the shift found. Then enter the anchors (1250, 1252) and (1350, 1356), read the seismic times for 1200, 1300 and 1400 ms, and finally enter a second anchor earlier than the first in seismic time and read what the panel says.
