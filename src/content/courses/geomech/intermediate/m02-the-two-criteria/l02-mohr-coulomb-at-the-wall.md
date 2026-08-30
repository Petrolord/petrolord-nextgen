# Mohr-Coulomb at the wall

The criterion, and how the engine solves it.

{{panel:gm-stability-explorer}}

## The criterion

    margin = sigma1 - q x sigma3 - UCS

Negative is safe. Zero is on the point of failing. Positive has failed.

## Evaluating it

At a given well pressure, the engine walks theta from 0 to 179 degrees in one degree steps, computes the three principal wall stresses at each, sorts them, and takes the worst margin over all of them.

Only half a turn is needed because the wall stress pattern repeats every 180 degrees.

## Why a sweep rather than a formula

Because on a deviated hole there is no closed form for the angle where the margin is worst. The shear term moves it, and finding it analytically means solving a transcendental equation.

A one degree sweep over 180 points is cheap, deterministic, and exactly reproducible in another language, which is what an independent oracle needs.

## The cost of the one degree grid

The reported breakout angle is an integer number of degrees, and the collapse pressure is the pressure at which the worst point on that grid reaches zero.

If the true worst angle falls between two grid points the reported pressure is very slightly optimistic. On a smooth function with a broad maximum that error is far below the uncertainty in any input, and the specification is stated so the oracle uses the same grid.

## The bisection

Having a worst-margin function of well pressure, the engine finds the pressure at which it crosses zero.

It does a 400-step scan first to find the interval where the crossing is, then 60 bisection steps inside it. That is a deterministic specification rather than a tolerance, so the answer is bit-reproducible.

## Why a scan before the bisection

Because the worst margin is NOT a monotone function of well pressure, and a naive bisection on a non-monotone function can converge on the wrong root.

Module 5 is about exactly that, and it is one of the more interesting things in the engine.

## What the answer means

The collapse pressure is the SMALLEST well pressure at which the criterion is satisfied everywhere.

Below it, some angle of the wall has failed. Above it, up to the point where the non-monotonicity bites, none has.

## The two parameters again

UCS is the intercept and q is the slope. A rock with a large UCS resists collapse at low confinement; a rock with a large q gains a lot from the mud.

At 2500 m in this profile the UCS is 132798979.91564198 Pa, which is large, and the collapse pressure comes out very low as a result.

## Exercise

Write the Mohr-Coulomb margin for a vertical hole at 2500 m as a function of the differential pressure, at the angle where the hoop stress peaks.

Then solve it for zero and compare against the panel's collapse pressure for a vertical hole there.
