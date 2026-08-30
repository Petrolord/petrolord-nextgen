# The oracle check

An independent implementation, and what agreeing with it establishes.

{{panel:hy-cleaning-explorer}}

## What the goldens are

Four cases, each with three flow rates of hydraulics results, four surge and swab results, a hole cleaning result, and the three rheology fits.

Every one of them was produced by a separate numpy program written against the same published method specification, in a different language by a different author.

## The method specification

The goldens name it: local n prime and K prime from the Herschel-Bulkley fit, a generalised Reynolds number, 16 over Re in a pipe and 24 over Re in an annulus for laminar flow, a Bourgoyne a over Re to the b for turbulent, a linear blend over 800 Reynolds numbers above the critical value, a Burkhardt clinging constant of 0.45, and Schiller-Naumann slip for the cuttings.

That specification is the thing both implementations agree to follow. Without it the comparison would be meaningless, because two people can implement drilling hydraulics differently in a dozen defensible ways.

## The agreement

The goldens ask for a relative tolerance of 1e-6. The engine achieves better than that everywhere.

The rheology fits agree to about 1e-10, which is the rounding of the published nine-decimal values.

The surge and swab pressures agree to about 1e-16, which is machine precision.

The pump pressures agree to about 1e-7, which is the largest disagreement in the whole comparison.

## Why the pump pressure is the worst of them

Because it is the longest chain: a fit, then a local power law at every element, then a Reynolds number, then a friction factor, then a sum over dozens of elements.

Each step carries a rounding, and the errors accumulate. 1e-7 over that chain is very good and it is not machine precision, which is what a chain that long looks like.

## What agreement proves

That two people reading the same method specification wrote code that produces the same numbers. That eliminates transcription errors, sign errors, unit errors and misread formulae.

## What it does not prove

That the method specification describes a real well.

Both implementations use the same laminar constants, the same turbulent correlation, the same blend width, the same clinging constant and the same slip correlation. Every one of those is a modelling choice, and agreeing about them says nothing about whether they are right.

The blend width in particular is a pure convention, and it is exactly where the annulus often sits.

## Compared with the previous course

The torque and drag course had a genuine disagreement to explain: worst relative 6.7e-2 on one case in compression. This course has none: the two implementations agree everywhere to better than the tolerance asked for.

That is a cleaner result and a less instructive one. It says nothing about which of the two would be right if they disagreed, because there is no closed-form case here to settle it.

## Exercise

Open the panel's minimum-flow view and read the oracle tile.

Note both the worst relative error and the number of values checked, and say what a hypothetical disagreement at 1e-3 would have meant that this result does not.
