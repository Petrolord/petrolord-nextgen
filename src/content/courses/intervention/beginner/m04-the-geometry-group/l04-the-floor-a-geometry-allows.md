# The floor a geometry allows

Every geometry has a skin at which the group reaches zero and the productivity index goes infinite. That number is computed on every call and compared against almost nothing.

{{panel:pd-diagnostic-explorer}}

## The floor is the group set to zero

`minimumSkin` returns the skin that makes ln(re/rw) less 3/4 plus S vanish. On the published geometry, re = 2000.000000 ft and rw = 0.350000 ft, the published floor is -7.900724584041 and the engine returns -7.900724584041, a difference of 0.0000e+0. It is the negative of the zero-skin denominator, which is why the two numbers on this geometry read the same apart from the sign.

The floor is a property of the radii alone. It knows nothing about acid, about proppant or about what a perforation can be persuaded to do.

## Walking an after-skin down toward it

A teaching geometry, re = 1180 ft and rw = 0.354 ft, gives ln(re/rw) = 8.111728083308 and a floor of -7.361728083308. This is a teaching case built for the lesson, not a published one. Sweeping the after-skin of a job down that geometry:

| After-skin | Multiplier | Denominator after | Warnings |
| --- | --- | --- | --- |
| -5.000 | 6.292734624 | 2.361728083 | none |
| -5.500 | 7.982759790 | 1.861728083 | none |
| -6.000 | 10.913873530 | 1.361728083 | none |
| -6.500 | 17.246424216 | 0.861728083 | none |
| -6.800 | 26.457156986 | 0.561728083 | none |

Every row between -6.800 and the refusal is accepted too, and the last one accepted, at an after-skin of -7.361, returns a multiplier of 20412.125808300 on a denominator of 0.000728083.

## What it refuses, and where

At an after-skin of -7.400 the answer is ok = false, with the words "Taking the skin to -7.4 would put it below the -7.4 this geometry allows, where the productivity index goes infinite. Real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture; ask for less."

Read that sentence twice. The refusal fires at the pole. The advice in it names a completely different limit, and the deepest skin it calls real for a fracture is -6. Everything between the two is accepted with no warning, no note and no flag, which is how a design at -6.800 comes back at 26.457156986 with exactly the same confidence as one at -5.000 comes back at 6.292734624.

A before-skin below the floor is refused by a different sentence that never mentions the achievable range: "A skin of -8.5 is below the -7.4 this geometry allows, where the productivity index goes infinite. That is the equation running out, not a well."

## The mistake

Treating a large multiplier as a large prize. The multiplier grows because a denominator is going to zero, and a denominator going to zero is arithmetic, not stimulation. A design whose after-skin sits close to the floor is not an ambitious job, it is a job the equation cannot describe.

## Exercise

Run the teaching geometry at an after-skin of -5.000 and at -6.500 and write down both multipliers.

Then say which of the two the module's own refusal text calls achievable, and what the engine said about the other one.
