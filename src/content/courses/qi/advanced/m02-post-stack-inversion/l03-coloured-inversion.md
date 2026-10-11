# Coloured inversion

Coloured inversion needs no wavelet and no low-frequency model. One operator, applied to every trace, reshapes the seismic's spectrum into the spectrum the wells' impedance logs have. The output is relative AI (acoustic impedance): band-limited, with no level. On the Ekene pack it correlates with the band-passed log at 0.931237 at Ekene-1 and 0.796895 at Ekene-4.

## The method

Lancaster and Whitcombe (2000), in the engine's `impedanceSpectrumSlope`, `colouredOperator` and `applyColoured`. The operator has two parts.

Its amplitude spectrum turns the seismic's average spectrum into the wells' impedance spectrum. That impedance spectrum is modelled as a power law, f^alpha, fitted to the logs by log-log least squares over 5 to 80 Hz. The operator acts inside the stated band, 8 to 60 Hz, with cosine tapers 5 Hz wide at each edge. Its phase is minus 90 degrees.

Because there is no LFM, nothing in the output says how hard a layer is, only how it differs from the layers round it. That is why the course scores it by correlation alone.

## The slope at each well

The slope comes from each pack well's AI log in time, over its logged samples only. The operator uses the mean, alpha -1.012769, with a transform length of 256. The score is correlation against the log band-passed between 8 and 50 Hz, over the logged samples:

| well | alpha from its log | correlation with the band-passed log | samples |
| --- | --- | --- | --- |
| Ekene-1 | -0.646563 | 0.931237 | 27 |
| Ekene-2 | -1.473109 | 0.923565 | 27 |
| Ekene-3 | -0.749731 | 0.828766 | 27 |
| Ekene-4 | -1.181673 | 0.796895 | 26 |

## Why the four slopes differ

The pack covers the Ekene Sand and the shale above it, so each log is short, and a slope fitted to a short log rests on few frequencies. The four slopes run from -0.646563 at Ekene-1 to -1.473109 at Ekene-2 about their mean of -1.012769. On the pack the mean of four short fits is the stated choice, and a study states it with the four slopes behind it.

## What the correlations can and cannot be compared with

At three of the four wells these correlations are higher than the model-based ones the next lesson prints. They are scored against a different target: the log band-passed between 8 and 50 Hz, where the absolute inversions are scored against the log after the 50 Hz high cut, which keeps its level and its low frequencies. A relative result is compared with the part of the log it can hold, so the two sets of correlations sit side by side only with their targets named.

What it offers is independence: no wavelet to scale, no LFM between wells, and one operator for every trace.

## What it cannot give

A level. Any figure that needs absolute AI, a porosity from impedance or a cut-off on AI, cannot be read from coloured inversion without adding a low-frequency model, and then it depends on the LFM.

{{panel:qi-inversion-explorer}}

## Exercise

In the inversion explorer, set View to "Coloured inversion" and Data to "Ekene teaching pack", with "Band low edge, Hz" 8, "Band high edge, Hz" 60 and the high cut of the log at 50 Hz. Read the mean alpha, the transform length, and each well's alpha and correlation. Then set the band high edge to 50 Hz and read the correlations again. Write one sentence on which well's correlation moved most, and whether its alpha sits near the mean or far from it.
