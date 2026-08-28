# Baselines and thirds

The engine's injectivity test is a comparison of two least squares slopes: the first third of the record against the last third. That construction is simple, defensible, and has three specific blind spots. This lesson names them, because a diagnostic you cannot fool is a diagnostic you do not understand.

## The construction

With $n$ usable points, let $k = \max(2, \lfloor n/3 \rfloor)$. Fit an ordinary least squares slope to points $0$ to $k$, giving the baseline. Fit another to points $n-k$ to $n$, giving the recent slope. Report both and their ratio.

For Ekene's 36 monthly points, $k = 12$: the first year against the last year, with the middle year unused.

## Blind spot one: a change in the middle

The middle third never enters either fit. A degradation that begins and ends inside months 13 to 24 changes neither slope and produces a ratio of 1.

More commonly, a degradation that begins in the middle third is partially captured: the last third contains only the part of it that persisted, and the baseline is clean, so the ratio is real but understated.

Ekene-4's degradation starts exactly at the boundary of the last third, on 2025-01-01 with the last third running 2025-01 to 2025-12. That is the most favourable possible timing for this test, and it is a property of the fixture, not of the method. A degradation starting six months earlier would leave the last third half-clean and the fitted slope somewhere between $1/0.5$ and $1/0.35$, with a correspondingly smaller ratio.

## Blind spot two: a gradual trend

The test compares two levels. A slope that rises steadily throughout the record, with no step anywhere, still produces a ratio above 1, so a trend is detected. But a trend and a step of the same total size look identical in the ratio, and they mean different things: a step is an event with a date and probably a cause, while a trend is a process.

The way to tell them apart is to look at the Hall plot itself rather than the two numbers, which is why the engine returns the full integral and cumulative arrays alongside the fitted slopes.

## Blind spot three: a baseline that is not a baseline

The first third is assumed to represent healthy behaviour. On a well that was damaged during completion and cleaned up over its first months, the first third contains the damage, the baseline slope is too high, and the ratio comes out below 1, reporting an improvement that is really a recovery from a bad start.

Start-up transients are extremely common in the first months of injection: the well is displacing completion fluid, the near-wellbore is being cleaned or plugged by the first water, and the rate is ramping. A baseline fitted across that period is a mixture, not a reference.

The defence is to look at the first third's own linearity. A clean baseline is a straight line; a start-up transient is visibly curved.

## Why thirds and not something else

Thirds is a reasonable default. It uses a third of the data for each fit, which is enough points for stability, and it leaves a gap between the two windows so that a slow transition does not appear in both.

The alternatives each cost something. A moving-window slope with a trend test is more sensitive and needs more data and more parameters. Comparing the last window against the whole history mixes the recent behaviour into its own baseline. Fitting a changepoint model is the most informative and the least transparent.

For a screening test that has to run unattended on every injector in a field, two least squares fits and a ratio is a sensible place to stop. Knowing where it stops is the point of this lesson.

## The minimum point count

Fewer than ten usable points and the well is excluded entirely, returned in the injectors-without-pressure list rather than given a plot.

That threshold is doing more work than it looks. With ten points, $k$ is 3, so each fit uses three points, and a three-point least squares slope is dominated by whichever point sits furthest from the mean. The threshold is a floor below which the ratio is not a measurement, and even at the floor it should be read with suspicion.

Ekene's 36 points give 12 per fit, which is comfortable.

## Using it well

Three habits.

**Read the ratio with the record length.** A ratio of 1.3 on 36 monthly points is a year-on-year comparison. The same ratio on 12 points is a four-month comparison, and four months of injection is not a lot of evidence.

**Look at the plot before believing the ratio.** Curvature, scatter, and a visible step all carry information the two numbers throw away.

**Check when the change happened.** If the ratio is high, find the date. A degradation with a date can be matched against operations records: a workover, a change of water source, a filter failure.

## The misconception to avoid

"The test uses all the data, so it is using all the information." It uses two thirds of the data in two fits and discards the middle third entirely, and it compresses everything into one number. That compression is what makes it runnable on a hundred wells unattended, and it is why the result is a screening flag rather than a conclusion.

## Exercise

First, for a well with 36 monthly points, state which calendar months fall in the baseline fit, which in the recent fit, and which in neither. Then say what a degradation beginning in month 20 would do to the reported ratio compared with one beginning in month 25.

Second, a well returns a slope ratio of 0.7 and an improving-injectivity alert. List three explanations, one benign and two that would concern you, and name the check that would separate them.
