# MDH and Agarwal

Two simpler axes, when they work and when they do not.

## The MDH plot

Miller, Dyes and Hutchinson plotted shut-in pressure against the logarithm of shut-in time alone, with no producing time in it.

    pws against log10(dt)

It is the same plot you would draw for a drawdown, and it is valid when the producing time is much longer than the shut-in time. Under that condition the Horner ratio is approximately tp/dt, and the logarithm of it differs from log(dt) by the constant log(tp), which shifts the line without tilting it. Same slope, same permeability, different intercept.

The engine's `mdhAnalysis` implements this form and it is the function used for every drawdown fixture in the course, where there is no producing time to worry about.

Applied to a buildup, MDH is a shortcut with a condition attached, and the condition is exactly the one this course's buildup fails: it produced for 36 hours and was shut in for over 79.

## Agarwal equivalent time

Agarwal proposed a different transform that maps buildup data onto the drawdown solution directly:

    dte = tp dt / (tp + dt)

Its behaviour is worth noticing. For small shut-in times it is essentially dt itself: at a shut-in of 0.01 hours after 36 hours of production it comes to 0.009997222993612885. For large shut-in times it saturates: as dt grows without bound, dte approaches tp and never exceeds it.

For this buildup the final point, at a shut-in of 79.43282347242814 hours, has an equivalent time of 24.772690808264272 hours, which is less than tp and much less than the shut-in time itself.

That compression at late time is the transform's whole point. A buildup that is plotted against equivalent time can be overlaid directly on a drawdown type curve, because equivalent time undoes the superposition.

## Which one for what

**Horner** for the semilog analysis of a buildup, always. It is exact for any tp and it gives p*.

**Agarwal equivalent time** for the derivative and for type-curve matching of a buildup. This is what the engine does: `autoFitModel` differentiates buildup data against equivalent time and drawdown data against elapsed time, applying the identical transform to the model and to the data so that the comparison is fair.

**MDH** for drawdowns, and for buildups only when tp is much greater than the shut-in time and the convenience is worth the approximation.

## The saturation is a real limit

Because equivalent time cannot exceed tp, a buildup can never see further into the reservoir than the production that preceded it. Shutting a well in for a month after producing it for a day does not buy a month of investigation; it buys, at best, a day of it.

That is a practical planning result. If you want a test to reach a boundary, the PRODUCTION before the shut-in has to be long enough, and extending the shut-in past a few times tp adds very little.

## Reading a number off the wrong axis

The three axes give three different numbers at the same nominal time, and mixing them up is a real failure mode.

At a shut-in of one hour after 36 hours of production: the Horner ratio is 37, the equivalent time is 0.972972972972973 hours, and the shut-in time is 1 hour. A skin formula that wants the line's value at one hour needs to know which of those the line is drawn against.

The engine keeps them apart internally, and a hand calculation should too.

## The misconception to avoid

"Agarwal equivalent time makes a buildup into a drawdown." It makes the buildup's PRESSURE CHANGE match a drawdown's for a well in an infinite-acting reservoir with constant storage. It does not make the two tests equivalent: the buildup still cannot see past tp, still carries the production history in its pressure, and still gives p* rather than an initial pressure.

## Exercise

Compute the Agarwal equivalent time for shut-in times of 1, 10, 36, 100 and 1000 hours, with tp = 36 hours.

Plot or tabulate the result and state, in one sentence, what a planner should conclude about the value of extending a shut-in from 100 to 1000 hours.
