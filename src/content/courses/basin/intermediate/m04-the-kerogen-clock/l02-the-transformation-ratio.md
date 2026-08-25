# The transformation ratio

The kerogen clock's read-out is the transformation ratio. This lesson defines it exactly as the engine computes it, fixes the isothermal convention the fixture uses, and works the first graded value of the module.

## The definition

$$TR = 1 - \frac{\sum_i x_i}{\sum_i x_i^0}$$

with $x_i^0$ the initial potentials and $x_i$ what remains. TR is the reacted fraction of the total potential: 0 for fresh kerogen, 1 when every bin is empty. Because the library potentials sum to 1, the denominator is 1 for the fixtures, but the engine divides anyway, so a measured spectrum that sums to 0.97 or 1.05 still yields an honest fraction.

TR is the number the tier above multiplies by a mass. A source rock with a generative potential of so many kilograms per square metre, at TR = 0.3, has generated thirty percent of it. That is the entire interface between this tier and the next: the kinetics deliver a dimensionless fraction, and everything with units of mass stays upstairs.

## The isothermal convention

The fixture holds a Type II kerogen at a constant 100 degC and asks for TR at 10, 50 and 100 Ma. Constant temperature makes the convention trivial in one way: module 2 proved step size does not matter when T is fixed, so the fixture takes whole-Ma steps, the engine's native $\Delta t$ of 1 Ma, rather than the 0.01 Ma sub-steps a ramp needs. There is no midpoint to choose because every midpoint is 100 degC.

The graded values are TR at 10 Ma, 0.022481215976523083, and at 50 Ma, 0.05477927380797565, both with tolerance 0.0005. The 100 Ma value, 0.07419624543388115, is tabulated but ungraded, and the next lesson is about what those three numbers say together.

## Working the 10 Ma value by hand

You already did most of this in module 2. At 100 degC over 10 Ma, the 46 kcal bin retains $e^{-3.5988} = 0.027357$ of its content, so from potential 0.01 it contributes $0.01 \times (1 - 0.027357) = 0.0097264$ of reacted potential. The 48 kcal bin retains $e^{-0.24251} = 0.78466$, contributing $0.05 \times 0.21534 = 0.010767$. The 50 kcal bin retains $e^{-0.016341} = 0.983792$, contributing $0.11 \times 0.016208 = 0.0017829$. The 52 bin adds about 0.00019, and higher bins are dust.

Sum: $0.0097264 + 0.010767 + 0.0017829 + 0.00019 = 0.0224663$, against the engine's 0.022481215976523083. Hand arithmetic with four bins reproduces the graded value to within 0.07 percent, comfortably inside tolerance. Notice the composition: at 10 Ma, the tiny 46 kcal bin and the 48 kcal bin each supply almost half the answer, and the 0.11-potential bin at 50 kcal supplies only 8 percent of it. Early TR comes from the toe of the spectrum, not from its bulk.

## What TR is not

Three common confusions to retire now. TR is not a maturity: it is a property of this kerogen's spectrum under this history, and the same history gives a different TR to a different type, as lesson 5 shows by a factor of 132. TR is not Ro in different units: the two clocks share nothing but the integrator, and only the vitrinite one is a calibration standard. And TR is not "the oil that exists": some generated mass never leaves the rock, and the split between what is generated and what escapes is expulsion, which belongs entirely to the Expert tier.

## Worked example

A colleague reports TR = 0.5 for the fixture kerogen and calls the rock "half done generating at 100 degC, given time". Assess. From lesson 1, the front at 100 degC cannot pass the 50 kcal bin, and the occupancy at or below 50 kcal is 0.17. TR = 0.5 at 100 degC is unreachable at any duration; the claim needs a hotter history, not a longer one. The correct ceiling statement is: at 100 degC, TR is bounded near 0.17, and reaching 0.5 requires the front to reach the 54 kcal bin, which requires temperature.

## Exercise

Compute the 48 kcal bin's contribution to TR at 50 Ma from its survival factor per Ma of 0.97604, and compare with the engine's 0.035128298223581114. Then answer in one sentence: why does the engine divide by the sum of potentials even though the library spectra sum to 1?

As a self check: $0.97604^{50} = 0.29765$, so the contribution is $0.05 \times (1 - 0.29765) = 0.0351175$, matching the engine to four figures. The division guards the definition: TR must remain a true fraction of the initial potential even when a user-supplied spectrum does not sum to 1, so the normalisation lives in the read-out rather than as a requirement on the data.
