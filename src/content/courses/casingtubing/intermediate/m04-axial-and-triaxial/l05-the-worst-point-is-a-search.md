# The worst point is a search

Four checks, four independent minima, and they are not at the same depth.

{{panel:ct-loadcase-explorer}}

## What the loop actually does

For each section, walk every grid point inside it and keep FOUR running minima independently: the smallest burst safety factor, the smallest collapse one, the smallest tension one and the smallest triaxial one.

They are tracked separately, so the four reported numbers can come from four different depths.

## Why they must be separate

Because the four loads peak in different places.

Tension peaks at the top of the section, always, because that is where the most string hangs below.

Collapse peaks at the bottom, on every case in this course.

Burst peaks at the top on the gas kick and at the bottom on the pressure test.

Triaxial peaks wherever the combination is worst, which is not necessarily where any single one of the three is.

## The two governing depths that are reported

Only two: the burst governing depth and the collapse one. The tension and triaxial minima are reported as numbers without their depths.

That is an asymmetry in the engine's output and it is worth noticing. If a triaxial verdict is the one that fails, the report does not tell you where, and you have to find it by running the profile yourself.

## Why a search rather than an argument

Because the argument only works while the profiles are simple.

On this string every profile is linear or piecewise linear, so an analytic argument would work and would be exact. On a string with a temperature-dependent yield, a varying dogleg, a partial cement column and a multi-section taper, no argument survives and the search is the only honest method.

An engine that searches is right on both, and an engine that argues is right on the easy one only.

## What a finer grid would change

51 points over 2507.919699301 m is a point every 50.15839398602 m. If a governing point were interior rather than at an endpoint, the reported value would be up to half a spacing away from the true one.

Because every governing point on this string is an endpoint, the grid resolution costs nothing here. That is a property of these seven cases, not a general guarantee.

## Exercise

For the pressure test on section 2, name where each of the four minima sits: burst, collapse, tension and triaxial.

Two of your four answers are read directly from the report and two of them you have to reason out.
