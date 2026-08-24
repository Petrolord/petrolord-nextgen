# The amplitude at tuning

Two capstone fields are amplitudes read at the tuning thickness, and both of them are the number **0.1155947595834732**. This lesson derives that number by hand, explains what its ratio to the isolated level means, and sets up the fact that the 25 Hz and 40 Hz readings are identical rather than merely similar.

## The derivation

At the tuning thickness the peak of the composite sits exactly at the top interface, so the closed form applies without correction:

$$s(t_0) = R_{top} + R_{base}\,w(T) = 0.08 - 0.08\,w(16\ \mathrm{ms})$$

The 25 Hz Ricker at a lag of 16 ms. Work the exponent first:

$$x = (\pi f t)^2 = (\pi \times 25 \times 0.016)^2 = (1.2566371)^2 = 1.5791367$$

Then the wavelet value:

$$w = (1 - 2x)e^{-x} = (1 - 3.1582734)\times e^{-1.5791367} = (-2.1582734)(0.2061530) = -0.4449345$$

And the amplitude:

$$s = 0.08 \times (1 + 0.4449345) = 0.08 \times 1.4449345 = 0.11559476$$

The model reports 0.1155947595834732. The hand calculation and the model agree to every digit the hand calculation carries.

## The ratio, which is the transferable part

Divide the tuning amplitude by the isolated amplitude:

$$\frac{0.1155947595834732}{0.07999999821186066} = 1.4449345$$

That ratio is the **tuning brightening factor**, and it is the part of the result that survives leaving this model. It does not depend on the coefficients: any equal and opposite pair under a 25 Hz Ricker on a 2 ms grid brightens by the same 44.5 percent at its tuning thickness, because both numerator and denominator scale with $R_{top}$.

It is also the number to carry into an argument about a map. If a horizon is known from well control to have a reflection pair of about $\pm 0.06$, then its isolated amplitude is 0.06 and no thickness can push it past $0.06 \times 1.445 = 0.0867$. A mapped amplitude of 0.12 over that horizon is not a tuned thin bed. It is something else.

## Why the tolerance is 0.002

The capstone accepts either amplitude within 0.002 of the graded value, which is 1.7 percent of it. That is generous compared with what the model itself is capable of, and the generosity has a specific purpose.

The stored traces are 32 bit floats, so the last several digits of any amplitude depend on rounding inside the engine rather than on the physics. A learner who computes the answer by hand from the Ricker formula, as above, gets 0.11559476 and stops there. A learner who reads the tile gets 0.1155947595834732. A learner who works in double precision throughout and never rounds gets 0.1155947617. All three are the same answer and the tolerance is wide enough to hold all three.

What the tolerance is **not** wide enough to hold is the continuous ideal. The largest amplitude a 25 Hz Ricker could theoretically produce against an opposite pair is $0.08 \times (1 + 2e^{-3/2}) = 0.11570083$, which differs from the graded value by 0.000106. That is inside the tolerance too, so it also passes, and module 5 explains why the two differ at all.

## What is not the answer

Three wrong values are close enough to be tempting.

**0.16**, which is the sum of the two coefficients in absolute value. The reflections never add at full strength, because the wavelet's value at the tuning lag is $-0.4449$ and not $-1$. Only a same signed pair at zero thickness reaches 0.16.

**0.08**, the isolated level. This is the answer to a different capstone field and mixing the two is the most common way to lose both.

**0.1157**, the continuous ideal. It passes the tolerance, but it is a theoretical maximum rather than a reading off this model, and quoting it as a measurement is the kind of small dishonesty that a reviewer will notice.

## Worked example

Predict the tuning amplitude for a wedge with a pair of $+0.05$ and $-0.05$ under a 25 Hz Ricker on the same grid, then check the prediction against the brightening factor.

The closed form gives $0.05 \times 1.4449345 = 0.07224673$. The brightening factor route gives the same thing: isolated level 0.05, times 1.4449345, is 0.0722467. The model, run with that pair, returns 0.07224672. The tuning thickness is still 16 ms.

## Exercise

A wedge is run with a pair of $+0.10$ and $-0.06$ under a 25 Hz Ricker. Predict the amplitude at 16 ms using the closed form, and state whether the brightening factor of 1.4449 applies to this case.

As a self-check: $s = 0.10 - (-0.06)(-0.4449345) = 0.10 - 0.0266961 = 0.0733$ is the wrong route, because the sign of the base coefficient is already negative, so the second term is $-0.06 \times -0.4449345 = +0.0266961$ and $s = 0.1266961$. The brightening factor does not apply, because it was derived for an equal pair where the isolated level and the base contribution scale together; here the isolated level is 0.10 and the ratio is 1.2670 rather than 1.4449.
