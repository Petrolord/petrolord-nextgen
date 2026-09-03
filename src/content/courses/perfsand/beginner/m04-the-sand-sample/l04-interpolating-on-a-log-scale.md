# Interpolating on a log scale

Why a D-value between two sieves is a geometric mean and not an arithmetic one.

{{panel:ps-shot-explorer}}

## The situation

A sieve stack gives you sizes at nine or so points. A D-value is almost never at one of those points, so it has to be interpolated between the two that bracket it.

The engine interpolates linearly in the LOGARITHM of the size against the retained percentage. That is a straight line on a semi-log plot.

## What the difference is

Take two sieves a decade apart, one at forty percent retained and one at sixty. The fiftieth percentile is halfway between them in percentage.

Interpolating on the log gives the GEOMETRIC mean of the two sizes. Interpolating linearly gives the arithmetic mean, which for a decade apart is a factor of about one point seven larger.

That is not a rounding difference. It is a size class.

## Why the log is right

Because the sieve series itself is geometric: consecutive standard openings step by a roughly constant ratio rather than a constant difference. Interpolating linearly between two geometrically spaced points weights the coarse end far too heavily.

And because a natural grain size distribution is approximately log-normal, so its cumulative curve is approximately straight on a log-size axis. Interpolating along a curve that is nearly straight in log space is nearly exact; doing it in linear space is not.

## Where the error goes

Always the same way: linear interpolation overstates the size. So a linearly interpolated D50 is too coarse, which sizes the gravel too coarse, which lets formation sand through the pack.

The error is largest where the sieves are furthest apart, which is exactly where a coarse stack has been used and the data are weakest anyway.

## The other consequence

Everything derived from a D-value inherits the log interpolation. The uniformity is a ratio of two interpolated values, the Saucier band is five and six times an interpolated median, and the slot window is one and two times an interpolated decile.

So a single interpolation choice propagates into every sand control decision in the course.

## Exercise

Take two sieve sizes a decade apart at forty and sixty percent retained and compute the fiftieth percentile both ways.

Say which is larger and by how much, and which one the engine uses.

Then say which direction a linearly interpolated D50 would move a gravel selection, and what would go wrong downhole.
