# Inverting the balance

The same exponential run backwards answers a different question: not what a line arrives at, but what wall it would need to arrive at a number you were given.

{{panel:pd-line-explorer}}

## One rearrangement, no search

`uForArrivalTemp` solves U = m Cp ln((Tin - Ta)/(Tt - Ta)) / (pi D L). The logarithm is the exponential turned over, and there is no iteration, no tolerance and no starting guess anywhere in it. The function returns the implied ntu alongside the U, and that ntu is the one the forward profile would report on the same line.

## The round trip closes exactly

Derived runs on the published fluid, 180.0 degF in against a 40.0 degF ambient at 120000.0 lb/hr and Cp 0.5 through the 6.065 in bore over 26400.0 ft. Each U was fed straight back into the forward profile.

| Target, degF | U needed, Btu/(hr ft2 degF) | ntu implied | Forward arrival, degF |
| --- | --- | --- | --- |
| 160.00 | 0.220644616732 | 0.154150679827 | 160.000000000000 |
| 140.00 | 0.481611808482 | 0.336472236621 | 140.000000000000 |
| 120.00 | 0.801009837807 | 0.559615787935 | 120.000000000000 |
| 100.00 | 1.212785515268 | 0.847297860387 | 100.000000000000 |
| 80.00 | 1.793150736343 | 1.252762968495 | 80.000000000000 |
| 60.00 | 2.785291634878 | 1.945910149055 | 60.000000000000 |

The round trip error is 0.0000e+0 degF on every row except the 60.00 degF one, which closes at 7.1054e-15 degF. That is floating point and not method error. An inverse that closes to the last figure is telling you it is the same equation, not a better model.

## What the inverse actually hands you

A number in Btu/(hr ft2 degF) and nothing else. Not a thickness, not a material, not a trench depth, and not a statement that such a wall can be built. The step from 160.00 degF to 60.00 degF asks the wall to move from 0.220644616732 to 2.785291634878, and which of foam, burial or a different rate delivers that is a question the function never sees.

## Everything else is held still

The inverse holds the inlet, the ambient, the mass rate, the heat capacity, the diameter and the length fixed and moves U alone. Asking for the U a target needs at a rate the field will not sustain gives a wall that is correct for a line that will never run.

## The careful mistake

Reading the U it returns as an answer about insulation. U is a conductance divided by an area, and the area is named separately. The same physical wall reads as 0.713200037662 Btu/(hr ft2 degF) against a 6.065 in bore and 0.501513997498 against an 8.625 in coated outside diameter, on one identical total resistance of 0.883057962117 hr ft degF/Btu per foot. A target U carries no more meaning than the diameter quoted with it.

## Exercise

Invert the published fluid over 26400.0 ft for a 120.00 degF target and record the U and the ntu.

Then run that U forward and say what the round trip proves and, more usefully, what it does not.
