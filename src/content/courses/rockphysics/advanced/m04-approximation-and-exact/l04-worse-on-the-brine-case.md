# Worse on the brine case

The approximation is nearly three times worse on the wet case than on the gas case. That is the opposite of the intuition that a bigger anomaly is harder to approximate, and it has a clean cause.

## The two maxima

Over 0 to 40 degrees:

$$\max|R_{Shuey} - R_{exact}|_{brine} = 0.005972095765271403$$

$$\max|R_{Shuey} - R_{exact}|_{gas} = 0.0021919285920672105$$

A ratio of 2.72.

## The cause

Shuey's form is a linearisation in the fractional contrasts across the interface. Its error grows with those contrasts, roughly as their square.

The brine sand differs from the shale by 16.7 percent in compressional velocity. The gas sand differs by 5.9 percent.

Squaring gives a ratio of about 8. The observed error ratio is 2.7, so the square law is an over-estimate here, but the direction is right and the mechanism is the one at work: the wet interface is the bigger elastic contrast, so the linearisation struggles more with it.

## Why the intuition points the wrong way

Because people think of the gas case as the anomalous one. It has the larger reflection coefficient, the more dramatic behaviour on a gather, and the interpretation attached to it.

None of that is what the approximation cares about. Shuey's error depends on how different the two rocks are, not on how large the resulting reflection is. The gas sand happens to be closer in velocity to the shale than the brine sand is, so it is the easier interface to approximate even though it is the louder one.

## The curvature term says the same thing

The curvature coefficient is the compressional velocity contrast: 0.07689718997139491 for brine and 0.028802610843132695 for gas.

The brine case carries 2.67 times the curvature, which is almost exactly the ratio of the maximum errors. That is not a coincidence: the curvature term is the first thing the linearisation gets wrong, and its size is a good predictor of how wrong.

So the curvature coefficient is worth reading as a diagnostic as well as a term. A case with a large $C$ is a case where Shuey should be trusted less at wide angle.

## What follows for modelling

Model the wet case with the exact solution, or at least check it.

That is a slightly surprising piece of advice, because the wet case is usually treated as the boring baseline. It is nevertheless the one where the approximation is weakest, and it is also the one the anomaly is measured against.

An error in the baseline propagates into the anomaly. If the wet case is modelled 17 percent low at the far offsets, the apparent difference between wet and gas is wrong by that much before any data are involved.

## Reading it off the panel

Both error tiles are printed for exactly this comparison.

{{panel:rp-avo-explorer}}

They read 0.005972 for the brine case and 0.002192 for the gas case. Then look at the chart: the blue dashed and solid lines separate at the right hand edge while the amber pair have come back together.

That picture is the lesson. The quiet case is the badly approximated one.

## Worked example

Check the prediction that the error ratio should track the curvature ratio, using the numbers.

Curvature ratio: $0.07689718997139491 / 0.028802610843132695 = 2.6698$.

Maximum error ratio: $0.005972095765271403 / 0.0021919285920672105 = 2.7246$.

Those agree to within 2 percent, which is close enough to be useful and not so close as to be a theorem. The curvature coefficient is computed from the rocks in one line, so it gives a cheap advance warning of where the approximation will be weak, before any comparison against the exact solution is run.

## Exercise

Two interfaces are to be modelled, one with a 20 percent compressional velocity contrast and one with a 5 percent contrast. State which will be better approximated by Shuey's form and roughly by how much.

Self check: the 5 percent contrast will be better approximated. The error grows roughly with the square of the contrast, so a factor of four in contrast suggests something like a factor of sixteen in error, although the Ekene comparison shows the square law over-estimates in practice, giving a factor of 2.7 where the square law predicted 8. The direction is reliable and the size should be checked against the exact solution rather than predicted.
