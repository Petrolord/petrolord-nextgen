# Local against global

{{panel:dq-outliers-explorer}}

Every rule so far has measured a value against the whole series: its mean and standard deviation, its median and MAD, its quartiles. A well log is not one population. It passes through shale and sand, and a value that is ordinary for the shale can be extreme for the sand around it. This module moves the question from the whole series to a window of neighbours.

EKENE-7's gamma ray, with the sentinel converted to null, carries two planted spikes: sixty gAPI added inside a sand at entries 70 and 170.

| entry | GR, gAPI | z on the whole channel | Hampel window median | Hampel flag |
| --- | --- | --- | --- | --- |
| 70 | 95.420000 | 1.058062 | 37.000000 | yes |
| 170 | 90.590000 | 0.900269 | 38.410000 | yes |

## What the global z-score sees

Run `zScores` on the whole channel and it flags 0 entries. Entry 70 reads a z of 1.058062 and entry 170 reads 0.900269, both well inside the threshold of 3. To a mean and standard deviation built from the whole log, a sand reading of 95.420000 gAPI looks like shale. The spike is invisible because the global statistics describe a mixture.

This is a different failure from module one. There, the outlier inflated the spread that measured it. Here the spread is wide for a legitimate reason, because the log holds two rock types, and no single centre describes both.

## What the window sees

The Hampel window looks only at the samples around each entry. At halfWindow 3, three samples either side, the window around entry 70 holds seven samples of sand. Its median is 37.000000 gAPI, and the spike reads 95.420000, a long way above the sand it sits in. The window around entry 170 has a median of 38.410000 against a reading of 90.590000. Both spikes are flagged.

The window rule answers a local question: does this sample stand apart from its immediate neighbours? It knows nothing of the log beyond the window, and it does not need to.

## Choosing the interval, or choosing the window

Module three reached the same spike another way. The Tukey fences on the whole log flagged nothing, and on the water sand alone they flagged entry 170. Cutting the series by lithology before running a global rule is one way to make the question local. It needs the lithology first.

A moving window needs no lithology. It adapts as it moves, so it follows the shale and the sand without being told where either begins. The price is that it knows nothing outside its window: a slow drift or a whole bed that is wrong will look normal to it, because every neighbour is wrong in the same way.

## Two questions, both valid

The global z-score asks whether a value is extreme for the log as a whole. The Hampel window asks whether it is extreme for where it sits. A report should say which question it asked, because on EKENE-7 the two give opposite answers for the same sample.

## Exercise

Open the explorer's Hampel view with the EKENE-7 gamma ray, sentinel converted, halfWindow 3 and nSigma 3. Confirm that entries 70 and 170 are both flagged, and read the window medians of 37.000000 and 38.410000. Then switch to the z view on the same channel and confirm the z of 1.058062 at entry 70. State in one sentence why the same sample passes one rule and fails the other.
