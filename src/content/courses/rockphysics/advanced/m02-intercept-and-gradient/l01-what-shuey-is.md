# What Shuey is

Zoeppritz solved the reflection problem exactly in 1919. Shuey rewrote the answer in 1985 in a form that separates what a seismic gather can actually measure. This lesson is about why the rewrite was worth doing.

## The problem with exact

The exact solution is a ratio of two complex expressions built from both rocks' three properties and the incidence angle. It is correct and it is opaque.

Nothing in it tells you which combination of rock properties a gather is sensitive to, or how to go the other way from a measured amplitude curve to something about the rocks. It is a forward calculator and not much else.

## The rewrite

Shuey's form is a series in the angle:

$$R(\theta) = A + B \sin^2\theta + C(\tan^2\theta - \sin^2\theta)$$

Three coefficients, each built from the rock contrasts alone, and three functions of angle that do not depend on the rocks at all.

That separation is the whole point. The rock properties live in $A$, $B$ and $C$; the geometry lives in the angle terms.

## What each term does

$A$ is the intercept, the value at zero angle. It is the normal incidence reflection coefficient.

$B$ is the gradient, which controls the behaviour over the angle range a seismic survey actually records, roughly 0 to 35 degrees.

$C$ is the curvature, which only matters at large angles where $\tan^2\theta$ pulls away from $\sin^2\theta$. Below about 30 degrees its contribution is small.

## Why it can be inverted

A gather gives amplitude against offset, and offset converts to angle. Fit a straight line to amplitude against $\sin^2\theta$ and the intercept of that line is $A$ and its slope is $B$.

Two numbers extracted from a curve, and both are rock properties. That is what made AVO a practical technique rather than a forward modelling exercise: the measurement and the theory meet in the same two coefficients.

The two-term form, dropping $C$, is what is used for that fit. It is the working version.

## The coefficients in full

$$A = \frac{1}{2}\left(\frac{\Delta v_p}{\bar{v}_p} + \frac{\Delta \rho}{\bar{\rho}}\right)$$

$$B = \frac{1}{2}\frac{\Delta v_p}{\bar{v}_p} - 2\left(\frac{\bar{v}_s}{\bar{v}_p}\right)^2\left(\frac{\Delta \rho}{\bar{\rho}} + \frac{2\Delta v_s}{\bar{v}_s}\right)$$

$$C = \frac{1}{2}\frac{\Delta v_p}{\bar{v}_p}$$

where the bars are averages across the interface and the deltas are lower minus upper.

Notice what appears where. The shear velocity is absent from $A$ entirely and present in $B$ twice, once in the weighting factor and once in the contrast. That is the single structural fact that makes AVO a fluid discriminator, and the next three lessons unpack it.

## What it is not

It is an approximation. It is derived by linearising the exact solution for small contrasts and small angles, and it inherits both limitations.

Small contrasts means it degrades when the two rocks are very different. Small angles means it degrades past about 30 degrees, which is inside the range modern surveys record.

Module four measures both of those on this interface, and finds the error is larger than most people assume.

## Worked example

Compute the intercept for the gas case from the coefficient formula and check it against the normal incidence value.

The averages are $\bar{v}_p = (2743 + 2905.6972280296195)/2 = 2824.3486140148097$ and $\bar{\rho} = (2450 + 2038.7104517793223)/2 = 2244.3552258896612$.

The contrasts are $\Delta v_p = 162.69722802961946$ and $\Delta \rho = -411.2895482206777$.

$$A = \tfrac{1}{2}\left(\frac{162.69722802961946}{2824.3486140148097} + \frac{-411.2895482206777}{2244.3552258896612}\right) = \tfrac{1}{2}(0.05760522 - 0.18325509) = -0.06282494$$

which is the graded gas intercept of -0.06282494068620303.

Compare that with the exact normal incidence value of -0.0629911815139045 from the last module. They differ by 0.00016624, in the fourth decimal, and that gap is already the approximation showing at zero degrees where it is supposed to be best.

## Exercise

State which of the three rock properties does not appear in the intercept, and why that is expected.

Self check: the shear velocity does not appear in the intercept. At normal incidence the incident wave produces no shear motion at the interface, so no shear property can influence the reflection, and Shuey's intercept is exactly the normal incidence coefficient in linearised form.
