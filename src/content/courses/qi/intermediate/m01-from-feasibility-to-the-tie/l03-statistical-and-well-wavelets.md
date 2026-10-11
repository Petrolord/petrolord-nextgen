# Statistical and well wavelets

The synthetic needs a wavelet, and two can be taken from the seismic at a well. The statistical wavelet assumes its phase; the wavelet from the well measures it. On the Ekene pack only the first can be extracted, because of the length of the logs.

{{video:qi-c8}}

## The statistical wavelet

`extractStatisticalWavelet` takes the amplitude spectrum of the traces' autocorrelation and builds a zero-phase wavelet from it. Its spectrum is the source wavelet's when the reflectivity is white, and its phase is assumed zero. The engine reads two stated inputs, a window length of 120 ms and a smoothing of 5 Hz, Hann-tapers the lags and normalises the peak to 1. The trace window is a third stated choice: here the full stack from 1100 to 1500 ms at each well.

## The four wells

| well | samples | peak Hz | centroid Hz | -6 dB low Hz | -6 dB high Hz |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 31 | 24.488746 | 25.084884 | 8.950036 | 41.469972 |
| Ekene-2 | 31 | 23.394907 | 23.431642 | 7.301503 | 39.582002 |
| Ekene-3 | 31 | 24.962688 | 25.605164 | 9.159836 | 42.236734 |
| Ekene-4 | 31 | 26.530951 | 26.581599 | 9.647548 | 43.780487 |

| wavelet on the same clock | samples | peak Hz | centroid Hz |
| --- | --- | --- | --- |
| 25 Hz Ricker | 31 | 25.039790 | 26.596139 |

## Reading the table

Every wavelet has 31 samples: the same window length on the same clock. Ekene-2 is the lowest in every column, from its peak of 23.394907 Hz to its high edge of 39.582002 Hz; Ekene-4 is the highest in every column, peak 26.530951 Hz and high edge 43.780487 Hz. Ekene-1 and Ekene-3 sit between them and close to each other.

The 25 Hz Ricker is a useful yardstick. Its peak is close to the field wavelets' peaks, but its centroid of 26.596139 Hz sits well above its peak, while each statistical wavelet's centroid sits close to its own peak. A Ricker chosen by its peak alone carries a higher centroid than any of the four field wavelets.

The table says nothing about phase: every statistical wavelet is zero phase by construction.

## The wavelet from the well

The second wavelet is the least-squares (Wiener) wavelet that best convolves the well's reflectivity into the trace at the well, so its phase is measured. It runs in the engines, beside Seismolord's synthetics, and it needs a log long enough for the wavelet asked for.

## Why the pack refuses it

Asked for its wavelet at Ekene-1 from the pack's logs, Seismolord answers:

> The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from.

The extraction keeps only trace samples whose whole wavelet window sits on live reflectivity. At its half length of 15 samples that window is 2 x 15 + 1 = 31 samples, and the pack's logs give 26 live synthetic samples at Ekene-1, so no sample qualifies. The course's ties therefore use the statistical wavelet, and every tie states that its phase was assumed.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Wavelets and phase", with Well at Ekene-1. Set Trace window start to 1100 ms, Trace window end to 1500 ms, Wavelet length to 120 ms and Spectral smoothing to 5 Hz, and read Samples, Peak, Centroid and the two -6 dB edges against the table. Change the smoothing and note which tiles move. Run the same settings at the other three wells. The explorer extracts no well wavelet, so finish with the tie view: set View to "The tie and the time-depth record", read Live synthetic samples at Ekene-1, set it beside the 31 samples of the wavelet window, and explain Seismolord's refusal in one sentence.
