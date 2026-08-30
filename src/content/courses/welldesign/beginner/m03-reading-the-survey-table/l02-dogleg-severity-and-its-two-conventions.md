# Dogleg severity and its two conventions

The same curvature, two numbers, and an exact conversion between them.

## The quantity

Dogleg severity is the total angle the hole turns through per unit of measured depth:

    DLS = dogleg angle / interval length

It combines inclination change and azimuth change into one number, through the dogleg formula from module 2. That combination is what matters physically: the pipe does not care whether the hole turned up or sideways, only how sharply it turned.

## The two conventions

**Degrees per 30 metres**, used with metric depths.

**Degrees per 100 feet**, used with foot depths.

They describe the same curvature over different reference lengths, so:

    DLS per 100 ft = DLS per 30 m x (30.48 / 30)

100 ft is 30.48 m, so the factor is exactly 1.016. A dogleg of 3 degrees per 30 m is 3.048 degrees per 100 ft.

## Why the 1.6 percent matters

Because the numbers people quote are thresholds, and thresholds are compared against.

A casing design limited to 5 degrees per 100 ft is limited to 4.92 degrees per 30 m. A rotary steerable specified at 8 degrees per 30 m delivers 8.13 degrees per 100 ft. Comparing a limit in one convention against a value in the other, without converting, is wrong by 1.6 percent in whichever direction is unhelpful.

The engine reports both columns for every station, precisely so the comparison does not have to be done in somebody's head.

## Build rate and turn rate are not dogleg

Three different quantities, easily confused:

**Build rate** is the change in INCLINATION per unit length. Positive is building, negative is dropping.

**Turn rate** is the change in AZIMUTH per unit length. It is signed and it wraps: going from 359 to 1 degrees is a turn of plus 2, not minus 358.

**Dogleg severity** is the total angle change, always positive, combining both.

At low inclination a large turn rate is a small dogleg, because the direction vector barely moves when the hole is nearly vertical. At high inclination the same turn rate is a large dogleg. That is the single most useful fact about the three: **turning is cheap when vertical and expensive when horizontal.**

## The formula that shows it

From the dogleg formula, for a pure turn at constant inclination i:

    cos(beta) = cos^2(i) + sin^2(i) cos(delta azimuth)

At i = 5 degrees, a 30 degree azimuth change gives a dogleg of about 2.6 degrees. At i = 85 degrees, the same 30 degree azimuth change gives about 29.9 degrees.

An eleven-fold difference from the same turn, which is why azimuth corrections are made early and high inclination sections are steered gently.

## What the pipe feels

Dogleg severity is the input to fatigue calculations, to torque and drag models, and to casing running analysis. The drill string cycles through bending stress every revolution as it passes through a dogleg, and fatigue life falls very steeply with severity.

That is why the compiler in module 5 reports the worst dogleg a design implies and can be given a limit to check against, and why a design with a smooth build rate is worth more than one that hits a target exactly.

## The misconception to avoid

"Dogleg severity is the build rate." It is only the build rate for a pure build with no azimuth change. Any turning adds to it, and at high inclination the turn dominates. A well plan with a modest build rate and an aggressive turn at 80 degrees can have a severity that no casing will run through.

## Exercise

Compute the dogleg for a pure 20 degree azimuth change at inclinations of 10, 45 and 80 degrees.

Express each as a severity per 30 m assuming the change happens over one 30 m interval, and then convert all three to degrees per 100 ft. State which of them exceeds a 5 degrees per 100 ft casing limit.
