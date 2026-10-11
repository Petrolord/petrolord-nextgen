# The low-frequency model from wells and horizons

A band-limited trace says how impedance changes and nothing of its level. Every absolute inversion in this tier takes the level from a low-frequency model, the LFM, built from the wells and carried along the horizons. Model-based inversion starts from it and is pulled towards it.

## Why the seismic needs it

The seismic band holds no trend: below about 8 Hz it carries nothing an inversion can use, so the level of AI (acoustic impedance) comes from the wells, and the LFM moves it to every trace.

## How the engine builds it

The LFM between wells comes from lfm.js, which awaits its independent oracle in the engines repository: the course teaches it and grades nothing through it until that oracle lands. It takes three steps:

1. **Low-pass each well.** Each well's ln(AI) in time is smoothed by a moving average whose half window is round(1000 / (cut x dt) / 2) samples. At the stated cut of 8 Hz on the 4.000000 ms clock that is 16 samples (`lowFrequencyModel`). That is more than half of a 27-sample log.
2. **Follow the horizons.** Between two horizons a sample keeps its proportional position (`mapToWellTime`), so a layer that thickens or dips between wells keeps its impedance. Above the first horizon and below the last, the time offset from that horizon is kept.
3. **Weight by distance.** The smoothed wells are carried to a trace by inverse distance weighting with power 2.

## The proportional position

The Ekene-1 trace's times mapped onto Ekene-2's horizons, the top and base of the Ekene Sand:

| time at Ekene-1 ms | the same position at Ekene-2 ms |
| --- | --- |
| 1280.796378 | 1297.746335 |
| 1288.796378 | 1305.746335 |
| 1299.913186 | 1318.075904 |
| 1319.029994 | 1338.405474 |

The second and fourth rows are the horizons. The third, mid-sand at Ekene-1, lands mid-sand in Ekene-2's thicker sand; the first, above the top, keeps its offset.

## The weights at Ekene-1

With Ekene-1 left out, distances in metres in the kit's projection; each weight is the inverse square of the distance, and a share is a weight over the sum of the three.

| well | distance m | share |
| --- | --- | --- |
| Ekene-2 | 1209.338662 | 0.477419 |
| Ekene-3 | 1360.147051 | 0.377419 |
| Ekene-4 | 2193.171220 | 0.145161 |

## At each well

The LFM ln(AI) at 1288.000000 ms, Ekene-1's sand top, left out and kept in, and the RMS error in AI of the LFM alone against the well's log after the 50 Hz high cut (`blindWellScore`, logged samples only):

| well | LFM ln(AI), left out | LFM ln(AI), kept | LFM-only AI error percent, left out | LFM-only AI error percent, kept |
| --- | --- | --- | --- | --- |
| Ekene-1 | 15.458070 | 15.461408 | 8.638086 | 8.369222 |
| Ekene-2 | 15.454999 | 15.473081 | 10.450743 | 11.272271 |
| Ekene-3 | 15.461340 | 15.446607 | 8.512597 | 7.817522 |
| Ekene-4 | 15.474175 | 15.468322 | 10.307658 | 10.251573 |

Left out, the errors run from 8.512597 percent at Ekene-3 to 10.450743 percent at Ekene-2. Keeping a well in lowers its own error at three wells and raises it at Ekene-2: a well inside its own LFM is no guarantee of a closer match.

## What these numbers will mean

The LFM-only error is the bar every inversion in the next module must clear, and the blind-well lesson shows it is hard to beat on RMS error. A study states the cut, the power, the horizons and the wells, and quotes the LFM-only score beside every inversion.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "The low-frequency model", Data to "Ekene teaching pack", "LFM cut, Hz" to 8 and "Inverse distance power" to 2. Set Well to Ekene-1 and "The well's own log" to left out, and read the distances, the shares and the two horizon times. Set the well's own log to kept in and look again. Change the power to 1 and note which way Ekene-4's share moves.
