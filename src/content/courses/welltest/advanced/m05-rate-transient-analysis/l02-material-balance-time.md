# Material-balance time

The transform that makes a variable-rate history behave like a constant-rate one.

{{panel:wt-regression-explorer}}

## Why it is exact

During boundary-dominated flow, the pressure everywhere in the drainage volume falls at a rate set by the material balance:

    p_avg(t) = p_i - Q(t) / (N ct)

and the drawdown from the average pressure to the well is set by the productivity index:

    p_avg(t) - p_wf(t) = q(t) / J

Add them and divide by q:

    (p_i - p_wf) / q  =  Q / (q N ct)  +  1/J
                      =  te / (N ct)   +  1/J

which is a straight line in te with slope 1/(N ct) and intercept 1/J.

Nothing in that derivation assumed a constant rate. It is exact for any rate history, provided the flow is boundary-dominated, and that is what makes te the right time variable.

## The two answers

    N = 1 / (slope x ct)
    J = 1 / intercept

The oil in place comes from the slope, the productivity index from the intercept. One straight line, two numbers, both of them things a reservoir engineer wants.

## What the fit gives on the oil fixture

Regressing the rate-normalised drawdown against te over all 80 rows gives an r squared of essentially 1 and an oil in place a sixth of a percent below the planted 2 million stock tank barrels, with a productivity index a fifth of a percent below the planted 1.5.

Both slightly low, both by about the same fraction, and the cause is the trapezoid rule used to accumulate cumulative production from discrete daily rates. A trapezoid under a convex declining curve slightly overstates the cumulative, which slightly overstates te, which slightly increases the slope and reduces N.

That is a discretisation error, not a physical one, and it would shrink with more frequent rate data.

## The exact-decline property

Something worth noticing on this fixture.

Fit the first 40 rows instead of all 80. The oil in place comes back the SAME to fifteen significant figures.

The reason is that this fixture is an exact constant-pressure exponential decline, for which the flowing material balance is an identity at every single point. Every row lies exactly on the line, so any subset defines it exactly.

That is a property of THIS fixture, not of production data. It is useful as a check that the implementation is right, which is what the engine's harness uses it for. It is not a claim that half a record is always enough.

## The compressibility, again

    N = 1 / (slope x ct)

Total compressibility is a multiplier on the answer, and it comes entirely from outside the analysis.

A ct 20 percent too high gives an N about 17 percent too low, from data that fit the line exactly as well. There is no signature in the fit. The line does not get worse.

This is the same structural problem as the drainage area in the Professional tier and it deserves the same treatment: report the compressibility used, and report the sensitivity.

For an undersaturated oil, ct is the sum of oil, water and rock compressibilities weighted by saturation, and each of the three carries its own uncertainty. Ten to twenty percent on ct is normal.

## When the line is not straight

Two cases.

**Early data, before boundary-dominated flow.** The transient period does not obey the flowing material balance and its points curve away from the line. They must be excluded, and identifying where they end is the same window problem as everywhere else in this course.

**A changing drainage volume.** An infill well, a shut-in neighbour, or a growing stimulated volume changes N during the record, and the plot shows a change of slope. That is information, and averaging through it is not.

## The misconception to avoid

"Material-balance time is a smoothing of elapsed time." It is a different variable with a different meaning, it can be much longer than the elapsed time, and it is not monotonic if the rate rises. It is the cumulative divided by the current rate, and reading it as a time is the same category error as reading a superposition time function as a time.

## Exercise

Derive the flowing material balance line from the two equations at the top of this lesson, showing where te appears.

Then say what the intercept would be for a well with a productivity index of 3 stb/d/psi, and what the slope would be for a tank of 5 million stock tank barrels at a total compressibility of 1.2e-5 per psi.
