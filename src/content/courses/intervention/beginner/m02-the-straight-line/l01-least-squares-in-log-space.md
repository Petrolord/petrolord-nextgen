# Least squares in log space

`logLogSlope` takes the natural log of both columns and fits one straight line to the pairs by ordinary least squares. Nothing else happens inside it.

{{panel:pd-diagnostic-explorer}}

## What the transform does to the data

The published power law is eleven points on y = a x^m. In the raw columns x runs from 1.000000 to 100.000000 and y from 3.700000000 to 1854.392764421, a curve that steepens all the way. In logs they run from 0.000000000 to 4.605170186 and from 1.308332820 to 7.525312571, and every pair lands on one line.

| x | y | ln x | ln y |
| --- | --- | --- | --- |
| 1.000000 | 3.700000000 | 0.000000000 | 1.308332820 |
| 3.000000 | 16.304797821 | 1.098612289 | 2.791459409 |
| 10.000000 | 82.832682127 | 2.302585093 | 4.416822695 |
| 35.000000 | 449.462625067 | 3.555348061 | 6.108052703 |
| 100.000000 | 1854.392764421 | 4.605170186 | 7.525312571 |

Those five rows are golden points out of the eleven the case publishes. The spacing is uneven in x on purpose, and least squares does not care: it weights every surviving pair the same.

## The five things it hands back

Fitted over all eleven of those points, the engine returns slope 1.350000000000, intercept 1.308332819650, r2 1.000000000000, n = 11 and spanDecades 2.000000000. Slope, intercept and fit quality describe the line. The count and the span describe the data the line was drawn through, and they are the only two members that say anything about what was in front of it.

## Two routes onto the same eleven points

The oracle does not use least squares. It computes Theil-Sen, the median of every pairwise slope, which shares no mean, no square and no covariance with the engine's arithmetic. Its published slope is 1.350000000000 and its published intercept 1.308332819650. The engine's derived difference from both is 0.0000e+0.

Agreement between two estimators with nothing in common is a strong statement about the arithmetic. It is not a statement about the well, because there is no well here.

## What the fit is not told

It is not told which axis is time. It is not told that the y column was a ratio, a derivative or a pressure. It is not told whether the rows it received were a whole history or a slice somebody chose. So a slope returned by this function is a property of a window, and the window is not in the return object.

## The mistake

Believing that a straight line in log space is a straight line in the data. On these eleven published points the fit is exact, r2 1.000000000000, and yet y rises from 3.700000000 to 1854.392764421. Straightness lives in the transform.

## Exercise

Take three of the published pairs and compute ln x and ln y for each, then check them against the golden values.

Then write the five members of the return for the full eleven-point fit, and mark which two describe the line and which two describe the data.
