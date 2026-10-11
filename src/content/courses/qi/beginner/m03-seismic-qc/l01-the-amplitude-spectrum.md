# The amplitude spectrum

The first data question is whether the seismic carries the frequencies a study needs at the target. The amplitude spectrum answers it: how much amplitude the traces carry at each frequency. On the Ekene full stack, 120 spread traces in the window 800 to 1600 ms, which holds the Ekene Sand, the mean spectrum peaks at 31.374887 Hz with a peak amplitude of 3269.099145, and falls away on both sides.

{{video:qi-a3}}

## How the engine measures it

The engine is seismicQc.js. Each trace is tapered at both ends by a Tukey window, at a stated taper fraction. It is then padded with zeros to twice the next power of two samples and transformed, and the one-sided amplitude is the modulus at each frequency. The frequency step is 1000 / (padded length x sample interval in ms). For the Ekene window, sampled every 4.000000 ms with taper 0.100000, the step is 0.488281 Hz.

Many traces make one spectrum by averageSpectrum, which averages the power of the traces and takes the root. A spectrum of the volume is a statement about many traces; the next lesson shows how spiky a single trace's spectrum is.

## The Ekene spectrum

The amplitude at a few frequencies, and the same relative to the peak in decibels, 20 log10 of amplitude over peak amplitude:

| frequency Hz | amplitude | relative to the peak, dB |
| --- | --- | --- |
| 4.882813 | 135.533846 | -27.647607 |
| 9.765625 | 575.251794 | -15.091402 |
| 15.136719 | 2116.417605 | -3.776535 |
| 20.019531 | 2403.141302 | -2.672976 |
| 24.902344 | 2691.535156 | -1.688561 |
| 29.785156 | 2071.960931 | -3.960931 |
| 35.156250 | 1424.977894 | -7.212399 |
| 40.039063 | 1249.410326 | -8.354460 |
| 49.804688 | 329.228053 | -19.938625 |
| 60.058594 | 115.309770 | -29.051240 |
| 80.078125 | 41.257627 | -37.978477 |

The peak is refined between frequency steps by a parabola through the three highest values, so the peak amplitude of 3269.099145 can sit above every tabled amplitude. Read in decibels, the tabled amplitudes from 15.136719 to 29.785156 Hz stay within a few dB of the peak; the spectrum is down by 8.354460 dB at 40.039063 Hz and by 29.051240 dB at 60.058594 Hz. On the low side it is down by 15.091402 dB already at 9.765625 Hz. The next lesson turns that shape into the band edges a verdict quotes.

## A check against a known answer

An engine figure is trusted when the engine reproduces a known answer. A Ricker wavelet of 30 Hz has an amplitude spectrum known in closed form: peak 30.000000 Hz, -6 dB edges 14.471033 and 49.062252 Hz, centroid 31.915382 Hz. The engine on that wavelet, sampled every 4.000000 ms with 31 samples and no taper, reads:

| quantity | closed form | engine |
| --- | --- | --- |
| peak Hz | 30.000000 | 30.070572 |
| -6 dB low edge Hz | 14.471033 | 14.463999 |
| -6 dB high edge Hz | 49.062252 | 49.112032 |
| centroid Hz | 31.915382 | 31.915377 |

The small differences come from the sampling and the finite length of the wavelet.

## What a study states with it

A spectrum is a measurement with inputs: which traces, which window and which taper. The Ekene figures above rest on the 120 spread traces, the window 800 to 1600 ms and taper 0.100000. Change any one and the figures move, and the verdict names all three.

The engine also refuses inputs it cannot measure. Too short a trace gives:

> A spectrum needs at least 8 samples.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and View to Seismic QC. With "Window start, ms (stated)" at 800, "Window end, ms (stated)" at 1600 and "Taper fraction (stated)" at 0.100000, read the chart and the Traces, Frequency step and Peak tiles. Then lengthen the window to 800 to 2400 ms and read the Frequency step and Peak again. Explain from the padding rule why the step changed, and say whether the peak moved.
