# Aligning and averaging into one field wavelet

Four wavelets that agree can be averaged into one, and that one wavelet then serves the whole field. The average comes from the same engine call as the comparison, and each well's correlation with it is that well's misfit: the number that says whether the well belongs in the average.

{{video:qi-c10}}

## The recipe

`compareWavelets` builds the field wavelet in four steps:

1. Align every wavelet to the reference by the lag of largest correlation, up to the stated 5 samples.
2. Scale each aligned wavelet to unit energy.
3. Take the mean, sample by sample.
4. Scale the mean to unit energy again.

Step 2 gives every well an equal vote whatever the strength of its trace. Step 4 puts the average on the same footing as its members, so its correlations read on the same scale as the previous lesson's similarities.

## Each well against the average

| well | correlation with the average |
| --- | --- |
| Ekene-1 | 0.999838 |
| Ekene-2 | 0.996125 |
| Ekene-3 | 0.999751 |
| Ekene-4 | 0.997075 |

Ekene-1 and Ekene-3 sit closest to the average, Ekene-2 farthest, with Ekene-4 between. That is the order of the spectra: the two wells in the middle of the frequency range lie nearest the mean, and the two at its ends lie farther from it, the lowest-frequency well farthest. Even the lowest, Ekene-2's 0.996125, is close to identical in shape.

## The average's spectrum

| wavelet | samples | peak Hz | centroid Hz |
| --- | --- | --- | --- |
| Ekene-1 | 31 | 24.488746 | 25.084884 |
| Ekene-2 | 31 | 23.394907 | 23.431642 |
| Ekene-3 | 31 | 24.962688 | 25.605164 |
| Ekene-4 | 31 | 26.530951 | 26.581599 |
| the average | 31 | 24.769590 | 25.155328 |

The average keeps the 31 samples of its members. Its peak of 24.769590 Hz and centroid of 25.155328 Hz sit inside the range the four wells span and close to Ekene-1's, the well nearest the average in shape.

## Different sample intervals

Wavelets on different clocks cannot be averaged sample by sample. `resampleWavelet` first brings them to one interval, by linear interpolation about the centre sample, so the centre of each wavelet stays at its centre. The Ekene average resampled from 4 ms to 2 ms has 61 samples: the same wavelet on the finer clock, still centred.

## What the average is for

The tier chooses one wavelet for the field, and each well's misfit is the evidence that one wavelet can serve all four. A study reports the average with its spectrum and the misfit table together. The misfit table is also the check on the average itself: a well that differs pulls the mean towards it and lowers every other well's figure, which is the case the next lesson builds.

## The choices the average states

Which wells enter it, the reference for the alignment, the maximum lag, and each wavelet's own window, length and smoothing. Leaving a well out is a choice the study names along with its reason.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Wavelets across wells", with the trace window at 1100 to 1500 ms, Designed rotation at none and Alignment search at 5 samples. Read each well's correlation with the average and the three Field wavelet tiles against the tables. Move Trace window start to 1200 ms and note which way the four correlations and the average's peak move, since the window is one of the choices the average states. Restore it. The explorer keeps every wavelet on the 4.000000 ms clock, so finish by hand: from the field wavelet's samples, work out how many it has on a 2 ms clock about the same centre.
