# The background trend and the off-trend distance

The (A, B) pairs of a window are summed up by one line through them. Castagna and Swan (1997) call that line the background trend, and an AVO anomaly is a point that sits off it.

## The line and the distance

`backgroundTrend` fits B = m A through the origin by orthogonal regression over the (A, B) pairs. Orthogonal regression minimises perpendicular distances, treating A and B alike, which suits a crossplot where both carry noise. The line passes through the origin because a reflector with no contrast has no intercept and no gradient.

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

Which line a distance is read from is a stated choice, and a distance quoted without its line means nothing.

## Units

The background slope is a ratio of B to A, so dividing every pair by one scale leaves m unchanged. The distance is in the units of A and B, here the kit's trace amplitude, and it shrinks by the scale when the pairs become reflection coefficients. A map of off-trend distance is read for its sign and its pattern until the one scale over every well ties it to reflectivity.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Shuey fit and the background trend", on gather 5 with bin edges 5, 15, 25, 35, mean angles 10, 20, 30, two terms and Sample time 1292 ms. Check the (A, B) pairs and Background trend slope m tiles, then read Off-trend distance of the sample and its sign. Move Sample time a few samples up and down and record which of the slope and the distance move. Then switch to three terms and say why the slope and the pair count stay put while the top's distance changes.
