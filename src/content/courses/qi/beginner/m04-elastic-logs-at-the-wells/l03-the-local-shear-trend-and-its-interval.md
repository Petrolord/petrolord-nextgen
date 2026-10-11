# The local shear trend and its prediction interval

A measured shear log calibrates the field's own relation between Vs and Vp. The local shear trend is that relation: a least squares fit of measured Vs on Vp over stated samples, with a prediction interval at a stated level, so that a well or a layer without shear can borrow a figure and know how far to trust it.

{{video:qi-b4}}

## The fit

`fitVsRegression` regresses measured Vs in m/s on Vp in km/s by ordinary least squares, in one of two forms: linear, Vs = c0 + c1 Vp, or quadratic with a c2 Vp^2 term. The slope c1 is in m/s of Vs per km/s of Vp. The engine returns the coefficients, the sample count n, the degrees of freedom (n less the number of coefficients), the residual standard error s, R squared and the Vp range of the calibration. On the 103 water-leg net sand samples of Ekene-1, linear:

| quantity | value |
| --- | --- |
| c0, m/s | -970.382459 |
| c1, the slope, m/s per km/s | 855.280029 |
| n | 103 |
| degrees of freedom | 101 |
| residual standard error s, m/s | 41.009437 |
| R squared | 0.925483 |
| lowest Vp, m/s | 2670.381000 |
| highest Vp, m/s | 3481.638000 |

An R squared of 0.925483 says Vp explains most of the spread in this sand's shear; s says the rest scatters by about 41.009437 m/s.

## The prediction and its interval

`predictVs` returns, at a new Vp, the predicted Vs and an interval Vs +/- t s sqrt(1 + leverage), where t is Student's quantile at (1 + level) / 2 on the degrees of freedom; sigma is s sqrt(1 + leverage). Leverage grows with distance from the centre of the calibration, so the interval widens towards the ends. A Vp outside the calibration range is flagged as extrapolated.

| Vp m/s | predicted Vs m/s | sigma m/s | low m/s | high m/s | extrapolated |
| --- | --- | --- | --- | --- | --- |
| 2900.000000 | 1509.929626 | 41.646413 | 1440.793224 | 1579.066029 | no |
| 3100.000000 | 1680.985632 | 41.225414 | 1612.548122 | 1749.423143 | no |
| 3300.000000 | 1852.041638 | 41.367840 | 1783.367688 | 1920.715589 | no |
| 3700.000000 | 2194.153650 | 43.298759 | 2122.274219 | 2266.033081 | yes |

The level here is 0.900000. At 3700 m/s the Vp lies above the highest calibrated value: sigma grows, and the flag says the line is being trusted where no sample supports it.

## Three stated choices

The level. At Vp 3100 m/s and the 0.8 level, the interval is 1627.805269 to 1734.165996 m/s, narrower than at 0.900000.

The form. Quadratic on the same samples gives c0 -4335.156360, c1 3017.560894, c2 -346.356417 and s 39.004155 m/s, and predicts 1690.797241 m/s at 3100 m/s. The extra coefficient buys a smaller s.

The samples. The water-leg net sand of all four pack wells together, 465 samples, gives c0 -1022.068640, c1 872.045751 and s 39.612304 m/s; at 3100 m/s it predicts 1681.273188 m/s with an interval of 1615.915396 to 1746.630980 m/s. More wells move the slope, and a study states which wells it fitted.

## The refusals

The panel prints each refusal unchanged:

> form must be 'linear' or 'quadratic'.

> The regression is singular (Vp has no spread).

> The interval level must be between 0 and 1.

The first came from asking for the form 'cubic', the second from six pairs all at Vp 3000 m/s, and the third from a level of 1.2.

{{panel:qi-feasibility-explorer}}

## Exercise

In the feasibility explorer, set View to "Shear and the local trend" and Data to "Ekene pack: Ekene-1". With "Trend form (stated)" linear and "Prediction interval level (stated)" 0.900000, set "Predict at Vp, m/s" to 2900.000000, 3300.000000 and 3700.000000 in turn and check the four rows above. Set the level to 0.8 at 3100 and read the narrower interval. Switch the form to quadratic and compare s and the prediction. Then fit Ekene-2 alone and say whether its slope sits nearer the Ekene-1 slope or the four-well slope.
