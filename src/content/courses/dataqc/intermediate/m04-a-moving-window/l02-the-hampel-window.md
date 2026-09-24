# The Hampel window

{{panel:dq-outliers-explorer}}

The Hampel identifier is the modified z-score idea run inside a moving window. For each sample the engine takes a window of 2 x halfWindow + 1 samples centred on it, finds the window median and the window MAD, and flags the sample when

|x - window median| > nSigma x 1.4826 x MAD of the window

strictly. The decision is made by the petrophysics engine's `despikeHampel`, which `hampel` imports, so the rule that conditions a log in the petrophysics engine is the rule that screens it here. A flagged sample's replacement is the window median.

EKENE-7's gamma ray, sentinel converted, halfWindow 3 and nSigma 3: 11 flags.

| entry | GR | window median | window MAD | threshold | absolute deviation, derived | replacement |
| --- | --- | --- | --- | --- | --- | --- |
| 15 | 110.770000 | 94.330000 | 1.660000 | 7.383348 | 16.440000 | 94.330000 |
| 30 | 90.540000 | 96.290000 | 1.090000 | 4.848102 | 5.750000 | 96.290000 |
| 49 | 24.810000 | 36.540000 | 1.480000 | 6.582744 | 11.730000 | 36.540000 |
| 50 | 24.830000 | 36.540000 | 1.480000 | 6.582744 | 11.710000 | 36.540000 |
| 70 | 95.420000 | 37.000000 | 7.700000 | 34.248060 | 58.420000 | 37.000000 |
| 77 | 43.730000 | 31.440000 | 2.430000 | 10.808154 | 12.290000 | 31.440000 |
| 82 | 43.630000 | 31.350000 | 1.960000 | 8.717688 | 12.280000 | 31.350000 |
| 145 | 29.570000 | 36.810000 | 0.830000 | 3.691674 | 7.240000 | 36.810000 |
| 170 | 90.590000 | 38.410000 | 3.320000 | 14.766696 | 52.180000 | 38.410000 |
| 185 | 42.860000 | 33.110000 | 2.020000 | 8.984556 | 9.750000 | 33.110000 |
| 186 | 42.810000 | 33.110000 | 1.340000 | 5.960052 | 9.700000 | 33.110000 |

## Reading a row

Take entry 70. Its window median is 37.000000 gAPI and its window MAD is 7.700000. The threshold is 3 x 1.4826 x 7.700000, which the engine returns as 34.248060. The sample sits 58.420000 from its window median, beyond the threshold, so it is flagged and its replacement is 37.000000.

Every row reads the same way, and the comparison is strictly beyond: a sample exactly on its threshold is inside, as the golden case `hampel-on-the-threshold` shows at 1.482600. The threshold is different on every row because each window has its own MAD. Entry 145 is flagged at a deviation of only 7.240000 gAPI because its window is very quiet, with a MAD of 0.830000 and a threshold of 3.691674. Entry 70's window has a MAD of 7.700000 and a threshold of 34.248060, so it takes a far larger deviation to be flagged there, and the spike's 58.420000 clears it.

## The sigma here, named

The product 1.4826 x MAD is the window's spread written in standard deviation units, and nSigma counts how many of those units a sample may sit from the window median. In this course that spread is always named with its source: 1.4826 x MAD of a seven-sample window, here. It is a different quantity from the sample standard deviation of module one, and from the raw MAD inside the modified z-score.

## Nine flags that were not planted

Only entries 70 and 170 are planted spikes. The other nine are samples farther from their window median than three scaled MADs of a seven-sample window, which is what the rule flags. Entries 15 and 30 sit in the upper shale; the rest sit in the two sands. Entry 145 is the plainest case of a quiet window, where a small deviation is enough.

None of those nine is a planted defect. Each is a flag from a stated rule, and each is a question about that sample. The flag does not decide what the sample is.

## The two knobs

Two settings shape the rule. halfWindow sets how local the question is, and nSigma sets how far out a sample must be. The engine exports the MAD scale as `HAMPEL_MAD_SCALE`, 1.4826, the petrophysics engine's value. The next lessons turn both knobs on this same channel.

## Exercise

Open the explorer's Hampel view with the EKENE-7 gamma ray, sentinel converted, at halfWindow 3 and nSigma 3. Confirm the 11 flags. For entry 170, multiply 3 by 1.4826 by the window MAD of 3.320000 and check the threshold of 14.766696. Then compare the absolute deviation of 52.180000 with it and say why the sample is flagged.
