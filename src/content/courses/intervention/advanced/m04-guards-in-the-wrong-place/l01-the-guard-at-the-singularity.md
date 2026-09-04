# The guard at the singularity

`skinPiMultiplier` refuses a design in exactly one place, and it is not the place where a treatment stops being real.

{{panel:pd-candidate-explorer}}

## One group, divided by itself

Productivity is inversely proportional to ln(re/rw) less 3/4 plus the skin, so what removing damage is worth is one of those groups divided by another. On the teaching geometry of ELELENWO-4, a case this course designed and not a published one, re is 1180 ft, rw is 0.354 ft, ln(re/rw) is 8.111728083308, and the skin at which the group reaches zero is -7.361728083308. At that well's skin of 7.5 the denominator is 14.861728083308 and the flow efficiency against an undamaged well is 0.495348054. The designed acid job, 7.5 down to -2.2, comes back ok = true with a multiplier of 2.879215612184, a denominator after of 5.161728083, and a flow efficiency after of 1.426213850.

The published geometry the golden commits, re of 2000 ft and rw of 0.35 ft, has a floor of -7.900724584041, returned inside all five published skin results and tested against no design.

## Where the refusal sits

The guard fires when the denominator reaches zero, the pole where the productivity index goes infinite. Everything short of the pole is accepted. The rows are a teaching sweep, after-skin walking down, before-skin held at 7.5.

| After-skin | Multiplier | Denominator after | Warnings, notes |
| --- | --- | --- | --- |
| -5.000 | 6.292734624 | 2.361728083 | none |
| -5.500 | 7.982759790 | 1.861728083 | none |
| -6.000 | 10.913873530 | 1.361728083 | none |
| -6.500 | 17.246424216 | 0.861728083 | none |
| -6.800 | 26.457156986 | 0.561728083 | none |

The deepest after-skin this geometry accepts is -7.361, where the denominator after is 0.000728083 and the multiplier is 20412.125808300, still ok = true, with no warning and no note attached.

## What it refuses with

At an after-skin of -7.400 the call returns ok = false and the words "Taking the skin to -7.4 would put it below the -7.4 this geometry allows, where the productivity index goes infinite. Real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture; ask for less."

The before-skin carries the same guard and a different sentence. At a before-skin of -8.5 it returns "A skin of -8.5 is below the -7.4 this geometry allows, where the productivity index goes infinite. That is the equation running out, not a well."

## The mistake a careful person makes

Reading ok = true as a statement that the design is achievable. It is a statement that the arithmetic did not divide by zero. `minimumSkin` is computed on every call and handed back inside the successful result, and it is compared against nothing but zero, so the one number in the object that could have flagged an overreach sits there unused. A multiplier of 26.457156986 comes back on a geometry whose own refusal text calls -6 the deepest a fracture reaches, and the object says nothing about it.

## Exercise

Write down the after-skin at which the module's own refusal text stops calling a treatment real, the multiplier the teaching sweep returns at -6.800, and the one it returns at -5.000. Then say which of those the function flags, and what a call site must check for itself.
