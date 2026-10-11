# Left-out wells and the widened band

A transform fitted log against log knows nothing of the inversion. On a map, porosity is predicted from inverted AI (acoustic impedance, Vp x density), and inverted AI carries the inversion's error; a band built from the log scatter alone is too narrow for it. The left-out check measures that error at the wells and widens the band by it.

{{video:qi-f17}}

## Where the check lives

The check is QI Studio app code, `calibrateProperty`, which calls the extraction-gated engine `propertyPrediction.js` for the fit and the interval. The leave-one-out loop around those calls is the app's; the course quotes its figures on the Ekene wells, and the prospect explorer states the check without computing it. A report says so.

## The steps

At seismic scale each well's ln(AI) and porosity in time are low-passed at 50 Hz, and the transform is fitted to the wells. Then each well is left out in turn, the transform is refitted on the others, and porosity is predicted from the blind inverted AI at that well, the same blind inversion the post-stack module scored, with the low-frequency model built from the other wells. The left-out residuals carry the inversion's error, so their pooled RMS widens the band:

s_extra = sqrt(RMS^2 - s^2), when the RMS exceeds s.

Each well's coverage is tested with the other wells' residuals only.

## Ekene, inside the Ekene Sand times

| quantity | value |
| --- | --- |
| a | 0.302982 |
| b, per 10^6 kg/(m2 s) | -0.017033 |
| n (upscaled samples) | 20 |
| s, the log-against-log residual error | 0.007175 |
| pooled left-out RMS | 0.024072 |
| s_extra, the widening | 0.022977 |

At seismic scale the fit rests on 20 upscaled samples, where the log-scale fit of the previous lesson had 644. The low-pass smooths the logs, so the log-against-log error s is small. The pooled left-out RMS is much larger, and the widening is close to the RMS itself: almost all of the band a map should carry comes from the inversion, and a band quoted from s alone would hide it.

| well left out | samples | RMS porosity error | bias | correlation | share inside the widened 80 percent band |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 5 | 0.028337 | -0.024560 | -0.484704 | 0.600000 |
| Ekene-2 | 6 | 0.027716 | -0.021598 | -0.794283 | 0.833333 |
| Ekene-3 | 5 | 0.021520 | -0.020246 | -0.734150 | 1.000000 |
| Ekene-4 | 4 | 0.012741 | -0.009593 | NaN | 1.000000 |

## Reading the wells

Every bias carries the same sign, so the left-out predictions sit off the log in one direction at all four wells; a study reports that offset beside the RMS. The correlations rest on four to six samples each and are negative at three wells: at this scale the prediction carries a level inside the sand and little of its shape. Ekene-4 returns NaN, the result the code gives when either series has no spread over the well's samples, and a NaN is reported as a gap.

The coverage column is the test of the widened band. Ekene-3 and Ekene-4 fall wholly inside it, Ekene-2 at 0.833333 and Ekene-1 at 0.600000. On five samples a share moves in large steps, so four wells give a rough check of an 80 percent band and no more. A report states the samples behind every share.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, set View to "Left-out wells and the widened band" and read what it declares: the check is QI Studio app code, and the explorer quotes no figure from it. Then set View to "A linear transform and its interval" with Data "Ekene teaching pack" and read the Residual standard error s of the log-scale fit. Set it beside the seismic-scale s and the pooled left-out RMS in the first table above, and write one sentence on which error a porosity map from inverted AI should carry, and why.
