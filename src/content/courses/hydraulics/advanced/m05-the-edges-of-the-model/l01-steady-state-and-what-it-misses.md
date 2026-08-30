# Steady state, and what it misses

Everything that happens while something is changing.

## The assumption

Every calculation in this course is a steady state: the flow rate is constant, the trip speed is constant, and nothing is accelerating.

The pressure at any point is a function of the current conditions and carries no memory.

## What that misses

**Starting the pumps.** Accelerating a column of mud thousands of metres long takes a pressure of its own, on top of the friction. It is a transient and it decays.

**Stopping them.** The same in reverse, and it can produce a pressure BELOW the steady value briefly, which is a swab with no string movement at all.

**Starting and stopping a trip.** A stand is not run at a constant speed: the string accelerates out of the slips and decelerates into them, and the peak surge follows the acceleration as well as the velocity.

**Connections.** The pumps stop, the equivalent circulating density falls to the static weight, the mud gels, and then the pumps start again. That whole cycle is a transient and it happens every stand.

## Why the acceleration term is real

The pressure to accelerate a column is roughly

    dp = rho L a

with L the length of the column and a the acceleration. For 3000 m of mud at 1440 kg/m3 accelerating at 0.1 m/s2, that is 432000 Pa.

Against a steady surge pressure of 981472.927055977 Pa at 0.5 m/s, an acceleration term of that size is not a small correction.

## Which way it goes

It ADDS to the surge on the way in during acceleration, and subtracts during deceleration. So the peak pressure during a stand is higher than the steady-state calculation at the peak velocity.

That is the single biggest reason a computed surge pressure is optimistic.

## What a transient model adds

Mud compressibility, so that a pressure wave travels rather than appearing instantly. String elasticity. Acceleration terms. A time axis.

Those models exist, they are considerably more expensive to run, and they are used on wells where the window is narrow enough to justify them.

## What to do without one

Use the PEAK velocity rather than the average, and add a margin for the acceleration.

That is a rule of thumb and it is what the steady-state calculation is actually used for in practice.

## Exercise

Estimate the acceleration a string undergoes coming out of the slips, from a plausible time to reach running speed.

Compute the acceleration pressure for that value on this well, and compare it against the steady surge at the running speed.
