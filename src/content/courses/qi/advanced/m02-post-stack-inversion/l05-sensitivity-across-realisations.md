# Sensitivity across realisations

One inversion gives one answer; rerunning it on inputs that differ in one stated assumption shows how far it moves. At Ekene-1, twenty noisy realisations of the full stack, each inverted blind, give a mean relative spread in AI (acoustic impedance) of 0.645787 over the logged samples.

## The method

`inversionSpread.js`. Realisations differ in one assumption each, and here that assumption is the noise. The course takes the Ekene-1 full-stack trace and adds seeded Gaussian noise at a signal-to-noise ratio of 4 (`addNoise`: the RMS of the trace over the noise standard deviation), on the 20 seeds 101 to 120. Each is inverted blind exactly as in the model-based lesson.

Per sample, `quantilesAcross` takes the quantiles across the realisations by linear interpolation between order statistics (Hyndman and Fan type 7), and `relativeSpread` returns (Q90 - Q10) / Q50.

## The labels

The course uses the Suite's percentile convention for parameters. Q10 is the 10th percentile, the value 10 percent of realisations fall below, so it is the LOW figure. Q50 is the median. Q90 is the 90th percentile, the HIGH figure. P-labels are kept for outcomes such as volumes, where P90 is the low figure. The uncertainty course teaches quantiles, the two labelling rules and Monte Carlo as a subject.

## Ekene-1, 20 realisations

| time ms | Q10 AI | Q50 AI | Q90 AI | relative spread |
| --- | --- | --- | --- | --- |
| 1280.000000 | 3220622.144347 | 4255855.190784 | 5379029.910027 | 0.507162 |
| 1288.000000 | 4056484.639171 | 5392598.674201 | 6743113.590982 | 0.498207 |
| 1296.000000 | 5559235.382643 | 7469086.162302 | 9637911.753338 | 0.546074 |
| 1304.000000 | 5069751.189881 | 6629158.255936 | 9889658.945117 | 0.727077 |

Mean relative spread over the 27 logged samples: 0.645787.

## What the spread says

Each row runs low to high, Q10 to Q90, with the median between. Round the top of the sand the spread sits near one half of the median, and at 1304 ms it rises to 0.727077. At that sample the Q90 lies much farther above the median than the Q10 lies below it.

The medians sit above the log after the high cut at 1296 and 1304 ms, as the single blind inversion did. Noise widens the answer round that overshoot; it does not remove it.

## What the spread does not say

It covers one assumption. Every realisation shares the same LFM, the same 25 Hz Ricker, the same scale, the same eps and the same 60 iterations; none of their uncertainty is in 0.645787. The model-based lesson showed the iteration count alone moving the AI error at Ekene-1 from 8.300748 to 52.851805 percent, a range no noise realisation explores.

It is also an estimate on stated seeds and a stated noise level: a different set of seeds gives different figures.

A study reports the spread with the assumption varied, the noise level, the seeds and their count, and the quantile rule. A spread from noise is kept apart from any spread over the LFM, the wavelet or the settings.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Realisations: Q10, Q50 and Q90", Data to "Ekene teaching pack" and Well to Ekene-1, with "Signal to noise of the added noise" 4, "First seed" 101, "Realisations" 20, eps 0.050000 and Iterations 60. Read Q10, Q50, Q90 and the relative spread round 1296 ms. Set the first seed to 201 and read the same row again. Then set the signal to noise to 8 and write one sentence on which way the spread moves.
