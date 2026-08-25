# Two term and three term

Shuey's form has three coefficients and most work uses two of them. This lesson is about what dropping the third costs.

## The two forms

$$R_2(\theta) = A + B\sin^2\theta$$

$$R_3(\theta) = A + B\sin^2\theta + C(\tan^2\theta - \sin^2\theta)$$

The third term is zero at zero degrees and grows slowly, because $\tan^2\theta$ and $\sin^2\theta$ track each other closely until the angle gets large. At 20 degrees the bracket is 0.0154; at 30 degrees it is 0.0833; at 40 degrees it is 0.290913.

So the curvature term is negligible out to about 20 degrees and is not negligible at 40.

## What C is

$$C = \frac{1}{2}\frac{\Delta v_p}{\bar{v}_p}$$

The compressional velocity contrast alone. At Ekene it is 0.07689718997139491 for the brine case and 0.028802610843132695 for the gas case.

Notice that the brine case's curvature is 2.7 times the gas case's, because its velocity contrast against the shale is much larger. That single fact explains most of the next lesson.

## The gas case compared

| angle | two term | three term | exact |
| --- | --- | --- | --- |
| 0 | -0.062825 | -0.062825 | -0.062991 |
| 10 | -0.070561 | -0.070534 | -0.070159 |
| 20 | -0.092837 | -0.092391 | -0.090820 |
| 30 | -0.126966 | -0.124566 | -0.122391 |
| 40 | -0.168831 | -0.160452 | -0.160206 |

At 40 degrees the two term form is out by 0.008625 and the three term form by 0.000246. The third term is worth a factor of 35 in accuracy at the far offsets.

## Which to use when

For forward modelling, the three term form, or better the exact solution, since there is no reason to approximate when all the inputs are known.

For inversion from a gather, the two term form, because a gather cannot resolve three coefficients reliably. Fitting three parameters to a noisy curve over a limited angle range gives a curvature estimate dominated by noise, and the instability contaminates the other two.

That is the practical compromise: model with three or with exact, invert with two, and remember that the coefficients extracted with two terms are not quite the same objects as the coefficients that went into the model.

## The bias that introduces

If a gather is fitted with two terms over a range where the third term is active, the fit absorbs the curvature into the gradient.

At Ekene, fitting the exact gas curve out to 40 degrees with two terms would give a gradient steeper than the true -0.2566, because the curve bends downward faster than $\sin^2\theta$ alone can describe.

So a gradient measured from far offsets and a gradient computed from rock properties are not directly comparable unless the same angle range and the same number of terms were used for both. That is a common and quiet source of mismatch between models and data.

## Worked example

Work out how much the third term contributes at each angle for the gas case, to see where it starts to matter.

The contribution is $C(\tan^2\theta - \sin^2\theta)$ with $C = 0.028802610843132695$.

At 20 degrees: $0.0288 \times 0.0154 = 0.000444$, which is 0.5 percent of the reflection there.

At 30 degrees: $0.0288 \times 0.0833 = 0.002400$, which is 2 percent.

At 40 degrees: $0.0288 \times 0.290913 = 0.008379$, which is 5 percent.

The threshold at which it starts to matter is around 25 to 30 degrees, which is exactly the range modern wide azimuth surveys record. The two term form was a good approximation for the offset ranges available when it was introduced and is a weaker one now.

## Exercise

State which of the two Shuey forms should be used to model a gather out to 40 degrees, and which should be used to fit one, and give the reason for the difference.

Self check: model with the three term form, since at 40 degrees the two term form is out by 0.008625 against the exact solution while the three term form is out by 0.000246. Fit with the two term form, since a noisy gather over a limited angle range cannot resolve three coefficients stably and the curvature estimate would contaminate the gradient.
