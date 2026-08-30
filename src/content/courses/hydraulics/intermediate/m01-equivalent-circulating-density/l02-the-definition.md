# The definition

A pressure expressed as a density, and why anyone would do that.

{{panel:hy-cleaning-explorer}}

## The expression

    ECD = mud density + (annulus loss below the point) / (g x TVD)

with g standard gravity and TVD the true vertical depth of the point.

It is the mud weight that would produce the same pressure statically. A pressure, converted into the units the rest of the well is discussed in.

## Why convert it

Because everything else in well design is quoted as a density.

Pore pressure, fracture pressure, mud weight and kick tolerance are all quoted in kg/m3 or pounds per gallon. A pressure in pascals cannot be compared against them without a conversion, and doing that conversion once, at the point of computation, avoids doing it wrong later.

## Read the divisor

TRUE VERTICAL depth, not measured depth.

That is not a detail. On the horizontal well, total depth is 2800 m of measured depth and rather less of true vertical depth, so the same annulus loss produces a LARGER equivalent circulating density uplift there than it would on a vertical well.

Using measured depth would understate the equivalent circulating density on every deviated well, and understating it is the unsafe direction.

## The numbers

Slant well, kcl_polymer, at 0.025 m3/s: mud weight 1440 kg/m3 and equivalent circulating density at total depth 1498.3349880149756 kg/m3.

An uplift of 58.33 kg/m3, which is about four percent.

Horizontal well, same mud and rate: 1554.1524595134213 kg/m3, an uplift of 114.15 kg/m3.

The horizontal well's uplift is nearly double, on a SMALLER annulus loss of 1359978.0097177096 Pa, entirely because its true vertical depth is smaller.

## Why that is the important number

Because a horizontal well's lateral adds annulus length and no true vertical depth. Every metre of lateral adds friction to the numerator and nothing to the denominator.

That is the mechanism that makes long laterals a pressure problem, and it is exactly parallel to the torque and drag result that a lateral adds contact length and no true vertical depth.

## What is not in it

Cuttings. The mud in the annulus while drilling is carrying rock, which is denser than mud, and its density is higher than the pumped mud's.

The engine does not add that, and the next lessons say how much it is worth.

## Exercise

Compute the uplift for both wells at 0.025 m3/s from the annulus losses and the equivalent circulating densities above.

Then back out the true vertical depth each one implies, and check them against the survey.
