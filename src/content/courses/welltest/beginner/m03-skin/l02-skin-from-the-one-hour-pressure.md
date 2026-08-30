# Skin from the one-hour pressure

The skin comes out of where the line sits, and the reference point is one hour.

{{panel:wt-buildup-explorer}}

## The formula

For a drawdown, with p1hr read off the fitted line at t = 1 hour:

    S = 1.1513 [ (p_i - p1hr)/m - log10( k / (phi mu ct rw^2) ) + 3.2275 ]

For a buildup, with p1hr read off the fitted line at a shut-in time of 1 hour and pwf the flowing pressure at the instant of shut-in:

    S = 1.1513 [ (p1hr - pwf)/m - log10( k / (phi mu ct rw^2) ) + 3.2275 ]

Same shape, different first bracket. The buildup measures the pressure recovery in the first hour against the flowing pressure it started from; the drawdown measures the pressure drop in the first hour against the initial pressure.

Getting those two the wrong way round is a standard error and it does not produce an obviously silly number, which is what makes it dangerous.

## What each piece does

**The first term** is the whole of the measurement. It is a pressure difference divided by the slope, so it is dimensionless, and it says how many semilog cycles of pressure drop the well showed in its first hour relative to the line's steepness.

**The middle term** is a reservoir term. It contains permeability, porosity, viscosity, compressibility and wellbore radius, all of them known before the test except the permeability, which comes from the slope you just fitted.

**The 3.2275** is a constant that absorbs the unit conversion and the exponential integral's Euler constant.

**The 1.1513** converts from natural to base-ten logarithms and back, which is 1/(2 log10 e) rounded.

## Why one hour

There is nothing physical about one hour. It is a convention: the line is evaluated at a fixed reference time so that the same arithmetic works for every test, and one hour is convenient because it makes log10(t) zero, so p1hr is simply the intercept of the fitted line.

It matters that the value is read off the FITTED LINE and not off the data. At one hour into this buildup the well is still storage-dominated and the measured pressure is nowhere near the line. Reading the measured pressure at one hour instead of the line's value at one hour is the second standard error in this calculation, and it produces skins that are wildly wrong.

The engine is explicit about this. `hornerAnalysis` computes p1hr as `intercept + slope * log10(tp + 1)`, which is the line's value, not any data point.

## Why the skin is fragile

The skin depends on the DIFFERENCE between the line's position and a measured pressure, divided by the slope. Both of those move when the window moves, and they move in ways that reinforce rather than cancel.

Change the window on this buildup from every point to the late points and the permeability changes by a factor of about 3.6. The skin changes from a negative number to a positive one, which is not a change of magnitude at all but a change of conclusion.

You will do this yourself in module 5. For now, the useful habit is to treat a reported skin as substantially less certain than the permeability that came from the same fit, because it is.

## The chain of dependency

Notice that the skin needs the permeability, which needs the slope, which needs the window. Everything downstream of the window inherits its error, and the skin is furthest downstream:

    window -> slope -> permeability -> skin -> skin pressure drop -> flow efficiency

By the time you reach flow efficiency, five choices back, a badly chosen window has been amplified through every step. That is not a reason to distrust the chain; it is a reason to spend the effort at the front of it.

## The misconception to avoid

"The skin comes from the early data because damage is a near-wellbore effect." The skin is computed from the position of the LATE straight line evaluated at an early reference time. The early data themselves are storage-dominated and are excluded from the fit. Physically the skin is near-wellbore; arithmetically it is read off the radial line, and those are different statements.

## Exercise

Open the panel and read the pressure the line takes at one hour for two different windows.

Then say what would happen to the reported skin if someone read the MEASURED pressure at one hour instead of the line's value, using the plot to judge whether the skin would come out too high or too low, and by roughly how much.
