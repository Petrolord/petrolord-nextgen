# Horner time runs backwards

The axis that confuses everybody the first time, and why it is the right axis.

{{panel:wt-buildup-explorer}}

## The transform

    Horner time = (tp + dt) / dt

with tp the producing time before shut-in and dt the shut-in time, both in hours.

For the buildup in this course, tp is 36 hours. The first recorded point is at a shut-in time of 0.01 hours and its Horner time is

    (36 + 0.01) / 0.01 = 3600.9999999999995

The last point is at 79.43282347242814 hours of shut-in, and its Horner time is

    (36 + 79.43282347242814) / 79.43282347242814 = 1.4532131482459003

So as the test proceeds, Horner time DECREASES, from over three thousand towards one. Plotted on a logarithmic axis in the conventional direction, the test runs from right to left, which is why Horner plots are almost always drawn with the axis reversed so that time still reads left to right.

Do not let the direction obscure what the number means. A large Horner ratio is early shut-in: the shut-in time is tiny compared to the producing time. A ratio approaching 1 is a very long shut-in: dt has grown so much that tp is negligible beside it.

## The limit that matters

Horner time can never reach 1 in a finite test. It approaches 1 from above as dt goes to infinity.

That is exactly why the extrapolation of the fitted line to a Horner time of 1 has a meaning: it is the pressure the well would reach after an infinite shut-in. It is called p*, and the next lesson is about what it is and is not.

At a Horner time of 1 the logarithm is zero, so p* is just the intercept of the fitted line. That is the whole reason the axis is built this way.

## One hour on this axis

The skin formula needs the line's value at a shut-in time of one hour. On the Horner axis, one hour of shut-in after 36 hours of production sits at a Horner time of exactly 37.

Which is a reminder that the reference point is not a fixed place on the plot: it moves with the producing time. Two tests on the same well with different producing times put their one-hour reference at different Horner ratios, and any manual reading has to be done on the plot for that test.

## What tp to use

If the well produced at a constant rate from the beginning, tp is simply the length of that production.

If it did not, tp is the equivalent producing time: cumulative production divided by the last stable rate. The engine provides `equivalentProducingTime` for exactly this, and the Expert tier shows a case where the equivalent producing time is nearly twice the duration of the final rate.

Using the wrong tp distorts the Horner axis and moves p*. The permeability is less affected, because the slope over the late data is relatively insensitive to tp, but the extrapolation is not.

## Why not just plot against shut-in time

You can, and that is the MDH plot, which the next-but-one lesson covers. It is simpler and it works when tp is much larger than the shut-in time, because then the Horner ratio is approximately tp/dt and the logarithm differs from log(dt) by a constant.

When tp is comparable to the shut-in time, which is the case here, the two are not equivalent and the Horner form is the correct one. The buildup in this course is shut in for more than twice as long as it produced, so its Horner axis compresses towards 1 at the end, and an MDH plot of the same data would keep spreading out. That difference is visible in the answers.

## The misconception to avoid

"The Horner plot is a plot against time." It is a plot against a dimensionless ratio built from two times, and the ratio is bounded below by 1 no matter how long you wait. That bound is a feature: it is what makes the extrapolation finite and gives p* a definition.

## Exercise

Compute the Horner time for shut-in times of 0.1, 1, 10 and 36 hours with a producing time of 36 hours.

Then repeat with a producing time of 360 hours. Say what happens to the spread of the four values, and explain why a long producing time makes a Horner plot look more like a plot against shut-in time.
