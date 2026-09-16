# One water density, twice

Both pump packagings carry a water density inside them. They were written into different expressions in different functions, in different units, for different purposes. This lesson takes each one apart and asks what density it is carrying.

{{panel:fc-pump-explorer}}

## Two routes to the same figure

The feet-per-psi packaging is a pressure over a height, so the density falls out of it directly: 144 square inches per square foot divided by the measured 2.310000000 gives 62.337662337662 lb per ft3.

The horsepower packaging takes more unpicking, because it is a rate times a height times a weight per unit volume. Start from 33000 ft lbf per minute per horsepower, divide by the measured 3960.000000, and convert gallons to cubic feet with 1728 cubic inches per cubic foot over 231 cubic inches per gallon. That gives 62.337662337662 lb per ft3.

The difference between the two is 0 lb per ft3.

## Why that matters

Two packagings, written separately, agree exactly. That is a real finding about the module and it is worth stating as one, because the alternative would have been two slightly different waters living in one engine, and a pressure and a power that quietly disagreed about the same fluid.

The two constants are tied together by a single quotient, 1714.285714285714, and that quotient is measurable directly out of the pair. Change one packaging without changing the other and it moves.

## What is held for literature here

What this implied density is away from real water is held for literature and is never graded in this course. The packagings are the engine's own definitions and they are measurable, which is why the figures above can be stated. The handbook density they approximate is not in this repository, so no claim is made about the gap.

## The golden case that shows the seam

The published power goldens make the point from outside. That file was written through SI watts at a water density its own oracle states, which is not the density the horsepower packaging carries, so the two routes do not agree to machine precision:

| published case | engine brake hp | golden brake hp | quotient |
| --- | --- | --- | --- |
| 1500.000000 gpm, 300.000000 ft, gravity 0.850000, efficiency 0.780000 | 123.834499 | 123.889863 | 0.999553114 |
| 600.000000 gpm, 120.000000 ft, gravity 1.020000, efficiency 0.720000 | 25.757576 | 25.769092 | 0.999553114 |

The quotient is 0.999553114 on both rows, which is what a difference in one constant looks like when it is applied consistently. The engine gate against these cases is therefore written with a tolerance, and the tolerance has to be chosen from the size of the disagreement the two routes really have.

## The mistake

Reading the quotient as an error in the engine. Neither route is wrong. Two conventions for the density of water have produced two answers to the same question, and the useful response is to know which convention you are quoting.

## Exercise

Give the implied density from each of the two pump packagings and the difference between them. Then give the quotient on the two published power cases, and say what it is evidence of.
