# The gradient is a shear story

Decompose the gas gradient into its three parts and one of them is four times the size of the other two combined. This lesson is that decomposition, because it changes what you consider when a gradient does not behave.

## The three terms

For the gas case:

| term | value |
| --- | --- |
| compressional, $\tfrac{1}{2}\Delta v_p / \bar{v}_p$ | +0.028802610843132695 |
| density, $-2w \Delta\rho/\bar{\rho}$ | +0.12395208861462988 |
| shear, $-4w \Delta v_s / \bar{v}_s$ | -0.4093180439179981 |
| total | -0.2565633444602355 |

## Two things worth noticing immediately

The shear term is 2.7 times larger in magnitude than the other two put together, and it is the only negative one.

The density term is positive. It pushes the gradient up, toward zero, which is the opposite of what people expect from a quantity that made the intercept strongly negative.

## Why the density term changes sign between A and B

In the intercept, the density contrast enters as $+\tfrac{1}{2}\Delta\rho/\bar{\rho}$. A falling density gives a negative contribution.

In the gradient, it enters as $-2w\Delta\rho/\bar{\rho}$. The minus sign flips it, so the same falling density gives a positive contribution.

That is not a quirk of notation. Physically, a low density lower halfspace reflects more strongly at normal incidence and its reflection strengthens less rapidly with offset than a velocity contrast would. The density's roles in the near and far offsets genuinely differ in sign.

The practical consequence is that intercept and gradient respond to density in opposite directions, which is part of why crossplotting them separates fluid effects.

## What this means for a wrong shear velocity

Everything, which is the point of the lesson.

Recall from the tier below that estimating shear from a gas sand's compressional velocity gives an answer 23.5 percent too low. Carry that error into the gradient.

The shear term is proportional to $\Delta v_s / \bar{v}_s$. An under-estimated sand shear velocity shrinks the contrast against the shale and shrinks the mean, and the net effect on the term is large. With a shear velocity of 1446.343832922053 m/s instead of 1890.9758806113214, the contrast against the shale's 1394 collapses from 496.98 m/s to 52.34, and the shear term falls from -0.409318 to -0.037276.

The gradient is then dominated by the positive density term and comes out at **+0.084195**, positive rather than negative. With an intercept still at -0.0628, that is a class IV response rather than class III.

So a shear estimate that is not calibrated does not merely add noise to the gradient. It changes the class the model predicts, and changes it to the one class that is usually read as evidence against a simple gas sand.

## The ranking to carry

For a gradient at a shale over sand interface, in order of influence: the shear contrast, then the density contrast, then the compressional contrast.

For an intercept: the density contrast, then the compressional contrast, and the shear contrast not at all.

Those two lists are different, which is exactly why two coefficients carry more information than one.

## Worked example

Confirm the decomposition adds up, and see what a 10 percent error in the sand's shear velocity would do.

The three terms sum to $0.028802610843132695 + 0.12395208861462988 - 0.4093180439179981 = -0.2565633444602355$, which is the graded gradient.

Now suppose the sand's shear velocity were 1701.8783 m/s rather than 1890.9759, a 10 percent under-estimate. The contrast against the shale falls from 496.98 to 307.88 m/s, and the weighting factor $w$ falls from 0.338195 to 0.300380.

The shear term shrinks from -0.409318 to -0.238977, and the gradient moves from -0.256563 to -0.100082. Less than 40 percent of its correct value, from a 10 percent error in one input.

The gradient is the most sensitive quantity in this course, and it is sensitive to the input most likely to be estimated rather than measured.

## Exercise

State which coefficient, intercept or gradient, is more sensitive to an error in the shear velocity, and by roughly how much at Ekene.

Self check: the gradient, and the intercept is not sensitive to it at all, since the shear velocity does not appear in the intercept formula. At Ekene a 10 percent error in the sand's shear velocity moves the gradient by more than half its value, while leaving the intercept unchanged.
