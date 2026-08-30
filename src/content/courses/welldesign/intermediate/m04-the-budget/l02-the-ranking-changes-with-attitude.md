# The ranking changes with attitude

The same well, the same tool, a different budget at every depth.

{{panel:wd-uncertainty-explorer}}

## The experiment

Set the panel to the shallow station, where the well is still vertical. Read the top of the source table. Then set it to total depth, where the well is horizontal. Read it again.

The lists have almost nothing in common, and the magnitudes differ by orders of magnitude.

## What happens at vertical

At 1200 m the well is vertical and the total variance is very small: the largest single source contributes about 4.28 square metres of trace, against a total at total depth that is thousands of times larger.

The leaders are cross-axial magnetic terms, and they lead for a specific reason: at zero inclination the azimuth is barely determined, so the terms that describe azimuth errors have large weightings, but the LEVER ARM is zero because the well has no horizontal displacement yet. Large angular uncertainty, no position consequence.

The depth sources are present and small, because 1200 m of depth at one part in a thousand is about a metre.

AMIL, which dominates everything at total depth, contributes essentially nothing at vertical, because its weighting has the sine of the inclination in it.

## What happens at horizontal

Everything reverses. The sine of the inclination is 1, so the axial magnetic terms are at their maximum. The well has kilometres of horizontal displacement, so every azimuth error is multiplied by a long lever arm.

The result is a total variance thousands of times larger and a completely different ranking.

## The general lesson

**A source's contribution is its magnitude times its weighting times its lever arm.** The magnitude is a constant from the parameter set. The weighting depends on the attitude. The lever arm depends on how far the well has gone since the error entered.

Change any of the three and the ranking changes.

## Why this matters for reporting

An uncertainty budget is often presented as a pie chart with the sources labelled. That chart is valid at ONE station.

Presenting it without saying which station is the equivalent of presenting a permeability without saying which well. The panel forces the question by making the station a control, and the honest report states the depth and the attitude alongside the shares.

## Why it matters for planning

Because the mitigation decision depends on where the uncertainty matters.

If the anti-collision problem is at 500 m, where the wells are close together and still nearly vertical, then the sources that dominate at total depth are irrelevant and the surface position uncertainty, which is not even in this model, is probably the biggest term.

If the problem is hitting a target at 8000 m, then AMIL and the declination reference are the whole story and non-magnetic spacing is the answer.

Spending money on the wrong one is easy, because the budget at total depth is the one that gets printed.

## The trend, not the snapshot

The most useful presentation is not a pie chart at one station but the top few sources plotted against measured depth, so the crossover is visible.

The engine keeps per-source covariances at every station precisely so this can be done, and the panel's station selector is the cheap version of it.

## The misconception to avoid

"The biggest error source in this survey is X." There is no single answer. X is the biggest at some depths and negligible at others, and a statement about a survey's error budget is only meaningful with a depth and an attitude attached. On this well the leader at total depth does not appear in the top five while the well is vertical.

## Exercise

Using the panel, record the largest source and the total trace at the shallow vertical station and at total depth.

Compute the ratio of the totals. Then explain, using the three factors from this lesson, why the ratio is so large and which of the three contributes most to it.
