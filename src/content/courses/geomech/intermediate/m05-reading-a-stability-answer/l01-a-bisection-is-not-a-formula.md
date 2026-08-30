# A bisection is not a formula

How the two pressures are actually found, and what that costs.

{{panel:gm-stability-explorer}}

## The situation

For a deviated hole there is no closed form for either bound. The angle at which the wall is worst has to be found by search, and the pressure at which the criterion is met has to be found by search too.

## The fracture bisection

Straightforward. The least wall stress falls monotonically with the well pressure, so there is exactly one pressure at which it reaches minus the tensile strength.

Eighty bisection steps between zero and an upper limit, and the answer is converged far beyond any meaningful precision.

## The collapse search

Not straightforward, because the worst Mohr-Coulomb margin is NOT monotone in the well pressure.

So the engine does a 400-step linear scan from zero up to the limit, finds the FIRST interval where the margin goes from positive to negative, and bisects inside that interval for 60 steps.

## Why the first crossing

Because the collapse pressure is defined as the SMALLEST well pressure that stabilises the hole. Later crossings, if any, are the criterion being violated again for a different reason at high pressure.

Taking the first one is the right definition, and it needs a scan to find rather than a bisection.

## What a fixed step count buys

Reproducibility. A bisection that stops at a tolerance stops after a data-dependent number of steps, and the last digits can differ between implementations or between compiler settings.

A bisection that always runs 60 steps produces the same bits every time, which is what makes an independent oracle comparison meaningful at 1e-9 rather than at 1e-6.

## What the scan resolution costs

The 400-step scan divides the pressure range into 400 intervals. If a crossing and an un-crossing both fall inside one interval, the scan misses the pair.

That is a real limitation of a scan-based root finder, and it is a stated specification rather than a bug: the oracle mirrors it exactly.

## The two edge cases

**Stable at zero pressure.** If the criterion is already satisfied with an empty hole, the collapse pressure is reported as zero and the breakout angle as the worst angle at zero. That happens in strong rock at shallow depth: the shallowest checkpoint in both wells reports a collapse equivalent mud weight of 11.678923272 kg/m3, which is essentially nothing.

**Never stable.** If no pressure in the range satisfies the criterion, the engine returns the top of the range. That is a signal that the window has closed rather than a pressure to use.

## Exercise

Explain why a bisection would be unsafe on the collapse criterion without the scan, using the definition of a bisection.

Then say what would happen if the scan used 40 steps instead of 400.
