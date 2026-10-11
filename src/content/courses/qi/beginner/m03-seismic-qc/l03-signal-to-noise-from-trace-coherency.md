# Signal to noise from trace coherency

The second data question is whether the signal is clean enough. Signal and noise cannot be separated on one trace, but two neighbouring traces can be compared: whatever they share is signal, and whatever differs is noise. On the 21 neighbouring traces along inline 1027 through Ekene-1, in the window 800 to 1600 ms, the median signal to noise is 361.155122 as a power ratio, 25.576938 dB.

## The method

The method is Hatton, Worthington and Makin (1986). Take two neighbouring traces that carry the same signal and independent noise of equal power. At their best alignment, their normalised cross-correlation is c, and the signal to noise power ratio is c / (1 - c). A correlation of zero gives a ratio of zero; as c climbs towards 1 the ratio grows without bound.

The engine, snrFromCoherency in seismicQc.js, searches a stated number of samples either side of zero lag for the best alignment, which allows for dip between the traces. It clamps c at 0.999999 at most, takes every neighbouring pair, and reports the median ratio and the same in decibels, 10 log10 of the ratio. The decibel form uses 10 log10 because the ratio is already a ratio of powers; the amplitude spectrum uses 20 log10 because it is in amplitude.

## The Ekene neighbours

The maximum lag is 3 samples.

| window ms | pairs | median signal to noise (power) | in dB |
| --- | --- | --- | --- |
| 800 to 1600 | 20 | 361.155122 | 25.576938 |
| 1600 to 2400 | 20 | 77.008444 | 18.865384 |

Twenty-one traces give twenty neighbouring pairs. The first five pairs of the shallow window, in order, are 388.889121, 471.612452, 367.582682, 350.585441 and 390.813495: close to one another and to the median. The deep window's median is lower, at 77.008444, so the deeper data is less clean. The Ekene Sand sits in the shallow window, so the verdict quotes 361.155122.

## The lag is a stated choice

The shallow window at four maximum lags:

| maximum lag, samples | median signal to noise | in dB |
| --- | --- | --- |
| 0 | 361.155122 | 25.576938 |
| 1 | 361.155122 | 25.576938 |
| 3 | 361.155122 | 25.576938 |
| 6 | 361.155122 | 25.576938 |

The median does not move, because the best alignment of every neighbouring pair here is at zero lag: the events along this inline are flat. On dipping events the best alignment moves off zero lag, which is what the search is for, so a study states the lag it allowed.

## A ratio near the clamp is a ceiling

When neighbouring traces are almost identical, c is close to 1 and c / (1 - c) grows without bound. At the clamp, 0.999999, the ratio is 999998.999971. A figure that large is a ceiling set by the clamp, and reads only as nearly identical traces. QI Studio prints any ratio of 10,000 or more as "over 10,000 (over 40 dB)" for that reason.

The engine also refuses what it cannot compare. Given one trace:

> Signal-to-noise needs at least two neighbouring traces.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set Data to "Ekene pack: Ekene-1" and View to Seismic QC. With the window at 800 to 1600 ms, read the Neighbouring pairs and both Median signal to noise tiles at "Maximum lag, samples (stated)" 0, 1, 3 and 6. Then set the window to 1600 to 2400 ms at lag 3 and read them again. Write one sentence on what an unchanged median across the lags tells you about the events, and one on which window's figure belongs in a verdict on the Ekene Sand.
