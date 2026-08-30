# Multi-rate semilog

The straight line generalised, with the whole rate history on the axis.

{{panel:wt-regression-explorer}}

## The idea

For a step-rate history, the rate-normalised pressure drop is linear in a superposition time function:

    (p_i - p_wf(t)) / q_n = m' X(t) + b'

where q_n is the rate of the period the point falls in, and

    X(t) = sum over steps before t of (dq_j / q_n) log10(t - t_j)

Each rate change contributes a logarithm of the time since it happened, weighted by the size of the change relative to the current rate.

The slope gives the permeability per unit rate:

    k = 162.6 B mu / (m' h)

and the intercept gives the skin by the usual formula.

Notice that the rate has left the permeability equation. It is in the normalisation instead, which is why this form works across periods at different rates.

## The engine's implementation

`multiRateSemilogAnalysis` takes the flowing pressures, the rate steps, and the reservoir properties. For each point it finds the rate in force, builds X, skips shut-in points where the current rate is zero, fits the line, and returns k, kh, skin, the slope per unit rate, r squared and the point count.

Shut-in points are excluded deliberately. Analysing a shut-in is Horner's job, and mixing the two in one fit conflates two different reference conditions.

## The result on the three-rate case

Fit the late points of all three periods, avoiding the transient immediately after each rate change: fifteen points out of thirty-seven.

The permeability comes back about two percent below the planted 85 mD, with a skin a little under the planted 6.5, at an r squared of 0.9999658720112803.

Two percent low, from the same cause as always: each period's early points are still in transition, and excluding them entirely would leave too few points to fit.

That is a good result. A single-rate semilog on the same well, at its best window, was about three percent low.

## Choosing the points

The window problem, three times over.

After each rate change the well goes through a storage transient exactly as it does at the start of a test. So each period has an early stretch that must be excluded, and a late stretch that is usable, and the boundaries have to be chosen for each period.

The convention used here is to take points more than a few hours after each rate change and up to the next one. On real data you would choose them from the derivative, computed against the superposition time function rather than against elapsed time.

## What it does not do

It does not fit wellbore storage. The storage transient after each change is excluded rather than modelled, so the same asymptotic bias applies as in the single-rate case.

The regression handles both: a model fit against a superposed rate history uses every point and models the storage. That is more work to set up and it is the right answer when the history is complicated.

## The check that matters

A multi-rate analysis produces one permeability from several periods. If the periods disagree, the fit is a compromise and the disagreement is hidden.

So the useful check is to analyse each period SEPARATELY as well, and compare. Periods that agree support the model. A period that disagrees points at a rate that was not what the record says, or at a rate-dependent skin, or at a boundary being felt during one period and not another.

## The misconception to avoid

"Superposition time is a correction to elapsed time." It is a different variable. The superposition function can decrease with time, can be negative, and has no interpretation as a time. Plotting against it is a device that makes a straight line out of a multi-rate response, and reading a time off its axis is meaningless.

## Exercise

For the three-rate history, write out the superposition time function X(t) explicitly for a point at t = 80 hours, with the three rate changes at 0, 24 and 60 hours.

Identify which rate is q_n for that point, and confirm that the weights (dq/q_n) sum to 1.
