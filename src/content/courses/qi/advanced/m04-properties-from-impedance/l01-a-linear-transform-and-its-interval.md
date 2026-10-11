# A linear transform and its interval

Inversion returns AI (acoustic impedance, Vp x density, in kg/(m2 s)); a porosity map needs a transform from AI to porosity and an honest band around every prediction. `fitLinearTransform` fits porosity = a + b AI by least squares on stated samples, and `predictWithInterval` returns the interval of a new observation at a stated AI. The course fits the transform first at log scale, and the next lesson asks what the inversion adds.

## The fit at the wells

The samples are a stated selection: net sand of the Ekene Sand in the four pack wells, Vsh at or below 0.350000, both the oil leg and the water leg, 644 samples, with AI from Vp x density and porosity from the kit's PHIT. The engine returns n, the residual standard error s on n - 2 degrees of freedom, and R squared.

| quantity | value |
| --- | --- |
| a | 0.363690 |
| b, per 10^6 kg/(m2 s) | -0.022834 |
| s | 0.017980 |
| R squared | 0.323708 |
| mean AI, kg/(m2 s) | 7160405.649805 |
| lowest calibration AI | 5693260.530000 |
| highest calibration AI | 8402495.750400 |

The slope is negative: harder sand carries less porosity. R squared 0.323708 says AI accounts for well under half of the porosity spread in these samples; the rest is the scatter that s measures.

## The interval of a new observation

The interval at a new AI x0 is y +/- t s sqrt(1 + 1/n + (x0 - mean)^2 / Sxx), with t Student's quantile at the stated level. The 1 under the root is the scatter of one new sample; the other two terms are the uncertainty of the line, and the last grows with the distance of x0 from the mean AI. The 80 percent interval gives Q10, its low end, and Q90, its high end; the uncertainty course teaches those labels as a subject, and this course uses them only as the two ends of a stated band.

| AI kg/(m2 s) | predicted porosity | Q10 (low end, 80 percent) | Q90 (high end, 80 percent) |
| --- | --- | --- | --- |
| 6500000.000000 | 0.215267 | 0.192157 | 0.238378 |
| 7000000.000000 | 0.203850 | 0.180764 | 0.226936 |
| 7500000.000000 | 0.192433 | 0.169342 | 0.215525 |
| 8500000.000000 | 0.169599 | 0.146406 | 0.192792 |

The bands are nearly the same width in every row. With 644 samples the line is well pinned, so almost all of the width is the scatter of one sample about it.

## Outside the calibration

The last row lies beyond the highest calibration AI, 8402495.750400. The engine still answers, and its interval widens only by the distance term. The band says nothing about whether a straight line still holds beyond the samples that built it, so a study flags every prediction made outside the calibration range.

## The level is a choice

At the 90 percent level and AI 7000000 the interval is 0.174207 to 0.233493, wider than the 80 percent band at the same AI. The level is stated beside every band, with the cut-off, the wells and the legs that built the fit: change any of them and a, b, s and every interval move.

{{panel:qi-prospect-explorer}}

## Exercise

In the prospect explorer, open the view that computes properties from impedance on the Ekene pack logs at the four wells. Fit the transform with the net sand cut-off at 0.350000 and both legs, and check a, b, s and R squared against the first table. Set the stated AI to 7000000 and read the 80 percent band, then set the interval level to 90 percent and read it again. Set the stated AI to 8500000 and write two sentences: what the band there tells a reader, and what it cannot.
