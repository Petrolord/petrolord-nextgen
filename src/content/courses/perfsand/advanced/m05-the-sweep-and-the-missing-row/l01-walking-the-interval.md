# Walking the interval

Turning a point criterion into a profile, and what the profile is for.

{{panel:ps-sand-explorer}}

## The sweep

Start at the top of the perforated interval, step down by a chosen increment to the bottom, and at every station evaluate the criterion against the local stresses, pore pressure and strength.

That gives a row per station: the measured depth, the true vertical depth, the pore pressure, the critical flowing pressure and the margin between them.

## What is interpolated and what is not

The stress and strength curves arrive on a depth grid from the Geomechanics course. At each station the engine interpolates them linearly in true vertical depth.

The measured depth to true vertical depth conversion is NOT linear. It uses the exact minimum-curvature increment from the bracketing survey station, because linear interpolation along an arc misses by decimetres at these depths, and a decimetre of true vertical depth is real stress.

## The governing row

The row with the smallest margin. That is the one that decides whether the interval can be produced at the intended drawdown, because a completion is limited by its weakest point.

The engine returns it alongside the rows, so a caller who wants one number gets the right one.

## What the profile shows that the governing row does not

How much of the interval is near the limit.

An interval whose governing row is barely negative and whose other twenty rows are comfortably positive has a thin weak streak. An interval where half the rows are negative has a different problem and a different answer.

The first might be perforated selectively to avoid the streak. The second needs sand control.

## Which way the margin usually goes with depth

Deeper is usually better, because rock strength increases with compaction faster than pore pressure increases with depth. On the published profile the margin rises monotonically through the interval, so the governing row is at the top.

That is the normal case and it is not universal, which is what the next lesson is about.

## Exercise

Describe the sweep and say what each row carries.

Say what is interpolated linearly and what is not, and why the exception matters.

Then explain what the profile shows that the governing row alone does not, and give two intervals that share a governing row and need different answers.
