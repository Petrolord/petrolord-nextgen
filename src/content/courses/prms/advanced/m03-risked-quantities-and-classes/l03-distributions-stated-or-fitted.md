# Distributions stated or fitted

{{panel:prms-aggregation-calculator}}

Every project in an aggregation states its distribution; the engine builds none from data. Volumetric estimates belong to the reservoir volumetrics course, and the shapes themselves to the uncertainty course. The engine reads a low, a best, a high and a mean off what is stated, and refuses a distribution it cannot honour exactly.

## Four types

Each project's distribution control offers four types; a fifth is refused, verbatim:

> projects[0].distribution.type must be one of "triangular-fit", "triangular", "lognormal", "normal"; got "beta"

- "triangular": a stated min, mode and max.
- "lognormal" and "normal": a stated mean and standard deviation.
- "triangular-fit": stated low, best and high estimates, and lib/stats fits the triangular that passes through them.

The Ekene Reserves use three of them:

| project | stated | low | best | high |
| --- | --- | --- | --- | --- |
| EKN-1 | triangular fitted: min 2.628420, mode 16.097684, max 31.737202 | 8.890000 | 16.650000 | 24.990000 |
| EKN-2 | lognormal mean 6.000000, standard deviation 1.800000 | 3.945035 | 5.746958 | 8.371921 |
| EKN-U | normal mean 4.000000, standard deviation 0.800000 | 2.974759 | 4.000000 | 5.025241 |

Stated estimates beside a stated distribution are refused, verbatim:

> projects[1].estimates must be left out when the distribution is stated (the engine reads the estimates off it); got {"low":1,"best":2,"high":3}

## A fit it cannot make

A triangular is fixed by three points, but some sets of three estimates admit none. When the best estimate sits too close to the low, no triangular passes through all three exactly. The engine refuses the call and bends no figure to make it fit, verbatim:

> projects[0].estimates must be low, best and high that a triangular distribution passes through exactly (lib/stats fitTriangularToPercentiles): the best estimate sits too near the low estimate for any triangular; got {"low":10,"best":15,"high":24}

A fit that passes through exactly can still reach below zero, and that is refused with its own message, verbatim:

> projects[0].estimates must be low, best and high whose fitted triangular stays at or above 0 (its minimum would be -2.236068); got {"low":1,"best":5,"high":9}

## A normal below zero

A normal has no floor. For a mean of 1 and a standard deviation of 1 the low would be -0.281552, and the engine refuses it, verbatim:

> projects[2].distribution must be a normal whose low estimate (the mean less 1.2815515655446004 standard deviations, here -0.281552) stays at or above 0; got {"type":"normal","mean":1,"stdDev":1}

A normal whose low stays at or above zero can still draw below it. On a stated project W, a normal of mean 4.000000 and standard deviation 3.100000 with a low estimate of 0.027190, the engine keeps those draws and says so, verbatim:

> W: a normal distribution draws below 0 with chance 0.098469 (lib/stats normalCDF); those draws stay in the total

The Ekene normal draws below zero so rarely that the chance prints as 0 at six decimals, so no such line appears.

## A triangular out of order

A stated triangular needs min at or below mode at or below max, and min below max, verbatim:

> projects[2].distribution must be a triangular with min <= mode <= max and min < max; got {"type":"triangular","min":3,"mode":2,"max":6}

## Exercise

Open the aggregation calculator on the view "Aggregation: arithmetic and probabilistic" and start from "Ekene Reserves at the field level". On EKN-U, set the standard deviation control to 3.100000 and read the note the reasons now print under its own id; then set the mean to 1 and the standard deviation to 1 and read the refusal. Restore EKN-U. On EKN-1, set the low estimate control to 10, the best to 15 and the high to 24, and read that refusal.
