# The workflow end to end

The whole tier in one sequence, with what fails at each step.

## The eight steps

**One. Fix the two rocks.** The overburden and the reservoir, each with a compressional velocity, a shear velocity and a density. The reservoir comes from the tier below, once per fluid case.

**Two. Compute the normal incidence reflection.** From the impedance contrast, exactly. It costs one line and it is the sign check for everything after.

**Three. Compute the Shuey coefficients.** Intercept, gradient and curvature, for each fluid case.

**Four. Classify.** With a stated threshold, and note how close the call is to a boundary.

**Five. Compute the exact solution across angle.** And compare it against the Shuey curve, recording the largest departure.

**Six. Find the polarity crossing** for any case that has one, using the exact solution.

**Seven. Compute the tuning thickness** for the survey's frequency, and convert it to metres at the reservoir velocity.

**Eight. Report.** Coefficients as coefficients, exact values as values, the class with its threshold, the approximation error, and the tuning threshold.

## Where each fails

Step one fails when the overburden is assumed rather than logged. Every number in this tier is a property of a pair of rocks, and the shale matters as much as the sand.

Step two rarely fails, and it catches sign errors in everything downstream.

Step three fails when the shear velocity was estimated without calibration, which the tier below measured at over 20 percent and which this tier showed can move a gradient from -0.2566 to +0.0842, changing the class.

Step four fails by omitting the threshold.

Step five is usually skipped. At Ekene it is worth 17 percent of the brine intercept.

Step six fails when it is done with the two term form, which at Ekene is nearly three degrees early.

Step seven fails when it is not done at all, which is the common case, and the consequence is an amplitude map read as a fluid map.

Step eight fails by reporting a Shuey evaluation as a reflection coefficient.

## What the sequence assumes

That the interface is planar and horizontal, that the wave is a plane wave, that both media are isotropic and elastic, and that the reservoir is thick enough for its top reflection to be isolated.

Real interfaces are none of the first three exactly, and the fourth is a condition you can at least check.

## Worked example

Run the whole sequence on Ekene in one pass.

One: shale 2743, 1394, 2450 over brine sand 3200, 1800, 2250 and gas sand 2905.6972280296195, 1890.9758806113214, 2038.7104517793223.

Two: normal incidence 0.034457 brine and -0.062991 gas, so the sign flips.

Three: brine A 0.034344, B -0.167662, C 0.076897; gas A -0.062825, B -0.256563, C 0.028803.

Four: class I and class III at a threshold of 0.02, with the brine case only 1.72 times above that threshold and becoming class II at 0.04.

Five: largest Shuey departure 0.005972 brine and 0.002192 gas over 0 to 40 degrees.

Six: brine polarity crossing at 29.870555217606523 degrees on the exact solution.

Seven: tuning 16 ms at 25 Hz, which is 23.2 m at the gas sand velocity.

Eight: report as in module four's last lesson.

Eight lines. What took five modules was knowing what each is worth.

## Exercise

A colleague hands you an AVO model and asks you to check it. List the four questions you would ask, in order of how much they could change the answer.

Self check: ask whether the shear velocity was measured or estimated, and if estimated whether it was calibrated, since an uncalibrated estimate can change the class; then what porosity the substitution assumed, since it moves the predicted velocity by more than 300 m/s; then what overburden was used, since the reflection is a property of a pair of rocks; then whether the reported values are Shuey or exact, since at 30 degrees those differ by more than twice the tolerance on the coefficients.
