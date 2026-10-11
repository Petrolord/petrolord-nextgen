# The Shuey fit from near, mid and far

The Associate tier read Shuey's intercept and gradient off a modelled interface. Here the same two numbers are fitted to the seismic: three partial stacks at a sample, each at its mean angle, and a straight line through them in sin^2(theta). The Rock Physics course derives Shuey's (1985) approximation in full; this course fits it.

## The fit

`fitShuey` fits, per sample, by least squares over the angles that carry a finite amplitude:

R(theta) = A + B sin^2(theta)

or, with a third term, A + B sin^2(theta) + C (tan^2(theta) - sin^2(theta)). A is the intercept, the amplitude at normal incidence; B is the gradient, how fast the amplitude changes with sin^2(theta); C is the curvature, which matters at far angles. An angle whose amplitude is not finite drops out of the fit, so the angles used can be fewer than the angles given.

With three angles the two-term fit has one spare equation. The three-term fit on three angles is exactly determined: it passes through all three points and leaves no misfit to judge it by.

## Gather 5 at the top

The three bins of the angle gather at the top (1292.000000 ms), near, mid and far, placed at their mean angles of 10, 20 and 30 degrees:

| fit | A | B | C | angles used |
| --- | --- | --- | --- | --- |
| two terms | 501.873676 | -734.431814 | 0.000000 | 3 |
| three terms | 510.227684 | -915.097371 | 467.947963 | 3 |
| two terms, 9 bins of 5 degrees at their centres | 519.312395 | -927.296460 | 0.000000 | 9 |

A is positive and B negative in every row: a peak at the top that dims with angle, the same signs as the modelled interface at Ekene-1. The two-term fit reports C as 0.000000 because it has no third term.

- **The three-term fit moves B.** Adding a curvature term takes some of the fall with angle into C, and the gradient grows steeper. On three points, with nothing left over, the split between B and C is fixed by the points alone, so noise in the far stack goes straight into both.
- **More bins move the two-term fit.** Nine bins of 5 degrees at their centres give a two-term A and B both larger in size than the three-bin fit.
- **The units are trace units.** A and B here are in the kit's trace amplitude, which has no physical scale. They become reflection coefficients only through the one scale over every well.

## What a fit states

Every A and B rests on stated choices: the angle stacks and their ranges, the angle each stack is placed at, the number of terms, and the velocity table that gave the angles. The two-term fit on near, mid and far at their mean angles is the course's working choice for the rest of this tier.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Shuey fit and the background trend", on gather 5. Set Angle bin edges to 5, 15, 25, 35, Sample time to 1292 ms, Mean angle of each bin to 10, 20, 30 and Shuey terms to two terms, and check the A and B tiles against the table. Switch to three terms and watch B and C move together. Then set the edges every 5 degrees from zero, nine bins in all, give each bin its centre as its mean angle, fit two terms again, and say which of A and B moved further.
