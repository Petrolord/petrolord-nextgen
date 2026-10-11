# Offset gathers and bin width

Angle is computed from offset, so the gathers are checked first: which offsets they hold, how those fall into bins, and where the target sits.

{{video:qi-d11}}

## The pack's gathers

| property | value |
| --- | --- |
| gathers | 12 NMO-corrected CDP gathers next to Ekene-1 |
| inlines | 1026 to 1028 |
| offsets | 13, from 100 to 2500 m |
| sample interval, ms | 4.000000 |
| time range, ms | 1000 to 1700 |
| mute | the kit's stated mute beyond 40 degrees, by the kit's own angle calculation |
| the gather at Ekene-1 | gather 5, inline 1027, crossline 2051 |

The gathers are NMO-corrected, so a flattened event should sit at one time on every offset; the next two lessons measure how far that holds. They carry the kit's stated mute beyond 40 degrees, by the kit's own angle calculation, which the course does not measure. Muted samples are exact zeros, live to the engines, so the mute and the angle bins of the next module are read together.

## Offset bins

`binOffsets` puts each offset into a bin of a stated width w. Bin k holds offsets from k w to (k + 1) w and is centred at (k + 0.5) w. `foldSummary` then reports how many traces went in, how many bins hold at least one, and the far offset, at the centre of the farthest live bin.

At a stated width of 200 m the gather fills 13 bins with fold 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1. The summary: 13 traces, 13 live bins, far offset 2500.000000 m.

## Reading the bins

At 200 m every offset falls in its own bin, at that bin's centre, so the fold is one throughout and the far offset reported, the last bin's centre, is also the farthest recorded offset.

The width is a stated choice with two effects. A wider bin gathers more offsets into each bin, so fold rises and the bins become fewer and coarser in offset. A width that puts the offsets off the bin centres changes the far offset reported, because a bin always reports its centre. A study states the width beside every fold it quotes.

## The top of the Ekene Sand on gather 5

The top is picked on the nearest offset about 1289 ms, close to Ekene-1's checkshot top of 1288.796378 ms. The pick takes the largest amplitude within 8 ms of that time and lands on 1292.000000 ms, a sample on the gather's 4.000000 ms clock. The top is a peak under SEG normal polarity, so the largest amplitude near the checkshot time is the event to pick.

The rest of this module and the next measure stretch, residual moveout, fold and angle on gather 5 at that time.

## For the two questions

For data quality, the gather holds 13 offsets from 100 to 2500 m, one in each 200 m bin; for the fluid question, the target sits where the tie predicts.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Gathers and their QC", with Gather at gather 5. Set Offset bin width to 200 m and read Offset bins, Traces, Live bins and Far offset (bin centre). Then set the width to 400 m and to 100 m, predicting the live bins and the far offset before reading each. Finally set Event near to 1289 ms and Pick half window to 8 ms, and read Event picked on gather 5, then on gather 0 and gather 11.
