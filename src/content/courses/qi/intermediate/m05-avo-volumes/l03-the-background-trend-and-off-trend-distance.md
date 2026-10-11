# The background trend and the off-trend distance

The (A, B) pairs of a window fall along a line: most reflectors in a shale and brine sand sequence share a ratio of gradient to intercept. Castagna and Swan (1997) call that line the background trend, and an AVO anomaly is a point that sits off it. `backgroundTrend` fits the line on the seismic pairs and `offTrend` measures how far a point sits from it.

## The line and the distance

`backgroundTrend` fits B = m A through the origin by orthogonal regression over the (A, B) pairs. Orthogonal regression minimises the perpendicular distances to the line, so A and B are treated alike, which suits a crossplot where both carry noise. The line passes through the origin because a reflector with no contrast has no intercept and no gradient.

`offTrend` returns the signed perpendicular distance of a point from that line:

(B - m A) / sqrt(1 + m^2)

Negative is below the line, towards softer, gas-like responses; positive is above it. This is the same distance the Associate tier read from the wet trend, now measured from a line fitted to the seismic.

## Gather 5

| quantity | value |
| --- | --- |
| (A, B) pairs, every sample of the window where all three bins carry data | 176 |
| trend slope m | -4.020851 |
| the top's off-trend distance, trace amplitude units | 309.781098 |

The slope is negative: across the window, a sample with a larger intercept tends to carry a more negative gradient. The top's point, the two-term A 501.873676 and B -734.431814 of the Shuey lesson, sits 309.781098 from the line on the positive side, above the trend, away from the softer responses.

## Two lines, two distances

The Associate tier measured the top at Ekene-1 against the wet trend, the fluid line fitted to the brine-substituted interfaces, and found the in situ interface on the negative side, the hydrocarbon side. Here the seismic top sits on the positive side of the seismic background. The two figures answer different questions:

- the wet trend is fitted to modelled interfaces taken to brine, in reflection coefficients;
- the background trend is fitted to every sample of a seismic window, whatever its fluid, in trace units, and the top's own sample is one of the 176.

Which line a distance is read from is a stated choice, and a distance quoted without its line means nothing. A study names the line, the window and the pairs it was fitted to.

## Units

The background slope is a ratio of B to A, so dividing every pair by one scale leaves m unchanged. The distance is not a ratio: it is in the units of A and B, here the kit's trace amplitude, and it shrinks by the scale when the pairs become reflection coefficients. A map of off-trend distance is read for its sign and its pattern until the one scale over every well ties it to reflectivity.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the AVO view on the Ekene pack's gather 5 with near, mid and far ranges of 5 to 15, 15 to 25 and 25 to 35 degrees and two terms at 10, 20 and 30 degrees. Fit the background trend over the gather window and check the pair count and slope. Read the top's off-trend distance at 1292 ms and its sign. Then narrow the window so it holds fewer samples, refit, and record how the slope and the top's distance move.
