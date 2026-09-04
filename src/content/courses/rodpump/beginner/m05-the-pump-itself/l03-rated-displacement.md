# Rated displacement

A constant, a diameter squared, a stroke and a speed. Four factors, one multiplication, and a number that is quoted more often than any other in rod pumping.

{{panel:pd-string-explorer}}

## The constant carries the unit conversion and nothing else

The published pump displacement constant is 0.116571155977 bbl per day per in2 per in per spm, and the engine's PUMP_CONSTANT reproduces it with a difference of 0.000e+0. It is not remembered, it is built: the engine's IN3_PER_BBL is 9702 in3 per bbl, from 42 gallons of 231 in3 each. The independent oracle builds the same constant starting from gallons, which is why a slip anywhere in that chain shows up as a disagreement rather than as a shared error.

## What the constant multiplies

Read the units of the constant carefully. The `in2` in them is the diameter squared, not the plunger area, because pi over four is already inside the 0.116571155977. On the published 106.687717 in stroke at 10 spm:

| Plunger, in | Rated displacement, bbl/d | Area form, bbl/d |
| --- | --- | --- |
| 1.5000 | 279.825985806 | 219.774815323 |
| 1.7500 | 380.874258458 | 299.137943078 |
| 2.0000 | 497.468419210 | 390.710782796 |
| 2.2500 | 629.608468063 | 494.493334476 |
| 2.5000 | 777.294405015 | 610.485598118 |

The second column is what comes back if the plunger area is fed in where the diameter squared belongs, applying pi over four twice. It understates the displacement by 21.460184 percent, and by exactly that percentage on every plunger from 1.0625 in to 2.7500 in, from 140.398801906 bbl/d down to 110.268961160 bbl/d at the small end and from 940.526230069 down to 738.687573723 bbl/d at the large end.

## The mistake

That constant percentage is what makes the error dangerous. A shortfall that changed with plunger size would look like a bug. One that holds at 21.460184 percent everywhere looks like a conservative design basis, and a designer who checks two plungers and finds the same relationship between them has confirmed nothing.

## Rated displacement is proportional to everything in it

Nothing in the product is nonlinear. Double the speed and the rating doubles. Double the stroke and the rating doubles. The rating has no term for the fluid, the depth, the string, the differential the pump works against, or the time of day.

## What it refuses

It refuses to be a forecast. A rated displacement is what the pump would move if the barrel filled completely and the plunger travelled the whole 106.687717 in of surface stroke. Both of those are assumptions, neither is checked here, and the stroke in particular belongs to the polished rod rather than to the plunger.

## Exercise

Compute the rated displacement of a 1.7500 in plunger on the published stroke at 10 spm by hand, using the diameter squared.

Then repeat it using the area and record the percentage between your two answers.
